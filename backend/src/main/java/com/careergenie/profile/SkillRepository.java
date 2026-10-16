package com.careergenie.profile;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {

    @Query("SELECT s FROM Skill s WHERE s.active = true ORDER BY s.category, s.name")
    List<Skill> findAllActive();

    List<Skill> findByCategory(Skill.SkillCategory category);

    Optional<Skill> findByNameIgnoreCase(String name);

    @Query("SELECT s FROM Skill s WHERE s.active = true AND LOWER(s.name) LIKE LOWER(CONCAT('%', :query, '%'))")
    List<Skill> searchByName(String query);
}
