"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [form, setForm] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(form),
                }
            );

            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Login failed");

            // ✅ Pehle purana session clear karo
            localStorage.clear();

            // ✅ Naya token save karo
            localStorage.setItem("token", data.token);

            // ✅ Token decode karo
            const payload = JSON.parse(atob(data.token.split(".")[1]));
            const role = (payload.role || "").toUpperCase().trim();
            const userId = payload.userId || payload.sub;

            // ✅ Role aur userId bhi save karo
            localStorage.setItem("role", role);
            localStorage.setItem("userId", userId);

            console.log("LOGIN SUCCESS:", { role, userId });

            // ✅ Role ke hisaab se redirect
            if (role === "DOCTOR") router.push("/dashboard/doctor");
            else if (role === "PATIENT") router.push("/dashboard/patient");
            else if (role === "ADMIN") router.push("/dashboard/admin");
            else if (role === "MEDICAL_STORE") router.push("/dashboard/store");
            else router.push("/");

        } catch (err) {
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh", background: "var(--navy)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: "2rem", position: "relative", overflow: "hidden"
        }}>
            <div style={{
                position: "fixed", width: 400, height: 400,
                background: "rgba(201,168,76,0.06)", borderRadius: "50%",
                filter: "blur(80px)", top: -100, right: -100, pointerEvents: "none"
            }} />
            <div style={{
                position: "fixed", width: 300, height: 300,
                background: "rgba(0,100,200,0.08)", borderRadius: "50%",
                filter: "blur(80px)", bottom: 0, left: -100, pointerEvents: "none"
            }} />

            <div style={{ width: "100%", maxWidth: 440, position: "relative", zIndex: 1 }}>

                {/* LOGO */}
                <div style={{ textAlign: "center", marginBottom: "2rem" }}>
                    <Link href="/" style={{ textDecoration: "none" }}>
                        <div style={{
                            width: 52, height: 52,
                            background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                            borderRadius: 12, display: "flex",
                            alignItems: "center", justifyContent: "center",
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
                    }}>Welcome Back</h1>
                    <p style={{ fontSize: 14, color: "rgba(240,244,255,0.5)" }}>
                        Sign in to your Survin Healthcare account
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
                            fontSize: 14, color: "#F09595", marginBottom: "1.5rem"
                        }}>{error}</div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleLogin}>
                        <div style={{ marginBottom: "1.2rem" }}>
                            <label style={{
                                fontSize: 12, color: "rgba(240,244,255,0.5)",
                                display: "block", marginBottom: 6
                            }}>Email Address</label>
                            <input className="inp" type="email"
                                   placeholder="rahul@gmail.com"
                                   value={form.email}
                                   onChange={e => setForm({ ...form, email: e.target.value })}
                                   required />
                        </div>
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{
                                fontSize: 12, color: "rgba(240,244,255,0.5)",
                                display: "block", marginBottom: 6
                            }}>Password</label>
                            <input className="inp" type="password"
                                   placeholder="••••••••"
                                   value={form.password}
                                   onChange={e => setForm({ ...form, password: e.target.value })}
                                   required />
                        </div>
                        <button type="submit" disabled={loading} style={{
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
                            {loading ? "Signing in..." : "Sign In"}
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

                    <p style={{ textAlign: "center", fontSize: 14, color: "rgba(240,244,255,0.5)" }}>
                        Don't have an account?{" "}
                        <Link href="/register" style={{ color: "#C9A84C", textDecoration: "none", fontWeight: 500 }}>
                            Register here
                        </Link>
                    </p>
                </div>

                <p style={{ textAlign: "center", marginTop: "1.5rem", fontSize: 13 }}>
                    <Link href="/" style={{ color: "rgba(240,244,255,0.4)", textDecoration: "none" }}>
                        ← Back to Home
                    </Link>
                </p>
            </div>
        </div>
    );
}