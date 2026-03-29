"use client";
import { useState, useEffect } from "react";

export default function MedicinesPage() {
    const [medicines, setMedicines] = useState([]);
    const [medicals, setMedicals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);
    const [message, setMessage] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        Promise.all([
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicines`)
                .then(r => r.json())
                .catch(() => []),
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/medicals`)
                .then(r => r.json())
                .catch(() => []),
        ]).then(([meds, stores]) => {
            setMedicines(Array.isArray(meds) ? meds : []);
            setMedicals(Array.isArray(stores) ? stores : []);
            setLoading(false);
        });
    }, []);

    const filteredMeds = medicines.filter(m =>
        m.name?.toLowerCase().includes(search.toLowerCase()) ||
        m.category?.toLowerCase().includes(search.toLowerCase())
    );

    // ✅ WhatsApp link directly generate karo
    const openWhatsApp = () => {
        if (!selectedMedicine) {
            alert("Please select a medicine first!");
            return;
        }
        if (!selectedStore) {
            alert("Please select a medical store!");
            return;
        }
        if (!message.trim()) {
            alert("Please write a message!");
            return;
        }

        const store = medicals.find(s => s.id === selectedStore);
        if (!store?.whatsapp) {
            alert("This store has no WhatsApp number!");
            return;
        }

        // ✅ WhatsApp message build karo
        const fullMessage = `Hello ${store.name}! 👋

I would like to enquire about:
💊 Medicine: ${selectedMedicine.name}
📦 Quantity: ${quantity}
${selectedMedicine.requiresPrescription ? "📋 I have a prescription.\n" : ""}
Message: ${message}

Please let me know the availability and price.
Thank you!`;

        // ✅ WhatsApp URL generate karo
        const whatsappNumber = store.whatsapp.replace(/[^0-9]/g, "");
        const encodedMessage = encodeURIComponent(fullMessage);
        const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

        // ✅ Seedha open karo
        window.open(whatsappUrl, "_blank");
    };

    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h2 style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 32, color: "#F0F4FF", marginBottom: "0.3rem"
                }}>Medicines & Stores</h2>
                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)" }}>
                    Search medicines and enquire at nearby medical stores via WhatsApp
                </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>

                {/* LEFT — MEDICINES LIST */}
                <div>
                    <h3 style={{
                        fontFamily: "'Cormorant Garamond',serif",
                        fontSize: 22, color: "#F0F4FF", marginBottom: "1rem"
                    }}>Available Medicines</h3>

                    <input className="inp"
                           placeholder="🔍 Search medicines or category..."
                           value={search}
                           onChange={e => setSearch(e.target.value)}
                           style={{ marginBottom: "1rem" }} />

                    {loading ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{
                                    background: "rgba(255,255,255,0.02)",
                                    border: "0.5px solid rgba(201,168,76,0.1)",
                                    borderRadius: 12, height: 70
                                }} />
                            ))}
                        </div>
                    ) : filteredMeds.length === 0 ? (
                        <div style={{ textAlign: "center", padding: "3rem", color: "rgba(240,244,255,0.3)" }}>
                            <div style={{ fontSize: 40, marginBottom: "0.5rem" }}>💊</div>
                            <p>No medicines found</p>
                        </div>
                    ) : (
                        filteredMeds.map((m) => {
                            const isSelected = selectedMedicine?.id === m.id;
                            return (
                                <div key={m.id}
                                     onClick={() => {
                                         setSelectedMedicine(m);
                                         setMessage(`Is ${m.name} available?`);
                                     }}
                                     style={{
                                         background: isSelected
                                             ? "rgba(201,168,76,0.08)"
                                             : "rgba(255,255,255,0.02)",
                                         border: isSelected
                                             ? "1px solid rgba(201,168,76,0.5)"
                                             : "0.5px solid rgba(201,168,76,0.15)",
                                         borderRadius: 12, padding: "1rem",
                                         marginBottom: "0.8rem",
                                         display: "flex", alignItems: "center", gap: "1rem",
                                         cursor: "pointer", transition: "all 0.2s"
                                     }}
                                     onMouseEnter={e => {
                                         if (!isSelected) e.currentTarget.style.borderColor = "rgba(201,168,76,0.35)";
                                     }}
                                     onMouseLeave={e => {
                                         if (!isSelected) e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
                                     }}
                                >
                                    <div style={{
                                        width: 44, height: 44, borderRadius: 10,
                                        background: "rgba(201,168,76,0.1)",
                                        display: "flex", alignItems: "center",
                                        justifyContent: "center", fontSize: 20, flexShrink: 0
                                    }}>💊</div>

                                    <div style={{ flex: 1 }}>
                                        <div style={{ fontSize: 14, color: "#F0F4FF", fontWeight: 500 }}>
                                            {m.name}
                                        </div>
                                        <div style={{ display: "flex", gap: "0.5rem", marginTop: 4, flexWrap: "wrap" }}>
                                            {m.category && (
                                                <span style={{
                                                    background: "rgba(0,212,255,0.08)", color: "#00D4FF",
                                                    border: "0.5px solid rgba(0,212,255,0.2)",
                                                    padding: "2px 8px", borderRadius: 12, fontSize: 11
                                                }}>{m.category}</span>
                                            )}
                                            {m.requiresPrescription && (
                                                <span style={{
                                                    background: "rgba(239,159,39,0.1)", color: "#EF9F27",
                                                    border: "0.5px solid rgba(239,159,39,0.3)",
                                                    padding: "2px 8px", borderRadius: 12, fontSize: 11
                                                }}>📋 Prescription Required</span>
                                            )}
                                            {m.price > 0 && (
                                                <span style={{
                                                    background: "rgba(29,158,117,0.1)", color: "#5DCAA5",
                                                    border: "0.5px solid rgba(29,158,117,0.2)",
                                                    padding: "2px 8px", borderRadius: 12, fontSize: 11
                                                }}>₹{m.price}</span>
                                            )}
                                        </div>
                                    </div>

                                    {isSelected && (
                                        <span style={{
                                            background: "rgba(201,168,76,0.2)", color: "#C9A84C",
                                            padding: "3px 10px", borderRadius: 20, fontSize: 11,
                                            flexShrink: 0
                                        }}>✓ Selected</span>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>

                {/* RIGHT — ENQUIRY + STORES */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>

                    {/* ENQUIRY FORM */}
                    <div style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(201,168,76,0.2)",
                        borderRadius: 16, padding: "1.5rem"
                    }}>
                        <h3 style={{
                            fontFamily: "'Cormorant Garamond',serif",
                            fontSize: 22, color: "#F0F4FF", marginBottom: "1.2rem"
                        }}>💬 WhatsApp Enquiry</h3>

                        {/* Selected Medicine Preview */}
                        {selectedMedicine ? (
                            <div style={{
                                background: "rgba(201,168,76,0.08)",
                                border: "0.5px solid rgba(201,168,76,0.3)",
                                borderRadius: 10, padding: "0.8rem",
                                marginBottom: "1rem",
                                display: "flex", justifyContent: "space-between", alignItems: "center"
                            }}>
                                <div>
                                    <div style={{ fontSize: 13, color: "#C9A84C", marginBottom: 2 }}>
                                        Selected Medicine
                                    </div>
                                    <div style={{ fontSize: 15, color: "#F0F4FF", fontWeight: 500 }}>
                                        💊 {selectedMedicine.name}
                                    </div>
                                </div>
                                <button onClick={() => setSelectedMedicine(null)} style={{
                                    background: "transparent", color: "rgba(240,244,255,0.4)",
                                    border: "none", cursor: "pointer", fontSize: 18
                                }}>✕</button>
                            </div>
                        ) : (
                            <div style={{
                                background: "rgba(239,159,39,0.05)",
                                border: "0.5px solid rgba(239,159,39,0.2)",
                                borderRadius: 10, padding: "0.8rem",
                                marginBottom: "1rem", fontSize: 13,
                                color: "#EF9F27"
                            }}>
                                ← Left side se medicine select karo
                            </div>
                        )}

                        {/* Store Select */}
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{
                                fontSize: 12, color: "rgba(240,244,255,0.5)",
                                display: "block", marginBottom: 6
                            }}>Select Medical Store *</label>
                            <select className="inp"
                                    value={selectedStore || ""}
                                    onChange={e => setSelectedStore(e.target.value)}>
                                <option value="">Choose a store...</option>
                                {medicals.map(s => (
                                    <option key={s.id} value={s.id}>
                                        {s.name} — {s.address}
                                        {!s.whatsapp ? " (No WhatsApp)" : ""}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity */}
                        <div style={{ marginBottom: "1rem" }}>
                            <label style={{
                                fontSize: 12, color: "rgba(240,244,255,0.5)",
                                display: "block", marginBottom: 6
                            }}>Quantity</label>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.8rem" }}>
                                <button onClick={() => setQuantity(q => Math.max(1, q - 1))} style={{
                                    width: 36, height: 36,
                                    background: "rgba(255,255,255,0.05)",
                                    border: "0.5px solid rgba(255,255,255,0.1)",
                                    borderRadius: 8, color: "#F0F4FF",
                                    fontSize: 18, cursor: "pointer"
                                }}>−</button>
                                <span style={{
                                    fontSize: 18, color: "#F0F4FF",
                                    fontWeight: 600, minWidth: 30, textAlign: "center"
                                }}>{quantity}</span>
                                <button onClick={() => setQuantity(q => q + 1)} style={{
                                    width: 36, height: 36,
                                    background: "rgba(255,255,255,0.05)",
                                    border: "0.5px solid rgba(255,255,255,0.1)",
                                    borderRadius: 8, color: "#F0F4FF",
                                    fontSize: 18, cursor: "pointer"
                                }}>+</button>
                            </div>
                        </div>

                        {/* Message */}
                        <div style={{ marginBottom: "1.5rem" }}>
                            <label style={{
                                fontSize: 12, color: "rgba(240,244,255,0.5)",
                                display: "block", marginBottom: 6
                            }}>Message *</label>
                            <textarea className="inp"
                                      placeholder="Is this medicine available? What is the price?"
                                      value={message}
                                      onChange={e => setMessage(e.target.value)}
                                      style={{ height: 80, resize: "none" }} />
                        </div>

                        {/* WhatsApp Button */}
                        <button onClick={openWhatsApp} style={{
                            width: "100%",
                            background: "linear-gradient(135deg,#25D366,#128C7E)",
                            color: "#FFFFFF", border: "none",
                            padding: "14px", borderRadius: 8,
                            fontSize: 15, fontWeight: 600,
                            cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                            display: "flex", alignItems: "center",
                            justifyContent: "center", gap: "0.5rem"
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="white">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                            </svg>
                            Send Enquiry via WhatsApp
                        </button>

                        {selectedMedicine?.requiresPrescription && (
                            <div style={{
                                marginTop: "0.8rem",
                                background: "rgba(239,159,39,0.08)",
                                border: "0.5px solid rgba(239,159,39,0.2)",
                                borderRadius: 8, padding: "0.7rem",
                                fontSize: 12, color: "#EF9F27"
                            }}>
                                📋 Note: This medicine requires a prescription.
                                Please have it ready when you visit the store.
                            </div>
                        )}
                    </div>

                    {/* NEARBY STORES */}
                    <div>
                        <h3 style={{
                            fontFamily: "'Cormorant Garamond',serif",
                            fontSize: 22, color: "#F0F4FF", marginBottom: "1rem"
                        }}>🏪 Nearby Medical Stores</h3>

                        {medicals.length === 0 ? (
                            <div style={{
                                textAlign: "center", padding: "2rem",
                                color: "rgba(240,244,255,0.3)"
                            }}>
                                <div style={{ fontSize: 36, marginBottom: "0.5rem" }}>🏪</div>
                                <p style={{ fontSize: 13 }}>No stores available</p>
                            </div>
                        ) : (
                            medicals.map(s => (
                                <div key={s.id} style={{
                                    background: selectedStore === s.id
                                        ? "rgba(201,168,76,0.06)"
                                        : "rgba(255,255,255,0.02)",
                                    border: selectedStore === s.id
                                        ? "0.5px solid rgba(201,168,76,0.4)"
                                        : "0.5px solid rgba(255,255,255,0.06)",
                                    borderRadius: 12, padding: "1rem",
                                    marginBottom: "0.8rem", cursor: "pointer",
                                    transition: "all 0.2s"
                                }}
                                     onClick={() => setSelectedStore(s.id)}
                                     onMouseEnter={e => {
                                         if (selectedStore !== s.id)
                                             e.currentTarget.style.borderColor = "rgba(201,168,76,0.25)";
                                     }}
                                     onMouseLeave={e => {
                                         if (selectedStore !== s.id)
                                             e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                                     }}
                                >
                                    <div style={{
                                        display: "flex", justifyContent: "space-between",
                                        alignItems: "flex-start", flexWrap: "wrap", gap: "0.5rem"
                                    }}>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontSize: 15, color: "#F0F4FF",
                                                fontWeight: 500, marginBottom: "0.3rem"
                                            }}>🏪 {s.name}</div>
                                            <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>
                                                📍 {s.address}
                                            </div>
                                            {s.openTime && (
                                                <div style={{ fontSize: 12, color: "rgba(240,244,255,0.4)", marginTop: 2 }}>
                                                    🕐 {s.openTime} — {s.closeTime}
                                                </div>
                                            )}
                                        </div>

                                        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                            {s.isVerified && (
                                                <span style={{
                                                    background: "rgba(29,158,117,0.1)", color: "#5DCAA5",
                                                    border: "0.5px solid rgba(29,158,117,0.3)",
                                                    padding: "3px 10px", borderRadius: 20, fontSize: 11
                                                }}>✅ Verified</span>
                                            )}
                                            {s.phone && (
                                                <a href={`tel:${s.phone}`}
                                                   onClick={e => e.stopPropagation()}
                                                   style={{
                                                       background: "rgba(0,212,255,0.1)", color: "#00D4FF",
                                                       border: "0.5px solid rgba(0,212,255,0.3)",
                                                       padding: "4px 12px", borderRadius: 20,
                                                       fontSize: 12, textDecoration: "none"
                                                   }}>📞 Call</a>
                                            )}
                                            {s.whatsapp && (
                                                <a href={`https://wa.me/${s.whatsapp}`}
                                                   target="_blank"
                                                   onClick={e => e.stopPropagation()}
                                                   style={{
                                                       background: "rgba(37,211,102,0.1)", color: "#25D366",
                                                       border: "0.5px solid rgba(37,211,102,0.3)",
                                                       padding: "4px 12px", borderRadius: 20,
                                                       fontSize: 12, textDecoration: "none"
                                                   }}>💬 WA</a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}