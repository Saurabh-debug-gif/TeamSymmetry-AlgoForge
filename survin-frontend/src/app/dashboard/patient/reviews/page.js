"use client";
import { useState, useEffect } from "react";

export default function ReviewsPage() {
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({ doctorId: "", rating: 5, comment: "" });
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/my`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => setAppointments(data.filter(a => a.status === "COMPLETED")))
            .catch(() => {});
    }, []);

    const submitReview = async () => {
        if (!form.doctorId || !form.comment) {
            setMsg({ text: "Please fill all fields!", type: "error" });
            return;
        }
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                setMsg({ text: "Review submitted! Thank you ✅", type: "success" });
                setForm({ doctorId: "", rating: 5, comment: "" });
            } else { setMsg({ text: "Failed to submit!", type: "error" }); }
        } catch { setMsg({ text: "Error!", type: "error" }); }
        finally { setSaving(false); setTimeout(() => setMsg({ text: "", type: "" }), 3000); }
    };

    return (
        <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#F0F4FF", marginBottom: "2rem" }}>
                Rate a Doctor
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>

                {/* REVIEW FORM */}
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    borderRadius: 16, padding: "2rem"
                }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#F0F4FF", marginBottom: "1.5rem" }}>
                        Write a Review
                    </h3>

                    {msg.text && (
                        <div style={{
                            background: msg.type === "success" ? "rgba(29,158,117,0.1)" : "rgba(226,75,74,0.1)",
                            border: `0.5px solid ${msg.type === "success" ? "rgba(29,158,117,0.3)" : "rgba(226,75,74,0.3)"}`,
                            borderRadius: 8, padding: "0.8rem",
                            fontSize: 13, color: msg.type === "success" ? "#5DCAA5" : "#F09595",
                            marginBottom: "1rem"
                        }}>{msg.text}</div>
                    )}

                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>
                            Select Doctor (Completed Appointments)
                        </label>
                        <select className="inp" value={form.doctorId}
                                onChange={e => setForm({ ...form, doctorId: e.target.value })}>
                            <option value="">Choose a doctor...</option>
                            {appointments.map(a => (
                                <option key={a.id} value={a.doctorId}>Dr. {a.doctorName}</option>
                            ))}
                        </select>
                    </div>

                    {/* STAR RATING */}
                    <div style={{ marginBottom: "1rem" }}>
                        <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 10 }}>
                            Rating
                        </label>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                            {[1, 2, 3, 4, 5].map(star => (
                                <button key={star}
                                        onClick={() => setForm({ ...form, rating: star })}
                                        style={{
                                            fontSize: 32, background: "none", border: "none",
                                            cursor: "pointer", color: star <= form.rating ? "#EF9F27" : "rgba(240,244,255,0.2)",
                                            transition: "color 0.2s"
                                        }}>★</button>
                            ))}
                        </div>
                    </div>

                    <div style={{ marginBottom: "1.5rem" }}>
                        <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>
                            Your Review
                        </label>
                        <textarea className="inp"
                                  placeholder="Share your experience with this doctor..."
                                  value={form.comment}
                                  onChange={e => setForm({ ...form, comment: e.target.value })}
                                  style={{ height: 120, resize: "none" }} />
                    </div>

                    <button onClick={submitReview} disabled={saving} style={{
                        width: "100%",
                        background: saving ? "rgba(201,168,76,0.5)" : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                        color: "#0A1628", border: "none", padding: "13px",
                        borderRadius: 8, fontSize: 15, fontWeight: 600,
                        cursor: saving ? "not-allowed" : "pointer",
                        fontFamily: "'Outfit',sans-serif"
                    }}>
                        {saving ? "Submitting..." : "⭐ Submit Review"}
                    </button>
                </div>

                {/* COMPLETED APPOINTMENTS */}
                <div>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#F0F4FF", marginBottom: "1rem" }}>
                        Completed Appointments
                    </h3>
                    {appointments.length === 0 ? (
                        <div style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(255,255,255,0.06)",
                            borderRadius: 16, padding: "2rem", textAlign: "center",
                            color: "rgba(240,244,255,0.3)"
                        }}>
                            <div style={{ fontSize: 48, marginBottom: "1rem" }}>⭐</div>
                            <p style={{ fontSize: 14 }}>No completed appointments yet</p>
                            <p style={{ fontSize: 12, marginTop: "0.5rem" }}>
                                Complete an appointment to leave a review
                            </p>
                        </div>
                    ) : (
                        appointments.map((apt, i) => (
                            <div key={i} style={{
                                background: "rgba(255,255,255,0.02)",
                                border: `0.5px solid ${form.doctorId === apt.doctorId ? "rgba(201,168,76,0.4)" : "rgba(255,255,255,0.06)"}`,
                                borderRadius: 12, padding: "1rem", marginBottom: "0.8rem",
                                cursor: "pointer", transition: "all 0.2s"
                            }}
                                 onClick={() => setForm({ ...form, doctorId: apt.doctorId })}
                            >
                                <div style={{ fontSize: 14, color: "#F0F4FF", fontWeight: 500 }}>
                                    Dr. {apt.doctorName}
                                </div>
                                <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 4 }}>
                                    📅 {apt.appointmentDate} · 🏥 {apt.clinicName}
                                </div>
                                <div style={{
                                    display: "inline-block", marginTop: "0.5rem",
                                    background: "rgba(29,158,117,0.1)", color: "#5DCAA5",
                                    border: "0.5px solid rgba(29,158,117,0.3)",
                                    padding: "3px 10px", borderRadius: 20, fontSize: 11
                                }}>COMPLETED</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}