package com.survin.SurvinHealthCare.review.dto;

import lombok.Getter;
import lombok.Setter;
import java.util.UUID;

@Getter
@Setter
public class ReviewResponse {
    private UUID id;
    private String patientName;
    private Integer rating;
    private String comment;
}