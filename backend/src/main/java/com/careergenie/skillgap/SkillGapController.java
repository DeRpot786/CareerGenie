package com.careergenie.skillgap;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skill-gaps")
@RequiredArgsConstructor
public class SkillGapController {

    private final SkillGapService skillGapService;

    @GetMapping("/match/{matchId}")
    public ResponseEntity<List<SkillGap>> getByMatchId(@PathVariable Long matchId) {
        return ResponseEntity.ok(skillGapService.getSkillGapsForMatch(matchId));
    }
}
