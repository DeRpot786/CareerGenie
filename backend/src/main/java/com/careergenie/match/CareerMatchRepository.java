package com.careergenie.match;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface CareerMatchRepository extends JpaRepository<CareerMatch,Long>{
    List<CareerMatch> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<CareerMatch> findTopByUserIdOrderByCreatedAtDesc(Long userId);
    long countByUserId(Long userId);
    Double findAvgOverallScoreByUserId(Long userId);
}
