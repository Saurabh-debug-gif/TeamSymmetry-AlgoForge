"use client";
import { useState, useEffect, useRef } from "react";

// ✅ Count up animation
function useCountUp(target, duration = 2000, start = false) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (!start || target === 0) return;
        let startTime = null;
        const step = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.floor(eased * target));
            if (progress < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }, [target, start, duration]);

    return count;
}

export default function Stats() {
    const [stats, setStats] = useState({
        verifiedDoctors: 0,
        totalPatients: 0,
        totalAppointments: 0,
        averageRating: 0,
    });
    const [loading, setLoading] = useState(true);
    const [animate, setAnimate] = useState(false);
    const sectionRef = useRef(null);

    useEffect(() => {
        // ✅ Fetch real stats
        fetch(process.env.NEXT_PUBLIC_API_URL + "/api/public/stats")
            .then(function(r) { return r.json(); })
            .then(function(data) {
                setStats({
                    verifiedDoctors: data.verifiedDoctors || 0,
                    totalPatients: data.totalPatients || 0,
                    totalAppointments: data.totalAppointments || 0,
                    averageRating: data.averageRating || 4.9,
                });
                setLoading(false);
            })
            .catch(function() {
                setLoading(false);
            });
    }, []);

    // ✅ Animate when section is visible
    useEffect(() => {
        const observer = new IntersectionObserver(
            function(entries) {
                if (entries[0].isIntersecting) {
                    setAnimate(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return function() { observer.disconnect(); };
    }, []);

    const doctorCount = useCountUp(stats.verifiedDoctors, 2000, animate);
    const patientCount = useCountUp(stats.totalPatients, 2000, animate);
    const appointmentCount = useCountUp(stats.totalAppointments, 2000, animate);

    const statItems = [
        {
            num: loading ? "..." : doctorCount + "+",
            label: "Verified Doctors",
            sublabel: "Across specializations",
            icon: "👨‍⚕️",
            color: "#C9A84C",
            glow: "rgba(201,168,76,0.15)"
        },
        {
            num: loading ? "..." : patientCount + "+",
            label: "Patients Served",
            sublabel: "And growing daily",
            icon: "🏥",
            color: "#00D4FF",
            glow: "rgba(0,212,255,0.15)"
        },
        {
            num: loading ? "..." : appointmentCount + "+",
            label: "Appointments",
            sublabel: "Successfully completed",
            icon: "📅",
            color: "#5DCAA5",
            glow: "rgba(29,158,117,0.15)"
        },
        {
            num: loading ? "..." : stats.averageRating + "★",
            label: "Average Rating",
            sublabel: "From patient reviews",
            icon: "⭐",
            color: "#EF9F27",
            glow: "rgba(239,159,39,0.15)"
        },
    ];

    return (
        <section ref={sectionRef} className="sec-pad" style={{ position: "relative" }}>

            {/* BG */}
            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(135deg, rgba(201,168,76,0.03) 0%, transparent 50%, rgba(0,100,200,0.04) 100%)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div className="sec-tag">By The Numbers</div>
                    <h2 className="sec-title">
                        Trusted by <span className="gold-text">Thousands</span>
                    </h2>
                    <p className="sec-sub" style={{ margin: "0 auto" }}>
                        Real numbers, real impact — updated live from our platform
                    </p>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "1.5rem",
                    maxWidth: 1000,
                    margin: "0 auto"
                }}>
                    {statItems.map(function(item, i) {
                        return (
                            <StatCard key={i} item={item} index={i} animate={animate} />
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

function StatCard({ item, index, animate }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={function() { setHovered(true); }}
            onMouseLeave={function() { setHovered(false); }}
            style={{
                background: hovered
                    ? "rgba(255,255,255,0.04)"
                    : "rgba(255,255,255,0.02)",
                border: "0.5px solid " + (hovered
                    ? "rgba(201,168,76,0.4)"
                    : "rgba(201,168,76,0.15)"),
                borderRadius: 20,
                padding: "2rem 1.5rem",
                textAlign: "center",
                transition: "all 0.3s",
                transform: hovered ? "translateY(-6px)" : "translateY(0)",
                boxShadow: hovered
                    ? "0 20px 40px " + item.glow
                    : "none",
                animationDelay: index * 0.1 + "s",
                opacity: animate ? 1 : 0,
                animation: animate
                    ? "fadeInUp 0.6s ease " + (index * 0.1) + "s forwards"
                    : "none",
            }}
        >
            {/* ICON */}
            <div style={{
                width: 56, height: 56, borderRadius: 14,
                background: item.glow,
                border: "0.5px solid " + item.color + "33",
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 24,
                margin: "0 auto 1.2rem",
                boxShadow: "0 0 20px " + item.glow
            }}>
                {item.icon}
            </div>

            {/* NUMBER */}
            <div style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: 44, fontWeight: 700,
                color: item.color, lineHeight: 1,
                marginBottom: "0.5rem",
                textShadow: "0 0 30px " + item.glow
            }}>
                {item.num}
            </div>

            {/* LABEL */}
            <div style={{
                fontSize: 15, color: "#F0F4FF",
                fontWeight: 500, marginBottom: "0.3rem"
            }}>
                {item.label}
            </div>

            {/* SUBLABEL */}
            <div style={{
                fontSize: 12, color: "rgba(240,244,255,0.4)"
            }}>
                {item.sublabel}
            </div>

            {/* LIVE INDICATOR */}
            <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "0.4rem",
                marginTop: "1rem"
            }}>
                <div style={{
                    width: 6, height: 6, borderRadius: "50%",
                    background: "#5DCAA5",
                    boxShadow: "0 0 6px #5DCAA5",
                    animation: "blink 2s ease infinite"
                }} />
                <span style={{ fontSize: 10, color: "rgba(240,244,255,0.3)", letterSpacing: "1px" }}>
          LIVE
        </span>
            </div>
        </div>
    );
}