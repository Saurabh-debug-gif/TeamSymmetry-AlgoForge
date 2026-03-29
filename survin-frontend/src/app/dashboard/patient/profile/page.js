"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PatientProfilePage() {
    const router = useRouter();
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [photo, setPhoto] = useState(null);
    const [preview, setPreview] = useState("");
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/patient/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            setProfile(data);
            setForm({
                dateOfBirth: data.dateOfBirth || "",
                gender: data.gender || "",
                bloodGroup: data.bloodGroup || "",
                address: data.address || "",
                emergencyContact: data.emergencyContact || "",
                medicalHistory: data.medicalHistory || "",
            });
            if (data.profilePhoto) setPreview(`${process.env.NEXT_PUBLIC_API_URL}${data.profilePhoto}`);
        } catch (err) { console.error(err); }
    };

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            let photoUrl = profile?.profilePhoto || "";
            if (photo) {
                const fd = new FormData();
                fd.append("file", photo);
                const photoRes = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/patient/upload-photo`,
                    { method: "POST", headers: { Authorization: `Bearer ${token}` }, body: fd }
                );
                if (photoRes.ok) photoUrl = await photoRes.text();
            }

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/patient/profile`,
                {
                    method: "PUT",
                    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                    body: JSON.stringify({ ...form, profilePhoto: photoUrl })
                }
            );

            if (res.ok) {
                setMsg({ text: "Profile updated!", type: "success" });
                setEditMode(false);
                fetchProfile();
                router.refresh();
            } else setMsg({ text: "Update failed!", type: "error" });
        } catch { setMsg({ text: "Error!", type: "error" }); }
        finally { setSaving(false); setTimeout(() => setMsg({ text: "", type: "" }), 3000); }
    };

    const fields = [
        { key: "dateOfBirth", label: "Date of Birth", icon: "🎂", type: "date" },
        { key: "gender", label: "Gender", icon: "👤", type: "select", options: ["MALE", "FEMALE", "OTHER"] },
        { key: "bloodGroup", label: "Blood Group", icon: "🩸", type: "select", options: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] },
        { key: "address", label: "Address", icon: "📍" },
        { key: "emergencyContact", label: "Emergency Contact", icon: "📞" },
    ];

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#F0F4FF" }}>
                    My Profile
                </h2>
                {!editMode ? (
                    <button onClick={() => setEditMode(true)} style={{
                        background: "rgba(201,168,76,0.1)", color: "#C9A84C",
                        border: "1px solid rgba(201,168,76,0.4)",
                        padding: "10px 24px", borderRadius: 8, fontSize: 14,
                        cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                    }}>✏️ Edit Profile</button>
                ) : (
                    <div style={{ display: "flex", gap: "0.8rem" }}>
                        <button onClick={() => { setEditMode(false); fetchProfile(); }} style={{
                            background: "transparent", color: "rgba(240,244,255,0.5)",
                            border: "0.5px solid rgba(255,255,255,0.15)",
                            padding: "10px 20px", borderRadius: 8, fontSize: 14,
                            cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                        }}>Cancel</button>
                        <button onClick={handleSave} disabled={saving} style={{
                            background: saving ? "rgba(201,168,76,0.5)" : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                            color: "#0A1628", border: "none",
                            padding: "10px 24px", borderRadius: 8, fontSize: 14,
                            fontWeight: 600, cursor: saving ? "not-allowed" : "pointer",
                            fontFamily: "'Outfit',sans-serif"
                        }}>{saving ? "Saving..." : "Save Changes"}</button>
                    </div>
                )}
            </div>

            {msg.text && (
                <div style={{
                    background: msg.type === "success" ? "rgba(29,158,117,0.1)" : "rgba(226,75,74,0.1)",
                    border: `0.5px solid ${msg.type === "success" ? "rgba(29,158,117,0.3)" : "rgba(226,75,74,0.3)"}`,
                    borderRadius: 8, padding: "0.8rem 1rem",
                    fontSize: 14, color: msg.type === "success" ? "#5DCAA5" : "#F09595",
                    marginBottom: "1.5rem"
                }}>{msg.text}</div>
            )}

            <div style={{
                background: "rgba(255,255,255,0.02)",
                border: "0.5px solid rgba(201,168,76,0.2)",
                borderRadius: 16, padding: "2rem"
            }}>
                {/* PHOTO */}
                <div style={{
                    display: "flex", alignItems: "center", gap: "1.5rem",
                    marginBottom: "2rem", paddingBottom: "2rem",
                    borderBottom: "0.5px solid rgba(255,255,255,0.06)"
                }}>
                    <div style={{ position: "relative" }}>
                        <div style={{
                            width: 90, height: 90, borderRadius: "50%",
                            background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: 32, fontWeight: 700, color: "#0A1628",
                            overflow: "hidden", border: "3px solid rgba(201,168,76,0.3)"
                        }}>
                            {preview ? (
                                <img src={preview} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="profile" />
                            ) : profile?.name?.charAt(0) || "P"}
                        </div>
                        {editMode && (
                            <label style={{
                                position: "absolute", bottom: 0, right: 0,
                                width: 28, height: 28, borderRadius: "50%",
                                background: "#C9A84C", cursor: "pointer",
                                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14
                            }}>
                                📷
                                <input type="file" accept="image/*"
                                       onChange={e => {
                                           const file = e.target.files[0];
                                           if (file) { setPhoto(file); setPreview(URL.createObjectURL(file)); }
                                       }}
                                       style={{ display: "none" }} />
                            </label>
                        )}
                    </div>
                    <div>
                        <div style={{ fontSize: 22, color: "#F0F4FF", fontWeight: 500 }}>{profile?.name}</div>
                        <div style={{ fontSize: 14, color: "rgba(240,244,255,0.5)", marginTop: 4 }}>{profile?.email}</div>
                        {profile?.bloodGroup && (
                            <div style={{
                                display: "inline-flex", alignItems: "center", gap: "0.4rem",
                                background: "rgba(226,75,74,0.1)", border: "0.5px solid rgba(226,75,74,0.3)",
                                borderRadius: 20, padding: "4px 14px", fontSize: 13, color: "#F09595", marginTop: "0.8rem"
                            }}>🩸 {profile.bloodGroup}</div>
                        )}
                    </div>
                </div>

                {/* VIEW MODE */}
                {!editMode && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                        {fields.map(f => (
                            <div key={f.key} style={{
                                background: "rgba(255,255,255,0.02)",
                                border: "0.5px solid rgba(255,255,255,0.05)",
                                borderRadius: 10, padding: "1rem"
                            }}>
                                <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", marginBottom: 6 }}>
                                    {f.icon} {f.label.toUpperCase()}
                                </div>
                                <div style={{ fontSize: 15, color: "#F0F4FF" }}>
                                    {profile?.[f.key] || "Not set"}
                                </div>
                            </div>
                        ))}
                        <div style={{
                            gridColumn: "1 / -1",
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(255,255,255,0.05)",
                            borderRadius: 10, padding: "1rem"
                        }}>
                            <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", marginBottom: 6 }}>
                                📋 MEDICAL HISTORY
                            </div>
                            <div style={{ fontSize: 15, color: "#F0F4FF", lineHeight: 1.6 }}>
                                {profile?.medicalHistory || "Not set"}
                            </div>
                        </div>
                    </div>
                )}

                {/* EDIT MODE */}
                {editMode && (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.2rem" }}>
                        {fields.map(f => (
                            <div key={f.key}>
                                <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>{f.label}</label>
                                {f.type === "select" ? (
                                    <select className="inp" value={form[f.key]}
                                            onChange={e => setForm({ ...form, [f.key]: e.target.value })}>
                                        <option value="">Select...</option>
                                        {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                ) : (
                                    <input className="inp" type={f.type || "text"}
                                           value={form[f.key]}
                                           onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                                )}
                            </div>
                        ))}
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>Medical History</label>
                            <textarea className="inp"
                                      placeholder="Any existing conditions, allergies, previous surgeries..."
                                      value={form.medicalHistory}
                                      onChange={e => setForm({ ...form, medicalHistory: e.target.value })}
                                      style={{ height: 100, resize: "none" }} />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
