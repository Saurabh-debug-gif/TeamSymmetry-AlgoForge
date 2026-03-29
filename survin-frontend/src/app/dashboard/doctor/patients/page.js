"use client";
import { useState, useEffect } from "react";

export default function DoctorPatients() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selected, setSelected] = useState(null);
    const [patientAppointments, setPatientAppointments] = useState([]);
    const [loadingDetail, setLoadingDetail] = useState(false);

    useEffect(() => { fetchPatients(); }, []);

    const fetchPatients = async () => {
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/patient/profile/all`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            setPatients(Array.isArray(data) ? data : []);
        } catch (err) { console.error(err); }
        finally { setLoading(false); }
    };

    const viewPatient = async (patient) => {
        setSelected(patient);
        setLoadingDetail(true);
        const token = localStorage.getItem("token");
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/doctor`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const data = await res.json();
            const filtered = Array.isArray(data)
                ? data.filter(a => a.patientName === patient.name)
                : [];
            setPatientAppointments(filtered);
        } catch { setPatientAppointments([]); }
        finally { setLoadingDetail(false); }
    };

    const filtered = patients.filter(p =>
        (p.name?.toLowerCase().includes(search.toLowerCase())) ||
        (p.email?.toLowerCase().includes(search.toLowerCase())) ||
        (p.bloodGroup?.toLowerCase().includes(search.toLowerCase()))
    );

    const statusColors = {
        PENDING: { bg: "rgba(239,159,39,0.1)", color: "#EF9F27", border: "rgba(239,159,39,0.3)" },
        CONFIRMED: { bg: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "rgba(0,212,255,0.3)" },
        CANCELLED: { bg: "rgba(226,75,74,0.1)", color: "#F09595", border: "rgba(226,75,74,0.3)" },
        COMPLETED: { bg: "rgba(29,158,117,0.1)", color: "#5DCAA5", border: "rgba(29,158,117,0.3)" },
    };

    // PATIENT DETAIL VIEW
    if (selected) return (
        <div>
            <button onClick={() => { setSelected(null); setPatientAppointments([]); }} style={{
                background: "transparent", color: "rgba(240,244,255,0.5)",
                border: "0.5px solid rgba(255,255,255,0.1)",
                padding: "8px 16px", borderRadius: 8, fontSize: 13,
                cursor: "pointer", fontFamily: "'Outfit',sans-serif", marginBottom: "1.5rem"
            }}>← Back to Patients</button>

            <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", gap: "1.5rem" }}>

                {/* LEFT — Patient Info */}
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
                                width: 80, height: 80, borderRadius: "50%",
                                margin: "0 auto 1rem",
                                background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 28, fontWeight: 700, color: "#0A1628",
                                overflow: "hidden", border: "3px solid rgba(201,168,76,0.4)"
                            }}>
                                {selected.profilePhoto ? (
                                    <img src={`${process.env.NEXT_PUBLIC_API_URL}${selected.profilePhoto}`}
                                         style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="patient" />
                                ) : selected.name?.charAt(0) || "P"}
                            </div>
                            <div style={{ fontSize: 20, color: "#F0F4FF", fontWeight: 500 }}>{selected.name}</div>
                            <div style={{ fontSize: 13, color: "rgba(240,244,255,0.5)", marginTop: 4 }}>{selected.email}</div>
                            {selected.bloodGroup && (
                                <div style={{
                                    display: "inline-block", marginTop: "0.8rem",
                                    background: "rgba(226,75,74,0.1)", color: "#F09595",
                                    border: "0.5px solid rgba(226,75,74,0.3)",
                                    padding: "4px 14px", borderRadius: 20, fontSize: 13
                                }}>🩸 {selected.bloodGroup}</div>
                            )}
                        </div>

                        <div style={{ padding: "1.2rem" }}>
                            {[
                                { label: "Date of Birth", val: selected.dateOfBirth, icon: "🎂" },
                                { label: "Gender", val: selected.gender, icon: "👤" },
                                { label: "Address", val: selected.address, icon: "📍" },
                                { label: "Emergency Contact", val: selected.emergencyContact, icon: "📞" },
                            ].filter(item => item.val).map(item => (
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

                    {selected.medicalHistory && (
                        <div style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(201,168,76,0.15)",
                            borderRadius: 12, padding: "1rem"
                        }}>
                            <div style={{ fontSize: 12, color: "#C9A84C", marginBottom: "0.5rem" }}>📋 Medical History</div>
                            <div style={{ fontSize: 13, color: "rgba(240,244,255,0.6)", lineHeight: 1.6 }}>
                                {selected.medicalHistory}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT — Appointments */}
                <div>
                    {/* STATS */}
                    <div style={{
                        display: "grid", gridTemplateColumns: "repeat(4,1fr)",
                        gap: "0.8rem", marginBottom: "1.5rem"
                    }}>
                        {[
                            { label: "Total", num: patientAppointments.length, color: "#C9A84C" },
                            { label: "Pending", num: patientAppointments.filter(a => a.status === "PENDING").length, color: "#EF9F27" },
                            { label: "Confirmed", num: patientAppointments.filter(a => a.status === "CONFIRMED").length, color: "#00D4FF" },
                            { label: "Completed", num: patientAppointments.filter(a => a.status === "COMPLETED").length, color: "#5DCAA5" },
                        ].map(s => (
                            <div key={s.label} style={{
                                background: "rgba(255,255,255,0.02)",
                                border: "0.5px solid rgba(201,168,76,0.15)",
                                borderRadius: 12, padding: "1rem", textAlign: "center"
                            }}>
                                <div style={{
                                    fontFamily: "'Cormorant Garamond',serif",
                                    fontSize: 28, fontWeight: 700, color: s.color
                                }}>{s.num}</div>
                                <div style={{ fontSize: 11, color: "rgba(240,244,255,0.4)", marginTop: 4 }}>{s.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* HISTORY */}
                    <div style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "0.5px solid rgba(201,168,76,0.2)",
                        borderRadius: 16, padding: "1.5rem"
                    }}>
                        <h3 style={{
                            fontFamily: "'Cormorant Garamond',serif",
                            fontSize: 20, color: "#F0F4FF", marginBottom: "1rem"
                        }}>Appointment History</h3>

                        {loadingDetail ? (
                            <p style={{ color: "rgba(240,244,255,0.4)", fontSize: 13 }}>Loading...</p>
                        ) : patientAppointments.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "2rem", color: "rgba(240,244,255,0.3)" }}>
                                <div style={{ fontSize: 36, marginBottom: "0.5rem" }}>📅</div>
                                <p style={{ fontSize: 13 }}>No appointments with this patient yet</p>
                            </div>
                        ) : (
                            patientAppointments.map((apt) => {
                                const sc = statusColors[apt.status] || statusColors.PENDING;
                                return (
                                    <div key={apt.id} style={{
                                        background: "rgba(255,255,255,0.02)",
                                        border: `0.5px solid ${sc.border}`,
                                        borderRadius: 10, padding: "1rem", marginBottom: "0.8rem"
                                    }}>
                                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                                            <div style={{ fontSize: 14, color: "#F0F4FF" }}>
                                                {apt.appointmentDate
                                                    ? new Date(apt.appointmentDate).toLocaleDateString("en-IN", {
                                                        weekday: "short", day: "numeric",
                                                        month: "short", year: "numeric"
                                                    })
                                                    : "Date TBD"}
                                                {apt.appointmentTime ? ` · ${apt.appointmentTime}` : ""}
                                            </div>
                                            <span style={{
                                                background: sc.bg, color: sc.color,
                                                border: `0.5px solid ${sc.border}`,
                                                padding: "3px 10px", borderRadius: 20, fontSize: 11
                                            }}>{apt.status}</span>
                                        </div>
                                        {apt.notes && (
                                            <div style={{ fontSize: 12, color: "rgba(240,244,255,0.5)" }}>📝 {apt.notes}</div>
                                        )}
                                        {apt.doctorDescription && (
                                            <div style={{ fontSize: 12, color: "#E8C97A", marginTop: 4 }}>
                                                👨‍⚕️ {apt.doctorDescription}
                                            </div>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );

    // PATIENTS LIST
    return (
        <div>
            <div style={{ marginBottom: "2rem" }}>
                <h2 style={{
                    fontFamily: "'Cormorant Garamond',serif",
                    fontSize: 32, color: "#F0F4FF", marginBottom: "0.3rem"
                }}>My Patients</h2>
                <p style={{ fontSize: 14, color: "rgba(240,244,255,0.4)" }}>
                    All registered patients on the platform
                </p>
            </div>

            {/* SEARCH */}
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1.5rem", alignItems: "center" }}>
                <input className="inp"
                       placeholder="🔍 Search by name, email or blood group..."
                       value={search}
                       onChange={e => setSearch(e.target.value)}
                       style={{ flex: 1 }} />
                <div style={{
                    background: "rgba(201,168,76,0.1)", color: "#C9A84C",
                    border: "0.5px solid rgba(201,168,76,0.3)",
                    padding: "10px 16px", borderRadius: 8, fontSize: 13, whiteSpace: "nowrap"
                }}>
                    {filtered.length} patient{filtered.length !== 1 ? "s" : ""}
                </div>
            </div>

            {/* GRID */}
            {loading ? (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} style={{
                            background: "rgba(255,255,255,0.02)",
                            border: "0.5px solid rgba(201,168,76,0.1)",
                            borderRadius: 14, height: 150
                        }} />
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div style={{ textAlign: "center", padding: "5rem 2rem", color: "rgba(240,244,255,0.3)" }}>
                    <div style={{ fontSize: 52, marginBottom: "1rem" }}>👥</div>
                    <p style={{ fontSize: 16 }}>No patients found</p>
                    {search && (
                        <button onClick={() => setSearch("")} style={{
                            marginTop: "1rem",
                            background: "rgba(201,168,76,0.1)", color: "#C9A84C",
                            border: "0.5px solid rgba(201,168,76,0.3)",
                            padding: "8px 20px", borderRadius: 8,
                            fontSize: 13, cursor: "pointer", fontFamily: "'Outfit',sans-serif"
                        }}>Clear Search</button>
                    )}
                </div>
            ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1rem" }}>
                    {filtered.map((patient, i) => (
                        <div key={i}
                             onClick={() => viewPatient(patient)}
                             style={{
                                 background: "rgba(255,255,255,0.02)",
                                 border: "0.5px solid rgba(201,168,76,0.15)",
                                 borderRadius: 14, overflow: "hidden",
                                 transition: "all 0.2s", cursor: "pointer"
                             }}
                             onMouseEnter={e => {
                                 e.currentTarget.style.transform = "translateY(-4px)";
                                 e.currentTarget.style.borderColor = "rgba(201,168,76,0.4)";
                             }}
                             onMouseLeave={e => {
                                 e.currentTarget.style.transform = "translateY(0)";
                                 e.currentTarget.style.borderColor = "rgba(201,168,76,0.15)";
                             }}
                        >
                            {/* TOP */}
                            <div style={{
                                background: "linear-gradient(135deg,rgba(201,168,76,0.08),rgba(0,100,200,0.05))",
                                padding: "1.2rem", display: "flex", alignItems: "center", gap: "1rem"
                            }}>
                                <div style={{
                                    width: 48, height: 48, borderRadius: "50%", flexShrink: 0,
                                    background: "linear-gradient(135deg,#C9A84C,#E8C97A)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    fontSize: 18, fontWeight: 700, color: "#0A1628",
                                    overflow: "hidden", border: "2px solid rgba(201,168,76,0.3)"
                                }}>
                                    {patient.profilePhoto ? (
                                        <img src={`${process.env.NEXT_PUBLIC_API_URL}${patient.profilePhoto}`}
                                             style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                             onError={e => e.target.style.display = "none"} alt="patient" />
                                    ) : patient.name?.charAt(0) || "P"}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{
                                        fontSize: 15, color: "#F0F4FF", fontWeight: 500,
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                    }}>{patient.name || "Patient"}</div>
                                    <div style={{
                                        fontSize: 11, color: "rgba(240,244,255,0.4)", marginTop: 2,
                                        whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis"
                                    }}>{patient.email || ""}</div>
                                </div>
                            </div>

                            {/* BOTTOM */}
                            <div style={{ padding: "0.8rem 1.2rem" }}>
                                <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                                    {patient.bloodGroup && (
                                        <span style={{
                                            background: "rgba(226,75,74,0.1)", color: "#F09595",
                                            border: "0.5px solid rgba(226,75,74,0.2)",
                                            padding: "3px 10px", borderRadius: 12, fontSize: 11
                                        }}>🩸 {patient.bloodGroup}</span>
                                    )}
                                    {patient.gender && (
                                        <span style={{
                                            background: "rgba(0,212,255,0.08)", color: "#00D4FF",
                                            border: "0.5px solid rgba(0,212,255,0.2)",
                                            padding: "3px 10px", borderRadius: 12, fontSize: 11
                                        }}>{patient.gender}</span>
                                    )}
                                    {!patient.bloodGroup && !patient.gender && (
                                        <span style={{ fontSize: 12, color: "rgba(240,244,255,0.3)" }}>
                      Profile incomplete
                    </span>
                                    )}
                                </div>
                                <div style={{
                                    marginTop: "0.8rem", fontSize: 12, color: "#C9A84C",
                                    display: "flex", alignItems: "center", gap: "0.3rem"
                                }}>View Details →</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
