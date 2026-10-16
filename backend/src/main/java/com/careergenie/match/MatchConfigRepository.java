package com.careergenie.match;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
public interface MatchConfigRepository extends JpaRepository<MatchConfig,Long>{
    Optional<MatchConfig> findByWeightKey(String key);
}
