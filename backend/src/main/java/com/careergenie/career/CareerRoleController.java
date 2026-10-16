package com.careergenie.career;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;
@RestController @RequestMapping("/api/career-roles") @RequiredArgsConstructor
public class CareerRoleController {
    private final CareerRoleRepository roleRepo;
    private final CareerRoleSkillRepository roleSkillRepo;
    @GetMapping
    public ResponseEntity<List<CareerRole>> list(){ return ResponseEntity.ok(roleRepo.findAllByOrderByNameAsc()); }
    @GetMapping("/{id}")
    public ResponseEntity<Map<String,Object>> detail(@PathVariable Long id){
        CareerRole r=roleRepo.findById(id).orElseThrow();
        List<CareerRoleSkill> skills=roleSkillRepo.findByRoleId(id);
        return ResponseEntity.ok(Map.of("role",r,"skills",skills));
    }
    @PostMapping
    public ResponseEntity<CareerRole> create(@RequestBody CareerRole role){
        role.setCustom(true);
        String slug=role.getName().toLowerCase().replaceAll("[^a-z0-9]","-").replaceAll("-+","-");
        role.setSlug(slug+"-"+System.currentTimeMillis());
        return ResponseEntity.ok(roleRepo.save(role));
    }
}
