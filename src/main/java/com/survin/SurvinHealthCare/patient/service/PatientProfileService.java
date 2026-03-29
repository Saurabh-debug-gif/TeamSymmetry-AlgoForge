package com.survin.SurvinHealthCare.patient.service;

import com.survin.SurvinHealthCare.auth.entity.User;
import com.survin.SurvinHealthCare.auth.repository.UserRepository;
import com.survin.SurvinHealthCare.patient.dto.PatientProfileRequest;
import com.survin.SurvinHealthCare.patient.dto.PatientProfileResponse;
import com.survin.SurvinHealthCare.patient.entity.PatientProfile;
import com.survin.SurvinHealthCare.patient.repository.PatientProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientProfileService {

    private final PatientProfileRepository patientProfileRepository;
    private final UserRepository userRepository;

    // ✅ Create Profile
    public PatientProfile createProfile(UUID userId, PatientProfileRequest request) {
        PatientProfile profile = new PatientProfile();
        profile.setUserId(userId);
        profile.setProfilePhoto(request.getProfilePhoto());
        profile.setDateOfBirth(request.getDateOfBirth());
        profile.setGender(request.getGender());
        profile.setBloodGroup(request.getBloodGroup());
        profile.setAddress(request.getAddress());
        profile.setEmergencyContact(request.getEmergencyContact());
        profile.setMedicalHistory(request.getMedicalHistory());
        return patientProfileRepository.save(profile);
    }

    // ✅ Get My Profile — Auto create if not exists
    public PatientProfileResponse getProfileByUserId(UUID userId) {

        PatientProfile profile = patientProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    PatientProfile newProfile = new PatientProfile();
                    newProfile.setUserId(userId);
                    return patientProfileRepository.save(newProfile);
                });

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return buildResponse(user, profile);
    }
    // ✅ Saare patients — Doctor ke liye
    public List<PatientProfileResponse> getAllPatients() {
        return patientProfileRepository.findAll()
                .stream()
                .map(profile -> {
                    User user = userRepository.findById(profile.getUserId()).orElse(null);
                    if (user == null) return null;
                    return buildResponse(user, profile);
                })
                .filter(p -> p != null)
                .collect(Collectors.toList());
    }
    // ✅ Update Profile — Auto create if not exists
    public PatientProfileResponse updateProfile(UUID userId, PatientProfileRequest request) {

        PatientProfile profile = patientProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    PatientProfile newProfile = new PatientProfile();
                    newProfile.setUserId(userId);
                    return patientProfileRepository.save(newProfile);
                });

        if (request.getProfilePhoto() != null)
            profile.setProfilePhoto(request.getProfilePhoto());
        if (request.getDateOfBirth() != null)
            profile.setDateOfBirth(request.getDateOfBirth());
        if (request.getGender() != null)
            profile.setGender(request.getGender());
        if (request.getBloodGroup() != null)
            profile.setBloodGroup(request.getBloodGroup());
        if (request.getAddress() != null)
            profile.setAddress(request.getAddress());
        if (request.getEmergencyContact() != null)
            profile.setEmergencyContact(request.getEmergencyContact());
        if (request.getMedicalHistory() != null)
            profile.setMedicalHistory(request.getMedicalHistory());

        patientProfileRepository.save(profile);
        return getProfileByUserId(userId);
    }

    // ✅ Helper
    private PatientProfileResponse buildResponse(User user, PatientProfile profile) {
        PatientProfileResponse response = new PatientProfileResponse();
        response.setId(profile.getId());
        response.setName(user.getName());
        response.setEmail(user.getEmail());
        response.setProfilePhoto(profile.getProfilePhoto());
        response.setDateOfBirth(profile.getDateOfBirth());
        response.setGender(profile.getGender());
        response.setBloodGroup(profile.getBloodGroup());
        response.setAddress(profile.getAddress());
        response.setEmergencyContact(profile.getEmergencyContact());
        response.setMedicalHistory(profile.getMedicalHistory());
        return response;
    }
}