package com.careergenie.profile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface UserSkillRepository extends JpaRepository<UserSkill,Long>{
    List<UserSkill> findByProfileId(Long profileId);
    boolean existsByProfileIdAndSkillId(Long profileId,Long skillId);
    void deleteByProfileIdAndSkillId(Long profileId,Long skillId);
}
