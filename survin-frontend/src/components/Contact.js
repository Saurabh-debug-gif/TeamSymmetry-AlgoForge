"use client";
import useBreakpoint from "@/hooks/useBreakpoint";

export default function Contact() {
    const { isMobile } = useBreakpoint();

    return (
        <section id="contact" className="sec-pad" style={{ background: "var(--navy2)" }}>
            <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                gap: isMobile ? "2rem" : "4rem",
                alignItems: "start"
            }}>

                {/* LEFT INFO */}
                <div>
                    <div className="sec-tag">Contact</div>
                    <h2 style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: isMobile ? 32 : 40,
                        color: "#F0F4FF", marginBottom: "1rem"
                    }}>Get In Touch</h2>
                    <p style={{
                        fontSize: 15, color: "rgba(240,244,255,0.55)",
                        lineHeight: 1.8, marginBottom: "2rem"
                    }}>Have questions? We respond within 24 hours.</p>

                    {[
                        { icon: "📧", label: "Email", val: "support@survin.com" },
                        { icon: "📞", label: "Phone", val: "+91 98765 43210" },
                        { icon: "📍", label: "Location", val: "Mumbai, Maharashtra" },
                    ].map((c) => (
                        <div key={c.label} style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.2rem" }}>
                            <div style={{
                                width: 44, height: 44,
                                background: "rgba(201,168,76,0.1)",
                                border: "0.5px solid rgba(201,168,76,0.2)",
                                borderRadius: 10,
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 18, flexShrink: 0
                            }}>{c.icon}</div>
                            <div>
                                <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", textTransform: "uppercase", letterSpacing: 1 }}>{c.label}</div>
                                <div style={{ fontSize: 14, color: "#E8C97A" }}>{c.val}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* FORM */}
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(201,168,76,0.15)",
                    borderRadius: 20, padding: isMobile ? "1.5rem" : "2rem"
                }}>
                    {!isMobile && (
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                            {["First Name", "Last Name"].map((p) => (
                                <div key={p}>
                                    <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>{p}</label>
                                    <input className="inp" placeholder={p} />
                                </div>
                            ))}
                        </div>
                    )}
                    {isMobile && (
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>Full Name</label>
                            <input className="inp" placeholder="Rahul Sharma" />
                        </div>
                    )}
                    {[
                        { label: "Email Address", placeholder: "rahul@gmail.com", type: "email" },
                        { label: "Message", placeholder: "How can we help you?", type: "textarea" },
                    ].map((f) => (
                        <div key={f.label} style={{ marginBottom: "1rem" }}>
                            <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>{f.label}</label>
                            {f.type === "textarea"
                                ? <textarea className="inp" placeholder={f.placeholder} style={{ height: 100, resize: "none" }} />
                                : <input className="inp" type={f.type} placeholder={f.placeholder} />
                            }
                        </div>
                    ))}
                    <button style={{
                        width: "100%",
                        background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                        color: "#0A1628", border: "none",
                        padding: 13, borderRadius: 8,
                        fontSize: 15, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Outfit',sans-serif"
                    }}>Send Message</button>
                </div>
            </div>
        </section>
    );
}