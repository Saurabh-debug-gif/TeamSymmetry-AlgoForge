"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
    const router = useRouter();
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        setLoaded(true);
    }, []);

    return (
        <section style={{
            position: "relative",
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            paddingTop: 68
        }}>

            {/* ✅ BACKGROUND VIDEO */}
            <video
                autoPlay
                muted
                loop
                playsInline
                style={{
                    position: "absolute",
                    top: 0, left: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover",
                    zIndex: 0,
                    opacity: 0.18,
                    filter: "blur(2px)"
                }}
            >
                <source src="/hero-video.mp4" type="video/mp4" />
            </video>

            {/* ✅ TOP GRADIENT OVERLAY */}
            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, rgba(10,22,40,0.8) 0%, rgba(10,22,40,0.4) 50%, rgba(10,22,40,0.95) 100%)",
                zIndex: 1
            }} />

            {/* ✅ SIDE GRADIENTS */}
            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(90deg, rgba(10,22,40,0.9) 0%, transparent 25%, transparent 75%, rgba(10,22,40,0.9) 100%)",
                zIndex: 1
            }} />

            {/* ✅ GOLD GLOW ORB */}
            <div style={{
                position: "absolute",
                width: 600, height: 600,
                borderRadius: "50%",
                background: "radial-gradient(circle, rgba(201,168,76,0.06) 0%, transparent 70%)",
                top: "50%", left: "50%",
                transform: "translate(-50%, -50%)",
                zIndex: 1,
                pointerEvents: "none"
            }} />

            {/* ✅ MAIN CONTENT */}
            <div style={{
                position: "relative",
                zIndex: 2,
                textAlign: "center",
                padding: "0 2rem",
                maxWidth: 900,
                opacity: loaded ? 1 : 0,
                transform: loaded ? "translateY(0)" : "translateY(30px)",
                transition: "all 0.8s ease"
            }}>

                {/* LIVE BADGE */}
                <div style={{
                    display: "inline-flex", alignItems: "center",
                    gap: "0.5rem",
                    background: "rgba(201,168,76,0.08)",
                    border: "0.5px solid rgba(201,168,76,0.25)",
                    borderRadius: 20, padding: "6px 20px",
                    fontSize: 11, color: "#C9A84C",
                    letterSpacing: "2px", textTransform: "uppercase",
                    marginBottom: "2rem"
                }}>
                    <div style={{
                        width: 6, height: 6, borderRadius: "50%",
                        background: "#5DCAA5",
                        boxShadow: "0 0 8px #5DCAA5",
                        animation: "blink 2s ease infinite"
                    }} />
                    India's Premium Healthcare Platform
                </div>

                {/* MAIN HEADING */}
                <h1 style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: "clamp(42px, 7vw, 82px)",
                    fontWeight: 700,
                    color: "#F0F4FF",
                    lineHeight: 1.1,
                    marginBottom: "1.5rem",
                    letterSpacing: "-1px"
                }}>
                    Your Health,{" "}
                    <br />
                    <span style={{
                        background: "linear-gradient(135deg,#C9A84C,#F5DFA0,#C9A84C)",
                        backgroundSize: "200% auto",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        animation: "shimmer 3s linear infinite"
                    }}>
            Our Priority
          </span>
                </h1>

                {/* SUBTITLE */}
                <p style={{
                    fontSize: "clamp(15px, 2vw, 18px)",
                    color: "rgba(240,244,255,0.6)",
                    lineHeight: 1.9,
                    maxWidth: 580,
                    margin: "0 auto 2.5rem"
                }}>
                    Connect with verified doctors, book appointments instantly,
                    and get digital prescriptions — all in one trusted platform.
                </p>

                {/* CTA BUTTONS */}
                <div style={{
                    display: "flex", gap: "1rem",
                    justifyContent: "center", flexWrap: "wrap",
                    marginBottom: "3.5rem"
                }}>
                    <button
                        onClick={function() { router.push("/register"); }}
                        style={{
                            background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                            color: "#0A1628", border: "none",
                            padding: "15px 40px", borderRadius: 10,
                            fontSize: 15, fontWeight: 700,
                            cursor: "pointer",
                            fontFamily: "'Outfit', sans-serif",
                            boxShadow: "0 8px 30px rgba(201,168,76,0.4)",
                            transition: "all 0.3s",
                            letterSpacing: "0.3px"
                        }}
                        onMouseEnter={function(e) {
                            e.currentTarget.style.transform = "translateY(-3px)";
                            e.currentTarget.style.boxShadow = "0 15px 40px rgba(201,168,76,0.5)";
                        }}
                        onMouseLeave={function(e) {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 8px 30px rgba(201,168,76,0.4)";
                        }}
                    >
                        Get Started Free →
                    </button>

                    <button
                        onClick={function() {
                            const el = document.getElementById("doctors");
                            if (el) el.scrollIntoView({ behavior: "smooth" });
                        }}
                        style={{
                            background: "rgba(255,255,255,0.05)",
                            color: "#F0F4FF",
                            border: "0.5px solid rgba(255,255,255,0.15)",
                            padding: "15px 40px", borderRadius: 10,
                            fontSize: 15, cursor: "pointer",
                            fontFamily: "'Outfit', sans-serif",
                            backdropFilter: "blur(10px)",
                            transition: "all 0.3s"
                        }}
                        onMouseEnter={function(e) {
                            e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                            e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)";
                            e.currentTarget.style.transform = "translateY(-3px)";
                        }}
                        onMouseLeave={function(e) {
                            e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                            e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                    >
                        Find Doctors 👨‍⚕️
                    </button>
                </div>

                {/* TRUST BADGES */}
                <div style={{
                    display: "flex", gap: "1.5rem",
                    justifyContent: "center", flexWrap: "wrap"
                }}>
                    {[
                        { icon: "🔒", text: "100% Secure" },
                        { icon: "✅", text: "Verified Doctors" },
                        { icon: "⚡", text: "Instant Booking" },
                        { icon: "💊", text: "Digital Prescriptions" },
                    ].map(function(badge, i) {
                        return (
                            <div key={i} style={{
                                display: "flex", alignItems: "center",
                                gap: "0.4rem",
                                background: "rgba(255,255,255,0.04)",
                                border: "0.5px solid rgba(255,255,255,0.08)",
                                borderRadius: 20, padding: "6px 14px",
                                fontSize: 12, color: "rgba(240,244,255,0.55)"
                            }}>
                                <span>{badge.icon}</span>
                                <span>{badge.text}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* SCROLL INDICATOR */}
            <div style={{
                position: "absolute", bottom: 35,
                left: "50%", transform: "translateX(-50%)",
                zIndex: 2, display: "flex",
                flexDirection: "column", alignItems: "center",
                gap: "0.5rem", cursor: "pointer"
            }}
                 onClick={function() {
                     window.scrollBy({ top: window.innerHeight, behavior: "smooth" });
                 }}
            >
                <div style={{
                    fontSize: 10, color: "rgba(240,244,255,0.25)",
                    letterSpacing: "3px", textTransform: "uppercase"
                }}>Scroll Down</div>

                {/* Animated Arrow */}
                <div style={{
                    width: 30, height: 30,
                    border: "0.5px solid rgba(201,168,76,0.3)",
                    borderRadius: "50%",
                    display: "flex", alignItems: "center",
                    justifyContent: "center",
                    animation: "floatCard 2s ease-in-out infinite",
                    color: "#C9A84C", fontSize: 14
                }}>↓</div>
            </div>
        </section>
    );
}
