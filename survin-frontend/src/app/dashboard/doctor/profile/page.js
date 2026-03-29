"use client";
import { useState, useEffect } from "react";

export default function DoctorProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });
    const [photoUploading, setPhotoUploading] = useState(false);

    const [form, setForm] = useState({
        clinicName: "",
        clinicAddress: "",
        specialization: "",
        consultationFee: "",
        experienceYears: "",
        about: "",
        phone: "",
        whatsapp: "",
        languages: "",
    });

    useEffect(() => { fetchProfile(); }, []);

    const fetchProfile = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/doctor/profile`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            setProfile(data);
            setForm({
                clinicName: data.clinicName || "",
                clinicAddress: data.clinicAddress || "",
                specialization: data.specialization || "",
                consultationFee: data.consultationFee || "",
                experienceYears: data.experienceYears || "",
                about: data.about || "",
                phone: data.phone || "",
                whatsapp: data.whatsapp || "",
                languages: data.languages?.join(", ") || "",
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    };

    const handleSave = async () => {
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/doctor/profile`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        ...form,
                        consultationFee: form.consultationFee ? Number(form.consultationFee) : null,
                        experienceYears: form.experienceYears ? Number(form.experienceYears) : null,
                        languages: form.languages
                            ? form.languages.split(",").map(l => l.trim()).filter(Boolean)
                            : [],
                    })
                }
            );
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setEditMode(false);
                showMsg("Profile updated! ✅", "success");
            } else {
                showMsg("Update failed!", "error");
            }
        } catch (err) {
            console.error(err);
            showMsg("Network error!", "error");
        } finally {
            setSaving(false);
        }
    };

    const handlePhotoUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setPhotoUploading(true);
        const token = localStorage.getItem("token");
        const formData = new FormData();
        formData.append("photo", file);
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/doctor/upload-photo`,
                {
                    method: "POST",
                    headers: { Authorization: `Bearer ${token}` },
                    body: formData
                }
            );
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                showMsg("Photo updated! ✅", "success");
            } else {
                showMsg("Photo upload failed!", "error");
            }
        } catch (err) {
            console.error(err);
            showMsg("Upload error!", "error");
        } finally {
            setPhotoUploading(false);
        }
    };

    if (loading) return (
        <div style={{
            display: "flex", alignItems: "center",
            justifyContent: "center", height: "60vh"
        }}>
            <div style={{
                fontFamily: "'Cormorant Garamond',serif",
                fontSize: 24, color: "#C9A84C"
            }}>Loading...</div>
        </div>
    );

    return (
        <div>
            {/* HEADER */}
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginBottom: "2rem",
                flexWrap: "wrap", gap: "1rem"
            }}>
                <div>
                    <h2 style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 32, color: "#F0F4FF", marginBottom: "0.3rem"
                    }}>My Profile</h2>
                    <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)" }}>
                        Manage your professional information
                    </p>
                </div>

                <div style={{ display: "flex", gap: "0.8rem" }}>
                    {editMode ? (
                        <>
                            <button onClick={() => {
                                setEditMode(false);
                                setMsg({ text: "", type: "" });
                            }} style={{
                                background: "transparent", color: "rgba(240,244,255,0.5)",
                                border: "0.5px solid rgba(255,255,255,0.15)",
                                padding: "10px 20px", borderRadius: 8,
                                fontSize: 14, cursor: "pointer",
                                fontFamily: "'Outfit',sans-serif"
                            }}>Cancel</button>

                            <button onClick={handleSave} disabled={saving} style={{
                                background: saving
                                    ? "rgba(201,168,76,0.5)"
                                    : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                color: "#0A1628", border: "none",
                                padding: "10px 24px", borderRadius: 8,
                                fontSize: 14, fontWeight: 600,
                                cursor: saving ? "not-allowed" : "pointer",
                                fontFamily: "'Outfit',sans-serif"
                            }}>
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </>
                    ) : (
                        <button onClick={() => setEditMode(true)} style={{
                            background: "rgba(201,168,76,0.1)", color: "#C9A84C",
                            border: "0.5px solid rgba(201,168,76,0.3)",
                            padding: "10px 24px", borderRadius: 8,
                            fontSize: 14, cursor: "pointer",
                            fontFamily: "'Outfit',sans-serif"
                        }}>✏️ Edit Profile</button>
                    )}
                </div>
            </div>

            {/* MSG */}
            {msg.text && (
                <div style={{
                    background: msg.type === "success"
                        ? "rgba(29,158,117,0.1)"
                        : "rgba(226,75,74,0.1)",
                    border: `0.5px solid ${msg.type === "success"
                        ? "rgba(29,158,117,0.3)"
                        : "rgba(226,75,74,0.3)"}`,
                    borderRadius: 8, padding: "0.8rem 1rem",
                    fontSize: 14,
                    color: msg.type === "success" ? "#5DCAA5" : "#F09595",
                    marginBottom: "1.5rem"
                }}>{msg.text}</div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem" }}>

                {/* LEFT — Photo + Basic Info */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                    {/* PHOTO CARD */}
                    <div style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(201,168,76,0.2)",
                        borderRadius: 16, overflow: "hidden"
                    }}>
                        <div style={{
                            background: "linear-gradient(135deg,rgba(201,168,76,0.15),rgba(0,100,200,0.1))",
                            padding: "2rem", textAlign: "center"
                        }}>
                            {/* PROFILE PHOTO */}
                            <div style={{
                                width: 100, height: 100, borderRadius: "50%",
                                margin: "0 auto 1rem",
                                background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 36, fontWeight: 700, color: "#0A1628",
                                overflow: "hidden", border: "3px solid rgba(201,168,76,0.4)",
                                position: "relative"
                            }}>
                                {profile?.profilePhoto ? (
                                    <img
                                        src={`${process.env.NEXT_PUBLIC_API_URL}${profile.profilePhoto}`}
                                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                        onError={e => e.target.style.display = "none"}
                                        alt="profile"
                                    />
                                ) : profile?.name?.charAt(0) || "D"}
                            </div>

                            <div style={{ fontSize: 20, color: "#F0F4FF", fontWeight: 500 }}>
                                {profile?.name || "Doctor"}
                            </div>
                            <div style={{ fontSize: 13, color: "#C9A84C", marginTop: 4 }}>
                                {profile?.specialization || "Specialist"}
                            </div>

                            {profile?.isVerified && (
                                <div style={{
                                    display: "inline-flex", alignItems: "center", gap: "0.3rem",
                                    marginTop: "0.8rem",
                                    background: "rgba(29,158,117,0.1)", color: "#5DCAA5",
                                    border: "0.5px solid rgba(29,158,117,0.3)",
                                    padding: "4px 14px", borderRadius: 20, fontSize: 12
                                }}>✅ Verified Doctor</div>
                            )}
                        </div>

                        {/* UPLOAD PHOTO */}
                        <div style={{ padding: "1rem", textAlign: "center" }}>
                            <label style={{
                                display: "inline-block",
                                background: "rgba(201,168,76,0.1)", color: "#C9A84C",
                                border: "0.5px solid rgba(201,168,76,0.3)",
                                padding: "8px 20px", borderRadius: 8,
                                fontSize: 13, cursor: "pointer",
                                fontFamily: "'Outfit',sans-serif"
                            }}>
                                {photoUploading ? "Uploading..." : "📷 Change Photo"}
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    style={{ display: "none" }}
                                    disabled={photoUploading}
                                />
                            </label>
                        </div>
                    </div>

                    {/* QUICK INFO */}
                    <div style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(201,168,76,0.15)",
                        borderRadius: 14, padding: "1.2rem"
                    }}>
                        {[
                            { icon: "🏥", label: "Clinic", val: profile?.clinicName },
                            { icon: "📍", label: "Address", val: profile?.clinicAddress },
                            { icon: "💰", label: "Fee", val: profile?.consultationFee ? `₹${profile.consultationFee}` : null },
                            { icon: "📅", label: "Experience", val: profile?.experienceYears ? `${profile.experienceYears} Years` : null },
                            { icon: "📞", label: "Phone", val: profile?.phone },
                            { icon: "💬", label: "WhatsApp", val: profile?.whatsapp },
                            { icon: "🌐", label: "Languages", val: profile?.languages?.join(", ") },
                        ].filter(i => i.val).map(item => (
                            <div key={item.label} style={{
                                display: "flex", gap: "0.8rem",
                                padding: "0.6rem 0",
                                borderBottom: "0.5px solid rgba(255,255,255,0.05)"
                            }}>
                                <span style={{ fontSize: 14, flexShrink: 0 }}>{item.icon}</span>
                                <div>
                                    <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)" }}>
                                        {item.label}
                                    </div>
                                    <div style={{ fontSize: 13, color: "#F0F4FF" }}>{item.val}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT — Edit Form / View */}
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    borderRadius: 16, padding: "2rem"
                }}>
                    <h3 style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 22, color: "#F0F4FF", marginBottom: "1.5rem"
                    }}>
                        {editMode ? "✏️ Edit Information" : "Professional Information"}
                    </h3>

                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "1.2rem"
                    }}>
                        {[
                            { key: "clinicName", label: "Clinic Name", placeholder: "Apollo Clinic" },
                            { key: "specialization", label: "Specialization", placeholder: "Cardiology" },
                            { key: "consultationFee", label: "Consultation Fee (₹)", placeholder: "500", type: "number" },
                            { key: "experienceYears", label: "Experience (Years)", placeholder: "5", type: "number" },
                            { key: "phone", label: "Phone Number", placeholder: "919876543210" },
                            { key: "whatsapp", label: "WhatsApp Number", placeholder: "919876543210" },
                        ].map(field => (
                            <div key={field.key}>
                                <label style={{
                                    fontSize: 12, color: "rgba(240,244,255,0.5)",
                                    display: "block", marginBottom: 6
                                }}>{field.label}</label>
                                {editMode ? (
                                    <input
                                        className="inp"
                                        type={field.type || "text"}
                                        placeholder={field.placeholder}
                                        value={form[field.key]}
                                        onChange={e => setForm({ ...form, [field.key]: e.target.value })}
                                    />
                                ) : (
                                    <div style={{
                                        fontSize: 14, color: "#F0F4FF",
                                        padding: "10px 0",
                                        borderBottom: "0.5px solid rgba(255,255,255,0.05)"
                                    }}>
                                        {profile?.[field.key] || (
                                            <span style={{ color: "rgba(240,244,255,0.3)" }}>Not set</span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}

                        {/* CLINIC ADDRESS — Full Width */}
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{
                                fontSize: 12, color: "rgba(240,244,255,0.5)",
                                display: "block", marginBottom: 6
                            }}>Clinic Address</label>
                            {editMode ? (
                                <input
                                    className="inp"
                                    placeholder="123 Main Street, Mumbai"
                                    value={form.clinicAddress}
                                    onChange={e => setForm({ ...form, clinicAddress: e.target.value })}
                                />
                            ) : (
                                <div style={{
                                    fontSize: 14, color: "#F0F4FF",
                                    padding: "10px 0",
                                    borderBottom: "0.5px solid rgba(255,255,255,0.05)"
                                }}>
                                    {profile?.clinicAddress || (
                                        <span style={{ color: "rgba(240,244,255,0.3)" }}>Not set</span>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* LANGUAGES — Full Width */}
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{
                                fontSize: 12, color: "rgba(240,244,255,0.5)",
                                display: "block", marginBottom: 6
                            }}>Languages (comma separated)</label>
                            {editMode ? (
                                <input
                                    className="inp"
                                    placeholder="English, Hindi, Marathi"
                                    value={form.languages}
                                    onChange={e => setForm({ ...form, languages: e.target.value })}
                                />
                            ) : (
                                <div style={{
                                    fontSize: 14, color: "#F0F4FF",
                                    padding: "10px 0",
                                    borderBottom: "0.5px solid rgba(255,255,255,0.05)"
                                }}>
                                    {profile?.languages?.length > 0
                                        ? profile.languages.join(", ")
                                        : <span style={{ color: "rgba(240,244,255,0.3)" }}>Not set</span>
                                    }
                                </div>
                            )}
                        </div>

                        {/* ABOUT — Full Width */}
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{
                                fontSize: 12, color: "rgba(240,244,255,0.5)",
                                display: "block", marginBottom: 6
                            }}>About / Bio</label>
                            {editMode ? (
                                <textarea
                                    className="inp"
                                    placeholder="Write about your experience, expertise and approach..."
                                    value={form.about}
                                    onChange={e => setForm({ ...form, about: e.target.value })}
                                    style={{ height: 120, resize: "none" }}
                                />
                            ) : (
                                <div style={{
                                    fontSize: 14, color: "rgba(240,244,255,0.7)",
                                    lineHeight: 1.7,
                                    padding: "10px 0"
                                }}>
                                    {profile?.about || (
                                        <span style={{ color: "rgba(240,244,255,0.3)" }}>
                      No bio added yet. Click Edit Profile to add.
                    </span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* SAVE BUTTON BOTTOM */}
                    {editMode && (
                        <div style={{
                            marginTop: "2rem",
                            display: "flex", gap: "1rem",
                            justifyContent: "flex-end"
                        }}>
                            <button onClick={() => setEditMode(false)} style={{
                                background: "transparent",
                                color: "rgba(240,244,255,0.5)",
                                border: "0.5px solid rgba(255,255,255,0.15)",
                                padding: "10px 24px", borderRadius: 8,
                                fontSize: 14, cursor: "pointer",
                                fontFamily: "'Outfit',sans-serif"
                            }}>Cancel</button>

                            <button onClick={handleSave} disabled={saving} style={{
                                background: saving
                                    ? "rgba(201,168,76,0.5)"
                                    : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                color: "#0A1628", border: "none",
                                padding: "10px 28px", borderRadius: 8,
                                fontSize: 14, fontWeight: 600,
                                cursor: saving ? "not-allowed" : "pointer",
                                fontFamily: "'Outfit',sans-serif"
                            }}>
                                {saving ? "Saving..." : "✅ Save Changes"}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
