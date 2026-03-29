package com.survin.SurvinHealthCare.review.repository;

import com.survin.SurvinHealthCare.review.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.UUID;

public interface ReviewRepository extends JpaRepository<Review, UUID> {

    // ✅ Doctor ki saari reviews
    List<Review> findByDoctorId(UUID doctorId);

    // ✅ Patient ne jo reviews di hain
    List<Review> findByPatientId(UUID patientId);

    // ✅ Overall average rating
    @Query("SELECT AVG(r.rating) FROM Review r")
    Double findAverageRating();

    // ✅ Specific doctor ka average rating — MISSING THA YEH!
    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.doctorId = :doctorId")
    Double getAverageRatingByDoctorId(@Param("doctorId") UUID doctorId);
}
