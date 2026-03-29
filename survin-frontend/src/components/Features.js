"use client";
import useBreakpoint from "@/hooks/useBreakpoint";

export default function Features() {
    const { isMobile, isTablet } = useBreakpoint();

    const features = [
        { icon: "📅", title: "Smart Appointments", desc: "Book with verified doctors by specialization, availability and rating." },
        { icon: "💊", title: "Digital Prescriptions", desc: "Doctors write digital prescriptions — access them anytime." },
        { icon: "🏪", title: "Medical Store Connect", desc: "Find nearby stores and send medicine enquiries via WhatsApp." },
        { icon: "⭐", title: "Verified Reviews", desc: "Real patient reviews help you choose the best doctor." },
        { icon: "📧", title: "Instant Notifications", desc: "Email confirmations for bookings and updates." },
        { icon: "🔒", title: "Secure & Private", desc: "JWT authentication keeps your data protected always." },
    ];

    const cols = isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)";

    return (
        <section className="sec-pad" style={{ background: "var(--navy2)" }}>
            <div className="sec-tag">Why Survin</div>
            <div className="sec-title">Everything You Need</div>
            <div className="sec-sub">A complete healthcare ecosystem for everyone.</div>

            <div style={{
                display: "grid", gridTemplateColumns: cols,
                gap: "1.5rem", marginTop: "3rem"
            }}>
                {features.map((f) => (
                    <div key={f.title} style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(201,168,76,0.2)",
                        borderRadius: 16, padding: "1.8rem",
                        cursor: "pointer", transition: "all 0.3s"
                    }}
                         onMouseEnter={e => {
                             e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)";
                             e.currentTarget.style.background = "rgba(201,168,76,0.04)";
                             e.currentTarget.style.transform = "translateY(-6px)";
                         }}
                         onMouseLeave={e => {
                             e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)";
                             e.currentTarget.style.background = "rgba(255,255,255,0.02)";
                             e.currentTarget.style.transform = "translateY(0)";
                         }}>
                        <div style={{
                            width: 48, height: 48,
                            background: "linear-gradient(135deg,rgba(201,168,76,0.15),rgba(201,168,76,0.05))",
                            border: "0.5px solid rgba(201,168,76,0.3)",
                            borderRadius: 12,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 20, marginBottom: "1rem"
                        }}>{f.icon}</div>
                        <h3 style={{ fontSize: 16, fontWeight: 500, color: "#F0F4FF", marginBottom: "0.5rem" }}>{f.title}</h3>
                        <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", lineHeight: 1.7 }}>{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}