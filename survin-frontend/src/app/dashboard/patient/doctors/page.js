"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function FindDoctors() {
    const router = useRouter();
    const [doctors, setDoctors] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [search, setSearch] = useState("");
    const [specialization, setSpecialization] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [availability, setAvailability] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [avgRating, setAvgRating] = useState(0);
    const [bookForm, setBookForm] = useState({ notes: "", patientPhone: "" });
    const [booking, setBooking] = useState(false);
    const [bookMsg, setBookMsg] = useState({ text: "", type: "" });
    const [showBooking, setShowBooking] = useState(false);

    useEffect(() => {
        // ✅ window.location NAHI — router use karo
        // ✅ Layout already role check kar raha hai — yahan dobara mat karo!
        fetchDoctors();
    }, []);

    const fetchDoctors = async () => {
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/doctor/profile/all`
            );
            const data = await res.json();
            const safe = Array.isArray(data) ? data : [];
            setDoctors(safe);
            setFiltered(safe);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = (searchVal, specVal) => {
        let result = [...doctors];
        if (searchVal) {
            result = result.filter(d =>
                d.name?.toLowerCase().includes(searchVal.toLowerCase()) ||
                d.specialization?.toLowerCase().includes(searchVal.toLowerCase()) ||
                d.clinicName?.toLowerCase().includes(searchVal.toLowerCase())
            );
        }
        if (specVal) {
            result = result.filter(d =>
                d.specialization?.toLowerCase().includes(specVal.toLowerCase())
            );
        }
        setFiltered(result);
    };

    const viewDoctorFix = async (doctor) => {
        setSelectedDoctor(doctor);
        setShowBooking(false);
        setBookMsg({ text: "", type: "" });
        try {
            const avRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/doctor/availability/${doctor.id}`
            );
            setAvailability(Array.isArray(await avRes.json()) ? await avRes.json() : []);

            const revRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/doctor/${doctor.id}`
            );
            const revData = await revRes.json();
            setReviews(Array.isArray(revData) ? revData : []);

            const ratingRes = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/doctor/${doctor.id}/rating`
            );
            setAvgRating(await ratingRes.json());
        } catch (err) {
            console.error(err);
        }
    };

    const bookAppointment = async () => {
        if (!bookForm.patientPhone) {
            setBookMsg({ text: "Please enter your phone number!", type: "error" });
            return;
        }

        const token = localStorage.getItem("token");

        if (!token) {
            setBookMsg({ text: "Session expired! Please login again.", type: "error" });
            return;
        }

        // ✅ Token se role check karo — localStorage.role pe depend mat karo
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            const role = (payload.role || "").toUpperCase().trim();
            if (role !== "PATIENT") {
                setBookMsg({ text: "❌ Only patients can book!", type: "error" });
                return;
            }
        } catch {
            setBookMsg({ text: "Invalid session!", type: "error" });
            return;
        }

        if (!selectedDoctor?.id) {
            setBookMsg({ text: "Invalid doctor!", type: "error" });
            return;
        }

        setBooking(true);

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/appointments`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        doctorId: selectedDoctor.id,
                        notes: bookForm.notes,
                        patientPhone: bookForm.patientPhone
                    })
                }
            );

            if (res.ok) {
                setBookMsg({
                    text: "✅ Appointment booked! Doctor will confirm soon.",
                    type: "success"
                });
                setBookForm({ notes: "", patientPhone: "" });
                setShowBooking(false);
            } else {
                const errText = await res.text();
                console.error("Booking failed:", errText);
                setBookMsg({ text: "Booking failed! Please try again.", type: "error" });
            }
        } catch (err) {
            console.error(err);
            setBookMsg({ text: "Network error!", type: "error" });
        } finally {
            setBooking(false);
        }
    };

    const specializations = [...new Set(doctors.map(d => d.specialization).filter(Boolean))];
    const days = ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"];

    // DOCTOR DETAIL VIEW
    if (selectedDoctor) return (
        <div>
            <button onClick={() => setSelectedDoctor(null)} style={{
                background: "transparent", color: "rgba(240,244,255,0.5)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                padding: "8px 16px", borderRadius: 8, fontSize: 13,
                cursor: "pointer", fontFamily: "'Outfit',sans-serif", marginBottom: "1.5rem"
            }}>← Back to Doctors</button>

            <div style={{ display: "grid", gridTemplateColumns: "340px 1fr", gap: "1.5rem" }}>

                {/* LEFT */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                    <div style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(201,168,76,0.2)",
                        borderRadius: 16, overflow: "hidden"
                    }}>
                        <div style={{
                            background: "linear-gradient(135deg,rgba(201,168,76,0.15),rgba(0,100,200,0.1))",
                            padding: "2rem", textAlign: "center"
                        }}>
                            <div style={{
                                width: 88, height: 88, borderRadius: "50%", margin: "0 auto 1rem",
                                background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 30, fontWeight: 700, color: "#0A1628",
                                overflow: "hidden", border: "3px solid rgba(201,168,76,0.4)"
                            }}>
                                {selectedDoctor.profilePhoto ? (
                                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${selectedDoctor.profilePhoto}`}
                                         style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="doc" />
                                ) : selectedDoctor.name?.charAt(0) || "D"}
                            </div>
                            <div style={{ fontSize: 22, color: "#F0F4FF", fontWeight: 500 }}>{selectedDoctor.name}</div>
                            <div style={{ fontSize: 14, color: "#C9A84C", marginTop: 4 }}>{selectedDoctor.specialization}</div>
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.3rem", marginTop: "0.5rem" }}>
                                <span style={{ color: "#EF9F27" }}>★</span>
                                <span style={{ fontSize: 14, color: "#F0F4FF" }}>
                  {avgRating ? Number(avgRating).toFixed(1) : "New"}
                </span>
                                <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>({reviews.length} reviews)</span>
                            </div>
                        </div>

                        <div style={{ padding: "1.2rem" }}>
                            {[
                                { label: "Clinic", val: selectedDoctor.clinicName, icon: "🏥" },
                                { label: "Address", val: selectedDoctor.clinicAddress, icon: "📍" },
                                { label: "Experience", val: selectedDoctor.experienceYears ? `${selectedDoctor.experienceYears} Years` : null, icon: "📅" },
                                { label: "Fee", val: selectedDoctor.consultationFee ? `₹${selectedDoctor.consultationFee}` : null, icon: "💰" },
                                { label: "Languages", val: selectedDoctor.languages?.join(", "), icon: "🌐" },
                            ].filter(i => i.val).map(item => (
                                <div key={item.label} style={{
                                    display: "flex", gap: "0.8rem", padding: "0.6rem 0",
                                    borderBottom: "0.5px solid rgba(255,255,255,0.05)"
                                }}>
                                    <span>{item.icon}</span>
                                    <div>
                                        <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)" }}>{item.label}</div>
                                        <div style={{ fontSize: 13, color: "#F0F4FF" }}>{item.val}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CONTACT */}
                    <div style={{ display: "flex", gap: "0.8rem" }}>
                        {selectedDoctor.whatsapp && (
                            <a href={`https://wa.me/${selectedDoctor.whatsapp}?text=Hello Dr. ${selectedDoctor.name}`}
                               target="_blank" style={{
                                flex: 1, background: "rgba(37,211,102,0.1)", color: "#25D366",
                                border: "0.5px solid rgba(37,211,102,0.3)",
                                padding: "10px", borderRadius: 8, fontSize: 13, textDecoration: "none",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
                            }}>💬 WhatsApp</a>
                        )}
                        {selectedDoctor.phone && (
                            <a href={`tel:${selectedDoctor.phone}`} style={{
                                flex: 1, background: "rgba(0,212,255,0.1)", color: "#00D4FF",
                                border: "0.5px solid rgba(0,212,255,0.3)",
                                padding: "10px", borderRadius: 8, fontSize: 13, textDecoration: "none",
                                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem"
                            }}>📞 Call</a>
                        )}
                    </div>

                    {/* BOOK BUTTON */}
                    <button onClick={() => setShowBooking(!showBooking)} style={{
                        width: "100%",
                        background: showBooking ? "rgba(226,75,74,0.1)" : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                        color: showBooking ? "#F09595" : "#0A1628",
                        border: showBooking ? "0.5px solid rgba(226,75,74,0.3)" : "none",
                        padding: "14px", borderRadius: 8, fontSize: 16, fontWeight: 600,
                        cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                    }}>
                        {showBooking ? "✕ Cancel" : "📅 Book Appointment"}
                    </button>
                </div>

                {/* RIGHT */}
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>

                    {/* BOOKING FORM */}
                    {showBooking && (
                        <div style={{
                            background: "rgba(201,168,76,0.05)",
                            border: "1px solid rgba(201,168,76,0.4)",
                            borderRadius: 16, padding: "1.5rem"
                        }}>
                            <h3 style={{
                                fontFamily: "'Cormorant Garamond',serif",
                                fontSize: 22, color: "#F0F4FF", marginBottom: "0.5rem"
                            }}>Book with Dr. {selectedDoctor.name}</h3>
                            <p style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginBottom: "1.5rem" }}>
                                Doctor will confirm date & time from their available slots.
                            </p>

                            {bookMsg.text && (
                                <div style={{
                                    background: bookMsg.type === "success" ? "rgba(29,158,117,0.1)" : "rgba(226,75,74,0.1)",
                                    border: `0.5px solid ${bookMsg.type === "success" ? "rgba(29,158,117,0.3)" : "rgba(226,75,74,0.3)"}`,
                                    borderRadius: 8, padding: "0.8rem",
                                    fontSize: 13, color: bookMsg.type === "success" ? "#5DCAA5" : "#F09595",
                                    marginBottom: "1rem"
                                }}>{bookMsg.text}</div>
                            )}

                            <div style={{ marginBottom: "1rem" }}>
                                <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>
                                    Your Phone Number *
                                </label>
                                <input className="inp" placeholder="919876543210"
                                       value={bookForm.patientPhone}
                                       onChange={e => setBookForm({ ...bookForm, patientPhone: e.target.value })} />
                            </div>

                            <div style={{ marginBottom: "1.5rem" }}>
                                <label style={{ fontSize: 12, color: "rgba(240,244,255,0.5)", display: "block", marginBottom: 6 }}>
                                    Reason / Symptoms
                                </label>
                                <textarea className="inp"
                                          placeholder="Describe your problem..."
                                          value={bookForm.notes}
                                          onChange={e => setBookForm({ ...bookForm, notes: e.target.value })}
                                          style={{ height: 100, resize: "none" }} />
                            </div>

                            {availability.filter(a => a.isAvailable).length > 0 && (
                                <div style={{
                                    background: "rgba(29,158,117,0.05)",
                                    border: "0.5px solid rgba(29,158,117,0.2)",
                                    borderRadius: 8, padding: "0.8rem", marginBottom: "1rem",
                                    fontSize: 12, color: "rgba(240,244,255,0.5)"
                                }}>
                                    📅 Available:{" "}
                                    <span style={{ color: "#5DCAA5" }}>
                    {availability.filter(a => a.isAvailable).map(a => a.dayOfWeek.slice(0, 3)).join(", ")}
                  </span>
                                </div>
                            )}

                            <button onClick={bookAppointment} disabled={booking} style={{
                                width: "100%",
                                background: booking ? "rgba(201,168,76,0.5)" : "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                color: "#0A1628", border: "none", padding: "14px",
                                borderRadius: 8, fontSize: 15, fontWeight: 600,
                                cursor: booking ? "not-allowed" : "pointer",
                                fontFamily: "'Outfit',sans-serif"
                            }}>{booking ? "Booking..." : "✅ Confirm Appointment Request"}</button>
                        </div>
                    )}

                    {/* ABOUT */}
                    {selectedDoctor.about && (
                        <div style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(201,168,76,0.15)",
                            borderRadius: 16, padding: "1.5rem"
                        }}>
                            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#F0F4FF", marginBottom: "0.8rem" }}>About</h3>
                            <p style={{ fontSize: 14, color: "rgba(240,244,255,0.6)", lineHeight: 1.8 }}>{selectedDoctor.about}</p>
                        </div>
                    )}

                    {/* AVAILABILITY */}
                    <div style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(201,168,76,0.15)",
                        borderRadius: 16, padding: "1.5rem"
                    }}>
                        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#F0F4FF", marginBottom: "1rem" }}>
                            Weekly Schedule
                        </h3>
                        {availability.length === 0 ? (
                            <p style={{ fontSize: 13, color: "rgba(240,244,255,0.4)" }}>Schedule not set yet</p>
                        ) : (
                            <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "0.5rem" }}>
                                {days.map(day => {
                                    const slot = availability.find(a => a.dayOfWeek === day);
                                    return (
                                        <div key={day} style={{
                                            padding: "0.8rem 0.5rem", borderRadius: 8, textAlign: "center",
                                            background: slot?.isAvailable ? "rgba(29,158,117,0.1)" : "rgba(255,255,255,0.02)",
                                            border: `0.5px solid ${slot?.isAvailable ? "rgba(29,158,117,0.3)" : "rgba(255,255,255,0.05)"}`
                                        }}>
                                            <div style={{ fontSize: 12, fontWeight: 500, color: slot?.isAvailable ? "#5DCAA5" : "rgba(240,244,255,0.25)" }}>
                                                {day.slice(0, 3)}
                                            </div>
                                            {slot?.isAvailable && (
                                                <>
                                                    <div style={{ fontSize: 10, color: "rgba(240,244,255,0.5)", marginTop: 2 }}>{slot.startTime?.slice(0, 5)}</div>
                                                    <div style={{ fontSize: 10, color: "rgba(240,244,255,0.3)" }}>{slot.endTime?.slice(0, 5)}</div>
                                                </>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* REVIEWS */}
                    <div style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(201,168,76,0.15)",
                        borderRadius: 16, padding: "1.5rem"
                    }}>
                        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 20, color: "#F0F4FF", marginBottom: "1rem" }}>
                            Patient Reviews
                        </h3>
                        {reviews.length === 0 ? (
                            <p style={{ fontSize: 13, color: "rgba(240,244,255,0.4)" }}>No reviews yet</p>
                        ) : (
                            reviews.slice(0, 3).map((r, i) => (
                                <div key={i} style={{ padding: "1rem 0", borderBottom: "0.5px solid rgba(255,255,255,0.05)" }}>
                                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.4rem" }}>
                                        <div style={{ fontSize: 14, color: "#F0F4FF" }}>{r.patientName || "Patient"}</div>
                                        <div style={{ color: "#EF9F27", fontSize: 13 }}>{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</div>
                                    </div>
                                    <div style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", fontStyle: "italic" }}>"{r.comment}"</div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // DOCTORS LIST
    return (
        <div>
            <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 32, color: "#F0F4FF", marginBottom: "2rem" }}>
                Find Doctors
            </h2>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", flexWrap: "wrap" }}>
                <input className="inp"
                       placeholder="🔍 Search by name or specialization..."
                       value={search}
                       onChange={e => { setSearch(e.target.value); applyFilters(e.target.value, specialization); }}
                       style={{ flex: 1, minWidth: 200 }} />
                <select className="inp" value={specialization}
                        onChange={e => { setSpecialization(e.target.value); applyFilters(search, e.target.value); }}
                        style={{ width: 200 }}>
                    <option value="">All Specializations</option>
                    {specializations.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
            </div>

            {specializations.length > 0 && (
                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
                    <button onClick={() => { setSpecialization(""); setFiltered(doctors); }} style={{
                        padding: "6px 16px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                        fontFamily: "'Outfit',sans-serif",
                        border: !specialization ? "1px solid #C9A84C" : "0.5px solid rgba(255,255,255,0.1)",
                        background: !specialization ? "rgba(201,168,76,0.15)" : "transparent",
                        color: !specialization ? "#C9A84C" : "rgba(240,244,255,0.5)"
                    }}>All</button>
                    {specializations.map(s => (
                        <button key={s} onClick={() => { setSpecialization(s); applyFilters(search, s); }} style={{
                            padding: "6px 16px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                            fontFamily: "'Outfit',sans-serif",
                            border: specialization === s ? "1px solid #C9A84C" : "0.5px solid rgba(255,255,255,0.1)",
                            background: specialization === s ? "rgba(201,168,76,0.15)" : "transparent",
                            color: specialization === s ? "#C9A84C" : "rgba(240,244,255,0.5)"
                        }}>{s}</button>
                    ))}
                </div>
            )}

            <div style={{ fontSize: 13, color: "rgba(240,244,255,0.4)", marginBottom: "1rem" }}>
                {loading ? "Loading..." : `${filtered.length} doctor${filtered.length !== 1 ? "s" : ""} found`}
            </div>

            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
                    {[1, 2, 3].map(i => (
                        <div key={i} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(201,168,76,0.1)",
                            borderRadius: 16, height: 280
                        }} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "4rem", color: "rgba(240,244,255,0.3)" }}>
                    <div style={{ fontSize: 48, marginBottom: "1rem" }}>👨‍⚕️</div>
                    <p>No doctors found</p>
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
                    {filtered.map((doc) => (
                        <div key={doc.id} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(201,168,76,0.2)",
                            borderRadius: 16, overflow: "hidden", transition: "all 0.3s"
                        }}
                             onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.5)"; }}
                             onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.borderColor = "rgba(201,168,76,0.2)"; }}
                        >
                            <div style={{
                                background: "linear-gradient(135deg,rgba(201,168,76,0.15),rgba(0,100,200,0.1))",
                                padding: "1.5rem", textAlign: "center"
                            }}>
                                <div style={{
                                    width: 64, height: 64, borderRadius: "50%", margin: "0 auto 1rem",
                                    background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 24, fontWeight: 700, color: "#0A1628",
                                    overflow: "hidden", border: "2px solid rgba(201,168,76,0.3)"
                                }}>
                                    {doc.profilePhoto ? (
                                        <img src={`${process.env.NEXT_PUBLIC_API_URL}${doc.profilePhoto}`}
                                             style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                             onError={e => e.target.style.display = "none"} alt="doc" />
                                    ) : doc.name?.charAt(0) || "D"}
                                </div>
                                <div style={{ fontSize: 16, color: "#F0F4FF", fontWeight: 500 }}>{doc.name || "Doctor"}</div>
                                <div style={{ fontSize: 12, color: "#C9A84C", marginTop: 4 }}>{doc.specialization || "Specialist"}</div>
                                {doc.isVerified && (
                                    <span style={{
                                        display: "inline-block", marginTop: "0.5rem",
                                        background: "rgba(29,158,117,0.1)", color: "#5DCAA5",
                                        border: "0.5px solid rgba(29,158,117,0.3)",
                                        padding: "2px 10px", borderRadius: 20, fontSize: 11
                                    }}>✅ Verified</span>
                                )}
                            </div>

                            <div style={{ padding: "1rem 1.2rem" }}>
                                {[
                                    { label: "Experience", val: doc.experienceYears ? `${doc.experienceYears} yrs` : "N/A" },
                                    { label: "Fee", val: doc.consultationFee ? `₹${doc.consultationFee}` : "N/A" },
                                    { label: "Clinic", val: doc.clinicName || "N/A" },
                                ].map(item => (
                                    <div key={item.label} style={{
                                        display: "flex", justifyContent: "space-between",
                                        padding: "4px 0", borderBottom: "0.5px solid rgba(255,255,255,0.04)"
                                    }}>
                                        <span style={{ fontSize: 12, color: "rgba(240,244,255,0.4)" }}>{item.label}</span>
                                        <span style={{ fontSize: 12, color: "#F0F4FF" }}>{item.val}</span>
                                    </div>
                                ))}

                                <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
                                    <button onClick={() => viewDoctorFix(doc)} style={{
                                        flex: 1, background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                        color: "#0A1628", border: "none", padding: "8px",
                                        borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                                        fontFamily: "'Outfit',sans-serif"
                                    }}>View & Book</button>
                                    {doc.whatsapp && (
                                        <a href={`https://wa.me/${doc.whatsapp}`} target="_blank" style={{
                                            background: "rgba(37,211,102,0.1)", color: "#25D366",
                                            border: "0.5px solid rgba(37,211,102,0.3)",
                                            padding: "8px 10px", borderRadius: 8, fontSize: 13,
                                            textDecoration: "none", display: "flex", alignItems: "center"
                                        }}>💬</a>
                                    )}
                                    {doc.phone && (
                                        <a href={`tel:${doc.phone}`} style={{
                                            background: "rgba(0,212,255,0.1)", color: "#00D4FF",
                                            border: "0.5px solid rgba(0,212,255,0.3)",
                                            padding: "8px 10px", borderRadius: 8, fontSize: 13,
                                            textDecoration: "none", display: "flex", alignItems: "center"
                                        }}>📞</a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}