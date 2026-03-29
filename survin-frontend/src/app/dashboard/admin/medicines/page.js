"use client";
import { useState, useEffect } from "react";

const emptyForm = {
    name: "", description: "", price: "",
    manufacturer: "", category: "", requiresPrescription: true
};

export default function AdminMedicines() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editId, setEditId] = useState(null);
    const [form, setForm] = useState(emptyForm);
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState({ text: "", type: "" });
    const [search, setSearch] = useState("");

    useEffect(() => { fetchMedicines(); }, []);

    const fetchMedicines = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/medicines`,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // ✅ Ek baar hi read karo
            const text = await res.text();

            if (!res.ok) {
                console.error("Medicines fetch failed:", text);
                setMedicines([]);
                return;
            }

            const data = JSON.parse(text);
            setMedicines(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Medicines error:", err);
            setMedicines([]);
        } finally {
            setLoading(false);
        }
    };
    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    };

    const handleSubmit = async () => {
        if (!form.name) { showMsg("Medicine name required!", "error"); return; }
        setSaving(true);
        const token = localStorage.getItem("token");
        try {
            const url = editId
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/admin/medicines/${editId}`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/admin/medicines`;
            const res = await fetch(url, {
                method: editId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
                body: JSON.stringify({ ...form, price: Number(form.price) || 0 })
            });
            if (res.ok) {
                showMsg(editId ? "Medicine updated! ✅" : "Medicine added! ✅", "success");
                setForm(emptyForm);
                setEditId(null);
                setShowForm(false);
                fetchMedicines();
            } else showMsg("Failed!", "error");
        } catch { showMsg("Error!", "error"); }
        finally { setSaving(false); }
    };

    const handleEdit = (m) => {
        setForm({
            name: m.name || "", description: m.description || "",
            price: m.price?.toString() || "",
            manufacturer: m.manufacturer || "", category: m.category || "",
            requiresPrescription: m.requiresPrescription !== false
        });
        setEditId(m.id);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!confirm("Delete this medicine?")) return;
        const token = localStorage.getItem("token");
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/medicines/${id}`,
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) { showMsg("Deleted!", "success"); fetchMedicines(); }
    };

    const filtered = medicines.filter(m =>
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.category?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
                <div>
                    <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#F0F4FF", marginBottom: "0.3rem" }}>
                        Medicines
                    </h2>
                    <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)" }}>
                        Manage medicines shown on patient & doctor pages
                    </p>
                </div>
                <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm(emptyForm); }} style={{
                    background: showForm ? "rgba(226,75,74,0.1)" : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                    color: showForm ? "#F09595" : "#0A1628",
                    border: showForm ? "0.5px solid rgba(226,75,74,0.3)" : "none",
                    padding: "10px 20px", borderRadius: 8, fontSize: 14, fontWeight: 600,
                    cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                }}>
                    {showForm ? "✕ Cancel" : "+ Add Medicine"}
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
                        {editId ? "Edit Medicine" : "Add Medicine"}
                    </h3>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                        {[
                            { key: "name", label: "Medicine Name *", placeholder: "Paracetamol 500mg" },
                            { key: "manufacturer", label: "Manufacturer", placeholder: "Sun Pharma" },
                            { key: "category", label: "Category", placeholder: "Painkiller, Antibiotic..." },
                            { key: "price", label: "Price (₹)", placeholder: "50", type: "number" },
                        ].map(f => (
                            <div key={f.key}>
                                <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>
                                    {f.label}
                                </label>
                                <input className="inp" type={f.type || "text"} placeholder={f.placeholder}
                                       value={form[f.key]}
                                       onChange={e => setForm({ ...form, [f.key]: e.target.value })} />
                            </div>
                        ))}
                        <div style={{ gridColumn: "1 / -1" }}>
                            <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>
                                Description
                            </label>
                            <textarea className="inp" placeholder="Medicine description..."
                                      value={form.description}
                                      onChange={e => setForm({ ...form, description: e.target.value })}
                                      style={{ height: 80, resize: "none" }} />
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                            <input type="checkbox" checked={form.requiresPrescription}
                                   onChange={e => setForm({ ...form, requiresPrescription: e.target.checked })}
                                   style={{ width: 16, height: 16, cursor: "pointer" }} />
                            <label style={{ fontSize: 14, color: "rgba(240,244,255,0.7)", cursor: "pointer" }}>
                                Requires Prescription 💊
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
                        {saving ? "Saving..." : editId ? "Update Medicine" : "Add Medicine"}
                    </button>
                </div>
            )}

            {/* SEARCH */}
            <input className="inp"
                   placeholder="🔍 Search medicines..."
                   value={search}
                   onChange={e => setSearch(e.target.value)}
                   style={{ marginBottom: "1.5rem" }} />

            {/* LIST */}
            {loading ? (
                <p style={{ color: "rgba(240,244,255,0.4)" }}>Loading...</p>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "rgba(240,244,255,0.3)" }}>
                    <div style={{ fontSize: 48, marginBottom: "1rem" }}>💊</div>
                    <p>No medicines yet</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
                    {filtered.map((m) => (
                        <div key={m.id} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(201,168,76,0.15)",
                            borderRadius: 14, padding: "1.2rem"
                        }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                <div style={{ fontSize: 15, color: "#F0F4FF", fontWeight: 500 }}>💊 {m.name}</div>
                                {m.requiresPrescription && (
                                    <span style={{
                                        background: "rgba(239,159,39,0.1)", color: "#EF9F27",
                                        border: "0.5px solid rgba(239,159,39,0.3)",
                                        padding: "2px 8px", borderRadius: 12, fontSize: 10
                                    }}>Rx</span>
                                )}
                            </div>
                            {m.category && (
                                <div style={{ fontSize: 12, color: "#C9A84C", marginBottom: "0.3rem" }}>
                                    {m.category}
                                </div>
                            )}
                            {m.manufacturer && (
                                <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginBottom: "0.3rem" }}>
                                    {m.manufacturer}
                                </div>
                            )}
                            {m.price > 0 && (
                                <div style={{ fontSize: 14, color: "#5DCAA5", fontWeight: 500, marginBottom: "0.5rem" }}>
                                    ₹{m.price}
                                </div>
                            )}
                            {m.description && (
                                <div style={{
                                    fontSize: 12, color: "rgba(240,244,255,0.4)",
                                    marginBottom: "0.8rem", lineHeight: 1.5
                                }}>{m.description}</div>
                            )}
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                                <button onClick={() => handleEdit(m)} style={{
                                    flex: 1, background: "rgba(0,212,255,0.1)", color: "#00D4FF",
                                    border: "0.5px solid rgba(0,212,255,0.3)",
                                    padding: "6px", borderRadius: 8, fontSize: 12,
                                    cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                                }}>✏️ Edit</button>
                                <button onClick={() => handleDelete(m.id)} style={{
                                    flex: 1, background: "rgba(226,75,74,0.1)", color: "#F09595",
                                    border: "0.5px solid rgba(226,75,74,0.3)",
                                    padding: "6px", borderRadius: 8, fontSize: 12,
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