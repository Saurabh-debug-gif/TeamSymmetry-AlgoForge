"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function DoctorLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [doctor, setDoctor] = useState(null);
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const role = (payload.role || "").toUpperCase().trim();

            if (role !== "DOCTOR") {
                if (role === "PATIENT") router.push("/dashboard/patient");
                else if (role === "ADMIN") router.push("/dashboard/admin");
                else router.push("/login");
                return;
            }
        } catch {
            router.push("/login");
            return;
        }

        // ✅ Pehle profile fetch karo — phir checking false karo
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => {
                if (r.status === 401 || r.status === 403) {
                    localStorage.removeItem("token");
                    router.push("/login");
                    return null;
                }
                return r.json();
            })
            .then(data => {
                if (data) {
                    setDoctor(data);
                }
                // ✅ Profile fetch ke BAAD checking false karo
                setChecking(false);
            })
            .catch(() => {
                // ✅ Error aaye toh bhi checking false karo — page render ho
                setChecking(false);
            });

    }, []);

    if (checking) return (
        <div style={{
            minHeight: "100vh", background: "var(--navy)",
            display: "flex", alignItems: "center", justifyContent: "center"
        }}>
            <div style={{
                color: "#C9A84C",
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 20
            }}>Loading...</div>
        </div>
    );

    const navLinks = [
        { href: "/dashboard/doctor", icon: "📊", label: "Overview" },
        { href: "/dashboard/doctor/appointments", icon: "📅", label: "Appointments" },
        { href: "/dashboard/doctor/pending", icon: "⏳", label: "Pending" },
        { href: "/dashboard/doctor/patients", icon: "👥", label: "My Patients" },
        { href: "/dashboard/doctor/prescriptions", icon: "💊", label: "Prescriptions" },
        { href: "/dashboard/doctor/profile", icon: "👤", label: "My Profile" },
        { href: "/dashboard/doctor/availability", icon: "🕐", label: "Availability" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "var(--navy)", display: "flex" }}>
            <aside style={{
                width: 240, background: "rgba(255,255,255,0.02)",
                borderRight: "0.5px solid rgba(201,168,76,0.15)",
                padding: "1.5rem", display: "flex", flexDirection: "column",
                position: "fixed", height: "100vh", zIndex: 100, overflowY: "auto"
            }}>
                <Link href="/" style={{ textDecoration: "none", marginBottom: "2rem", display: "block" }}>
                    <div style={{
                        fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 700,
                        background: "linear-gradient(135deg,#C9A84C,#F5DFA0)",
                        WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent"
                    }}>Survin Healthcare</div>
                    <div style={{ fontSize: 11, color: "rgba(240,244,255,0.3)", marginTop: 2 }}>
                        Doctor Portal
                    </div>
                </Link>

                {/* DOCTOR INFO */}
                <div style={{
                    background: "rgba(201,168,76,0.08)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    borderRadius: 12, padding: "1rem", marginBottom: "1.5rem"
                }}>
                    <div style={{
                        width: 52, height: 52, borderRadius: "50%",
                        background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 20, fontWeight: 700, color: "#0A1628",
                        marginBottom: "0.8rem", overflow: "hidden",
                        border: "2px solid rgba(201,168,76,0.3)"
                    }}>
                        {doctor?.profilePhoto ? (
                            <img
                                src={`${process.env.NEXT_PUBLIC_API_URL}${doctor.profilePhoto}`}
                                alt="profile"
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                onError={e => e.target.style.display = "none"}
                            />
                        ) : (
                            <span>{doctor?.name?.charAt(0) || "D"}</span>
                        )}
                    </div>
                    <div style={{ fontSize: 14, color: "#F0F4FF", fontWeight: 500 }}>
                        {doctor?.name || "Doctor"}
                    </div>
                    <div style={{ fontSize: 11, color: "#C9A84C", marginTop: 2 }}>
                        {doctor?.specialization || "Specialist"}
                    </div>
                    {doctor?.clinicName && (
                        <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>
                            🏥 {doctor.clinicName}
                        </div>
                    )}
                </div>

                {/* NAV */}
                <nav style={{ flex: 1 }}>
                    {navLinks.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.href} href={item.href} style={{ textDecoration: "none" }}>
                                <div style={{
                                    display: "flex", alignItems: "center", gap: "0.8rem",
                                    padding: "0.7rem 0.8rem", borderRadius: 8, marginBottom: 4,
                                    background: isActive ? "rgba(201,168,76,0.15)" : "transparent",
                                    color: isActive ? "#E8C97A" : "rgba(240,244,255,0.5)",
                                    fontSize: 14,
                                    borderLeft: isActive ? "2px solid #C9A84C" : "2px solid transparent",
                                    transition: "all 0.2s", cursor: "pointer"
                                }}
                                     onMouseEnter={e => {
                                         if (!isActive) e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                                     }}
                                     onMouseLeave={e => {
                                         if (!isActive) e.currentTarget.style.background = "transparent";
                                     }}
                                >
                                    <span>{item.icon}</span>
                                    <span>{item.label}</span>
                                </div>
                            </Link>
                        );
                    })}
                </nav>

                {/* LOGOUT */}
                <button onClick={() => {
                    localStorage.removeItem("token");
                    router.push("/login");
                }} style={{
                    width: "100%", padding: "0.8rem",
                    background: "rgba(226,75,74,0.1)",
                    border: "0.5px solid rgba(226,75,74,0.2)",
                    borderRadius: 8, color: "#F09595",
                    fontSize: 14, cursor: "pointer",
                    fontFamily: "'Outfit',sans-serif",
                    display: "flex", alignItems: "center",
                    gap: "0.5rem", justifyContent: "center"
                }}>🚪 Logout</button>
            </aside>

            <main style={{ marginLeft: 240, flex: 1, padding: "2rem", minHeight: "100vh" }}>
                {children}
            </main>
        </div>
    );
}