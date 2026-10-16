package com.careergenie.profile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface EducationRepository extends JpaRepository<Education,Long>{List<Education> findByProfileIdOrderByEndYearDesc(Long profileId);}
