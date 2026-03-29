"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const [form, setForm] = useState({
        name: "", email: "", phone: "",
        password: "", confirmPassword: "", role: "PATIENT"
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const roles = [
        { value: "PATIENT", label: "Patient", icon: "🧑‍🦽", desc: "Book appointments" },
        { value: "DOCTOR", label: "Doctor", icon: "👨‍⚕️", desc: "Manage patients" },
        { value: "MEDICAL_STORE", label: "Medical Store", icon: "🏪", desc: "Manage medicines" },
    ];

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match!");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters!");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        name: form.name,
                        email: form.email,
                        phone: form.phone,
                        password: form.password,
                        role: form.role,
                    }),
                }
            );

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.message || "Registration failed");
            }

            setSuccess("Account created! Redirecting to login...");
            setTimeout(() => router.push("/login"), 2000);

        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            background: "var(--navy)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "2rem", position: "relative", overflow: "hidden"
        }}>

            {/* ORB GLOWS */}
            <div style={{
                position: "fixed", width: 400, height: 400,
                background: "rgba(201,168,76,0.06)",
                borderRadius: "50%", filter: "blur(80px)",
                top: -100, right: -100, pointerEvents: "none"
            }} />
            <div style={{
                position: "fixed", width: 300, height: 300,
                background: "rgba(0,100,200,0.08)",
                borderRadius: "50%", filter: "blur(80px)",
                bottom: 0, left: -100, pointerEvents: "none"
            }} />

            <div style={{ width: "100%", maxWidth: 500, position: "relative", zIndex: 1 }}>

                {/* LOGO */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <div style={{
                            width: 52, height: 52,
                            background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                            borderRadius: 12,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontWeight: 700, fontSize: 22, color: "#0A1628",
                            fontFamily: "'Cormorant Garamond', serif",
                            margin: "0 auto 1rem"
                        }}>S</div>
                    </Link>
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: 32, fontWeight: 700,
                        background: "linear-gradient(135deg,#C9A84C,#F5DFA0)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        marginBottom: "0.3rem"
                    }}>Create Account</h1>
                    <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)" }}>
                        Join Survin Healthcare today
                    </p>
                </div>

                {/* FORM CARD */}
                <div style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "0.5px solid rgba(201,168,76,0.2)",
                    borderRadius: 20, padding: "2rem"
                }}>

                    {/* ERROR */}
                    {error && (
                        <div style={{
                            background: "rgba(226,75,74,0.1)",
                            border: "0.5px solid rgba(226,75,74,0.3)",
                            borderRadius: 8, padding: "0.8rem 1rem",
                            fontSize: 14, color: "#F09595",
                            marginBottom: "1.5rem"
                        }}>{error}</div>
                    )}

                    {/* SUCCESS */}
                    {success && (
                        <div style={{
                            background: "rgba(29,158,117,0.1)",
                            border: "0.5px solid rgba(29,158,117,0.3)",
                            borderRadius: 8, padding: "0.8rem 1rem",
                            fontSize: 14, color: "#5DCAA5",
                            marginBottom: "1.5rem"
                        }}>{success}</div>
                    )}

                    <form onSubmit={handleRegister}>

                        {/* ROLE SELECTOR */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{
                                fontSize: 12, color: "rgba(240,244,255,0.5)",
                                display: "block", marginBottom: 10, letterSpacing: "0.5px"
                            }}>I am a...</label>
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "0.8rem" }}>
                                {roles.map((r) => (
                                    <div key={r.value}
                                         onClick={() => setForm({ ...form, role: r.value })}
                                         style={{
                                             padding: "1rem 0.5rem", borderRadius: 10, textAlign: "center",
                                             cursor: "pointer", transition: "all 0.2s",
                                             border: form.role === r.value
                                                 ? "1px solid rgba(201,168,76,0.6)"
                                                 : "0.5px solid rgba(255,255,255,0.08)",
                                             background: form.role === r.value
                                                 ? "rgba(201,168,76,0.1)"
                                                 : "rgba(255,255,255,0.02)",
                                         }}>
                                        <div style={{ fontSize: 22, marginBottom: "0.4rem" }}>{r.icon}</div>
                                        <div style={{
                                            fontSize: 13, fontWeight: 500,
                                            color: form.role === r.value ? "#E8C97A" : "#F0F4FF"
                                        }}>{r.label}</div>
                                        <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>{r.desc}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* NAME */}
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>Full Name</label>
                            <input className="inp" type="text" placeholder="Rahul Sharma"
                                   value={form.name}
                                   onChange={e => setForm({ ...form, name: e.target.value })}
                                   required />
                        </div>

                        {/* EMAIL + PHONE */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
                            <div>
                                <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>Email</label>
                                <input className="inp" type="email" placeholder="rahul@gmail.com"
                                       value={form.email}
                                       onChange={e => setForm({ ...form, email: e.target.value })}
                                       required />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>Phone</label>
                                <input className="inp" type="tel" placeholder="9876543210"
                                       value={form.phone}
                                       onChange={e => setForm({ ...form, phone: e.target.value })} />
                            </div>
                        </div>

                        {/* PASSWORD */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
                            <div>
                                <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>Password</label>
                                <input className="inp" type="password" placeholder="••••••••"
                                       value={form.password}
                                       onChange={e => setForm({ ...form, password: e.target.value })}
                                       required />
                            </div>
                            <div>
                                <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>Confirm Password</label>
                                <input className="inp" type="password" placeholder="••••••••"
                                       value={form.confirmPassword}
                                       onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                                       required />
                            </div>
                        </div>

                        {/* SUBMIT */}
                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: "100%",
                                background: loading
                                    ? "rgba(201,168,76,0.5)"
                                    : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                color: "#0A1628", border: "none",
                                padding: "13px", borderRadius: 8,
                                fontSize: 15, fontWeight: 600,
                                cursor: loading ? "not-allowed" : "pointer",
                                fontFamily: "'Outfit', sans-serif"
                            }}>
                            {loading ? "Creating Account..." : "Create Account"}
                        </button>
                    </form>

                    {/* DIVIDER */}
                    <div style={{
                        display: "flex", alignItems: "center",
                        gap: "1rem", margin: "1.5rem 0"
                    }}>
                        <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
                        <span style={{ fontSize: 12, color: "rgba(240,244,255,0.3)" }}>or</span>
                        <div style={{ flex: 1, height: "0.5px", background: "rgba(255,255,255,0.08)" }} />
                    </div>

                    {/* LOGIN LINK */}
                    <p style={{ textAlign: "center", fontSize: 14, color: "rgba(240,244,255,0.5)" }}>
                        Already have an account?{" "}
                        <Link href="/login" style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 500 }}>
                            Sign in
                        </Link>
                    </p>
                </div>

                {/* BACK */}
                <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: 13 }}>
                    <Link href="/" style={{ color: "rgba(240,244,255,0.4)", textDecoration: "none" }}>
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
}
