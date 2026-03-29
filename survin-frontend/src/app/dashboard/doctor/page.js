"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DoctorOverview() {
    const [doctor, setDoctor] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [pending, setPending] = useState([]);
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [profileRes, appRes, pendingRes, patientsRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/profile`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/doctor`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/doctor/pending`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/profile/all`, { headers }),
            ]);

            const profileData = await profileRes.json();
            console.log("Doctor profile:", profileData); // ← Debug ke liye

            setDoctor(profileData);

            const appData = await appRes.json();
            setAppointments(Array.isArray(appData) ? appData : []);

            const pendingData = await pendingRes.json();
            setPending(Array.isArray(pendingData) ? pendingData : []);

            const patientsData = await patientsRes.json();
            setPatients(Array.isArray(patientsData) ? patientsData : []);

        } catch (err) {
            console.error("fetchData error:", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <div style={{display: "flex", alignItems: "center", justifyContent: "center", height: "60vh"}}>
            <div style={{fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: "#C9A84C"}}>
                Loading...
            </div>
        </div>
    );

    const stats = [
        {
            label: "Total Patients",
            num: patients.length,
            icon: "👥",
            color: "#C9A84C",
            href: "/dashboard/doctor/patients"
        },
        {
            label: "Total Appointments",
            num: appointments.length,
            icon: "📅",
            color: "#00D4FF",
            href: "/dashboard/doctor/appointments"
        },
        {label: "Pending", num: pending.length, icon: "⏳", color: "#EF9F27", href: "/dashboard/doctor/pending"},
        {
            label: "Completed",
            num: appointments.filter(a => a.status === "COMPLETED").length,
            icon: "✅",
            color: "#5DCAA5",
            href: "/dashboard/doctor/appointments"
        },
    ];

    const statusColors = {
        PENDING: {bg: "rgba(239,159,39,0.1)", color: "#EF9F27", border: "rgba(239,159,39,0.3)"},
        CONFIRMED: {bg: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "rgba(0,212,255,0.3)"},
        CANCELLED: {bg: "rgba(226,75,74,0.1)", color: "#F09595", border: "rgba(226,75,74,0.3)"},
        COMPLETED: {bg: "rgba(29,158,117,0.1)", color: "#5DCAA5", border: "rgba(29,158,117,0.3)"},
    };

    return (
        <div>
            {/* GREETING */}
            <div style={{
                background: "linear-gradient(135deg,rgba(201,168,76,0.08),rgba(0,100,200,0.05))",
                border: "0.5px solid rgba(201,168,76,0.2)",
                borderRadius: 16, padding: "2rem", marginBottom: "2rem",
                display: "flex", alignItems: "center",
                justifyContent: "space-between", flexWrap: "wrap", gap: "1rem"
            }}>
                <div>
                    <h2 style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 32, color: "#F0F4FF", marginBottom: "0.3rem"
                    }}>
                        Good Morning, Dr. {doctor?.name?.split(" ")[0]}! 👋
                    </h2>
                    <p style={{fontSize: 14, color: "rgba(240,244,255,0.5)"}}>
                        {doctor?.specialization || "Specialist"} · {doctor?.clinicName || "Clinic"}
                    </p>
                    {pending.length > 0 && (
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            background: "rgba(239,159,39,0.1)", border: "0.5px solid rgba(239,159,39,0.3)",
                            borderRadius: 20, padding: "4px 14px",
                            fontSize: 13, color: "#EF9F27", marginTop: "0.8rem"
                        }}>
                            ⏳ {pending.length} pending appointment{pending.length > 1 ? "s" : ""} waiting
                        </div>
                    )}
                </div>
                <Link href="/dashboard/doctor/pending">
                    <button style={{
                        background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                        color: "#0A1628", border: "none",
                        padding: "12px 24px", borderRadius: 8,
                        fontSize: 14, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Outfit',sans-serif"
                    }}>View Pending →
                    </button>
                </Link>
            </div>

            {/* STATS */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                gap: "1rem", marginBottom: "2rem"
            }}>
                {stats.map((s) => (
                    <Link key={s.label} href={s.href} style={{textDecoration: "none"}}>
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
                            <div style={{fontSize: 24, marginBottom: "0.5rem"}}>{s.icon}</div>
                            <div style={{
                                fontFamily: "'Cormorant Garamond',serif",
                                fontSize: 36, fontWeight: 700, color: s.color
                            }}>{s.num}</div>
                            <div style={{fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 4}}>
                                {s.label}
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            <div style={{display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem"}}>

                {/* RECENT PATIENTS */}
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    borderRadius: 16, padding: "1.5rem"
                }}>
                    <div style={{
                        display: "flex", justifyContent: "space-between",
                        alignItems: "center", marginBottom: "1.2rem"
                    }}>
                        <h3 style={{fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#F0F4FF"}}>
                            Recent Patients
                        </h3>
                        <Link href="/dashboard/doctor/patients"
                              style={{fontSize: 13, color: "#C9A84C", textDecoration: "none"}}>
                            View all →
                        </Link>
                    </div>

                    {patients.length === 0 ? (
                        <div style={{textAlign: "center", padding: "2rem", color: "rgba(240,244,255,0.3)"}}>
                            <div style={{fontSize: 32, marginBottom: "0.5rem"}}>👥</div>
                            <p style={{fontSize: 13}}>No patients yet</p>
                        </div>
                    ) : (
                        patients.slice(0, 5).map((p, i) => (
                            <div key={i} style={{
                                display: "flex", alignItems: "center", gap: "0.8rem",
                                padding: "0.7rem 0",
                                borderBottom: i < Math.min(patients.length, 5) - 1
                                    ? "0.5px solid rgba(255,255,255,0.05)" : "none"
                            }}>
                                <div style={{
                                    width: 36, height: 36, borderRadius: "50%",
                                    background: "linear-gradient(135deg,rgba(201,168,76,0.3),rgba(201,168,76,0.1))",
                                    border: "0.5px solid rgba(201,168,76,0.3)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 14, fontWeight: 600, color: "#C9A84C",
                                    flexShrink: 0, overflow: "hidden"
                                }}>
                                    {p.profilePhoto ? (
                                        <img src={`${process.env.NEXT_PUBLIC_API_URL}${p.profilePhoto}`}
                                             style={{width: "100%", height: "100%", objectFit: "cover"}}
                                             onError={e => e.target.style.display = "none"} alt="patient"/>
                                    ) : p.name?.charAt(0) || "P"}
                                </div>
                                <div style={{flex: 1}}>
                                    <div style={{fontSize: 14, color: "#F0F4FF"}}>{p.name || "Patient"}</div>
                                    <div style={{fontSize: 11, color: "rgba(240,244,255,0.4)"}}>
                                        {p.bloodGroup ? `🩸 ${p.bloodGroup}` : ""}
                                        {p.gender ? ` · ${p.gender}` : ""}
                                    </div>
                                </div>
                                {p.bloodGroup && (
                                    <span style={{
                                        background: "rgba(226,75,74,0.1)", color: "#F09595",
                                        border: "0.5px solid rgba(226,75,74,0.2)",
                                        padding: "2px 8px", borderRadius: 12, fontSize: 11
                                    }}>{p.bloodGroup}</span>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* QUICK ACTIONS */}
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    borderRadius: 16, padding: "1.5rem"
                }}>
                    <h3 style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 20, color: "#F0F4FF", marginBottom: "1.2rem"
                    }}>Quick Actions</h3>
                    {[
                        {
                            href: "/dashboard/doctor/pending",
                            icon: "⏳",
                            label: "Review Pending",
                            desc: "Set date & time for appointments",
                            color: "#EF9F27"
                        },
                        {
                            href: "/dashboard/doctor/appointments",
                            icon: "📅",
                            label: "All Appointments",
                            desc: "View & manage appointments",
                            color: "#00D4FF"
                        },
                        {
                            href: "/dashboard/doctor/prescriptions",
                            icon: "💊",
                            label: "Write Prescription",
                            desc: "Create new prescription",
                            color: "#5DCAA5"
                        },
                        {
                            href: "/dashboard/doctor/availability",
                            icon: "🕐",
                            label: "Set Availability",
                            desc: "Update your schedule",
                            color: "#C9A84C"
                        },
                    ].map((q) => (
                        <Link key={q.href} href={q.href} style={{textDecoration: "none"}}>
                            <div style={{
                                display: "flex", alignItems: "center", gap: "1rem",
                                padding: "0.8rem", borderRadius: 10, marginBottom: "0.5rem",
                                background: "rgba(255,255,255,0.02)",
                                border: "0.5px solid rgba(255,255,255,0.05)",
                                cursor: "pointer", transition: "all 0.2s"
                            }}
                                 onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(201,168,76,0.3)"}
                                 onMouseLeave={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.05)"}
                            >
                                <div style={{
                                    width: 40, height: 40, borderRadius: 10,
                                    background: "rgba(255,255,255,0.04)",
                                    display: "flex", alignItems: "center",
                                    justifyContent: "center", fontSize: 18, flexShrink: 0
                                }}>{q.icon}</div>
                                <div>
                                    <div style={{fontSize: 14, color: q.color, fontWeight: 500}}>{q.label}</div>
                                    <div style={{fontSize: 12, color: "rgba(240,244,255,0.4)"}}>{q.desc}</div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* RECENT APPOINTMENTS */}
            <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "0.5px solid rgba(201,168,76,0.2)",
                borderRadius: 16, padding: "1.5rem"
            }}>
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "center", marginBottom: "1rem"
                }}>
                    <h3 style={{fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#F0F4FF"}}>
                        Recent Appointments
                    </h3>
                    <Link href="/dashboard/doctor/appointments"
                          style={{fontSize: 13, color: "#C9A84C", textDecoration: "none"}}>
                        View all →
                    </Link>
                </div>

                {appointments.length === 0 ? (
                    <div style={{textAlign: "center", padding: "2rem", color: "rgba(240,244,255,0.3)"}}>
                        <div style={{fontSize: 36, marginBottom: "0.5rem"}}>📅</div>
                        <p style={{fontSize: 14}}>No appointments yet</p>
                    </div>
                ) : (
                    appointments.slice(0, 5).map((apt) => {
                        const sc = statusColors[apt.status] || statusColors.PENDING;
                        return (
                            <div key={apt.id} style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", padding: "0.8rem 0",
                                borderBottom: "0.5px solid rgba(255,255,255,0.05)",
                                flexWrap: "wrap", gap: "0.5rem"
                            }}>
                                <div>
                                    <div style={{fontSize: 14, color: "#F0F4FF"}}>
                                        {apt.patientName || "Patient"}
                                    </div>
                                    <div style={{fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 2}}>
                                        {apt.appointmentDate ? `📅 ${apt.appointmentDate}` : "Date TBD"}
                                        {apt.appointmentTime ? ` · ⏰ ${apt.appointmentTime}` : ""}
                                    </div>
                                </div>
                                <span style={{
                                    background: sc.bg, color: sc.color,
                                    border: `0.5px solid ${sc.border}`,
                                    padding: "4px 12px", borderRadius: 20, fontSize: 11
                                }}>{apt.status}</span>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
}