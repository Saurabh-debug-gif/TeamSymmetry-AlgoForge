package com.survin.SurvinHealthCare.review.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class ReviewRequest {
    private UUID doctorId;
    private Integer rating;   // 1-5
    private String comment;
}