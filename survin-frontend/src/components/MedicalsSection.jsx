"use client";
import { useState, useEffect } from "react";

export default function MedicalsSection() {
    const [medicals, setMedicals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        fetch(process.env.NEXT_PUBLIC_API_URL + "/api/medicals")
            .then(function(r) { return r.json(); })
            .then(function(data) {
                setMedicals(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(function() { setLoading(false); });
    }, []);

    if (loading || medicals.length === 0) return null;

    const displayed = showAll ? medicals : medicals.slice(0, 3);

    return (
        <section className="sec-pad" id="medicals" style={{ position: "relative" }}>
            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, transparent, rgba(29,158,117,0.03), transparent)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{
                    display: "flex", justifyContent: "space-between",
                    alignItems: "flex-end", flexWrap: "wrap",
                    gap: "1rem", marginBottom: "3rem"
                }}>
                    <div>
                        <div className="sec-tag">Healthcare Network</div>
                        <h2 className="sec-title" style={{ marginBottom: "0.5rem" }}>
                            Affiliated <span className="gold-text">Medical Stores</span>
                        </h2>
                        <p className="sec-sub">
                            Trusted medical stores partnered with Survin Healthcare
                        </p>
                    </div>

                    <button
                        onClick={function() { setShowAll(function(p) { return !p; }); }}
                        className="btn-outline"
                        style={{ whiteSpace: "nowrap" }}
                    >
                        {showAll ? "Show Less" : "Check Affiliated Ties →"}
                    </button>
                </div>

                <div style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                    gap: "1.5rem"
                }}>
                    {displayed.map(function(store) {
                        return <MedicalCard key={store.id} store={store} />;
                    })}
                </div>

                {medicals.length > 3 && (
                    <div style={{ textAlign: "center", marginTop: "2rem" }}>
                        <button
                            onClick={function() { setShowAll(function(p) { return !p; }); }}
                            style={{
                                background: "transparent", color: "#C9A84C",
                                border: "1px solid rgba(201,168,76,0.4)",
                                padding: "12px 32px", borderRadius: 8,
                                fontSize: 14, cursor: "pointer",
                                fontFamily: "'Outfit',sans-serif"
                            }}
                        >
                            {showAll ? "Show Less ↑" : "View All " + medicals.length + " Medical Stores ↓"}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}

function MedicalCard({ store: s }) {
    const [hovered, setHovered] = useState(false);

    const waText = "Hello " + (s.name || "") + ", I would like to enquire about medicines.";
    const waHref = "https://wa.me/" + (s.whatsapp || "") + "?text=" + encodeURIComponent(waText);

    return (
        <div
            onMouseEnter={function() { setHovered(true); }}
            onMouseLeave={function() { setHovered(false); }}
            style={{
                background: hovered ? "rgba(29,158,117,0.05)" : "rgba(255,255,255,0.02)",
                border: "0.5px solid " + (hovered ? "rgba(29,158,117,0.4)" : "rgba(201,168,76,0.15)"),
                borderRadius: 16, padding: "1.5rem",
                transition: "all 0.3s",
                transform: hovered ? "translateY(-5px)" : "translateY(0)",
                boxShadow: hovered ? "0 15px 30px rgba(29,158,117,0.08)" : "none"
            }}
        >
            {/* HEADER */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "1rem" }}>
                <div style={{
                    width: 44, height: 44, borderRadius: 10,
                    background: "linear-gradient(135deg,rgba(29,158,117,0.2),rgba(29,158,117,0.05))",
                    border: "0.5px solid rgba(29,158,117,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 20, flexShrink: 0
                }}>🏪</div>
                <div>
                    <div style={{ fontSize: 16, color: "#F0F4FF", fontWeight: 600, marginBottom: 2 }}>
                        {s.name}
                    </div>
                    {s.isVerified && (
                        <span style={{
                            background: "rgba(29,158,117,0.1)", color: "#5DCAA5",
                            border: "0.5px solid rgba(29,158,117,0.3)",
                            padding: "2px 10px", borderRadius: 20, fontSize: 11
                        }}>✅ Verified Partner</span>
                    )}
                </div>
            </div>

            {/* INFO */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1rem" }}>
                {s.address && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <span style={{ fontSize: 13, flexShrink: 0 }}>📍</span>
                        <span style={{ fontSize: 13, color: "rgba(240,244,255,0.6)", lineHeight: 1.5 }}>
              {s.address}
            </span>
                    </div>
                )}
                {s.openTime && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <span style={{ fontSize: 13 }}>🕐</span>
                        <span style={{ fontSize: 13, color: "rgba(240,244,255,0.6)" }}>
              {s.openTime} — {s.closeTime}
            </span>
                    </div>
                )}
                {s.email && (
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                        <span style={{ fontSize: 13 }}>📧</span>
                        <span style={{ fontSize: 13, color: "rgba(240,244,255,0.6)" }}>{s.email}</span>
                    </div>
                )}
            </div>

            {/* BUTTONS */}
            <div style={{ display: "flex", gap: "0.6rem" }}>
                {s.phone && (
                    <a href={"tel:" + s.phone} style={{
                        flex: 1,
                        background: "rgba(0,212,255,0.08)", color: "#00D4FF",
                        border: "0.5px solid rgba(0,212,255,0.25)",
                        padding: "9px", borderRadius: 8, fontSize: 13,
                        textDecoration: "none", textAlign: "center"
                    }}>📞 Call</a>
                )}
                {s.whatsapp && (
                    <a href={waHref} target="_blank" rel="noreferrer" style={{
                        flex: 1,
                        background: "rgba(37,211,102,0.08)", color: "#25D366",
                        border: "0.5px solid rgba(37,211,102,0.25)",
                        padding: "9px", borderRadius: 8, fontSize: 13,
                        textDecoration: "none", textAlign: "center"
                    }}>💬 WhatsApp</a>
                )}
                {s.email && (
                    <a href={"mailto:" + s.email} style={{
                        flex: 1,
                        background: "rgba(201,168,76,0.08)", color: "#C9A84C",
                        border: "0.5px solid rgba(201,168,76,0.25)",
                        padding: "9px", borderRadius: 8, fontSize: 13,
                        textDecoration: "none", textAlign: "center"
                    }}>📧 Email</a>
                )}
            </div>
        </div>
    );
}