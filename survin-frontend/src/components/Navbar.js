"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import useBreakpoint from "@/hooks/useBreakpoint";

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [activeSection, setActiveSection] = useState("");
    const { isMobile, isTablet } = useBreakpoint();
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
            const sections = ["doctors", "medicines", "medicals", "contact"];
            for (const id of sections) {
                const el = document.getElementById(id);
                if (el) {
                    const rect = el.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        setActiveSection(id);
                        return;
                    }
                }
            }
            setActiveSection("");
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id) => {
        setMenuOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    // ✅ Home button fix
    const handleHome = () => {
        setMenuOpen(false);
        if (window.location.pathname === "/") {
            window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            router.push("/");
        }
    };

    const links = [
        { label: "Home", type: "home" },
        { label: "Doctors", id: "doctors", type: "scroll" },
        { label: "Medicines", id: "medicines", type: "scroll" },
        { label: "Medical Stores", id: "medicals", type: "scroll" },
        { label: "Contact", id: "contact", type: "scroll" },
    ];

    const linkStyle = (isActive) => ({
        background: isActive ? "rgba(201,168,76,0.12)" : "transparent",
        border: "none",
        color: isActive ? "#C9A84C" : "rgba(240,244,255,0.65)",
        padding: "8px 16px",
        borderRadius: 8,
        fontSize: 13,
        cursor: "pointer",
        fontFamily: "'Outfit', sans-serif",
        letterSpacing: "0.3px",
        transition: "all 0.2s",
        position: "relative",
        display: "inline-block",
        textDecoration: "none"
    });

    return (
        <>
            <nav style={{
                position: "fixed", top: 0, width: "100%", zIndex: 1000,
                padding: isMobile ? "0.8rem 1.2rem" : "0 3rem",
                display: "flex", alignItems: "center",
                justifyContent: "space-between",
                height: isMobile ? "auto" : 68,
                backdropFilter: "blur(24px)",
                background: scrolled ? "rgba(10,22,40,0.97)" : "rgba(10,22,40,0.6)",
                borderBottom: scrolled
                    ? "0.5px solid rgba(201,168,76,0.3)"
                    : "0.5px solid rgba(201,168,76,0.1)",
                transition: "all 0.3s",
                boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.3)" : "none"
            }}>

                {/* ✅ LOGO */}
                <button
                    onClick={handleHome}
                    style={{
                        display: "flex", alignItems: "center",
                        gap: "0.8rem", background: "none",
                        border: "none", cursor: "pointer",
                        padding: 0, flexShrink: 0
                    }}
                >
                    {/* ✅ Logo Image */}
                    <div style={{
                        width: 42, height: 42,
                        borderRadius: 10,
                        overflow: "hidden",
                        border: "1px solid rgba(201,168,76,0.3)",
                        boxShadow: "0 0 16px rgba(201,168,76,0.2)",
                        display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0,
                        background: "linear-gradient(135deg,#C9A84C,#E8C97A)"
                    }}>
                        <Image
                            src="/logo.png"
                            alt="Survin Healthcare Logo"
                            width={42}
                            height={42}
                            style={{ objectFit: "cover", width: "100%", height: "100%" }}
                            onError={function(e) {
                                // ✅ Agar image load na ho toh fallback
                                e.target.style.display = "none";
                            }}
                        />
                    </div>

                    <div style={{ textAlign: "left" }}>
                        <div style={{
                            fontFamily: "'Cormorant Garamond', serif",
                            fontSize: isMobile ? 16 : 19,
                            fontWeight: 700, lineHeight: 1.1,
                            background: "linear-gradient(135deg,#C9A84C,#F5DFA0)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent"
                        }}>Survin Healthcare</div>
                        {!isMobile && (
                            <div style={{
                                fontSize: 9, color: "rgba(201,168,76,0.5)",
                                letterSpacing: "1.5px", textTransform: "uppercase"
                            }}>Premium · Professional · Compassionate</div>
                        )}
                    </div>
                </button>

                {/* DESKTOP LINKS */}
                {!isMobile && !isTablet && (
                    <ul style={{
                        display: "flex", gap: "0.2rem",
                        listStyle: "none", alignItems: "center"
                    }}>
                        {links.map((item) => {
                            const isActive = item.id ? activeSection === item.id : false;
                            return (
                                <li key={item.label}>
                                    <button
                                        onClick={() => {
                                            if (item.type === "home") handleHome();
                                            else scrollToSection(item.id);
                                        }}
                                        style={linkStyle(isActive)}
                                        onMouseEnter={function(e) {
                                            e.currentTarget.style.color = "#C9A84C";
                                            e.currentTarget.style.background = "rgba(201,168,76,0.08)";
                                        }}
                                        onMouseLeave={function(e) {
                                            e.currentTarget.style.color = isActive
                                                ? "#C9A84C"
                                                : "rgba(240,244,255,0.65)";
                                            e.currentTarget.style.background = isActive
                                                ? "rgba(201,168,76,0.12)"
                                                : "transparent";
                                        }}
                                    >
                                        {item.label}
                                        {isActive && (
                                            <div style={{
                                                position: "absolute",
                                                bottom: 2, left: "50%",
                                                transform: "translateX(-50%)",
                                                width: 4, height: 4,
                                                background: "#C9A84C",
                                                borderRadius: "50%"
                                            }} />
                                        )}
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                )}

                {/* DESKTOP BUTTONS */}
                {!isMobile && !isTablet && (
                    <div style={{ display: "flex", gap: "0.7rem", alignItems: "center" }}>
                        <button
                            onClick={() => router.push("/login")}
                            style={{
                                background: "transparent", color: "#C9A84C",
                                border: "1px solid rgba(201,168,76,0.35)",
                                padding: "8px 22px", borderRadius: 8,
                                fontSize: 13, cursor: "pointer",
                                fontFamily: "'Outfit', sans-serif",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={function(e) {
                                e.currentTarget.style.background = "rgba(201,168,76,0.08)";
                                e.currentTarget.style.borderColor = "rgba(201,168,76,0.6)";
                            }}
                            onMouseLeave={function(e) {
                                e.currentTarget.style.background = "transparent";
                                e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
                            }}
                        >Login</button>

                        <button
                            onClick={() => router.push("/register")}
                            style={{
                                background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                color: "#0A1628", border: "none",
                                padding: "9px 22px", borderRadius: 8,
                                fontSize: 13, fontWeight: 600, cursor: "pointer",
                                fontFamily: "'Outfit', sans-serif",
                                boxShadow: "0 4px 15px rgba(201,168,76,0.25)",
                                transition: "all 0.2s"
                            }}
                            onMouseEnter={function(e) {
                                e.currentTarget.style.transform = "translateY(-2px)";
                                e.currentTarget.style.boxShadow = "0 6px 20px rgba(201,168,76,0.4)";
                            }}
                            onMouseLeave={function(e) {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 15px rgba(201,168,76,0.25)";
                            }}
                        >Get Started →</button>
                    </div>
                )}

                {/* MOBILE HAMBURGER */}
                {(isMobile || isTablet) && (
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        style={{
                            background: menuOpen
                                ? "rgba(201,168,76,0.15)"
                                : "rgba(201,168,76,0.08)",
                            border: "0.5px solid rgba(201,168,76,0.3)",
                            borderRadius: 8, padding: "8px 12px",
                            cursor: "pointer", color: "#C9A84C",
                            fontSize: 18, transition: "all 0.2s"
                        }}
                    >{menuOpen ? "✕" : "☰"}</button>
                )}
            </nav>

            {/* MOBILE MENU */}
            {(isMobile || isTablet) && menuOpen && (
                <div style={{
                    position: "fixed",
                    top: isMobile ? 62 : 68,
                    left: 0, right: 0,
                    background: "rgba(10,22,40,0.99)",
                    backdropFilter: "blur(24px)",
                    borderBottom: "0.5px solid rgba(201,168,76,0.2)",
                    zIndex: 999,
                    padding: "1.5rem",
                    display: "flex", flexDirection: "column",
                    gap: "0.3rem",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.5)"
                }}>
                    {links.map((item) => (
                        <button
                            key={item.label}
                            onClick={() => {
                                if (item.type === "home") handleHome();
                                else scrollToSection(item.id);
                            }}
                            style={{
                                background: "transparent", border: "none",
                                borderBottom: "0.5px solid rgba(201,168,76,0.08)",
                                color: "rgba(240,244,255,0.8)",
                                padding: "0.9rem 0.5rem",
                                fontSize: 16, cursor: "pointer",
                                fontFamily: "'Outfit', sans-serif",
                                textAlign: "left", transition: "color 0.2s"
                            }}
                            onMouseEnter={function(e) {
                                e.currentTarget.style.color = "#C9A84C";
                            }}
                            onMouseLeave={function(e) {
                                e.currentTarget.style.color = "rgba(240,244,255,0.8)";
                            }}
                        >{item.label}</button>
                    ))}

                    <div style={{ display: "flex", gap: "0.8rem", marginTop: "1rem" }}>
                        <button
                            onClick={() => { router.push("/login"); setMenuOpen(false); }}
                            style={{
                                flex: 1, background: "transparent", color: "#C9A84C",
                                border: "1px solid rgba(201,168,76,0.4)",
                                padding: "12px", borderRadius: 8,
                                fontSize: 14, cursor: "pointer",
                                fontFamily: "'Outfit', sans-serif"
                            }}
                        >Login</button>

                        <button
                            onClick={() => { router.push("/register"); setMenuOpen(false); }}
                            style={{
                                flex: 1,
                                background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                color: "#0A1628", border: "none",
                                padding: "12px", borderRadius: 8,
                                fontSize: 14, fontWeight: 600,
                                cursor: "pointer",
                                fontFamily: "'Outfit', sans-serif"
                            }}
                        >Get Started →</button>
                    </div>
                </div>
            )}
        </>
    );
}
