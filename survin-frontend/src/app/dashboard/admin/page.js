"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminOverview() {
    const [stats, setStats] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/stats`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => { setStats(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    const cards = [
        { label: "Total Users", num: stats.totalUsers || 0, icon: "👥", color: "#C9A84C", href: "/dashboard/admin/patients" },
        { label: "Total Doctors", num: stats.totalDoctors || 0, icon: "👨‍⚕️", color: "#00D4FF", href: "/dashboard/admin/doctors" },
        { label: "Total Patients", num: stats.totalPatients || 0, icon: "🧑‍🦽", color: "#5DCAA5", href: "/dashboard/admin/patients" },
        { label: "Appointments", num: stats.totalAppointments || 0, icon: "📅", color: "#EF9F27", href: "/dashboard/admin" },
        { label: "Pending", num: stats.pendingAppointments || 0, icon: "⏳", color: "#F09595", href: "/dashboard/admin" },
        { label: "Medical Stores", num: stats.totalMedicals || 0, icon: "🏪", color: "#C9A84C", href: "/dashboard/admin/medicals" },
        { label: "Medicines", num: stats.totalMedicines || 0, icon: "💊", color: "#00D4FF", href: "/dashboard/admin/medicines" },
    ];

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#F0F4FF", marginBottom: "0.3rem" }}>
                    Admin Dashboard
                </h2>
                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)" }}>
                    Manage everything from one place
                </p>
            </div>

            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
                    {[1,2,3,4,5,6,7].map(i => (
                        <div key={i} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(201,168,76,0.1)",
                            borderRadius: 14, height: 120
                        }} />
                    ))}
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem", marginBottom: "2rem" }}>
                    {cards.map((c) => (
                        <Link key={c.label} href={c.href} style={{ textDecoration: "none" }}>
                            <div style={{
                                background: "rgba(255,255,255,0.02)",
                                border: "0.5px solid rgba(201,168,76,0.15)",
                                borderRadius: 14, padding: "1.5rem",
                                cursor: "pointer", transition: "all 0.2s"
                            }}
                                 onMouseEnter={e => {
                                     e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
                                     e.currentTarget.style.transform = "translateY(-3px)";
                                 }}
                                 onMouseLeave={e => {
                                     e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
                                     e.currentTarget.style.transform = "translateY(0)";
                                 }}
                            >
                                <div style={{ fontSize: 24, marginBottom: "0.5rem" }}>{c.icon}</div>
                                <div style={{
                                    fontFamily: "'Cormorant Garamond',serif",
                                    fontSize: 36, fontWeight: 700, color: c.color
                                }}>{c.num}</div>
                                <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 4 }}>{c.label}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* QUICK ACTIONS */}
            <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "0.5px solid rgba(201,168,76,0.2)",
                borderRadius: 16, padding: "1.5rem"
            }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#F0F4FF", marginBottom: "1.2rem" }}>
                    Quick Actions
                </h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
                    {[
                        { href: "/dashboard/admin/doctors", icon: "👨‍⚕️", label: "Manage Doctors", color: "#00D4FF" },
                        { href: "/dashboard/admin/patients", icon: "👥", label: "Manage Patients", color: "#5DCAA5" },
                        { href: "/dashboard/admin/medicals", icon: "🏪", label: "Add Medical Store", color: "#C9A84C" },
                        { href: "/dashboard/admin/medicines", icon: "💊", label: "Add Medicine", color: "#EF9F27" },
                    ].map((q) => (
                        <Link key={q.href} href={q.href} style={{ textDecoration: "none" }}>
                            <div style={{
                                background: "rgba(255,255,255,0.02)",
                                border: "0.5px solid rgba(255,255,255,0.05)",
                                borderRadius: 12, padding: "1.2rem",
                                textAlign: "center", cursor: "pointer", transition: "all 0.2s"
                            }}
                                 onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"}
                                 onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
                            >
                                <div style={{ fontSize: 28, marginBottom: "0.5rem" }}>{q.icon}</div>
                                <div style={{ fontSize: 13, color: q.color, fontWeight: 500 }}>{q.label}</div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}