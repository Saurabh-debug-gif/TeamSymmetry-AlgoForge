"use client";
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const pathname = usePathname();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) { router.push("/login"); return; }

        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const role = (payload.role || "").toUpperCase().trim();

            if (role !== "ADMIN") {
                if (role === "DOCTOR") router.push("/dashboard/doctor");
                else if (role === "PATIENT") router.push("/dashboard/patient");
                else router.push("/login");
                return;
            }
        } catch {
            router.push("/login");
            return;
        }

        setChecking(false);
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
        { href: "/dashboard/admin", icon: "📊", label: "Overview" },
        { href: "/dashboard/admin/sop", icon: "📄", label: "SOP Processor" },
        { href: "/dashboard/admin/doctors", icon: "👨‍⚕️", label: "Doctors" },
        { href: "/dashboard/admin/patients", icon: "👥", label: "Patients" },
        { href: "/dashboard/admin/medicals", icon: "🏪", label: "Medical Stores" },
        { href: "/dashboard/admin/medicines", icon: "💊", label: "Medicines" },
    ];

    return (
        <div style={{ minHeight: "100vh", background: "var(--navy)", display: "flex" }}>

            {/* SIDEBAR */}
            <aside style={{
                width: 240,
                background: "rgba(255,255,255,0.02)",
                borderRight: "0.5px solid rgba(201,168,76,0.15)",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column",
                position: "fixed",
                height: "100vh",
                zIndex: 100,
                overflowY: "auto"
            }}>

                {/* LOGO */}
                <Link href="/" style={{ textDecoration: "none", marginBottom: "2rem", display: "block" }}>
                    <div style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 18, fontWeight: 700,
                        background: "linear-gradient(135deg,#C9A84C,#F5DFA0)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent"
                    }}>Survin Healthcare</div>
                    <div style={{ fontSize: 11, color: "rgba(240,244,255,0.3)", marginTop: 2 }}>
                        Admin Portal
                    </div>
                </Link>

                {/* ADMIN INFO */}
                <div style={{
                    background: "rgba(201,168,76,0.08)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    borderRadius: 12, padding: "1rem",
                    marginBottom: "1.5rem",
                    display: "flex", alignItems: "center", gap: "0.8rem"
                }}>
                    <div style={{
                        width: 44, height: 44, borderRadius: "50%",
                        background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 18, fontWeight: 700, color: "#0A1628", flexShrink: 0
                    }}>A</div>
                    <div>
                        <div style={{ fontSize: 14, color: "#F0F4FF", fontWeight: 500 }}>
                            Super Admin
                        </div>
                        <div style={{
                            fontSize: 11, color: "#C9A84C", marginTop: 2,
                            display: "flex", alignItems: "center", gap: "0.3rem"
                        }}>
              <span style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: "#5DCAA5", display: "inline-block"
              }}></span>
                            Online
                        </div>
                    </div>
                </div>

                {/* NAV LINKS */}
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
                    localStorage.clear();
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

            {/* MAIN CONTENT */}
            <main style={{
                marginLeft: 240, flex: 1,
                padding: "2rem", minHeight: "100vh"
            }}>
                {children}
            </main>
        </div>
    );
}