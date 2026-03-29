"use client";
import { useState, useEffect } from "react";

const emptyForm = {
    name: "", address: "", phone: "", whatsapp: "",
    email: "", openTime: "", closeTime: "", isVerified: false
};

export default function AdminMedicals() {
    const [medicals, setMedicals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });

    useEffect(() => { fetchMedicals(); }, []);
    const fetchMedicals = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/medicals`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ Ek baar hi read karo
            const text = await res.text();

            if (!res.ok) {
                console.error("Medicals fetch failed:", text);
                setMedicals([]);
                return;
            }

            const data = JSON.parse(text);
            setMedicals(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Medicals error:", err);
            setMedicals([]);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    };

    const handleSubmit = async () => {
        if (!form.name || !form.address) {
            showMsg("Name and address required!", "error");
            return;
        }
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const url = editId
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/medicals/${editId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/medicals`;
            const res = await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            });
            if (res.ok) {
                showMsg(editId ? "Medical store updated! ✅" : "Medical store added! ✅", "success");
                setForm(emptyForm);
                setEditId(null);
                setShowForm(false);
                fetchMedicals();
            } else showMsg("Failed!", "error");
        } catch { showMsg("Error!", "error"); }
        finally { setSaving(false); }
    };

    const handleEdit = (m) => {
        setForm({
            name: m.name || "", address: m.address || "",
            phone: m.phone || "", whatsapp: m.whatsapp || "",
            email: m.email || "", openTime: m.openTime || "",
            closeTime: m.closeTime || "", isVerified: m.isVerified || false
        });
        setEditId(m.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this medical store?")) return;
        const token = localStorage.getItem("token");
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/medicals/${id}`,
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) { showMsg("Deleted!", "success"); fetchMedicals(); }
    };

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#F0F4FF", marginBottom: "0.3rem" }}>
                        Medical Stores
                    </h2>
                    <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)" }}>
                        Manage medical stores shown on patient page
                    </p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }} style={{
                    background: showForm ? "rgba(226,75,74,0.1)" : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                    color: showForm ? "#F09595" : "#0A1628",
                    border: showForm ? "0.5px solid rgba(226,75,74,0.3)" : "none",
                    padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                }}>
                    {showForm ? "✕ Cancel" : "+ Add Store"}
                </button>
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

            {/* FORM */}
            {showForm && (
                <div style={{
                    background: "rgba(255,255,255,0.02)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    borderRadius: 16, padding: "2rem", marginBottom: "2rem"
                }}>
                    <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#F0F4FF", marginBottom: "1.5rem" }}>
                        {editId ? "Edit Medical Store" : "Add Medical Store"}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        {[
                            { key: "name", label: "Store Name *", placeholder: "Apollo Pharmacy" },
                            { key: "address", label: "Address *", placeholder: "Andheri West, Mumbai" },
                            { key: "phone", label: "Phone Number", placeholder: "919876543210" },
                            { key: "whatsapp", label: "WhatsApp", placeholder: "919876543210" },
                            { key: "email", label: "Email", placeholder: "store@gmail.com" },
                            { key: "openTime", label: "Open Time", placeholder: "09:00 AM" },
                            { key: "closeTime", label: "Close Time", placeholder: "10:00 PM" },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>
                                    {f.label}
                                </label>
                                <input className="inp" placeholder={f.placeholder}
                                       value={form[f.key]}
                                       onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                            </div>
                        ))}
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", paddingTop: "1.5rem" }}>
                            <input type="checkbox" checked={form.isVerified}
                                   onChange={e => setForm({ ...form, isVerified: e.target.checked })}
                                   style={{ width: 16, height: 16, cursor: "pointer" }} />
                            <label style={{ fontSize: 14, color: "rgba(240,244,255,0.7)", cursor: "pointer" }}>
                                Mark as Verified ✅
                            </label>
                        </div>
                    </div>

                    <button onClick={handleSubmit} disabled={saving} style={{
                        background: saving ? "rgba(201,168,76,0.5)" : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                        color: "#0A1628", border: "none",
                        padding: "12px 32px", borderRadius: 8,
                        fontSize: 14, fontWeight: 600,
                        cursor: saving ? "not-allowed" : "pointer",
                        fontFamily: "'Outfit',sans-serif"
                    }}>
                        {saving ? "Saving..." : editId ? "Update Store" : "Add Store"}
                    </button>
                </div>
            )}

            {/* LIST */}
            {loading ? (
                <p style={{ color: "rgba(240,244,255,0.4)" }}>Loading...</p>
            ) : medicals.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "rgba(240,244,255,0.3)" }}>
                    <div style={{ fontSize: 48, marginBottom: "1rem" }}>🏪</div>
                    <p>No medical stores yet</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {medicals.map((m) => (
                        <div key={m.id} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(201,168,76,0.15)",
                            borderRadius: 14, padding: "1.2rem",
                            display: "flex", alignItems: "center",
                            justifyContent: "space-between", flexWrap: "wrap", gap: "1rem"
                        }}>
                            <div>
                                <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.4rem" }}>
                                    <div style={{ fontSize: 16, color: "#F0F4FF", fontWeight: 500 }}>🏪 {m.name}</div>
                                    {m.isVerified && (
                                        <span style={{
                                            background: "rgba(29,158,117,0.1)", color: "#5DCAA5",
                                            border: "0.5px solid rgba(29,158,117,0.3)",
                                            padding: "2px 8px", borderRadius: 12, fontSize: 11
                                        }}>✅ Verified</span>
                                    )}
                                </div>
                                <div style={{ fontSize: 13, color: "rgba(240,244,255,0.4)" }}>
                                    📍 {m.address}
                                    {m.phone ? ` · 📞 ${m.phone}` : ""}
                                    {m.openTime ? ` · 🕐 ${m.openTime} - ${m.closeTime}` : ""}
                                </div>
                            </div>

                            <div style={{ display: "flex", gap: "0.6rem" }}>
                                <button onClick={() => handleEdit(m)} style={{
                                    background: "rgba(0,212,255,0.1)", color: "#00D4FF",
                                    border: "0.5px solid rgba(0,212,255,0.3)",
                                    padding: "6px 14px", borderRadius: 8, fontSize: 12,
                                    cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                                }}>✏️ Edit</button>
                                <button onClick={() => handleDelete(m.id)} style={{
                                    background: "rgba(226,75,74,0.1)", color: "#F09595",
                                    border: "0.5px solid rgba(226,75,74,0.3)",
                                    padding: "6px 14px", borderRadius: 8, fontSize: 12,
                                    cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                                }}>🗑 Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}