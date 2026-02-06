import { useState, useEffect, useRef } from "react";

const LAWYERS = [
  { id: 1, name: "Adv. Priya Sharma", speciality: "Traffic & Motor Vehicle", rating: 4.9, cases: 1240, distance: "0.8 km", eta: "3 min", price: 499, avatar: "PS", available: true, lang: ["Hindi", "English"], badge: "Top Rated" },
  { id: 2, name: "Adv. Rajesh Malhotra", speciality: "Traffic & Criminal", rating: 4.8, cases: 980, distance: "1.2 km", eta: "5 min", price: 599, avatar: "RM", available: true, lang: ["Hindi", "English", "Punjabi"], badge: "Expert" },
  { id: 3, name: "Adv. Sunita Desai", speciality: "Consumer & Civil", rating: 4.7, cases: 760, distance: "2.1 km", eta: "8 min", price: 399, avatar: "SD", available: true, lang: ["Hindi", "English", "Marathi"], badge: null },
  { id: 4, name: "Adv. Arjun Kapoor", speciality: "Criminal Defense", rating: 4.9, cases: 1560, distance: "3.5 km", eta: "12 min", price: 799, avatar: "AK", available: true, lang: ["Hindi", "English"], badge: "Premium" },
  { id: 5, name: "Adv. Meera Iyer", speciality: "Traffic & Insurance", rating: 4.6, cases: 540, distance: "1.8 km", eta: "6 min", price: 449, avatar: "MI", available: false, lang: ["Hindi", "English", "Tamil"], badge: null },
];

const CATEGORIES = [
  { id: "traffic", icon: "🚗", label: "Traffic Challan", desc: "Speeding, signal violation, wrong parking", color: "#FF6B35" },
  { id: "accident", icon: "🚑", label: "Road Accident", desc: "Accident claims, FIR assistance, insurance", color: "#E63946" },
  { id: "police", icon: "🛡️", label: "Police Matter", desc: "Wrongful detention, harassment, FIR issues", color: "#457B9D" },
  { id: "consumer", icon: "🛒", label: "Consumer Rights", desc: "Fraud, defective products, overcharging", color: "#2A9D8F" },
  { id: "property", icon: "🏠", label: "Property Dispute", desc: "Tenant issues, encroachment, eviction", color: "#E9C46A" },
  { id: "cyber", icon: "💻", label: "Cyber Crime", desc: "Online fraud, identity theft, harassment", color: "#6A4C93" },
];

const STEPS = ["Select Issue", "Choose Lawyer", "Confirm & Connect"];

// Pulse animation for live indicator
const pulseKeyframes = `
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes ripple { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes countUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes mapDot { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,53,0.4); } 50% { box-shadow: 0 0 0 12px rgba(255,107,53,0); } }

@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700&family=Fraunces:opsz,wght@9..144,600;9..144,800&display=swap');
`;

