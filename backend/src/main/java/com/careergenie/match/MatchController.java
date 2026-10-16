package com.careergenie.match;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.careergenie.auth.UserRepository;
import java.util.*;

@RestController @RequestMapping("/api/match") @RequiredArgsConstructor
public class MatchController {
    private final MatchService matchService;
    private final UserRepository userRepo;
    private Long uid(Authentication a){return userRepo.findByEmail(a.getName()).orElseThrow().getId();}

    @PostMapping
    public ResponseEntity<CareerMatch> runMatch(Authentication auth, @RequestBody Map<String,Long> body){
        return ResponseEntity.status(HttpStatus.CREATED).body(matchService.runMatch(uid(auth), body.get("jobId")));
    }
    @GetMapping("/{id}")
    public ResponseEntity<CareerMatch> get(@PathVariable Long id){return ResponseEntity.ok(matchService.getById(id));}
    @GetMapping("/latest")
    public ResponseEntity<CareerMatch> latest(Authentication auth){
        return matchService.getLatest(uid(auth)).map(ResponseEntity::ok).orElse(ResponseEntity.noContent().build());
    }
    @GetMapping
    public ResponseEntity<List<CareerMatch>> all(Authentication auth){return ResponseEntity.ok(matchService.getAllForUser(uid(auth)));}
}
