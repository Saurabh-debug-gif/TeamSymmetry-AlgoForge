package com.survin.SurvinHealthCare.notification.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    // ✅ Basic Email Bhejo
    public void sendEmail(String toEmail, String subject, String body) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);

            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(body, true); // true = HTML support
            mailSender.send(message);

        } catch (Exception e) {
            System.out.println("Email send failed: " + e.getMessage());
        }
    }

    // ✅ Appointment Confirm Email
    public void sendAppointmentConfirmation(
            String patientEmail,
            String patientName,
            String doctorName,
            String date,
            String time,
            String clinicName,
            String clinicAddress) {

        String subject = "🏥 Appointment Confirmed — SurvinHealthCare";

        String body = "<h2>Hello " + patientName + "!</h2>" +
                "<p>Your appointment has been <b>confirmed</b>.</p>" +
                "<hr>" +
                "<h3>Appointment Details:</h3>" +
                "<p>👨‍⚕️ <b>Doctor:</b> " + doctorName + "</p>" +
                "<p>📅 <b>Date:</b> " + date + "</p>" +
                "<p>⏰ <b>Time:</b> " + time + "</p>" +
                "<p>🏥 <b>Clinic:</b> " + clinicName + "</p>" +
                "<p>📍 <b>Address:</b> " + clinicAddress + "</p>" +
                "<hr>" +
                "<p>Thank you for choosing SurvinHealthCare!</p>";

        sendEmail(patientEmail, subject, body);
    }

    // ✅ Appointment Cancel Email
    public void sendAppointmentCancellation(
            String patientEmail,
            String patientName,
            String doctorName,
            String date) {

        String subject = "❌ Appointment Cancelled — SurvinHealthCare";

        String body = "<h2>Hello " + patientName + "!</h2>" +
                "<p>Your appointment has been <b>cancelled</b>.</p>" +
                "<hr>" +
                "<p>👨‍⚕️ <b>Doctor:</b> " + doctorName + "</p>" +
                "<p>📅 <b>Date:</b> " + date + "</p>" +
                "<hr>" +
                "<p>Please book again at your convenience.</p>" +
                "<p>Thank you for choosing SurvinHealthCare!</p>";

        sendEmail(patientEmail, subject, body);
    }

    // ✅ Welcome Email
    public void sendWelcomeEmail(String email, String name) {

        String subject = "🎉 Welcome to SurvinHealthCare!";

        String body = "<h2>Welcome " + name + "!</h2>" +
                "<p>Thank you for joining <b>SurvinHealthCare</b>.</p>" +
                "<p>You can now:</p>" +
                "<ul>" +
                "<li>Book appointments with doctors</li>" +
                "<li>Search doctors by specialization</li>" +
                "<li>Get medicines from medical stores</li>" +
                "</ul>" +
                "<p>Thank you for choosing SurvinHealthCare!</p>";

        sendEmail(email, subject, body);
    }
}