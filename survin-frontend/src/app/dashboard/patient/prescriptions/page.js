"use client";
import { useState, useEffect } from "react";

export default function PatientPrescriptions() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("token");
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prescriptions/my`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then(r => r.json())
            .then(data => { setPrescriptions(data); setLoading(false); })
            .catch(() => setLoading(false));
    }, []);

    return (
        <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#F0F4FF", marginBottom: "2rem" }}>
                My Prescriptions
            </h2>

            {loading ? <p style={{ color: "rgba(240,244,255,0.4)" }}>Loading...</p>
                : prescriptions.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "4rem", color: "rgba(240,244,255,0.3)" }}>
                        <div style={{ fontSize: 48, marginBottom: "1rem" }}>💊</div>
                        <p>No prescriptions yet</p>
                    </div>
                ) : prescriptions.map((p, i) => (
                    <div key={i} style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(201,168,76,0.2)",
                        borderRadius: 16, marginBottom: "1rem", overflow: "hidden"
                    }}>
                        {/* HEADER */}
                        <div style={{
                            padding: "1.2rem 1.5rem", display: "flex",
                            justifyContent: "space-between", alignItems: "center",
                            cursor: "pointer"
                        }} onClick={() => setExpanded(expanded === i ? null : i)}>
                            <div>
                                <div style={{ fontSize: 15, color: "#F0F4FF", fontWeight: 500 }}>
                                    Dr. {p.doctorName || "Doctor"}
                                </div>
                                <div style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>
                                    🔬 {p.diagnosis || "Diagnosis N/A"}
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                <span style={{
                    background: "rgba(201,168,76,0.1)", color: "#C9A84C",
                    border: "0.5px solid rgba(201,168,76,0.3)",
                    padding: "4px 12px", borderRadius: 20, fontSize: 12
                }}>{p.medicines?.length || 0} medicines</span>
                                <span style={{ color: "rgba(240,244,255,0.4)", fontSize: 18 }}>
                  {expanded === i ? "▲" : "▼"}
                </span>
                            </div>
                        </div>

                        {/* EXPANDED */}
                        {expanded === i && (
                            <div style={{
                                padding: "1.5rem",
                                borderTop: "0.5px solid rgba(255,255,255,0.05)"
                            }}>
                                {p.instructions && (
                                    <div style={{
                                        background: "rgba(0,212,255,0.05)",
                                        border: "0.5px solid rgba(0,212,255,0.2)",
                                        borderRadius: 8, padding: "0.8rem",
                                        fontSize: 13, color: "#00D4FF", marginBottom: "1rem"
                                    }}>
                                        📋 Instructions: {p.instructions}
                                    </div>
                                )}

                                <h4 style={{ fontSize: 14, color: "#C9A84C", marginBottom: "0.8rem" }}>Prescribed Medicines</h4>
                                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "0.8rem" }}>
                                    {p.medicines?.map((m, j) => (
                                        <div key={j} style={{
                                            background: "rgba(255,255,255,0.03)",
                                            border: "0.5px solid rgba(201,168,76,0.1)",
                                            borderRadius: 10, padding: "1rem"
                                        }}>
                                            <div style={{ fontSize: 14, color: "#F0F4FF", fontWeight: 500, marginBottom: "0.5rem" }}>
                                                💊 {m.medicineName}
                                            </div>
                                            <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>
                                                <div>Dosage: {m.dosage}</div>
                                                <div>Duration: {m.duration}</div>
                                                <div>Timing: {m.timing}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
        </div>
    );
}