package com.careergenie.profile;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import com.careergenie.auth.UserRepository;
import java.io.*;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;
    private final SkillRepository skillRepo;
    private final UserRepository userRepo;
    private final EducationRepository educationRepo;
    private final ExperienceRepository experienceRepo;
    private final ProjectRepository projectRepo;
    private final CertificationRepository certRepo;
    private final UserSkillRepository userSkillRepo;

    private Long userId(Authentication auth){
        return userRepo.findByEmail(auth.getName()).orElseThrow().getId();
    }

    @GetMapping
    public ResponseEntity<ProfileFullDto> getProfile(Authentication auth){
        return ResponseEntity.ok(profileService.getFullProfile(userId(auth)));
    }

    @PutMapping
    public ResponseEntity<Profile> updateProfile(Authentication auth, @RequestBody ProfileUpdateRequest req){
        return ResponseEntity.ok(profileService.updateProfile(userId(auth), req));
    }

    @PostMapping("/photo")
    public ResponseEntity<Map<String,String>> uploadPhoto(Authentication auth, @RequestParam("file") MultipartFile file) throws IOException{
        String dir = "uploads/photos";
        Files.createDirectories(Paths.get(dir));
        String filename = UUID.randomUUID()+"-"+file.getOriginalFilename();
        file.transferTo(Paths.get(dir, filename));
        String url = "/uploads/photos/"+filename;
        profileService.updatePhotoUrl(userId(auth), url);
        return ResponseEntity.ok(Map.of("photoUrl", url));
    }

    @GetMapping("/completion")
    public ResponseEntity<Map<String,Integer>> getCompletion(Authentication auth){
        Long uid = userId(auth);
        Profile p = profileService.getByUserId(uid);
        return ResponseEntity.ok(Map.of("completionPct", p.getCompletionPct()));
    }

    // ── Skills ──
    @GetMapping("/skills")
    public ResponseEntity<List<UserSkill>> getSkills(Authentication auth){
        Profile p = profileService.getByUserId(userId(auth));
        return ResponseEntity.ok(userSkillRepo.findByProfileId(p.getId()));
    }

    @PostMapping("/skills")
    public ResponseEntity<UserSkill> addSkill(Authentication auth, @RequestBody Map<String,Object> body){
        Long skillId = Long.valueOf(body.get("skillId").toString());
        UserSkill.Proficiency prof = UserSkill.Proficiency.valueOf(body.getOrDefault("proficiency","BEGINNER").toString());
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.addSkill(userId(auth), skillId, prof));
    }

    @DeleteMapping("/skills/{skillId}")
    public ResponseEntity<Void> removeSkill(Authentication auth, @PathVariable Long skillId){
        profileService.removeSkill(userId(auth), skillId);
        return ResponseEntity.noContent().build();
    }

    // ── Education ──
    @PostMapping("/education")
    public ResponseEntity<Education> addEducation(Authentication auth, @RequestBody Education edu){
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.addEducation(userId(auth), edu));
    }

    @PutMapping("/education/{id}")
    public ResponseEntity<Education> updateEducation(Authentication auth, @PathVariable Long id, @RequestBody Education edu){
        edu.setId(id); return ResponseEntity.ok(educationRepo.save(edu));
    }

    @DeleteMapping("/education/{id}")
    public ResponseEntity<Void> deleteEducation(@PathVariable Long id){
        educationRepo.deleteById(id); return ResponseEntity.noContent().build();
    }

    // ── Experience ──
    @PostMapping("/experience")
    public ResponseEntity<Experience> addExperience(Authentication auth, @RequestBody Experience exp){
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.addExperience(userId(auth), exp));
    }

    @PutMapping("/experience/{id}")
    public ResponseEntity<Experience> updateExperience(Authentication auth, @PathVariable Long id, @RequestBody Experience exp){
        exp.setId(id); return ResponseEntity.ok(experienceRepo.save(exp));
    }

    @DeleteMapping("/experience/{id}")
    public ResponseEntity<Void> deleteExperience(@PathVariable Long id){
        experienceRepo.deleteById(id); return ResponseEntity.noContent().build();
    }

    // ── Projects ──
    @PostMapping("/projects")
    public ResponseEntity<Project> addProject(Authentication auth, @RequestBody Project proj){
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.addProject(userId(auth), proj));
    }

    @PutMapping("/projects/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project proj){
        proj.setId(id); return ResponseEntity.ok(projectRepo.save(proj));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id){
        projectRepo.deleteById(id); return ResponseEntity.noContent().build();
    }

    // ── Certifications ──
    @PostMapping("/certifications")
    public ResponseEntity<Certification> addCert(Authentication auth, @RequestBody Certification cert){
        return ResponseEntity.status(HttpStatus.CREATED).body(profileService.addCertification(userId(auth), cert));
    }

    @PutMapping("/certifications/{id}")
    public ResponseEntity<Certification> updateCert(@PathVariable Long id, @RequestBody Certification cert){
        cert.setId(id); return ResponseEntity.ok(certRepo.save(cert));
    }

    @DeleteMapping("/certifications/{id}")
    public ResponseEntity<Void> deleteCert(@PathVariable Long id){
        certRepo.deleteById(id); return ResponseEntity.noContent().build();
    }

    // ── Skills dictionary ──
    @GetMapping("/skills/all")
    public ResponseEntity<List<Skill>> getAllSkills(@RequestParam(required=false) String q){
        if(q!=null && !q.isBlank()) return ResponseEntity.ok(skillRepo.searchByName(q));
        return ResponseEntity.ok(skillRepo.findAllActive());
    }
}
