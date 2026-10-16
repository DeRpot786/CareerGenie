package com.careergenie.career;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface CareerRoleSkillRepository extends JpaRepository<CareerRoleSkill,Long>{
    List<CareerRoleSkill> findByRoleId(Long roleId);
    List<CareerRoleSkill> findByRoleIdAndImportance(Long roleId,CareerRoleSkill.Importance importance);
}
