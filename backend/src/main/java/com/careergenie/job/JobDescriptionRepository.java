package com.careergenie.job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface JobDescriptionRepository extends JpaRepository<JobDescription,Long>{
    List<JobDescription> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<JobDescription> findBySampleTrue();
}
