package com.survin.SurvinHealthCare.review.controller;

import com.survin.SurvinHealthCare.review.dto.ReviewRequest;
import com.survin.SurvinHealthCare.review.dto.ReviewResponse;
import com.survin.SurvinHealthCare.review.entity.Review;
import com.survin.SurvinHealthCare.review.service.ReviewService;
import com.survin.SurvinHealthCare.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final JwtService jwtService;

    // ✅ Patient — Review Do
    @PostMapping
    public Review addReview(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody ReviewRequest request) {
        String token = authHeader.substring(7);
        UUID patientId = jwtService.extractUserId(token);
        return reviewService.addReview(patientId, request);
    }

    // ✅ Doctor Ki Reviews Dekho
    @GetMapping("/doctor/{doctorId}")
    public List<ReviewResponse> getDoctorReviews(
            @PathVariable UUID doctorId) {
        return reviewService.getDoctorReviews(doctorId);
    }

    // ✅ Doctor Ka Average Rating
    @GetMapping("/doctor/{doctorId}/rating")
    public Double getAverageRating(
            @PathVariable UUID doctorId) {
        return reviewService.getAverageRating(doctorId);
    }
}
