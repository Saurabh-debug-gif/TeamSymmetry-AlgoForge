"use client";
import { useState, useEffect } from "react";

export default function DoctorsShowcase() {
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_API_URL + "/api/doctor/profile/all")
            .then(function(r) { return r.json(); })
            .then(function(data) {
                const verified = Array.isArray(data)
                    ? data.filter(function(d) { return d.isVerified; })
                    : [];
                setDoctors(verified);
                setLoading(false);
            })
            .catch(function() { setLoading(false); });
    }, []);

    if (loading || doctors.length === 0) return null;

    // ✅ Scroll tabhi karo jab 4+ doctors hon
    const shouldScroll = doctors.length >= 4;

    // ✅ Sirf scroll ke liye duplicate karo — cards unique rahenge
    const displayDoctors = shouldScroll
        ? doctors.concat(doctors)  // Seamless loop ke liye sirf 2x
        : doctors;                 // ✅ 1 doctor = 1 card

    const speed = Math.max(20, doctors.length * 6) + "s";

    return (
        <section className="sec-pad" style={{ overflow: "hidden", position: "relative" }}>
            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, transparent, rgba(201,168,76,0.03), transparent)",
                pointerEvents: "none"
            }} />

            <div style={{ textAlign: "center", marginBottom: "3rem", position: "relative", zIndex: 1 }}>
                <div className="sec-tag">Our Medical Experts</div>
                <h2 className="sec-title">
                    Meet Our <span className="gold-text">Verified Doctors</span>
                </h2>
                <p className="sec-sub" style={{ margin: "0 auto" }}>
                    Consult with India's top verified healthcare professionals
                </p>
            </div>

            <div style={{
                position: "relative",
                maskImage: shouldScroll
                    ? "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)"
                    : "none",
                WebkitMaskImage: shouldScroll
                    ? "linear-gradient(90deg, transparent, black 8%, black 92%, transparent)"
                    : "none",
            }}>
                <div
                    style={{
                        display: "flex",
                        gap: "1.5rem",
                        // ✅ Scroll animation sirf 4+ doctors pe
                        animation: shouldScroll
                            ? "scrollLeft " + speed + " linear infinite"
                            : "none",
                        width: shouldScroll ? "max-content" : "100%",
                        // ✅ Kam doctors = center mein dikhao
                        justifyContent: shouldScroll ? "flex-start" : "center",
                        flexWrap: shouldScroll ? "nowrap" : "wrap",
                    }}
                    onMouseEnter={function(e) {
                        if (shouldScroll)
                            e.currentTarget.style.animationPlayState = "paused";
                    }}
                    onMouseLeave={function(e) {
                        if (shouldScroll)
                            e.currentTarget.style.animationPlayState = "running";
                    }}
                >
                    {displayDoctors.map(function(doc, i) {
                        return <DoctorCard key={doc.id + "-" + i} doctor={doc} />;
                    })}
                </div>
            </div>

            {shouldScroll && (
                <style>{
                    "@keyframes scrollLeft {" +
                    "  0% { transform: translateX(0); }" +
                    "  100% { transform: translateX(-50%); }" +
                    "}"
                }</style>
            )}
        </section>
    );
}

