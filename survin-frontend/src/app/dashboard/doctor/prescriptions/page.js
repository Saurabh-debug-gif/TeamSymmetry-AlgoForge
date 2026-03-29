"use client";
import { useState, useEffect } from "react";

export default function PrescriptionsPage() {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        appointmentId: "", patientId: "",
        diagnosis: "", instructions: "",
        medicines: [{ medicineName: "", dosage: "", duration: "", timing: "" }]
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => { fetchPrescriptions(); }, []);

    const fetchPrescriptions = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/prescriptions/doctor`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPrescriptions(await res.json());
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const addMedicine = () => setForm({
        ...form,
        medicines: [...form.medicines, { medicineName: "", dosage: "", duration: "", timing: "" }]
    });

    const removeMedicine = (i) => {
        const updated = form.medicines.filter((_, idx) => idx !== i);
        setForm({ ...form, medicines: updated });
    };

    const handleSubmit = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/prescriptions`, {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            });
            setShowForm(false);
            setForm({
                appointmentId: "", patientId: "",
                diagnosis: "", instructions: "",
                medicines: [{ medicineName: "", dosage: "", duration: "", timing: "" }]
            });
            fetchPrescriptions();
        } catch (err) { console.error(err); }
        finally { setSaving(false); }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#F0F4FF" }}>
                    Prescriptions
                </h2>
                <button onClick={() => setShowForm(!showForm)} style={{
                    background: showForm ? "rgba(226,75,74,0.1)" : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                    color: showForm ? "#F09595" : "#0A1628",
                    border: showForm ? "0.5px solid rgba(226,75,74,0.3)" : "none",
                    padding: "10px 20px", borderRadius: 8,
                    fontSize: 14, fontWeight: 600, cursor: "pointer",
                    fontFamily: "'Outfit',sans-serif"
                }}>
                    {showForm ? "✕ Cancel" : "+ New Prescription"}
                </button>
            </div>

            {/* NEW FORM */}
            {showForm && (
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    borderRadius: 16, padding: "2rem", marginBottom: "2rem"
                }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#F0F4FF", marginBottom: "1.5rem" }}>
                        New Prescription
                    </h3>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                        {[
                            { key: "appointmentId", label: "Appointment ID" },
                            { key: "patientId", label: "Patient ID" },
                            { key: "diagnosis", label: "Diagnosis" },
                            { key: "instructions", label: "Instructions" },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>{f.label}</label>
                                <input className="inp" value={form[f.key]}
                                       onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                            </div>
                        ))}
                    </div>

                    <div style={{ marginBottom: "1rem" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                            <h4 style={{ fontSize: 14, color: "#C9A84C" }}>Medicines</h4>
                            <button onClick={addMedicine} style={{
                                background: "rgba(201,168,76,0.1)", color: "#C9A84C",
                                border: "0.5px solid rgba(201,168,76,0.3)",
                                padding: "6px 14px", borderRadius: 6,
                                fontSize: 12, cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                            }}>+ Add Medicine</button>
                        </div>

                        {form.medicines.map((m, i) => (
                            <div key={i} style={{
                                display: "grid", gridTemplateColumns: "repeat(4,1fr) auto",
                                gap: "0.8rem", marginBottom: "0.8rem", alignItems: "end"
                            }}>
                                {[
                                    { field: "medicineName", label: "Medicine Name" },
                                    { field: "dosage", label: "Dosage" },
                                    { field: "duration", label: "Duration" },
                                    { field: "timing", label: "Timing" },
                                ].map(({ field, label }) => (
                                    <div key={field}>
                                        <label style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", display: "block", marginBottom: 4 }}>{label}</label>
                                        <input className="inp" value={m[field]}
                                               placeholder={field === "medicineName" ? "Paracetamol" : field === "dosage" ? "500mg" : field === "duration" ? "5 days" : "After meal"}
                                               onChange={e => {
                                                   const updated = [...form.medicines];
                                                   updated[i][field] = e.target.value;
                                                   setForm({ ...form, medicines: updated });
                                               }}
                                               style={{ padding: "6px 10px", fontSize: 13 }} />
                                    </div>
                                ))}
                                {form.medicines.length > 1 && (
                                    <button onClick={() => removeMedicine(i)} style={{
                                        background: "rgba(226,75,74,0.1)", color: "#F09595",
                                        border: "0.5px solid rgba(226,75,74,0.3)",
                                        padding: "8px 12px", borderRadius: 6,
                                        fontSize: 14, cursor: "pointer"
                                    }}>✕</button>
                                )}
                            </div>
                        ))}
                    </div>

                    <button onClick={handleSubmit} disabled={saving} style={{
                        background: saving ? "rgba(201,168,76,0.5)" : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                        color: "#0A1628", border: "none",
                        padding: "12px 32px", borderRadius: 8,
                        fontSize: 15, fontWeight: 600,
                        cursor: saving ? "not-allowed" : "pointer",
                        fontFamily: "'Outfit',sans-serif"
                    }}>
                        {saving ? "Saving..." : "Save Prescription"}
                    </button>
                </div>
            )}

            {/* LIST */}
            {loading ? (
                <p style={{ color: "rgba(240,244,255,0.4)" }}>Loading...</p>
            ) : prescriptions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "rgba(240,244,255,0.3)" }}>
                    <div style={{ fontSize: 48, marginBottom: "1rem" }}>💊</div>
                    <p>No prescriptions yet</p>
                </div>
            ) : (
                prescriptions.map((p, i) => (
                    <div key={i} style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(201,168,76,0.15)",
                        borderRadius: 12, padding: "1.5rem", marginBottom: "1rem"
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.8rem" }}>
                            <div style={{ fontSize: 15, color: "#F0F4FF", fontWeight: 500 }}>
                                Patient: {p.patientName || "Unknown"}
                            </div>
                        </div>
                        <div style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: "0.4rem" }}>
                            🔬 Diagnosis: {p.diagnosis || "—"}
                        </div>
                        <div style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: "0.4rem" }}>
                            📋 Instructions: {p.instructions || "—"}
                        </div>
                        {p.medicines?.length > 0 && (
                            <div style={{ marginTop: "0.8rem", display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                {p.medicines.map((m, j) => (
                                    <span key={j} style={{
                                        background: "rgba(201,168,76,0.1)", color: "#E8C97A",
                                        border: "0.5px solid rgba(201,168,76,0.2)",
                                        padding: "4px 12px", borderRadius: 20, fontSize: 12
                                    }}>
                    💊 {m.medicineName} · {m.dosage} · {m.duration}
                  </span>
                                ))}
                            </div>
                        )}
                    </div>
                ))
            )}
        </div>
    );
}
