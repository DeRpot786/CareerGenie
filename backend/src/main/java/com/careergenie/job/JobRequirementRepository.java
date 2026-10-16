package com.careergenie.job;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
public interface JobRequirementRepository extends JpaRepository<JobRequirement,Long>{
    List<JobRequirement> findByJobId(Long jobId);
    List<JobRequirement> findByJobIdAndRequiredTrue(Long jobId);
}
