package com.survin.SurvinHealthCare.review.service;

import com.survin.SurvinHealthCare.auth.repository.UserRepository;
import com.survin.SurvinHealthCare.review.dto.ReviewRequest;
import com.survin.SurvinHealthCare.review.dto.ReviewResponse;
import com.survin.SurvinHealthCare.review.entity.Review;
import com.survin.SurvinHealthCare.review.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    // ✅ Review Do
    public Review addReview(UUID patientId, ReviewRequest request) {
        Review review = new Review();
        review.setPatientId(patientId);
        review.setDoctorId(request.getDoctorId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        return reviewRepository.save(review);
    }

    // ✅ Doctor Ki Reviews Dekho
    public List<ReviewResponse> getDoctorReviews(UUID doctorId) {
        return reviewRepository.findByDoctorId(doctorId)
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // ✅ Doctor Ka Average Rating
    public Double getAverageRating(UUID doctorId) {
        Double avg = reviewRepository  .getAverageRatingByDoctorId(doctorId);
        return avg != null ? Math.round(avg * 10.0) / 10.0 : 0.0;
    }

    // ✅ Helper
    private ReviewResponse buildResponse(Review review) {
        ReviewResponse response = new ReviewResponse();
        response.setId(review.getId());
        response.setRating(review.getRating());
        response.setComment(review.getComment());
        userRepository.findById(review.getPatientId())
                .ifPresent(user -> response.setPatientName(user.getName()));
        return response;
    }
}