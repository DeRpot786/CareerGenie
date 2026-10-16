package com.careergenie.career;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.*;
public interface CareerRoleRepository extends JpaRepository<CareerRole,Long>{
    List<CareerRole> findAllByOrderByNameAsc();
    Optional<CareerRole> findBySlug(String slug);
}
