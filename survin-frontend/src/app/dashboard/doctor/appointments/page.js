"use client";
import { useState, useEffect } from "react";

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("ALL");
    const [formData, setFormData] = useState({});
    const [saving, setSaving] = useState({});
    const [msg, setMsg] = useState({});

    // ✅ ROLE PROTECTION
    useEffect(() => {
        const role = localStorage.getItem("role");
        if (role !== "DOCTOR") {
            alert("Unauthorized");
            window.location.href = "/login";
        }
    }, []);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        const token = localStorage.getItem("token");

        // 🔥 SAFETY CHECK
        if (!token) {
            alert("Session expired");
            window.location.href = "/login";
            return;
        }

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/doctor`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const data = await res.json();
            setAppointments(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (id, field, value) => {
        setFormData(prev => ({
            ...prev,
            [id]: { ...prev[id], [field]: value }
        }));
    };

    const updateAppointment = async (id, status) => {
        const token = localStorage.getItem("token");
        const data = formData[id] || {};

        if (!token) {
            alert("Session expired");
            window.location.href = "/login";
            return;
        }

        if (status === "CONFIRMED" && (!data.date || !data.time)) {
            setMsg(prev => ({
                ...prev,
                [id]: { text: "⚠️ Please select date & time first!", type: "error" }
            }));
            return;
        }

        setSaving(prev => ({ ...prev, [id]: true }));

        try {
            const params = new URLSearchParams({ status });

            if (data.date) params.append("date", data.date);
            if (data.time) params.append("time", data.time + ":00");
            if (data.description) params.append("description", data.description);

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}?${params}`,
                {
                    method: "PUT",
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            if (res.ok) {
                setMsg(prev => ({
                    ...prev,
                    [id]: {
                        text:
                            status === "CONFIRMED"
                                ? "✅ Confirmed! Patient will be notified."
                                : status === "COMPLETED"
                                    ? "🏥 Marked as completed!"
                                    : "❌ Appointment cancelled.",
                        type:
                            status === "CONFIRMED" || status === "COMPLETED"
                                ? "success"
                                : "error"
                    }
                }));

                // Clear form
                setFormData(prev => {
                    const copy = { ...prev };
                    delete copy[id];
                    return copy;
                });

                // Refresh after delay
                setTimeout(() => {
                    setMsg(prev => {
                        const copy = { ...prev };
                        delete copy[id];
                        return copy;
                    });
                    fetchAppointments();
                }, 1500);

            } else {
                setMsg(prev => ({
                    ...prev,
                    [id]: { text: "Update failed!", type: "error" }
                }));
            }

        } catch (err) {
            console.error("Update error:", err);
            setMsg(prev => ({
                ...prev,
                [id]: { text: "Network error!", type: "error" }
            }));
        } finally {
            setSaving(prev => ({ ...prev, [id]: false }));
        }
    };

    const filtered =
        filter === "ALL"
            ? appointments
            : appointments.filter(a => a.status === filter);

    // 👉 UI SAME BELOW (NO CHANGE)
    const statusColors = {
        PENDING: { bg: "rgba(239,159,39,0.08)", color: "#EF9F27", border: "rgba(239,159,39,0.25)" },
        CONFIRMED: { bg: "rgba(0,212,255,0.08)", color: "#00D4FF", border: "rgba(0,212,255,0.25)" },
        CANCELLED: { bg: "rgba(226,75,74,0.08)", color: "#F09595", border: "rgba(226,75,74,0.25)" },
        COMPLETED: { bg: "rgba(29,158,117,0.08)", color: "#5DCAA5", border: "rgba(29,158,117,0.25)" },
    };

    const counts = {
        ALL: appointments.length,
        PENDING: appointments.filter(a => a.status === "PENDING").length,
        CONFIRMED: appointments.filter(a => a.status === "CONFIRMED").length,
        COMPLETED: appointments.filter(a => a.status === "COMPLETED").length,
        CANCELLED: appointments.filter(a => a.status === "CANCELLED").length,
    };

    return (
        <div>
            {/* HEADER */}
            <div style={{ marginBottom: "2rem" }}>
                <h2 style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 32, color: "#F0F4FF", marginBottom: "0.3rem"
                }}>Appointments</h2>
                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)" }}>
                    Manage patient appointments — set date, time and confirm
                </p>
            </div>

            {/* FILTER TABS */}
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem", flexWrap: "wrap" }}>
                {["ALL", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"].map(s => (
                    <button key={s} onClick={() => setFilter(s)} style={{
                        padding: "6px 14px", borderRadius: 20, fontSize: 12,
                        cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                        display: "flex", alignItems: "center", gap: "0.4rem",
                        border: filter === s ? "1px solid #C9A84C" : "0.5px solid rgba(255,255,255,0.1)",
                        background: filter === s ? "rgba(201,168,76,0.15)" : "transparent",
                        color: filter === s ? "#C9A84C" : "rgba(240,244,255,0.5)"
                    }}>
                        {s}
                        {counts[s] > 0 && (
                            <span style={{
                                background: filter === s ? "#C9A84C" : "rgba(255,255,255,0.1)",
                                color: filter === s ? "#0A1628" : "rgba(240,244,255,0.5)",
                                borderRadius: 10, padding: "1px 7px", fontSize: 11
                            }}>{counts[s]}</span>
                        )}
                    </button>
                ))}
            </div>

            {/* LIST */}
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[1, 2].map(i => (
                        <div key={i} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(201,168,76,0.1)",
                            borderRadius: 16, height: 120,
                            animation: "pulse 1.5s ease-in-out infinite"
                        }} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{
                    textAlign: "center", padding: "5rem 2rem",
                    color: "rgba(240,244,255,0.3)"
                }}>
                    <div style={{ fontSize: 52, marginBottom: "1rem" }}>📅</div>
                    <p style={{ fontSize: 16 }}>No {filter === "ALL" ? "" : filter.toLowerCase()} appointments</p>
                </div>
            ) : (
                filtered.map((apt) => {
                    const sc = statusColors[apt.status] || statusColors.PENDING;
                    const data = formData[apt.id] || {};
                    const isSaving = saving[apt.id] || false;
                    const aptMsg = msg[apt.id];

                    return (
                        <div key={apt.id} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: `0.5px solid ${sc.border}`,
                            borderRadius: 16, padding: "1.5rem",
                            marginBottom: "1rem", transition: "all 0.2s"
                        }}>

                            {/* ROW 1 — Patient + Status */}
                            <div style={{
                                display: "flex", justifyContent: "space-between",
                                alignItems: "center", marginBottom: "0.8rem", flexWrap: "wrap", gap: "0.5rem"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                    <div style={{
                                        width: 40, height: 40, borderRadius: "50%",
                                        background: `${sc.bg}`,
                                        border: `0.5px solid ${sc.border}`,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 16, flexShrink: 0
                                    }}>👤</div>
                                    <div>
                                        <div style={{ fontSize: 16, color: "#F0F4FF", fontWeight: 500 }}>
                                            {apt.patientName || "Patient"}
                                        </div>
                                        {apt.patientPhone && (
                                            <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>
                                                📞 {apt.patientPhone}
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <span style={{
                                    background: sc.bg, color: sc.color,
                                    border: `0.5px solid ${sc.border}`,
                                    padding: "5px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500
                                }}>{apt.status}</span>
                            </div>

                            {/* ROW 2 — Patient Note */}
                            {apt.notes && (
                                <div style={{
                                    background: "rgba(255,255,255,0.03)",
                                    borderRadius: 8, padding: "0.5rem 0.8rem",
                                    fontSize: 13, color: "rgba(240,244,255,0.55)",
                                    marginBottom: "0.8rem",
                                    borderLeft: "2px solid rgba(201,168,76,0.3)"
                                }}>
                                    "{apt.notes}"
                                </div>
                            )}

                            {/* ROW 3 — Confirmed Date/Time */}
                            {apt.appointmentDate && (
                                <div style={{
                                    display: "flex", gap: "1.5rem", flexWrap: "wrap",
                                    marginBottom: "0.8rem"
                                }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                        <span style={{ fontSize: 13, color: "rgba(240,244,255,0.4)" }}>📅</span>
                                        <span style={{ fontSize: 14, color: "#00D4FF" }}>
                      {new Date(apt.appointmentDate).toLocaleDateString("en-IN", {
                          weekday: "short", day: "numeric",
                          month: "short", year: "numeric"
                      })}
                    </span>
                                    </div>
                                    {apt.appointmentTime && (
                                        <div style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
                                            <span style={{ fontSize: 13, color: "rgba(240,244,255,0.4)" }}>⏰</span>
                                            <span style={{ fontSize: 14, color: "#00D4FF" }}>{apt.appointmentTime}</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* ROW 4 — Doctor's Note */}
                            {apt.doctorDescription && (
                                <div style={{
                                    background: "rgba(201,168,76,0.06)",
                                    border: "0.5px solid rgba(201,168,76,0.2)",
                                    borderRadius: 8, padding: "0.5rem 0.8rem",
                                    fontSize: 13, color: "#E8C97A",
                                    marginBottom: "0.8rem"
                                }}>
                                    👨‍⚕️ {apt.doctorDescription}
                                </div>
                            )}

                            {/* MSG */}
                            {aptMsg && (
                                <div style={{
                                    fontSize: 13,
                                    color: aptMsg.type === "success" ? "#5DCAA5" : "#F09595",
                                    marginBottom: "0.8rem",
                                    display: "flex", alignItems: "center", gap: "0.4rem"
                                }}>{aptMsg.text}</div>
                            )}

                            {/* PENDING — Inline date/time/note + buttons */}
                            {apt.status === "PENDING" && (
                                <div style={{
                                    borderTop: "0.5px solid rgba(255,255,255,0.06)",
                                    paddingTop: "1rem", marginTop: "0.5rem"
                                }}>
                                    {/* INPUTS ROW */}
                                    <div style={{
                                        display: "flex", gap: "0.6rem",
                                        flexWrap: "wrap", marginBottom: "0.8rem",
                                        alignItems: "center"
                                    }}>
                                        <input type="date" className="inp"
                                               value={data.date || ""}
                                               min={new Date().toISOString().split("T")[0]}
                                               onChange={e => handleChange(apt.id, "date", e.target.value)}
                                               style={{ width: 155, fontSize: 13, padding: "7px 10px" }} />

                                        <input type="time" className="inp"
                                               value={data.time || ""}
                                               onChange={e => handleChange(apt.id, "time", e.target.value)}
                                               style={{ width: 125, fontSize: 13, padding: "7px 10px" }} />

                                        <input className="inp"
                                               placeholder="Note for patient (optional)"
                                               value={data.description || ""}
                                               onChange={e => handleChange(apt.id, "description", e.target.value)}
                                               style={{ flex: 1, minWidth: 180, fontSize: 13, padding: "7px 12px" }} />
                                    </div>

                                    {/* BUTTONS ROW */}
                                    <div style={{ display: "flex", gap: "0.6rem" }}>
                                        <button
                                            onClick={() => updateAppointment(apt.id, "CONFIRMED")}
                                            disabled={isSaving}
                                            style={{
                                                background: isSaving
                                                    ? "rgba(201,168,76,0.4)"
                                                    : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                                color: "#0A1628", border: "none",
                                                padding: "9px 24px", borderRadius: 8,
                                                fontSize: 13, fontWeight: 600,
                                                cursor: isSaving ? "not-allowed" : "pointer",
                                                fontFamily: "'Outfit',sans-serif"
                                            }}>
                                            {isSaving ? "Saving..." : "✅ Confirm"}
                                        </button>
                                        <button
                                            onClick={() => updateAppointment(apt.id, "CANCELLED")}
                                            disabled={isSaving}
                                            style={{
                                                background: "transparent", color: "#F09595",
                                                border: "0.5px solid rgba(226,75,74,0.3)",
                                                padding: "9px 20px", borderRadius: 8,
                                                fontSize: 13, cursor: isSaving ? "not-allowed" : "pointer",
                                                fontFamily: "'Outfit',sans-serif"
                                            }}>Cancel</button>
                                    </div>
                                </div>
                            )}

                            {/* CONFIRMED — Mark complete */}
                            {apt.status === "CONFIRMED" && (
                                <div style={{
                                    borderTop: "0.5px solid rgba(255,255,255,0.06)",
                                    paddingTop: "0.8rem", marginTop: "0.3rem"
                                }}>
                                    <button
                                        onClick={() => updateAppointment(apt.id, "COMPLETED")}
                                        disabled={isSaving}
                                        style={{
                                            background: "rgba(29,158,117,0.1)", color: "#5DCAA5",
                                            border: "0.5px solid rgba(29,158,117,0.3)",
                                            padding: "8px 20px", borderRadius: 8,
                                            fontSize: 13, cursor: "pointer",
                                            fontFamily: "'Outfit',sans-serif"
                                        }}>🏥 Mark as Completed</button>
                                </div>
                            )}
                        </div>
                    );
                })
            )}
        </div>
    );
}