function DoctorCard({ doctor }) {
    const [hovered, setHovered] = useState(false);

    const waText = "Hello Dr. " + (doctor.name || "") + ", I would like to book an appointment.";
    const waHref = "https://wa.me/" + (doctor.whatsapp || "") + "?text=" + encodeURIComponent(waText);
    const telHref = "tel:" + (doctor.phone || "");
    const photoSrc = (process.env.NEXT_PUBLIC_API_URL || "") + (doctor.profilePhoto || "");

    return (
        <div
            onMouseEnter={function() { setHovered(true); }}
            onMouseLeave={function() { setHovered(false); }}
            style={{
                width: 260,
                background: hovered ? "rgba(201,168,76,0.08)" : "rgba(255,255,255,0.02)",
                border: "0.5px solid " + (hovered ? "rgba(201,168,76,0.5)" : "rgba(201,168,76,0.15)"),
                borderRadius: 20,
                overflow: "hidden",
                transition: "all 0.3s ease",
                transform: hovered ? "translateY(-8px) scale(1.02)" : "translateY(0) scale(1)",
                boxShadow: hovered ? "0 20px 40px rgba(201,168,76,0.15)" : "none",
                flexShrink: 0,
            }}
        >
            {/* TOP */}
            <div style={{
                background: "linear-gradient(135deg,rgba(201,168,76,0.15),rgba(0,100,200,0.1))",
                padding: "1.5rem",
                textAlign: "center",
                position: "relative"
            }}>
                <div style={{
                    position: "absolute", top: 12, right: 12,
                    background: "rgba(29,158,117,0.15)",
                    border: "0.5px solid rgba(29,158,117,0.4)",
                    borderRadius: 20, padding: "3px 10px",
                    fontSize: 10, color: "#5DCAA5"
                }}>✅ Verified</div>

                <div style={{
                    width: 80, height: 80, borderRadius: "50%",
                    margin: "0 auto 1rem",
                    background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 28, fontWeight: 700, color: "#0A1628",
                    overflow: "hidden",
                    border: "3px solid rgba(201,168,76,0.4)",
                    boxShadow: "0 0 20px rgba(201,168,76,0.2)"
                }}>
                    {doctor.profilePhoto
                        ? <img
                            src={photoSrc}
                            style={{ width: "100%", height: "100%", objectFit: "cover" }}
                            alt={doctor.name || "Doctor"}
                            onError={function(e) { e.target.style.display = "none"; }}
                        />
                        : (doctor.name ? doctor.name.charAt(0) : "D")
                    }
                </div>

                <div style={{ fontSize: 17, color: "#F0F4FF", fontWeight: 600, marginBottom: 4 }}>
                    {doctor.name || "Doctor"}
                </div>
                <div style={{
                    color: "#C9A84C",
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 15, fontStyle: "italic"
                }}>
                    {doctor.specialization || "Specialist"}
                </div>
            </div>

            {/* BOTTOM */}
            <div style={{ padding: "1rem 1.2rem" }}>
                {[
                    { icon: "🏥", val: doctor.clinicName },
                    {
                        icon: "📅",
                        val: doctor.experienceYears
                            ? doctor.experienceYears + " Years Experience"
                            : null
                    },
                    {
                        icon: "💰",
                        val: doctor.consultationFee
                            ? "₹" + doctor.consultationFee + " Consultation"
                            : null
                    },
                ].filter(function(i) { return i.val; }).map(function(item, idx) {
                    return (
                        <div key={idx} style={{
                            display: "flex", alignItems: "center", gap: "0.5rem",
                            padding: "4px 0",
                            borderBottom: "0.5px solid rgba(255,255,255,0.04)",
                            fontSize: 12, color: "rgba(240,244,255,0.6)"
                        }}>
                            <span>{item.icon}</span>
                            <span style={{
                                whiteSpace: "nowrap", overflow: "hidden",
                                textOverflow: "ellipsis"
                            }}>{item.val}</span>
                        </div>
                    );
                })}

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.8rem" }}>
                    {doctor.whatsapp && (
                        <a href={waHref} target="_blank" rel="noreferrer" style={{
                            flex: 1,
                            background: "rgba(37,211,102,0.1)", color: "#25D366",
                            border: "0.5px solid rgba(37,211,102,0.3)",
                            padding: "7px", borderRadius: 8,
                            fontSize: 12, textDecoration: "none", textAlign: "center"
                        }}>💬 WhatsApp</a>
                    )}
                    {doctor.phone && (
                        <a href={telHref} style={{
                            flex: 1,
                            background: "rgba(0,212,255,0.1)", color: "#00D4FF",
                            border: "0.5px solid rgba(0,212,255,0.3)",
                            padding: "7px", borderRadius: 8,
                            fontSize: 12, textDecoration: "none", textAlign: "center"
                        }}>📞 Call</a>
                    )}
                </div>
            </div>
        </div>
    );
}
