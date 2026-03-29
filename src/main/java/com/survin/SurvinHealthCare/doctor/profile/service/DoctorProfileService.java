package com.survin.SurvinHealthCare.doctor.profile.service;

import com.survin.SurvinHealthCare.auth.repository.UserRepository;
import com.survin.SurvinHealthCare.doctor.profile.dto.DoctorProfileRequest;
import com.survin.SurvinHealthCare.doctor.profile.dto.DoctorProfileResponse;
import com.survin.SurvinHealthCare.doctor.profile.entity.DoctorProfile;
import com.survin.SurvinHealthCare.doctor.profile.repository.DoctorProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DoctorProfileService {

    private final DoctorProfileRepository doctorProfileRepository;
    private final UserRepository userRepository;

    // ✅ Get Profile
    public DoctorProfileResponse getProfile(UUID userId) {
        DoctorProfile profile = doctorProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    DoctorProfile newProfile = new DoctorProfile();
                    newProfile.setUserId(userId);
                    return doctorProfileRepository.save(newProfile);
                });
        return buildResponse(profile);
    }

    // ✅ Update Profile
    public DoctorProfileResponse updateProfile(UUID userId, DoctorProfileRequest request) {
        DoctorProfile profile = doctorProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    DoctorProfile newProfile = new DoctorProfile();
                    newProfile.setUserId(userId);
                    return newProfile;
                });

        if (request.getClinicName() != null)
            profile.setClinicName(request.getClinicName());
        if (request.getClinicAddress() != null)
            profile.setClinicAddress(request.getClinicAddress());
        if (request.getSpecialization() != null)
            profile.setSpecialization(request.getSpecialization());
        if (request.getConsultationFee() != null)
            profile.setConsultationFee(request.getConsultationFee());
        if (request.getExperienceYears() != null)
            profile.setExperienceYears(request.getExperienceYears());
        if (request.getAbout() != null)
            profile.setAbout(request.getAbout());
        if (request.getPhone() != null)
            profile.setPhone(request.getPhone());
        if (request.getWhatsapp() != null)
            profile.setWhatsapp(request.getWhatsapp());
        if (request.getLanguages() != null)
            profile.setLanguagesList(request.getLanguages());

        doctorProfileRepository.save(profile);
        return buildResponse(profile);
    }

    // ✅ Upload Photo — ADDED!
    public DoctorProfileResponse uploadPhoto(UUID userId, MultipartFile file) throws IOException {
        DoctorProfile profile = doctorProfileRepository.findByUserId(userId)
                .orElseGet(() -> {
                    DoctorProfile newProfile = new DoctorProfile();
                    newProfile.setUserId(userId);
                    return doctorProfileRepository.save(newProfile);
                });

        // ✅ Upload directory banao
        String uploadDir = "uploads/doctors/";
        File dir = new File(uploadDir);
        if (!dir.exists()) dir.mkdirs();

        // ✅ Unique filename
        String filename = userId.toString() + "_"
                + System.currentTimeMillis() + "_"
                + file.getOriginalFilename();

        // ✅ File save karo
        Path filePath = Paths.get(uploadDir + filename);
        Files.write(filePath, file.getBytes());

        // ✅ Profile mein photo path save karo
        profile.setProfilePhoto("/uploads/doctors/" + filename);
        doctorProfileRepository.save(profile);

        return buildResponse(profile);
    }

    // ✅ Get All Doctors
    public List<DoctorProfileResponse> getAllDoctors() {
        return doctorProfileRepository.findAll()
                .stream()
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // ✅ Filter by Specialization
    public List<DoctorProfileResponse> filterBySpecialization(String specialization) {
        return doctorProfileRepository.findAll()
                .stream()
                .filter(p -> specialization.equalsIgnoreCase(p.getSpecialization()))
                .map(this::buildResponse)
                .collect(Collectors.toList());
    }

    // ✅ Get by Profile ID
    public DoctorProfileResponse getById(UUID profileId) {
        DoctorProfile profile = doctorProfileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Doctor not found"));
        return buildResponse(profile);
    }

    // ✅ Build Response
    private DoctorProfileResponse buildResponse(DoctorProfile profile) {
        DoctorProfileResponse response = new DoctorProfileResponse();

        response.setId(profile.getId());
        response.setUserId(profile.getUserId());
        response.setClinicName(profile.getClinicName());
        response.setClinicAddress(profile.getClinicAddress());
        response.setSpecialization(profile.getSpecialization());
        response.setConsultationFee(profile.getConsultationFee());
        response.setExperienceYears(profile.getExperienceYears());
        response.setAbout(profile.getAbout());
        response.setPhone(profile.getPhone());
        response.setWhatsapp(profile.getWhatsapp());
        response.setProfilePhoto(profile.getProfilePhoto());
        response.setIsVerified(profile.getIsVerified());

        // ✅ String → List
        response.setLanguages(profile.getLanguagesList());

        // ✅ User se name + email
        if (profile.getUserId() != null) {
            userRepository.findById(profile.getUserId())
                    .ifPresent(user -> {
                        response.setName(user.getName());
                        response.setEmail(user.getEmail());
                    });
        }

        return response;
    }
}
