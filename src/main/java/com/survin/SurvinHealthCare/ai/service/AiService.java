package com.survin.SurvinHealthCare.ai.service;

import com.survin.SurvinHealthCare.ai.entity.sop;
import com.survin.SurvinHealthCare.ai.repository.sopRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.core.io.ByteArrayResource;

@Service
@RequiredArgsConstructor
public class AiService {

    private final sopRepository sopRepository;

    public String processSop(MultipartFile file) throws Exception {

        String pythonUrl = "http://localhost:8000/process-sop";

        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.MULTIPART_FORM_DATA);

        ByteArrayResource resource = new ByteArrayResource(file.getBytes()) {
            @Override
            public String getFilename() {
                return file.getOriginalFilename();
            }
        };

        MultiValueMap<String, Object> body = new LinkedMultiValueMap<>();
        body.add("file", resource);

        HttpEntity<MultiValueMap<String, Object>> requestEntity =
                new HttpEntity<>(body, headers);

        ResponseEntity<String> response = restTemplate.postForEntity(
                pythonUrl,
                requestEntity,
                String.class
        );

        // ✅ SAVE TO DB
        com.survin.SurvinHealthCare.ai.entity.sop sop = new sop();
        sop.setFileName(file.getOriginalFilename());
        sop.setContent(response.getBody());

        sopRepository.save(sop);

        return response.getBody();
    }
}