package com.careergenie.skillgap;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillGapService {

    private final SkillGapRepository skillGapRepository;

    public List<SkillGap> getSkillGapsForMatch(Long matchId) {
        return skillGapRepository.findByMatchId(matchId);
    }

    @Transactional
    public SkillGap saveSkillGap(SkillGap skillGap) {
        return skillGapRepository.save(skillGap);
    }
}
