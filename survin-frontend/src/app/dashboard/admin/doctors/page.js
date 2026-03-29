"use client";
import { useState, useEffect } from "react";

export default function AdminDoctors() {
    const [doctors, setDoctors] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [msg, setMsg] = useState({ text: "", type: "" });

    useEffect(() => { fetchData(); }, []);

    const fetchData = async () => {
        const token = localStorage.getItem("token");
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const [docRes, userRes] = await Promise.all([
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/doctors`, { headers }),
                fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users`, { headers }),
            ]);
            const docData = await docRes.json();
            const userData = await userRes.json();
            setDoctors(Array.isArray(docData) ? docData : []);
            setUsers(Array.isArray(userData) ? userData : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const showMsg = (text, type) => {
        setMsg({ text, type });
        setTimeout(() => setMsg({ text: "", type: "" }), 3000);
    };

    const verifyDoctor = async (id) => {
        const token = localStorage.getItem("token");
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/doctors/${id}/verify`,
            { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) { showMsg("Doctor verified! ✅", "success"); fetchData(); }
        else showMsg("Failed!", "error");
    };

    const deleteUser = async (userId) => {
        if (!confirm("Are you sure you want to delete this user?")) return;
        const token = localStorage.getItem("token");
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}`,
            { method: "DELETE", headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) { showMsg("User deleted!", "success"); fetchData(); }
        else showMsg("Failed!", "error");
    };

    const blockUser = async (userId, block) => {
        const token = localStorage.getItem("token");
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/${userId}/${block ? "block" : "unblock"}`,
            { method: "PUT", headers: { Authorization: `Bearer ${token}` } }
        );
        if (res.ok) { showMsg(`User ${block ? "blocked" : "unblocked"}!`, "success"); fetchData(); }
    };

    // Get userId from users list by matching doctor profile
    const getUserId = (doctorProfile) => {
        return doctorProfile.userId;
    };

    const getUserInfo = (userId) => {
        return users.find(u => u.id === userId);
    };

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#F0F4FF", marginBottom: "0.3rem" }}>
                    Manage Doctors
                </h2>
                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)" }}>
                    Verify, block or delete doctor accounts
                </p>
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

            {loading ? (
                <p style={{ color: "rgba(240,244,255,0.4)" }}>Loading...</p>
            ) : doctors.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "rgba(240,244,255,0.3)" }}>
                    <div style={{ fontSize: 48, marginBottom: "1rem" }}>👨‍⚕️</div>
                    <p>No doctors found</p>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    {doctors.map((doc) => {
                        const user = getUserInfo(doc.userId);
                        return (
                            <div key={doc.id} style={{
                                background: "rgba(255,255,255,0.02)",
                                border: "0.5px solid rgba(201,168,76,0.15)",
                                borderRadius: 14, padding: "1.2rem",
                                display: "flex", alignItems: "center",
                                justifyContent: "space-between", flexWrap: "wrap", gap: "1rem"
                            }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                    <div style={{
                                        width: 48, height: 48, borderRadius: "50%",
                                        background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 18, fontWeight: 700, color: "#0A1628", overflow: "hidden"
                                    }}>
                                        {doc.profilePhoto ? (
                                            <img src={`${process.env.NEXT_PUBLIC_API_URL}${doc.profilePhoto}`}
                                                 style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="doc" />
                                        ) : user?.name?.charAt(0) || "D"}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: 15, color: "#F0F4FF", fontWeight: 500 }}>
                                            {user?.name || "Doctor"}
                                        </div>
                                        <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>
                                            {user?.email || ""} · {doc.specialization || "Specialist"}
                                        </div>
                                        <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>
                                            🏥 {doc.clinicName || "No clinic"} · 📞 {doc.phone || "No phone"}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", alignItems: "center" }}>
                                    {doc.isVerified ? (
                                        <span style={{
                                            background: "rgba(29,158,117,0.1)", color: "#5DCAA5",
                                            border: "0.5px solid rgba(29,158,117,0.3)",
                                            padding: "4px 12px", borderRadius: 20, fontSize: 12
                                        }}>✅ Verified</span>
                                    ) : (
                                        <button onClick={() => verifyDoctor(doc.id)} style={{
                                            background: "rgba(0,212,255,0.1)", color: "#00D4FF",
                                            border: "0.5px solid rgba(0,212,255,0.3)",
                                            padding: "6px 14px", borderRadius: 8, fontSize: 12,
                                            cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                                        }}>✓ Verify</button>
                                    )}

                                    {user && (
                                        <>
                                            <button onClick={() => blockUser(user.id, !user.isBlocked)} style={{
                                                background: user.isBlocked ? "rgba(29,158,117,0.1)" : "rgba(239,159,39,0.1)",
                                                color: user.isBlocked ? "#5DCAA5" : "#EF9F27",
                                                border: `0.5px solid ${user.isBlocked ? "rgba(29,158,117,0.3)" : "rgba(239,159,39,0.3)"}`,
                                                padding: "6px 14px", borderRadius: 8, fontSize: 12,
                                                cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                                            }}>{user.isBlocked ? "🔓 Unblock" : "🔒 Block"}</button>

                                            <button onClick={() => deleteUser(user.id)} style={{
                                                background: "rgba(226,75,74,0.1)", color: "#F09595",
                                                border: "0.5px solid rgba(226,75,74,0.3)",
                                                padding: "6px 14px", borderRadius: 8, fontSize: 12,
                                                cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                                            }}>🗑 Delete</button>
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