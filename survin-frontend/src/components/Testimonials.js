"use client";
import { useEffect, useState } from "react";
import useBreakpoint from "@/hooks/useBreakpoint";

export default function Testimonials() {
    const { isMobile, isTablet } = useBreakpoint();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

    const fetchReviews = async () => {
        try {
            // Pehle saare doctors lao
            const docRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/doctor/profile/all`
            );
            const doctors = await docRes.json();

            // Har doctor ki reviews lao
            const allReviews = [];
            for (const doctor of doctors.slice(0, 5)) {
                const revRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/doctor/${doctor.id}`
                );
                const doctorReviews = await revRes.json();

                // Sirf latest review lo har doctor ka
                if (doctorReviews.length > 0) {
                    allReviews.push({
                        ...doctorReviews[0],
                        doctorName: doctor.clinicName || "Doctor",
                        doctorSpec: doctor.specialization || "",
                    });
                }
            }

            // Latest 3 reviews show karo
            setReviews(allReviews.slice(0, 3));
        } catch (err) {
            console.error("Reviews fetch failed:", err);
        } finally {
            setLoading(false);
        }
    };

    // Star render helper
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) =>
            i < rating ? "★" : "☆"
        ).join("");
    };

    // Initials helper
    const getInitials = (name) => {
        if (!name) return "?";
        return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
    };

    const cols = isMobile ? "1fr" : isTablet ? "repeat(2,1fr)" : "repeat(3,1fr)";

    return (
        <section className="sec-pad" style={{ background: "var(--navy3)" }}>
            <div className="sec-tag">Real Reviews</div>
            <div className="sec-title">What Patients Say</div>
            <div className="sec-sub">Real reviews from real patients — updated live.</div>

            {/* LOADING STATE */}
            {loading && (
                <div style={{
                    display: "grid", gridTemplateColumns: cols,
                    gap: "1.5rem", marginTop: "3rem"
                }}>
                    {[1, 2, 3].map((i) => (
                        <div key={i} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(201,168,76,0.1)",
                            borderRadius: 16, padding: "1.8rem", height: 200,
                            animation: "pulse 1.5s ease-in-out infinite"
                        }}>
                            <div style={{ height: 12, background: "rgba(201,168,76,0.1)", borderRadius: 4, marginBottom: 16, width: "60%" }} />
                            <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 4, marginBottom: 10 }} />
                            <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 4, marginBottom: 10, width: "80%" }} />
                            <div style={{ height: 10, background: "rgba(255,255,255,0.05)", borderRadius: 4, width: "70%" }} />
                        </div>
                    ))}
                </div>
            )}

            {/* NO REVIEWS */}
            {!loading && reviews.length === 0 && (
                <div style={{
                    textAlign: "center", padding: "4rem",
                    color: "rgba(240,244,255,0.4)", fontSize: 15
                }}>
                    <div style={{ fontSize: 40, marginBottom: "1rem" }}>⭐</div>
                    <p>No reviews yet — be the first to review!</p>
                </div>
            )}

            {/* REVIEWS GRID */}
            {!loading && reviews.length > 0 && (
                <div style={{
                    display: "grid", gridTemplateColumns: cols,
                    gap: "1.5rem", marginTop: "3rem"
                }}>
                    {reviews.map((r, idx) => (
                        <div key={idx} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(255,255,255,0.06)",
                            borderRadius: 16, padding: "1.8rem",
                            transition: "border-color 0.3s"
                        }}
                             onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"}
                             onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"}
                        >
                            {/* STARS */}
                            <div style={{
                                color: "#E8C97A", fontSize: 14,
                                marginBottom: "1rem", letterSpacing: 2
                            }}>
                                {renderStars(r.rating)}
                                <span style={{
                                    fontSize: 12, color: "rgba(240,244,255,0.4)",
                                    marginLeft: 8
                                }}>{r.rating}/5</span>
                            </div>

                            {/* COMMENT */}
                            <p style={{
                                fontSize: 14, color: "rgba(240,244,255,0.6)",
                                lineHeight: 1.8, marginBottom: "1.5rem",
                                fontStyle: "italic"
                            }}>
                                "{r.comment || "Great experience with this doctor!"}"
                            </p>

                            {/* REVIEWER */}
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                <div style={{
                                    width: 38, height: 38, borderRadius: "50%",
                                    background: "linear-gradient(135deg,rgba(201,168,76,0.3),rgba(201,168,76,0.1))",
                                    border: "0.5px solid rgba(201,168,76,0.3)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 13, fontWeight: 600, color: "#C9A84C",
                                    flexShrink: 0
                                }}>{getInitials(r.patientName)}</div>
                                <div>
                                    <div style={{ fontSize: 14, color: "#F0F4FF", fontWeight: 500 }}>
                                        {r.patientName || "Anonymous Patient"}
                                    </div>
                                    <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)" }}>
                                        Patient · Reviewed {r.doctorSpec || "Doctor"}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* LIVE BADGE */}
            <div style={{
                display: "flex", justifyContent: "center",
                marginTop: "2rem"
            }}>
                <div style={{
                    display: "inline-flex", alignItems: "center", gap: "0.5rem",
                    background: "rgba(201,168,76,0.08)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    padding: "6px 16px", borderRadius: 20,
                    fontSize: 12, color: "rgba(240,244,255,0.5)"
                }}>
                    <div style={{
                        width: 6, height: 6, background: "#00D4FF",
                        borderRadius: "50%", animation: "blink 2s ease-in-out infinite"
                    }} />
                    Live reviews from real patients
                </div>
            </div>
        </section>
    );
}