export default function LegalOnDemand() {
  const [screen, setScreen] = useState("home"); // home, category, lawyers, confirm, connecting, active
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectProgress, setConnectProgress] = useState(0);
  const [callTime, setCallTime] = useState(0);
  const [showSOS, setShowSOS] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (screen === "connecting") {
      const interval = setInterval(() => {
        setConnectProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setScreen("active");
            return 100;
          }
          return prev + 2;
        });
      }, 60);
      return () => clearInterval(interval);
    }
  }, [screen]);

  useEffect(() => {
    if (screen === "active") {
      timerRef.current = setInterval(() => setCallTime(t => t + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [screen]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setScreen("lawyers");
  };

  const handleLawyerSelect = (lawyer) => {
    setSelectedLawyer(lawyer);
    setScreen("confirm");
  };

  const handleConnect = () => {
    setConnectProgress(0);
    setScreen("connecting");
  };

  const handleEndCall = () => {
    clearInterval(timerRef.current);
    setCallTime(0);
    setScreen("home");
    setSelectedCategory(null);
    setSelectedLawyer(null);
  };

  const filteredLawyers = LAWYERS.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.speciality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stepIndex = screen === "lawyers" ? 1 : screen === "confirm" ? 2 : 0;

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif",
      background: "#0A0A0F",
      minHeight: "100vh",
      maxWidth: 430,
      margin: "0 auto",
      position: "relative",
      overflow: "hidden",
      color: "#F0EDE6",
    }}>
      <style>{pulseKeyframes}</style>

      {/* Ambient background glow */}
      <div style={{
        position: "fixed", top: -100, right: -100, width: 300, height: 300,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />
      <div style={{
        position: "fixed", bottom: -80, left: -80, width: 250, height: 250,
        borderRadius: "50%", background: "radial-gradient(circle, rgba(42,157,143,0.06) 0%, transparent 70%)",
        pointerEvents: "none",
      }} />

      {/* ===== HOME SCREEN ===== */}
      {screen === "home" && (
        <div style={{ padding: "0 20px 100px", animation: "fadeIn 0.4s ease" }}>
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 8px" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#FF6B35", fontWeight: 700, marginBottom: 4 }}>
                ● Legal Help On-Demand
              </div>
              <h1 style={{
                fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 800, margin: 0,
                background: "linear-gradient(135deg, #F0EDE6, #FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                NyayNow
              </h1>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button onClick={() => setShowSOS(!showSOS)} style={{
                background: "#E63946", border: "none", color: "white", borderRadius: 12,
                padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer",
                letterSpacing: 1, boxShadow: "0 0 20px rgba(230,57,70,0.3)",
              }}>
                SOS
              </button>
              <div style={{
                width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #1a1a24, #252530)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                👤
              </div>
            </div>
          </div>

          {/* SOS Panel */}
          {showSOS && (
            <div style={{
              background: "linear-gradient(135deg, #E63946, #C1121F)", borderRadius: 16,
              padding: 20, marginTop: 12, animation: "slideUp 0.3s ease",
            }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🚨 Emergency Legal SOS</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 16 }}>
                Instantly connect with the nearest available lawyer. Best for wrongful arrests, accidents, or emergencies.
              </div>
              <button onClick={() => {
                setSelectedCategory(CATEGORIES[1]);
                setSelectedLawyer(LAWYERS[0]);
                handleConnect();
                setShowSOS(false);
              }} style={{
                width: "100%", padding: "14px", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)",
                borderRadius: 12, color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer",
                backdropFilter: "blur(10px)",
              }}>
                Connect Now — Free First 2 Min
              </button>
            </div>
          )}

          {/* Status Banner */}
          <div style={{
            background: "linear-gradient(135deg, rgba(42,157,143,0.12), rgba(42,157,143,0.04))",
            border: "1px solid rgba(42,157,143,0.2)", borderRadius: 16,
            padding: "14px 18px", marginTop: 20, display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: "#2A9D8F",
              animation: "pulse 2s infinite", flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>24 lawyers online near you</div>
              <div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>Avg. response time: 3 minutes</div>
            </div>
          </div>

          {/* Categories */}
          <div style={{ marginTop: 28 }}>
            <h2 style={{ fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: "#8A8A9A", fontWeight: 600, marginBottom: 16 }}>
              What do you need help with?
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {CATEGORIES.map((cat, i) => (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat)}
                  style={{
                    background: "linear-gradient(145deg, #14141E, #1A1A26)",
                    border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16,
                    padding: "20px 16px", textAlign: "left", cursor: "pointer", color: "#F0EDE6",
                    transition: "all 0.2s ease", position: "relative", overflow: "hidden",
                    animation: `slideUp 0.4s ease ${i * 0.06}s both`,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + "55"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{
                    position: "absolute", top: -20, right: -20, width: 80, height: 80,
                    borderRadius: "50%", background: cat.color, opacity: 0.06,
                  }} />
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{cat.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{cat.label}</div>
                  <div style={{ fontSize: 11, color: "#8A8A9A", lineHeight: 1.4 }}>{cat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Consultations */}
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase", color: "#8A8A9A", fontWeight: 600, marginBottom: 16 }}>
              Recent Activity
            </h2>
            {[
              { title: "Traffic Challan — Red Light", lawyer: "Adv. Priya Sharma", status: "Resolved", time: "2 days ago", statusColor: "#2A9D8F" },
              { title: "Insurance Claim Dispute", lawyer: "Adv. Rajesh Malhotra", status: "In Progress", time: "5 days ago", statusColor: "#E9C46A" },
            ].map((item, i) => (
              <div key={i} style={{
                background: "linear-gradient(145deg, #14141E, #1A1A26)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: 14,
                padding: "16px 18px", marginBottom: 10, animation: `slideUp 0.4s ease ${0.3 + i * 0.08}s both`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "#8A8A9A", marginTop: 4 }}>{item.lawyer} · {item.time}</div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: item.statusColor,
                    background: item.statusColor + "18", padding: "4px 10px", borderRadius: 8,
                  }}>
                    {item.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== LAWYERS LIST SCREEN ===== */}
      {screen === "lawyers" && (
        <div style={{ padding: "0 20px 100px", animation: "fadeIn 0.3s ease" }}>
          {/* Back + Stepper */}
          <div style={{ padding: "20px 0 12px", display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setScreen("home")} style={{
              background: "rgba(255,255,255,0.06)", border: "none", color: "#F0EDE6",
              width: 38, height: 38, borderRadius: 12, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>←</button>
            <div>
              <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                Step {stepIndex + 1} of 3
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>Choose Your Lawyer</div>
            </div>
          </div>

          {/* Progress Steps */}
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= stepIndex ? "#FF6B35" : "rgba(255,255,255,0.08)",
                transition: "all 0.3s ease",
              }} />
            ))}
          </div>

          {/* Selected Category Tag */}
          {selectedCategory && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              background: selectedCategory.color + "18", border: `1px solid ${selectedCategory.color}33`,
              borderRadius: 10, padding: "8px 14px", marginBottom: 16,
            }}>
              <span style={{ fontSize: 16 }}>{selectedCategory.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: selectedCategory.color }}>{selectedCategory.label}</span>
            </div>
          )}

          {/* Search */}
          <div style={{
            background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10,
          }}>
            <span style={{ opacity: 0.5 }}>🔍</span>
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name or speciality..."
              style={{
                background: "none", border: "none", color: "#F0EDE6", fontSize: 14,
                outline: "none", width: "100%", fontFamily: "inherit",
              }}
            />
          </div>

          {/* Sort Pills */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
            {["Nearest", "Top Rated", "Lowest Price", "Most Cases"].map((pill, i) => (
              <button key={pill} style={{
                background: i === 0 ? "#FF6B35" : "rgba(255,255,255,0.06)",
                border: "none", borderRadius: 10, padding: "8px 14px",
                color: i === 0 ? "white" : "#8A8A9A", fontSize: 12, fontWeight: 600,
                cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.2s",
              }}>
                {pill}
              </button>
            ))}
          </div>

          {/* Lawyer Cards */}
          {filteredLawyers.map((lawyer, i) => (
            <button
              key={lawyer.id}
              onClick={() => lawyer.available && handleLawyerSelect(lawyer)}
              style={{
                width: "100%", textAlign: "left", cursor: lawyer.available ? "pointer" : "default",
                background: "linear-gradient(145deg, #14141E, #1A1A26)",
                border: "1px solid rgba(255,255,255,0.06)", borderRadius: 18,
                padding: 18, marginBottom: 12, color: "#F0EDE6", position: "relative",
                opacity: lawyer.available ? 1 : 0.5, transition: "all 0.2s ease",
                animation: `slideUp 0.4s ease ${i * 0.07}s both`,
              }}
              onMouseEnter={e => { if (lawyer.available) e.currentTarget.style.borderColor = "#FF6B3544"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              {lawyer.badge && (
                <span style={{
                  position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 700,
                  background: lawyer.badge === "Premium" ? "linear-gradient(135deg, #E9C46A, #F4A261)" :
                    lawyer.badge === "Top Rated" ? "linear-gradient(135deg, #FF6B35, #E63946)" :
                    "linear-gradient(135deg, #457B9D, #2A9D8F)",
                  color: "white", padding: "3px 10px", borderRadius: 8, letterSpacing: 0.5,
                }}>
                  {lawyer.badge}
                </span>
              )}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                  background: `linear-gradient(135deg, ${selectedCategory?.color || '#FF6B35'}44, ${selectedCategory?.color || '#FF6B35'}11)`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 16, fontWeight: 700, color: selectedCategory?.color || '#FF6B35',
                  border: `1px solid ${selectedCategory?.color || '#FF6B35'}33`,
                }}>
                  {lawyer.avatar}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{lawyer.name}</div>
                  <div style={{ fontSize: 12, color: "#8A8A9A", marginTop: 3 }}>{lawyer.speciality}</div>
                  <div style={{ display: "flex", gap: 14, marginTop: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 12, color: "#E9C46A" }}>⭐ {lawyer.rating}</span>
                    <span style={{ fontSize: 12, color: "#8A8A9A" }}>{lawyer.cases} cases</span>
                    <span style={{ fontSize: 12, color: "#2A9D8F" }}>📍 {lawyer.distance}</span>
                    <span style={{ fontSize: 12, color: "#FF6B35" }}>⏱ {lawyer.eta}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
                    <div style={{ display: "flex", gap: 6 }}>
                      {lawyer.lang.map(l => (
                        <span key={l} style={{
                          fontSize: 10, background: "rgba(255,255,255,0.06)", borderRadius: 6,
                          padding: "3px 8px", color: "#8A8A9A",
                        }}>{l}</span>
                      ))}
                    </div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, color: "#FF6B35" }}>
                      ₹{lawyer.price}<span style={{ fontSize: 11, fontWeight: 400, color: "#8A8A9A" }}>/consult</span>
                    </div>
                  </div>
                </div>
              </div>
              {!lawyer.available && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(10,10,15,0.6)", backdropFilter: "blur(2px)",
                }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "#8A8A9A" }}>Currently Unavailable</span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      {/* ===== CONFIRM SCREEN ===== */}
      {screen === "confirm" && selectedLawyer && (
        <div style={{ padding: "0 20px 100px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ padding: "20px 0 12px", display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setScreen("lawyers")} style={{
              background: "rgba(255,255,255,0.06)", border: "none", color: "#F0EDE6",
              width: 38, height: 38, borderRadius: 12, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}>←</button>
            <div>
              <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>
                Step 3 of 3
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>Confirm & Connect</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{
                flex: 1, height: 3, borderRadius: 2,
                background: i <= 2 ? "#FF6B35" : "rgba(255,255,255,0.08)",
              }} />
            ))}
          </div>

          {/* Lawyer Detail Card */}
          <div style={{
            background: "linear-gradient(145deg, #14141E, #1A1A26)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
            padding: 24, textAlign: "center", position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)",
              width: 200, height: 200, borderRadius: "50%",
              background: `radial-gradient(circle, ${selectedCategory?.color || '#FF6B35'}15, transparent)`,
            }} />
            <div style={{
              width: 80, height: 80, borderRadius: 20, margin: "0 auto 16px",
              background: `linear-gradient(135deg, ${selectedCategory?.color || '#FF6B35'}55, ${selectedCategory?.color || '#FF6B35'}22)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 700, color: selectedCategory?.color || '#FF6B35',
              border: `2px solid ${selectedCategory?.color || '#FF6B35'}44`,
            }}>
              {selectedLawyer.avatar}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{selectedLawyer.name}</div>
            <div style={{ fontSize: 13, color: "#8A8A9A", marginTop: 4 }}>{selectedLawyer.speciality}</div>

            <div style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 24,
              background: "rgba(0,0,0,0.3)", borderRadius: 14, padding: 16,
            }}>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#E9C46A", fontFamily: "'Fraunces', serif" }}>{selectedLawyer.rating}</div>
                <div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>Rating</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#2A9D8F", fontFamily: "'Fraunces', serif" }}>{selectedLawyer.cases}</div>
                <div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>Cases</div>
              </div>
              <div>
                <div style={{ fontSize: 22, fontWeight: 700, color: "#FF6B35", fontFamily: "'Fraunces', serif" }}>{selectedLawyer.eta}</div>
                <div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>ETA</div>
              </div>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div style={{
            background: "linear-gradient(145deg, #14141E, #1A1A26)",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16,
            padding: 20, marginTop: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8A8A9A", marginBottom: 16 }}>
              Pricing
            </div>
            {[
              { label: "Consultation Fee", value: `₹${selectedLawyer.price}` },
              { label: "Platform Fee", value: "₹49" },
              { label: "GST (18%)", value: `₹${Math.round((selectedLawyer.price + 49) * 0.18)}` },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                <span style={{ color: "#8A8A9A" }}>{item.label}</span>
                <span style={{ fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12, marginTop: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16 }}>
                <span style={{ fontWeight: 700 }}>Total</span>
                <span style={{ fontWeight: 800, color: "#FF6B35", fontFamily: "'Fraunces', serif", fontSize: 20 }}>
                  ₹{selectedLawyer.price + 49 + Math.round((selectedLawyer.price + 49) * 0.18)}
                </span>
              </div>
            </div>
          </div>

          {/* What to expect */}
          <div style={{
            background: "linear-gradient(145deg, #14141E, #1A1A26)",
            border: "1px solid rgba(255,255,255,0.06)", borderRadius: 16,
            padding: 20, marginTop: 16,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8A8A9A", marginBottom: 14 }}>
              What to Expect
            </div>
            {[
              "15-minute video/voice consultation",
              "Document review & legal opinion",
              "Follow-up summary via email",
              "Option to extend at ₹200/10 min",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2A9D8F", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#B0B0B8" }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Connect Button */}
          <button onClick={handleConnect} style={{
            width: "100%", padding: "18px", marginTop: 24,
            background: "linear-gradient(135deg, #FF6B35, #E63946)",
            border: "none", borderRadius: 16, color: "white", fontSize: 16, fontWeight: 700,
            cursor: "pointer", letterSpacing: 0.5,
            boxShadow: "0 8px 32px rgba(255,107,53,0.3)",
          }}>
            Connect Now — ₹{selectedLawyer.price + 49 + Math.round((selectedLawyer.price + 49) * 0.18)}
          </button>
          <div style={{ textAlign: "center", fontSize: 11, color: "#8A8A9A", marginTop: 10 }}>
            🔒 Secure payment via UPI, Card or Wallet
          </div>
        </div>
      )}

      {/* ===== CONNECTING SCREEN ===== */}
      {screen === "connecting" && selectedLawyer && (
        <div style={{
          padding: "0 20px", animation: "fadeIn 0.3s ease",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "100vh", textAlign: "center",
        }}>
          {/* Ripple effect */}
          <div style={{ position: "relative", width: 120, height: 120, marginBottom: 40 }}>
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid #FF6B35", animation: "ripple 2s infinite",
            }} />
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid #FF6B35", animation: "ripple 2s infinite 0.5s",
            }} />
            <div style={{
              position: "absolute", inset: 0, borderRadius: "50%",
              border: "2px solid #FF6B35", animation: "ripple 2s infinite 1s",
            }} />
            <div style={{
              width: 120, height: 120, borderRadius: "50%",
              background: `linear-gradient(135deg, #FF6B3544, #FF6B3522)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 32, fontWeight: 700, color: "#FF6B35",
              position: "relative", zIndex: 1,
            }}>
              {selectedLawyer.avatar}
            </div>
          </div>

          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
            Connecting you with
          </div>
          <div style={{ fontSize: 18, color: "#FF6B35", fontWeight: 600, marginBottom: 24 }}>
            {selectedLawyer.name}
          </div>

          {/* Progress bar */}
          <div style={{ width: "80%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
            <div style={{
              width: `${connectProgress}%`, height: "100%",
              background: "linear-gradient(90deg, #FF6B35, #E63946)",
              borderRadius: 2, transition: "width 0.1s linear",
            }} />
          </div>
          <div style={{ fontSize: 13, color: "#8A8A9A" }}>
            {connectProgress < 30 ? "Verifying payment..." : connectProgress < 60 ? "Notifying lawyer..." : connectProgress < 90 ? "Setting up secure channel..." : "Almost there..."}
          </div>
        </div>
      )}

      {/* ===== ACTIVE CALL SCREEN ===== */}
      {screen === "active" && selectedLawyer && (
        <div style={{
          padding: "0 20px", animation: "fadeIn 0.4s ease",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          minHeight: "100vh", textAlign: "center",
        }}>
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, padding: "16px 20px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2A9D8F", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 12, color: "#2A9D8F", fontWeight: 600 }}>LIVE</span>
            </div>
            <span style={{ fontSize: 12, color: "#8A8A9A" }}>🔒 Encrypted</span>
          </div>

          <div style={{
            width: 100, height: 100, borderRadius: "50%",
            background: `linear-gradient(135deg, #2A9D8F44, #2A9D8F22)`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 32, fontWeight: 700, color: "#2A9D8F",
            border: "3px solid #2A9D8F44", marginBottom: 24,
            animation: "mapDot 2s infinite",
          }}>
            {selectedLawyer.avatar}
          </div>

          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700 }}>
            {selectedLawyer.name}
          </div>
          <div style={{ fontSize: 13, color: "#8A8A9A", marginTop: 4 }}>{selectedCategory?.label}</div>

          <div style={{
            fontFamily: "'Fraunces', serif", fontSize: 48, fontWeight: 700, color: "#2A9D8F",
            margin: "32px 0", letterSpacing: 4, animation: "countUp 0.5s ease",
          }}>
            {formatTime(callTime)}
          </div>

          {/* Call Actions */}
          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            {[
              { icon: "🔇", label: "Mute" },
              { icon: "📹", label: "Video" },
              { icon: "📎", label: "Share" },
              { icon: "💬", label: "Chat" },
            ].map(action => (
              <button key={action.label} style={{
                background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 16, width: 60, height: 60, display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#F0EDE6",
                gap: 4,
              }}>
                <span style={{ fontSize: 20 }}>{action.icon}</span>
                <span style={{ fontSize: 9, color: "#8A8A9A" }}>{action.label}</span>
              </button>
            ))}
          </div>

          {/* End Call */}
          <button onClick={handleEndCall} style={{
            marginTop: 40, width: 72, height: 72, borderRadius: "50%",
            background: "linear-gradient(135deg, #E63946, #C1121F)",
            border: "none", fontSize: 28, cursor: "pointer", color: "white",
            boxShadow: "0 8px 32px rgba(230,57,70,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            ✕
          </button>
          <div style={{ fontSize: 12, color: "#8A8A9A", marginTop: 12 }}>End Consultation</div>
        </div>
      )}

      {/* ===== BOTTOM NAV ===== */}
      {["home", "lawyers", "confirm"].includes(screen) && (
        <div style={{
          position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
          width: "100%", maxWidth: 430,
          background: "linear-gradient(180deg, transparent, #0A0A0F 30%)",
          padding: "30px 20px 20px",
        }}>
          <div style={{
            background: "rgba(20,20,30,0.9)", backdropFilter: "blur(20px)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20,
            padding: "12px 8px", display: "flex", justifyContent: "space-around",
          }}>
            {[
              { icon: "⚖️", label: "Home", active: screen === "home" },
              { icon: "📋", label: "Cases", active: false },
              { icon: "💬", label: "Messages", active: false },
              { icon: "👤", label: "Profile", active: false },
            ].map((tab, i) => (
              <button
                key={tab.label}
                onClick={() => { if (tab.label === "Home") { setScreen("home"); setSelectedCategory(null); setSelectedLawyer(null); }}}
                style={{
                  background: "none", border: "none", color: tab.active ? "#FF6B35" : "#8A8A9A",
                  display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                  cursor: "pointer", padding: "6px 16px", borderRadius: 12,
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: 20 }}>{tab.icon}</span>
                <span style={{ fontSize: 10, fontWeight: tab.active ? 700 : 500 }}>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
