"use client";
import { useState, useEffect } from "react";

export default function AvailabilityPage() {
    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];
    const [schedule, setSchedule] = useState(
        days.map(d => ({
            dayOfWeek: d,
            startTime: "09:00:00",
            endTime: "17:00:00",
            isAvailable: d !== "SUNDAY"
        }))
    );
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctor/availability`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => { if (data.length > 0) setSchedule(data); })
            .catch(() => {});
    }, []);

    const toggle = (i) => {
        const updated = [...schedule];
        updated[i].isAvailable = !updated[i].isAvailable;
        setSchedule(updated);
    };

    const updateTime = (i, field, val) => {
        const updated = [...schedule];
        updated[i][field] = val + ":00";
        setSchedule(updated);
    };

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/doctor/availability`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ schedule })
                }
            );
            if (res.ok) setMsg({ text: "Availability saved!", type: "success" });
            else setMsg({ text: "Save failed!", type: "error" });
        } catch { setMsg({ text: "Error!", type: "error" }); }
        finally { setSaving(false); setTimeout(() => setMsg({ text: "", type: "" }), 3000); }
    };

    return (
        <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#F0F4FF", marginBottom: "2rem" }}>
                My Availability
            </h2>

            {msg.text && (
                <div style={{
                    background: msg.type === "success" ? "rgba(29,158,117,0.1)" : "rgba(226,75,74,0.1)",
                    border: "0.5px solid rgba(29,158,117,0.3)",
                    borderRadius: 8, padding: "0.8rem 1rem",
                    fontSize: 14, color: "#5DCAA5", marginBottom: "1.5rem"
                }}>{msg.text}</div>
            )}

            <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "0.5px solid rgba(201,168,76,0.2)",
                borderRadius: 16, padding: "2rem"
            }}>
                {schedule.map((s, i) => (
                    <div key={s.dayOfWeek} style={{
                        display: "flex", alignItems: "center",
                        gap: "1.5rem", padding: "1rem 0",
                        borderBottom: i < schedule.length - 1 ? "0.5px solid rgba(255,255,255,0.05)" : "none",
                        flexWrap: "wrap"
                    }}>
                        {/* TOGGLE */}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", width: 130 }}>
                            <div onClick={() => toggle(i)} style={{
                                width: 40, height: 22, borderRadius: 11,
                                background: s.isAvailable ? "#1D9E75" : "rgba(255,255,255,0.1)",
                                cursor: "pointer", position: "relative", transition: "background 0.2s", flexShrink: 0
                            }}>
                                <div style={{
                                    width: 16, height: 16, borderRadius: "50%",
                                    background: "white", position: "absolute",
                                    top: 3, left: s.isAvailable ? 21 : 3,
                                    transition: "left 0.2s"
                                }} />
                            </div>
                            <span style={{
                                fontSize: 14, fontWeight: 500,
                                color: s.isAvailable ? "#F0F4FF" : "rgba(240,244,255,0.3)"
                            }}>
                {s.dayOfWeek.slice(0, 3)}
              </span>
                        </div>

                        {s.isAvailable ? (
                            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
                                <div>
                                    <label style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", display: "block", marginBottom: 4 }}>Start Time</label>
                                    <input type="time" className="inp"
                                           value={s.startTime.slice(0, 5)}
                                           onChange={e => updateTime(i, "startTime", e.target.value)}
                                           style={{ padding: "6px 10px", fontSize: 13, width: 130 }} />
                                </div>
                                <div>
                                    <label style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", display: "block", marginBottom: 4 }}>End Time</label>
                                    <input type="time" className="inp"
                                           value={s.endTime.slice(0, 5)}
                                           onChange={e => updateTime(i, "endTime", e.target.value)}
                                           style={{ padding: "6px 10px", fontSize: 13, width: 130 }} />
                                </div>
                            </div>
                        ) : (
                            <span style={{ fontSize: 13, color: "rgba(240,244,255,0.25)", fontStyle: "italic" }}>
                Not available this day
              </span>
                        )}
                    </div>
                ))}

                <button onClick={handleSave} disabled={saving} style={{
                    marginTop: "1.5rem",
                    background: saving ? "rgba(201,168,76,0.5)" : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                    color: "#0A1628", border: "none",
                    padding: "12px 36px", borderRadius: 8,
                    fontSize: 15, fontWeight: 600,
                    cursor: saving ? "not-allowed" : "pointer",
                    fontFamily: "'Outfit',sans-serif"
                }}>
                    {saving ? "Saving..." : "Save Availability"}
                </button>
            </div>
        </div>
    );
}