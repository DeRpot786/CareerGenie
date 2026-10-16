package com.careergenie.auth;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();

        // Seed demo student
        userRepository.save(User.builder()
                .email("alex.thomas@example.com")
                .passwordHash(passwordEncoder.encode("Password@123"))
                .role(User.Role.USER)
                .active(true)
                .build());

        // Seed demo admin
        userRepository.save(User.builder()
                .email("admin@careergenie.dev")
                .passwordHash(passwordEncoder.encode("Admin@123"))
                .role(User.Role.ADMIN)
                .active(true)
                .build());

        // Seed disabled user
        userRepository.save(User.builder()
                .email("disabled.user@example.com")
                .passwordHash(passwordEncoder.encode("Password@123"))
                .role(User.Role.USER)
                .active(false)
                .build());
    }

    @Test
    @DisplayName("1. User Registration: Creates account, generates profile, returns JWT and user info")
    void testRegisterNewUser() throws Exception {
        RegisterRequest request = new RegisterRequest(
                "Jane Doe",
                "jane.doe@example.com",
                "Password@123",
                "Frontend Developer"
        );

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("jane.doe@example.com"))
                .andExpect(jsonPath("$.user.role").value("USER"));

        assertThat(userRepository.findByEmail("jane.doe@example.com")).isPresent();
    }

    @Test
    @DisplayName("2. Demo Student Login: Authenticates and returns JWT")
    void testLoginDemoStudent() throws Exception {
        LoginRequest login = new LoginRequest("alex.thomas@example.com", "Password@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("alex.thomas@example.com"))
                .andExpect(jsonPath("$.user.role").value("USER"));
    }

    @Test
    @DisplayName("3. Demo Admin Login: Authenticates and returns ADMIN role")
    void testLoginDemoAdmin() throws Exception {
        LoginRequest login = new LoginRequest("admin@careergenie.dev", "Admin@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").isNotEmpty())
                .andExpect(jsonPath("$.user.email").value("admin@careergenie.dev"))
                .andExpect(jsonPath("$.user.role").value("ADMIN"));
    }

    @Test
    @DisplayName("4. GET /api/auth/me: Retrieves authenticated user info using valid Bearer JWT")
    void testGetMeEndpoint() throws Exception {
        LoginRequest login = new LoginRequest("alex.thomas@example.com", "Password@123");

        String response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        AuthResponse auth = objectMapper.readValue(response, AuthResponse.class);

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + auth.token()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.email").value("alex.thomas@example.com"))
                .andExpect(jsonPath("$.role").value("USER"));
    }

    @Test
    @DisplayName("5. Access Control: Regular USER receives 403 Forbidden on Admin endpoint")
    void testUserRoleGetsForbiddenOnAdminEndpoint() throws Exception {
        LoginRequest userLogin = new LoginRequest("alex.thomas@example.com", "Password@123");

        String response = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(userLogin)))
                .andExpect(status().isOk())
                .andReturn()
                .getResponse()
                .getContentAsString();

        AuthResponse auth = objectMapper.readValue(response, AuthResponse.class);

        // Attempting to access admin route with USER token must return 403 Forbidden
        mockMvc.perform(get("/api/admin/users")
                        .header("Authorization", "Bearer " + auth.token()))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("6. Disabled User Rejection: Inactive accounts are rejected upon login")
    void testDisabledUserIsRejected() throws Exception {
        LoginRequest login = new LoginRequest("disabled.user@example.com", "Password@123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isUnauthorized());
    }
}
