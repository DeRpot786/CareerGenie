package com.careergenie.profile;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
@Entity @Table(name="certifications")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Certification {
    @Id @GeneratedValue(strategy=GenerationType.IDENTITY) private Long id;
    @Column(name="profile_id",nullable=false) private Long profileId;
    @Column(nullable=false) private String name;
    private String issuer;
    @Column(name="issued_date") private LocalDate issuedDate;
    @Column(name="expiry_date") private LocalDate expiryDate;
    @Column(name="credential_url") private String credentialUrl;
}
