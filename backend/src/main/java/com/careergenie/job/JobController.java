package com.careergenie.job;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.careergenie.auth.UserRepository;
import java.util.*;

@RestController @RequestMapping("/api/jobs") @RequiredArgsConstructor
public class JobController {
    private final JobService jobService;
    private final UserRepository userRepo;
    private Long uid(Authentication a){return userRepo.findByEmail(a.getName()).orElseThrow().getId();}

    @PostMapping("/analyze")
    public ResponseEntity<JobDescription> analyze(Authentication auth, @RequestBody Map<String,String> body){
        return ResponseEntity.status(HttpStatus.CREATED)
            .body(jobService.analyzeAndSave(uid(auth), body.get("rawText"), body.get("notes")));
    }
    @GetMapping
    public ResponseEntity<List<JobDescription>> list(Authentication auth){return ResponseEntity.ok(jobService.getSavedJobs(uid(auth)));}
    @GetMapping("/sample")
    public ResponseEntity<List<JobDescription>> sample(){return ResponseEntity.ok(jobService.getSampleJobs());}
    @GetMapping("/{id}")
    public ResponseEntity<JobDescription> get(@PathVariable Long id){return ResponseEntity.ok(jobService.getById(id));}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id){jobService.delete(id);return ResponseEntity.noContent().build();}
}
