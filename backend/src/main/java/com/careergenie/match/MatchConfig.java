package com.careergenie.match;
import jakarta.persistence.*;
import lombok.*;
@Entity @Table(name="match_config")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class MatchConfig {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="weight_key",unique=true,nullable=false) private String weightKey;
    @Column(name="weight_value",nullable=false) private Double weightValue;
    private String description;
}
