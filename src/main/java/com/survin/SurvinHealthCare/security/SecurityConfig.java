package com.survin.SurvinHealthCare.config;

import com.survin.SurvinHealthCare.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.Arrays;

@Configuration
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(Arrays.asList(
                "http://localhost:3000",
                "http://192.168.0.101:3000",
                "http://192.168.0.102:3000"
        ));
        config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(Arrays.asList("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authorizeHttpRequests(auth -> auth

                        // ✅ 1. Auth endpoints
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers("/api/ai/**").permitAll()
                        // ✅ 2. Static files
                        .requestMatchers("/uploads/**").permitAll()

                        // ✅ 3. Public stats — PEHLE RAKHO
                        .requestMatchers("/api/public/**").permitAll()

                        // ✅ 4. Doctor public profiles
                        .requestMatchers(HttpMethod.GET, "/api/doctor/profile/all").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/doctor/profile/filter").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/doctor/profile/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/doctor/availability/**").permitAll()

                        // ✅ 5. Reviews public
                        .requestMatchers(HttpMethod.GET, "/api/reviews/**").permitAll()

                        // ✅ 6. Medicines & Medicals public
                        .requestMatchers(HttpMethod.GET, "/api/medicines/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/medicals/**").permitAll()

                        // ✅ 7. Photo upload
                        .requestMatchers("/api/doctor/upload-photo").permitAll()
                        .requestMatchers("/api/patient/upload-photo").permitAll()

                        // ✅ 8. Admin — authenticated
                        .requestMatchers("/api/admin/**").authenticated()

                        // ✅ 9. Baaki sab authenticated
                        .anyRequest().authenticated()
                )
                .addFilterBefore(
                        jwtAuthenticationFilter,
                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }
}
