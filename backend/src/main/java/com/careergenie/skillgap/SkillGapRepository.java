package com.careergenie.skillgap;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillGapRepository extends JpaRepository<SkillGap, Long> {
    List<SkillGap> findByMatchId(Long matchId);
    void deleteByMatchId(Long matchId);
}
