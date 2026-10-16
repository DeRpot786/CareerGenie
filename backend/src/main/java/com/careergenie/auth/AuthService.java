package com.careergenie.auth;

import com.careergenie.profile.Profile;
import com.careergenie.profile.ProfileRepository;
import com.careergenie.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final ProfileRepository profileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new IllegalStateException("An account with this email already exists");
        }
        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .role(User.Role.USER)
                .active(true)
                .build();
        user = userRepository.save(user);

        // Auto-create blank profile
        Profile profile = Profile.builder()
                .userId(user.getId())
                .fullName(request.fullName())
                .targetRole(request.targetRole() != null ? request.targetRole() : "Full Stack Developer")
                .completionPct(10)
                .build();
        profileRepository.save(profile);

        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, toDto(user));
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow();
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole().name());
        return new AuthResponse(token, toDto(user));
    }

    public UserDto getCurrentUser(String email) {
        return userRepository.findByEmail(email)
                .map(this::toDto)
                .orElseThrow();
    }

    private UserDto toDto(User user) {
        return new UserDto(user.getId(), user.getEmail(), user.getRole().name(), user.isActive());
    }
}
