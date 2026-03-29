"use client";
import useBreakpoint from "@/hooks/useBreakpoint";

export default function Process() {
    const { isMobile, isTablet } = useBreakpoint();

    const steps = [
        { num: "1", title: "Register", desc: "Create your account as a patient or doctor in minutes." },
        { num: "2", title: "Find Doctor", desc: "Search by specialization, city or availability." },
        { num: "3", title: "Book Slot", desc: "Pick your preferred date and get confirmed instantly." },
        { num: "4", title: "Get Treated", desc: "Visit clinic and receive your digital prescription." },
    ];

    const cols = isMobile ? "repeat(2,1fr)" : isTablet ? "repeat(2,1fr)" : "repeat(4,1fr)";

    return (
        <section className="sec-pad" style={{ background: "var(--navy2)" }}>
            <div style={{ textAlign: "center", marginBottom: "1rem" }}>
                <div className="sec-tag" style={{ textAlign: "center" }}>Process</div>
                <div className="sec-title" style={{ textAlign: "center" }}>
                    {isMobile ? "How It Works" : "4 Simple Steps"}
                </div>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: cols,
                gap: "1rem", marginTop: "3rem"
            }}>
                {steps.map((s) => (
                    <div key={s.num} style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
                        <div style={{
                            width: 52, height: 52, borderRadius: "50%",
                            background: "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.05))",
                            border: "1px solid rgba(201,168,76,0.4)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            margin: "0 auto 1rem",
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: 20, fontWeight: 700, color: "#C9A84C"
                        }}>{s.num}</div>
                        <h4 style={{ fontSize: 14, color: "#F0F4FF", marginBottom: "0.4rem", fontWeight: 500 }}>{s.title}</h4>
                        <p style={{ fontSize: 12, color: "rgba(240,244,255,0.45)", lineHeight: 1.6 }}>{s.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}