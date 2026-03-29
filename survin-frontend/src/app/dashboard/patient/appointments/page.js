"use client";
import { useState, useEffect } from "react";

export default function PatientAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");


    useEffect(() => {
        const role = localStorage.getItem("role");

        if (role !== "PATIENT") {
            alert("Unauthorized");
            window.location.href = "/login";
        }
    }, []);


    const userId = localStorage.getItem("userId");

    const safeAppointments = appointments.filter(
        a => a.patientId === userId
    );


    // ✅ Fetch on mount + when token changes
    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const userId = localStorage.getItem("userId"); // ✅ important

            if (!token) {
                console.error("No token found");
                return;
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/my`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) {
                throw new Error("Failed to fetch appointments");
            }

            const data = await res.json();

            console.log("RAW API DATA:", data);

            // ✅ SAFETY FILTER (CRITICAL FIX)
            // Ensures only patient’s appointments are shown
            const safeData = data.filter(
                (apt) => apt.patientId === userId
            );

            console.log("FILTERED DATA:", safeData);

            setAppointments(safeData);

        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    // ✅ Filter logic
    const filtered =
        filter === "ALL"
            ? appointments
            : appointments.filter((a) => a.status === filter);

    // ✅ Status styles
    const statusColors = {
        PENDING: { bg: "rgba(239,159,39,0.1)", color: "#EF9F27", border: "rgba(239,159,39,0.3)" },
        CONFIRMED: { bg: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "rgba(0,212,255,0.3)" },
        CANCELLED: { bg: "rgba(226,75,74,0.1)", color: "#F09595", border: "rgba(226,75,74,0.3)" },
        COMPLETED: { bg: "rgba(29,158,117,0.1)", color: "#5DCAA5", border: "rgba(29,158,117,0.3)" },
    };

    return (
        <div>
            <h2 style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 32,
                color: "#F0F4FF",
                marginBottom: "2rem"
            }}>
                My Appointments
            </h2>

            {/* ✅ FILTER BUTTONS */}
            <div style={{
                display: "flex",
                gap: "0.5rem",
                marginBottom: "2rem",
                flexWrap: "wrap"
            }}>
                {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map((s) => (
                    <button
                        key={s}
                        onClick={() => setFilter(s)}
                        style={{
                            padding: "6px 16px",
                            borderRadius: 20,
                            fontSize: 13,
                            cursor: "pointer",
                            fontFamily: "'Outfit',sans-serif",
                            border: filter === s
                                ? "1px solid #C9A84C"
                                : "0.5px solid rgba(255,255,255,0.1)",
                            background: filter === s
                                ? "rgba(201,168,76,0.15)"
                                : "transparent",
                            color: filter === s
                                ? "#C9A84C"
                                : "rgba(240,244,255,0.5)"
                        }}
                    >
                        {s}
                    </button>
                ))}
            </div>

            {/* ✅ CONTENT */}
            {loading ? (
                <p style={{ color: "rgba(240,244,255,0.4)" }}>Loading...</p>
            ) : filtered.length === 0 ? (
                <div style={{
                    textAlign: "center",
                    padding: "4rem",
                    color: "rgba(240,244,255,0.3)"
                }}>
                    <div style={{ fontSize: 48, marginBottom: "1rem" }}>📅</div>
                    <p>No appointments found</p>
                </div>
            ) : (
                filtered.map((apt) => {
                    const sc = statusColors[apt.status] || statusColors.PENDING;

                    return (
                        <div
                            key={apt.id}
                            style={{
                                background: "rgba(255,255,255,0.02)",
                                border: "0.5px solid rgba(255,255,255,0.06)",
                                borderRadius: 16,
                                padding: "1.5rem",
                                marginBottom: "1rem"
                            }}
                        >
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                                gap: "1rem"
                            }}>
                                <div>
                                    <div style={{
                                        fontSize: 16,
                                        color: "#F0F4FF",
                                        fontWeight: 500,
                                        marginBottom: "0.4rem"
                                    }}>
                                        Dr. {apt.doctorName || "Doctor"}
                                    </div>

                                    <div style={{
                                        fontSize: 13,
                                        color: "rgba(240,244,255,0.5)"
                                    }}>
                                        🏥 {apt.clinicName || "Clinic"} · 📍 {apt.clinicAddress || ""}
                                    </div>

                                    <div style={{
                                        fontSize: 13,
                                        color: "rgba(240,244,255,0.5)"
                                    }}>
                                        📅 {apt.appointmentDate || "Date TBD"}
                                        {apt.appointmentTime && ` · ⏰ ${apt.appointmentTime}`}
                                    </div>

                                    {apt.notes && (
                                        <div style={{
                                            fontSize: 13,
                                            color: "rgba(240,244,255,0.4)",
                                            marginTop: 4
                                        }}>
                                            📝 {apt.notes}
                                        </div>
                                    )}
                                </div>

                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "0.5rem",
                                    alignItems: "flex-end"
                                }}>
                                    <span style={{
                                        background: sc.bg,
                                        color: sc.color,
                                        border: `0.5px solid ${sc.border}`,
                                        padding: "4px 14px",
                                        borderRadius: 20,
                                        fontSize: 12
                                    }}>
                                        {apt.status}
                                    </span>

                                    {apt.status === "CONFIRMED" && (
                                        <div style={{ fontSize: 12, color: "#5DCAA5" }}>
                                            ✅ Appointment confirmed!
                                        </div>
                                    )}

                                    {apt.status === "PENDING" && (
                                        <div style={{ fontSize: 12, color: "#EF9F27" }}>
                                            ⏳ Waiting for doctor confirmation
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
}