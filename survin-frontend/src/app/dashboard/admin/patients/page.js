"use client";
import { useState, useEffect } from "react";

export default function AdminPatients() {
    const [patients, setPatients] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState({ text: "", type: "" });
    const [search, setSearch] = useState("");

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [patRes, userRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/patients`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, { headers }),
            ]);

            // ✅ Ek baar hi read karo — FIXED!
            const patData = await patRes.json();
            const userData = await userRes.json();

            setPatients(Array.isArray(patData) ? patData : []);
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (err) {
            console.error("Fetch error:", err);
        } finally {
            setLoading(false);
        }
    };

    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    };

    const deleteUser = async (userId) => {
        if (!confirm("Delete this patient? This cannot be undone!")) return;
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`,
                { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) {
                showMsg("Patient deleted! ✅", "success");
                fetchData();
            } else {
                const err = await res.text();
                console.error("Delete failed:", err);
                showMsg("Delete failed!", "error");
            }
        } catch (err) {
            console.error(err);
            showMsg("Network error!", "error");
        }
    };

    const blockUser = async (userId, block) => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/${block ? "block" : "unblock"}`,
                { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
            );
            if (res.ok) {
                showMsg(`Patient ${block ? "blocked 🔒" : "unblocked 🔓"}!`, "success");
                fetchData();
            } else {
                showMsg("Action failed!", "error");
            }
        } catch (err) {
            console.error(err);
            showMsg("Network error!", "error");
        }
    };

    const getUserInfo = (userId) => users.find(u => u.id === userId);

    // ✅ Agar patient profile nahi hai toh bhi user dikhao
    const allPatientUsers = users.filter(u => {
        const hasPatientProfile = patients.some(p => p.userId === u.id);
        const isPatientRole = true; // Sab users dikhao jo patients hain
        return hasPatientProfile;
    });

    // ✅ Search filter
    const filteredPatients = patients.filter(p => {
        const user = getUserInfo(p.userId);
        return (
            user?.name?.toLowerCase().includes(search.toLowerCase()) ||
            user?.email?.toLowerCase().includes(search.toLowerCase()) ||
            p.bloodGroup?.toLowerCase().includes(search.toLowerCase())
        );
    });

    return (
        <div>
            {/* HEADER */}
            <div style={{ marginBottom: "2rem" }}>
                <h2 style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 32, color: "#F0F4FF", marginBottom: "0.3rem"
                }}>Manage Patients</h2>
                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)" }}>
                    View, block or delete patient accounts
                </p>
            </div>

            {/* MSG */}
            {msg.text && (
                <div style={{
                    background: msg.type === "success" ? "rgba(29,158,117,0.1)" : "rgba(226,75,74,0.1)",
                    border: `0.5px solid ${msg.type === "success" ? "rgba(29,158,117,0.3)" : "rgba(226,75,74,0.3)"}`,
                    borderRadius: 8, padding: "0.8rem 1rem",
                    fontSize: 14, color: msg.type === "success" ? "#5DCAA5" : "#F09595",
                    marginBottom: "1.5rem"
                }}>{msg.text}</div>
            )}

            {/* SEARCH + COUNT */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
                <input className="inp"
                       placeholder="🔍 Search by name, email or blood group..."
                       value={search}
                       onChange={e => setSearch(e.target.value)}
                       style={{ flex: 1 }} />
                <div style={{
                    background: "rgba(201,168,76,0.1)", color: "#C9A84C",
                    border: "0.5px solid rgba(201,168,76,0.3)",
                    padding: "10px 16px", borderRadius: 8,
                    fontSize: 13, whiteSpace: "nowrap"
                }}>
                    {filteredPatients.length} patient{filteredPatients.length !== 1 ? "s" : ""}
                </div>
            </div>

            {/* LIST */}
            {loading ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(201,168,76,0.1)",
                            borderRadius: 14, height: 80
                        }} />
                    ))}
                </div>
            ) : filteredPatients.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "rgba(240,244,255,0.3)" }}>
                    <div style={{ fontSize: 48, marginBottom: "1rem" }}>👥</div>
                    <p style={{ fontSize: 15 }}>
                        {search ? "No patients match your search" : "No patients found"}
                    </p>
                    {search && (
                        <button onClick={() => setSearch("")} style={{
                            marginTop: "1rem",
                            background: "rgba(201,168,76,0.1)", color: "#C9A84C",
                            border: "0.5px solid rgba(201,168,76,0.3)",
                            padding: "8px 20px", borderRadius: 8,
                            fontSize: 13, cursor: "pointer",
                            fontFamily: "'Outfit',sans-serif"
                        }}>Clear Search</button>
                    )}
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {filteredPatients.map((p) => {
                        const user = getUserInfo(p.userId);
                        return (
                            <div key={p.id} style={{
                                background: "rgba(255,255,255,0.02)",
                                border: user?.isBlocked
                                    ? "0.5px solid rgba(226,75,74,0.2)"
                                    : "0.5px solid rgba(201,168,76,0.15)",
                                borderRadius: 14, padding: "1.2rem",
                                display: "flex", alignItems: "center",
                                justifyContent: "space-between",
                                flexWrap: "wrap", gap: "1rem"
                            }}>

                                {/* LEFT — Patient Info */}
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: "50%",
                                        background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 18, fontWeight: 700, color: "#0A1628",
                                        overflow: "hidden", flexShrink: 0,
                                        border: "2px solid rgba(201,168,76,0.3)"
                                    }}>
                                        {p.profilePhoto ? (
                                            <img
                                                src={`${process.env.NEXT_PUBLIC_API_URL}${p.profilePhoto}`}
                                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                                onError={e => e.target.style.display = "none"}
                                                alt="patient"
                                            />
                                        ) : user?.name?.charAt(0) || "P"}
                                    </div>

                                    <div>
                                        <div style={{ fontSize: 15, color: "#F0F4FF", fontWeight: 500 }}>
                                            {user?.name || "Patient"}
                                        </div>
                                        <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>
                                            {user?.email || "No email"}
                                        </div>
                                        <div style={{
                                            display: "flex", gap: "0.5rem",
                                            marginTop: 6, flexWrap: "wrap"
                                        }}>
                                            {p.bloodGroup && (
                                                <span style={{
                                                    background: "rgba(226,75,74,0.1)", color: "#F09595",
                                                    border: "0.5px solid rgba(226,75,74,0.2)",
                                                    padding: "2px 8px", borderRadius: 12, fontSize: 11
                                                }}>🩸 {p.bloodGroup}</span>
                                            )}
                                            {p.gender && (
                                                <span style={{
                                                    background: "rgba(0,212,255,0.08)", color: "#00D4FF",
                                                    border: "0.5px solid rgba(0,212,255,0.2)",
                                                    padding: "2px 8px", borderRadius: 12, fontSize: 11
                                                }}>{p.gender}</span>
                                            )}
                                            {p.dateOfBirth && (
                                                <span style={{
                                                    background: "rgba(255,255,255,0.04)",
                                                    color: "rgba(240,244,255,0.5)",
                                                    border: "0.5px solid rgba(255,255,255,0.08)",
                                                    padding: "2px 8px", borderRadius: 12, fontSize: 11
                                                }}>🎂 {p.dateOfBirth}</span>
                                            )}
                                            {user?.isBlocked && (
                                                <span style={{
                                                    background: "rgba(226,75,74,0.1)", color: "#F09595",
                                                    border: "0.5px solid rgba(226,75,74,0.3)",
                                                    padding: "2px 8px", borderRadius: 12, fontSize: 11
                                                }}>🔒 Blocked</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* RIGHT — Action Buttons */}
                                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                                    {user && (
                                        <>
                                            <button
                                                onClick={() => blockUser(user.id, !user.isBlocked)}
                                                style={{
                                                    background: user.isBlocked
                                                        ? "rgba(29,158,117,0.1)"
                                                        : "rgba(239,159,39,0.1)",
                                                    color: user.isBlocked ? "#5DCAA5" : "#EF9F27",
                                                    border: `0.5px solid ${user.isBlocked
                                                        ? "rgba(29,158,117,0.3)"
                                                        : "rgba(239,159,39,0.3)"}`,
                                                    padding: "7px 16px", borderRadius: 8,
                                                    fontSize: 13, cursor: "pointer",
                                                    fontFamily: "'Outfit',sans-serif"
                                                }}>
                                                {user.isBlocked ? "🔓 Unblock" : "🔒 Block"}
                                            </button>

                                            <button
                                                onClick={() => deleteUser(user.id)}
                                                style={{
                                                    background: "rgba(226,75,74,0.1)", color: "#F09595",
                                                    border: "0.5px solid rgba(226,75,74,0.3)",
                                                    padding: "7px 16px", borderRadius: 8,
                                                    fontSize: 13, cursor: "pointer",
                                                    fontFamily: "'Outfit',sans-serif"
                                                }}>
                                                🗑 Delete
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}