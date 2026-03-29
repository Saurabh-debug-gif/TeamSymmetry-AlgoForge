"use client";
import { useState, useEffect } from "react";

export default function MedicinesShowcase() {
    const [medicines, setMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");

    useEffect(() => {
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines`)
            .then(r => r.json())
            .then(data => {
                setMedicines(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const categories = [...new Set(medicines.map(m => m.category).filter(Boolean))];

    const filtered = medicines.filter(m => {
        const matchSearch = m.name?.toLowerCase().includes(search.toLowerCase()) ||
            m.manufacturer?.toLowerCase().includes(search.toLowerCase());
        const matchCat = !category || m.category === category;
        return matchSearch && matchCat;
    });

    if (loading || medicines.length === 0) return null;

    return (
        <section className="sec-pad" id="medicines" style={{ position: "relative" }}>

            <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(180deg, transparent, rgba(0,100,200,0.04), transparent)",
                pointerEvents: "none"
            }} />

            <div style={{ position: "relative", zIndex: 1 }}>
                <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                    <div className="sec-tag">Survin Medicines</div>
                    <h2 className="sec-title">
                        Available <span className="gold-text">Medicines</span>
                    </h2>
                    <p className="sec-sub" style={{ margin: "0 auto" }}>
                        Browse our curated list of medicines — enquire directly at affiliated stores
                    </p>
                </div>

                {/* SEARCH + FILTER */}
                <div style={{
                    display: "flex", gap: "1rem",
                    marginBottom: "2rem", flexWrap: "wrap",
                    maxWidth: 700, margin: "0 auto 2rem"
                }}>
                    <input
                        className="inp"
                        placeholder="🔍 Search medicines..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        style={{ flex: 1, minWidth: 200 }}
                    />
                    <select
                        className="inp"
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                        style={{ width: 200 }}
                    >
                        <option value="">All Categories</option>
                        {categories.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>

                {/* CATEGORY CHIPS */}
                {categories.length > 0 && (
                    <div style={{
                        display: "flex", gap: "0.5rem",
                        flexWrap: "wrap", justifyContent: "center",
                        marginBottom: "2rem"
                    }}>
                        <button
                            onClick={() => setCategory("")}
                            style={{
                                padding: "6px 16px", borderRadius: 20, fontSize: 12,
                                cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                                border: !category ? "1px solid #C9A84C" : "0.5px solid rgba(255,255,255,0.1)",
                                background: !category ? "rgba(201,168,76,0.15)" : "transparent",
                                color: !category ? "#C9A84C" : "rgba(240,244,255,0.5)"
                            }}
                        >All</button>
                        {categories.map(c => (
                            <button
                                key={c}
                                onClick={() => setCategory(c)}
                                style={{
                                    padding: "6px 16px", borderRadius: 20, fontSize: 12,
                                    cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                                    border: category === c ? "1px solid #C9A84C" : "0.5px solid rgba(255,255,255,0.1)",
                                    background: category === c ? "rgba(201,168,76,0.15)" : "transparent",
                                    color: category === c ? "#C9A84C" : "rgba(240,244,255,0.5)"
                                }}
                            >{c}</button>
                        ))}
                    </div>
                )}

                {/* MEDICINES GRID */}
                {filtered.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "3rem", color: "rgba(240,244,255,0.3)" }}>
                        <div style={{ fontSize: 48, marginBottom: "1rem" }}>💊</div>
                        <p>No medicines found</p>
                    </div>
                ) : (
                    <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
                        gap: "1.5rem"
                    }}>
                        {filtered.map(m => (
                            <MedicineCard key={m.id} medicine={m} />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}

function MedicineCard({ medicine: m }) {
    const [hovered, setHovered] = useState(false);

    return (
        <div
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                background: hovered ? "rgba(201,168,76,0.06)" : "rgba(255,255,255,0.02)",
                border: `0.5px solid ${hovered ? "rgba(201,168,76,0.4)" : "rgba(201,168,76,0.15)"}`,
                borderRadius: 16,
                padding: "1.5rem",
                transition: "all 0.3s",
                transform: hovered ? "translateY(-6px)" : "translateY(0)",
                boxShadow: hovered ? "0 15px 30px rgba(201,168,76,0.1)" : "none",
                cursor: "default"
            }}
        >
            {/* ICON */}
            <div style={{
                width: 52, height: 52, borderRadius: 12,
                background: "linear-gradient(135deg,rgba(201,168,76,0.2),rgba(201,168,76,0.05))",
                border: "0.5px solid rgba(201,168,76,0.3)",
                display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 24,
                marginBottom: "1rem"
            }}>💊</div>

            {/* NAME */}
            <div style={{
                fontSize: 16, color: "#F0F4FF",
                fontWeight: 600, marginBottom: "0.3rem"
            }}>{m.name}</div>

            {/* BADGES */}
            <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", marginBottom: "0.8rem" }}>
                {m.category && (
                    <span style={{
                        background: "rgba(0,212,255,0.08)", color: "#00D4FF",
                        border: "0.5px solid rgba(0,212,255,0.2)",
                        padding: "2px 10px", borderRadius: 20, fontSize: 11
                    }}>{m.category}</span>
                )}
                {m.requiresPrescription && (
                    <span style={{
                        background: "rgba(239,159,39,0.1)", color: "#EF9F27",
                        border: "0.5px solid rgba(239,159,39,0.3)",
                        padding: "2px 10px", borderRadius: 20, fontSize: 11
                    }}>📋 Rx Required</span>
                )}
            </div>

            {/* DETAILS */}
            {m.manufacturer && (
                <div style={{
                    fontSize: 12, color: "rgba(240,244,255,0.4)",
                    marginBottom: "0.5rem"
                }}>By {m.manufacturer}</div>
            )}

            {m.description && (
                <div style={{
                    fontSize: 13, color: "rgba(240,244,255,0.55)",
                    lineHeight: 1.6, marginBottom: "0.8rem",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                }}>{m.description}</div>
            )}

            {/* PRICE + ACTION */}
            <div style={{
                display: "flex", justifyContent: "space-between",
                alignItems: "center", marginTop: "0.8rem",
                paddingTop: "0.8rem",
                borderTop: "0.5px solid rgba(255,255,255,0.06)"
            }}>
                <div style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 22, fontWeight: 700,
                    color: m.price > 0 ? "#5DCAA5" : "rgba(240,244,255,0.3)"
                }}>
                    {m.price > 0 ? `₹${m.price}` : "Price on request"}
                </div>
                <a href="#medicals" style={{
                    background: "rgba(201,168,76,0.1)", color: "#C9A84C",
                    border: "0.5px solid rgba(201,168,76,0.3)",
                    padding: "6px 14px", borderRadius: 8,
                    fontSize: 12, textDecoration: "none",
                    transition: "all 0.2s"
                }}>Enquire →</a>
            </div>
        </div>
    );
}