"use client";
import { useState, useEffect } from "react";

export default function PendingPage() {
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => { fetchPending(); }, []);

    const fetchPending = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/doctor/pending`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            setPending(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const updateAppointment = async (id, status, date, time, description) => {
        const token = localStorage.getItem("token");
        const params = new URLSearchParams({ status });
        if (date) params.append("date", date);
        if (time) params.append("time", time + ":00");
        if (description) params.append("description", description);

        await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}?${params}`,
            { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
        );
        fetchPending();
    };

    return (
        <div>
            <h2 style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 32, color: "#F0F4FF", marginBottom: "0.5rem"
            }}>
                Pending Appointments
                {pending.length > 0 && (
                    <span style={{
                        marginLeft: "1rem", fontSize: 16,
                        background: "rgba(239,159,39,0.1)", color: "#EF9F27",
                        border: "0.5px solid rgba(239,159,39,0.3)",
                        padding: "4px 12px", borderRadius: 20
                    }}>{pending.length}</span>
                )}
            </h2>
            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)", marginBottom: "2rem" }}>
                Set date & time for each appointment and confirm or cancel
            </p>

            {loading ? (
                <p style={{ color: "rgba(240,244,255,0.4)" }}>Loading...</p>
            ) : pending.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "rgba(240,244,255,0.3)" }}>
                    <div style={{ fontSize: 48, marginBottom: "1rem" }}>⏳</div>
                    <p>No pending appointments!</p>
                </div>
            ) : (
                pending.map((apt) => (
                    <PendingCard key={apt.id} apt={apt} onUpdate={updateAppointment} />
                ))
            )}
        </div>
    );
}

function PendingCard({ apt, onUpdate }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [description, setDescription] = useState("");
    const [saving, setSaving] = useState(false);

    const handleConfirm = async () => {
        if (!date || !time) {
            alert("Please set date and time before confirming!");
            return;
        }
        setSaving(true);
        await onUpdate(apt.id, "CONFIRMED", date, time, description);
        setSaving(false);
    };

    const handleCancel = async () => {
        setSaving(true);
        await onUpdate(apt.id, "CANCELLED", null, null, description);
        setSaving(false);
    };

    return (
        <div style={{
            background: "rgba(255,255,255,0.02)",
            border: "0.5px solid rgba(239,159,39,0.25)",
            borderRadius: 16, padding: "1.5rem",
            marginBottom: "1.2rem"
        }}>
            {/* PATIENT INFO */}
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "flex-start", marginBottom: "1.5rem",
                flexWrap: "wrap", gap: "0.5rem"
            }}>
                <div>
                    <div style={{ fontSize: 18, color: "#F0F4FF", fontWeight: 500 }}>
                        👤 {apt.patientName || "Patient"}
                    </div>
                    <div style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", marginTop: 4 }}>
                        📞 {apt.patientPhone || "No phone"}
                    </div>
                    {apt.notes && (
                        <div style={{
                            marginTop: "0.8rem",
                            background: "rgba(255,255,255,0.03)",
                            border: "0.5px solid rgba(255,255,255,0.08)",
                            borderRadius: 8, padding: "0.6rem 0.8rem",
                            fontSize: 13, color: "rgba(240,244,255,0.6)"
                        }}>
                            📝 Patient note: {apt.notes}
                        </div>
                    )}
                </div>
                <span style={{
                    background: "rgba(239,159,39,0.1)", color: "#EF9F27",
                    border: "0.5px solid rgba(239,159,39,0.3)",
                    padding: "4px 14px", borderRadius: 20, fontSize: 12
                }}>⏳ PENDING</span>
            </div>

            {/* DATE TIME + DESCRIPTION */}
            <div style={{
                background: "rgba(201,168,76,0.04)",
                border: "0.5px solid rgba(201,168,76,0.15)",
                borderRadius: 12, padding: "1.2rem"
            }}>
                <div style={{
                    fontSize: 12, color: "#C9A84C",
                    marginBottom: "1rem", fontWeight: 500
                }}>
                    Set Appointment Details
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "1rem", marginBottom: "1rem"
                }}>
                    {/* DATE */}
                    <div>
                        <label style={{
                            fontSize: 12, color: "rgba(240,244,255,0.5)",
                            display: "block", marginBottom: 6
                        }}>📅 Appointment Date *</label>
                        <input type="date" className="inp"
                               value={date}
                               min={new Date().toISOString().split("T")[0]}
                               onChange={e => setDate(e.target.value)}
                               style={{ padding: "8px 12px", fontSize: 13 }} />
                    </div>

                    {/* TIME */}
                    <div>
                        <label style={{
                            fontSize: 12, color: "rgba(240,244,255,0.5)",
                            display: "block", marginBottom: 6
                        }}>⏰ Appointment Time *</label>
                        <input type="time" className="inp"
                               value={time}
                               onChange={e => setTime(e.target.value)}
                               style={{ padding: "8px 12px", fontSize: 13 }} />
                    </div>
                </div>

                {/* DESCRIPTION */}
                <div style={{ marginBottom: "1rem" }}>
                    <label style={{
                        fontSize: 12, color: "rgba(240,244,255,0.5)",
                        display: "block", marginBottom: 6
                    }}>📋 Additional Notes for Patient (Optional)</label>
                    <textarea className="inp"
                              placeholder="e.g. Please bring your previous reports, Come fasting, Teleconsultation link will be sent..."
                              value={description}
                              onChange={e => setDescription(e.target.value)}
                              style={{ height: 80, resize: "none", fontSize: 13 }} />
                </div>

                {/* BUTTONS */}
                <div style={{ display: "flex", gap: "1rem" }}>
                    <button onClick={handleConfirm} disabled={saving} style={{
                        flex: 2,
                        background: saving
                            ? "rgba(201,168,76,0.5)"
                            : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                        color: "#0A1628", border: "none",
                        padding: "12px", borderRadius: 8,
                        fontSize: 14, fontWeight: 600,
                        cursor: saving ? "not-allowed" : "pointer",
                        fontFamily: "'Outfit',sans-serif"
                    }}>
                        {saving ? "Saving..." : "✅ Confirm Appointment"}
                    </button>
                    <button onClick={handleCancel} disabled={saving} style={{
                        flex: 1,
                        background: "rgba(226,75,74,0.1)", color: "#F09595",
                        border: "0.5px solid rgba(226,75,74,0.3)",
                        padding: "12px", borderRadius: 8,
                        fontSize: 14, cursor: saving ? "not-allowed" : "pointer",
                        fontFamily: "'Outfit',sans-serif"
                    }}>
                        ❌ Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}