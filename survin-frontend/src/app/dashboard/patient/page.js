"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function PatientOverview() {
    const [patient, setPatient] = useState(null);
    const [appointments, setAppointments] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [patRes, appRes, preRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patient/profile`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/my`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prescriptions/my`, { headers }),
            ]);
            setPatient(await patRes.json());
            const appData = await appRes.json();
            setAppointments(Array.isArray(appData) ? appData : []);
            const preData = await preRes.json();
            setPrescriptions(Array.isArray(preData) ? preData : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    if (loading) return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 24, color: "#C9A84C" }}>Loading...</div>
        </div>
    );

    const stats = [
        { label: "Total Appointments", num: appointments.length, icon: "📅", color: "#C9A84C" },
        { label: "Upcoming", num: appointments.filter(a => a.status === "CONFIRMED").length, icon: "✅", color: "#00D4FF" },
        { label: "Prescriptions", num: prescriptions.length, icon: "💊", color: "#5DCAA5" },
        { label: "Pending", num: appointments.filter(a => a.status === "PENDING").length, icon: "⏳", color: "#EF9F27" },
    ];

    const statusColors = {
        PENDING: { bg: "rgba(239,159,39,0.1)", color: "#EF9F27", border: "rgba(239,159,39,0.3)" },
        CONFIRMED: { bg: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "rgba(0,212,255,0.3)" },
        CANCELLED: { bg: "rgba(226,75,74,0.1)", color: "#F09595", border: "rgba(226,75,74,0.3)" },
        COMPLETED: { bg: "rgba(29,158,117,0.1)", color: "#5DCAA5", border: "rgba(29,158,117,0.3)" },
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
                        Hello, {patient?.name?.split(" ")[0]}! 👋
                    </h2>
                    <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)" }}>
                        Your health dashboard — stay healthy, stay happy!
                    </p>
                    {patient?.bloodGroup && (
                        <div style={{
                            display: "inline-flex", alignItems: "center", gap: "0.5rem",
                            background: "rgba(226,75,74,0.1)", border: "0.5px solid rgba(226,75,74,0.3)",
                            borderRadius: 20, padding: "4px 14px",
                            fontSize: 13, color: "#F09595", marginTop: "0.8rem"
                        }}>🩸 Blood Group: {patient.bloodGroup}</div>
                    )}
                </div>
                <Link href="/dashboard/patient/doctors">
                    <button style={{
                        background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                        color: "#0A1628", border: "none",
                        padding: "12px 24px", borderRadius: 8,
                        fontSize: 14, fontWeight: 600, cursor: "pointer",
                        fontFamily: "'Outfit',sans-serif"
                    }}>Find a Doctor →</button>
                </Link>
            </div>

            {/* STATS */}
            <div style={{
                display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                gap: "1rem", marginBottom: "2rem"
            }}>
                {stats.map((s) => (
                    <div key={s.label} style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(201,168,76,0.15)",
                        borderRadius: 14, padding: "1.5rem"
                    }}>
                        <div style={{ fontSize: 24, marginBottom: "0.5rem" }}>{s.icon}</div>
                        <div style={{
                            fontFamily: "'Cormorant Garamond',serif",
                            fontSize: 36, fontWeight: 700, color: s.color
                        }}>{s.num}</div>
                        <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 4 }}>{s.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>

                {/* HEALTH INFO */}
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    borderRadius: 16, padding: "1.5rem"
                }}>
                    <h3 style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 20, color: "#F0F4FF", marginBottom: "1rem"
                    }}>Health Info</h3>
                    {[
                        { label: "Blood Group", val: patient?.bloodGroup, icon: "🩸" },
                        { label: "Date of Birth", val: patient?.dateOfBirth, icon: "🎂" },
                        { label: "Gender", val: patient?.gender, icon: "👤" },
                        { label: "Emergency Contact", val: patient?.emergencyContact, icon: "📞" },
                    ].map((item) => (
                        <div key={item.label} style={{
                            display: "flex", justifyContent: "space-between",
                            padding: "0.6rem 0",
                            borderBottom: "0.5px solid rgba(255,255,255,0.05)"
                        }}>
              <span style={{ fontSize: 13, color: "rgba(240,244,255,0.4)" }}>
                {item.icon} {item.label}
              </span>
                            <span style={{ fontSize: 13, color: "#F0F4FF" }}>
                {item.val || "Not set"}
              </span>
                        </div>
                    ))}
                    <Link href="/dashboard/patient/profile">
                        <button style={{
                            marginTop: "1rem", width: "100%",
                            background: "rgba(201,168,76,0.1)", color: "#C9A84C",
                            border: "0.5px solid rgba(201,168,76,0.3)",
                            padding: "8px", borderRadius: 8,
                            fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                        }}>Update Health Info</button>
                    </Link>
                </div>

                {/* QUICK ACTIONS */}
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    borderRadius: 16, padding: "1.5rem"
                }}>
                    <h3 style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 20, color: "#F0F4FF", marginBottom: "1rem"
                    }}>Quick Actions</h3>
                    {[
                        { href: "/dashboard/patient/doctors", icon: "👨‍⚕️", label: "Book Appointment", desc: "Find & book a doctor", color: "#C9A84C" },
                        { href: "/dashboard/patient/prescriptions", icon: "💊", label: "View Prescriptions", desc: "Check your medicines", color: "#5DCAA5" },
                        { href: "/dashboard/patient/medicines", icon: "🏪", label: "Medicine Enquiry", desc: "WhatsApp medical stores", color: "#00D4FF" },
                        { href: "/dashboard/patient/reviews", icon: "⭐", label: "Rate a Doctor", desc: "Share your experience", color: "#EF9F27" },
                    ].map((q) => (
                        <Link key={q.href} href={q.href} style={{ textDecoration: "none" }}>
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
                                    <div style={{ fontSize: 14, color: q.color, fontWeight: 500 }}>{q.label}</div>
                                    <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>{q.desc}</div>
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
                    <h3 style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 20, color: "#F0F4FF"
                    }}>Recent Appointments</h3>
                    <Link href="/dashboard/patient/appointments"
                          style={{ fontSize: 13, color: "#C9A84C", textDecoration: "none" }}>
                        View all →
                    </Link>
                </div>

                {appointments.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "2rem", color: "rgba(240,244,255,0.3)" }}>
                        <div style={{ fontSize: 36, marginBottom: "0.5rem" }}>📅</div>
                        <p style={{ fontSize: 14 }}>No appointments yet</p>
                        <Link href="/dashboard/patient/doctors">
                            <button style={{
                                marginTop: "1rem",
                                background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                color: "#0A1628", border: "none",
                                padding: "8px 20px", borderRadius: 8,
                                fontSize: 13, fontWeight: 600, cursor: "pointer",
                                fontFamily: "'Outfit',sans-serif"
                            }}>Book Now</button>
                        </Link>
                    </div>
                ) : (
                    appointments.slice(0, 4).map((apt) => {
                        const sc = statusColors[apt.status] || statusColors.PENDING;
                        return (
                            <div key={apt.id} style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", padding: "0.8rem 0",
                                borderBottom: "0.5px solid rgba(255,255,255,0.05)",
                                flexWrap: "wrap", gap: "0.5rem"
                            }}>
                                <div>
                                    <div style={{ fontSize: 14, color: "#F0F4FF" }}>
                                        Dr. {apt.doctorName || "Doctor"}
                                    </div>
                                    <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>
                                        {apt.clinicName || "Clinic"}
                                        {apt.appointmentDate ? ` · 📅 ${apt.appointmentDate}` : ""}
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