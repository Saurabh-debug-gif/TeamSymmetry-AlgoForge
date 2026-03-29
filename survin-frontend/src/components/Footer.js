"use client";
import useBreakpoint from "@/hooks/useBreakpoint";

export default function Footer() {
    const { isMobile } = useBreakpoint();

    return (
        <footer style={{
            background: "rgba(5,11,20,0.95)",
            padding: isMobile ? "2rem 1.2rem" : "3rem",
            borderTop: "0.5px solid rgba(201,168,76,0.1)"
        }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr 1fr" : "2fr 1fr 1fr 1fr",
                gap: isMobile ? "1.5rem" : "2rem",
                marginBottom: "2rem"
            }}>

                {/* BRAND — Full width on mobile */}
                <div style={{ gridColumn: isMobile ? "1 / -1" : "auto" }}>
                    <div style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 20, fontWeight: 700,
                        background: "linear-gradient(135deg,#C9A84C,#F5DFA0)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "0.8rem"
                    }}>Survin Healthcare</div>
                    <p style={{ fontSize: 13, color: "rgba(240,244,255,0.35)", lineHeight: 1.7 }}>
                        India's most trusted healthcare platform. Premium. Professional. Compassionate.
                    </p>
                </div>

                {[
                    { title: "Platform", links: ["Find Doctors", "Book Appointment", "Medical Stores", "Prescriptions"] },
                    { title: "Support", links: ["Help Center", "Privacy Policy", "Terms of Service", "Contact Us"] },
                    ...(!isMobile ? [{ title: "Doctors", links: ["Doctor Login", "Register", "Dashboard", "Prescriptions"] }] : []),
                ].map((col) => (
                    <div key={col.title}>
                        <h4 style={{ fontSize: 12, color: "#C9A84C", marginBottom: "0.8rem", letterSpacing: 1, textTransform: "uppercase" }}>{col.title}</h4>
                        <ul style={{ listStyle: "none" }}>
                            {col.links.map((l) => (
                                <li key={l} style={{
                                    fontSize: 12, color: "rgba(240,244,255,0.4)",
                                    marginBottom: "0.5rem", cursor: "pointer"
                                }}>{l}</li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div style={{
                borderTop: "0.5px solid rgba(255,255,255,0.05)",
                paddingTop: "1.5rem", textAlign: "center",
                fontSize: isMobile ? 11 : 12,
                color: "rgba(240,244,255,0.25)", letterSpacing: "0.5px"
            }}>
                © 2026 Survin Healthcare · Premium · Professional · Compassionate
            </div>
        </footer>
    );
}