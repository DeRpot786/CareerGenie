package com.careergenie.profile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface ExperienceRepository extends JpaRepository<Experience,Long>{List<Experience> findByProfileIdOrderByStartDateDesc(Long profileId);}
