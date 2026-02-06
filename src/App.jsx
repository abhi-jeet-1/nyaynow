import { useState, useEffect, useRef } from "react";

// ==================== DATA ====================

const LAWYERS = [
  { id: 1, name: "Adv. Priya Sharma", speciality: "Traffic & Motor Vehicle", rating: 4.9, cases: 1240, distance: "0.8 km", eta: "3 min", price: 499, avatar: "PS", available: true, lang: ["Hindi", "English"], badge: "Top Rated", phone: "+91 98765 43210", barCouncil: "MP/1234/2015", experience: "9 years" },
  { id: 2, name: "Adv. Rajesh Malhotra", speciality: "Traffic & Criminal", rating: 4.8, cases: 980, distance: "1.2 km", eta: "5 min", price: 599, avatar: "RM", available: true, lang: ["Hindi", "English", "Punjabi"], badge: "Expert", phone: "+91 98765 43211", barCouncil: "DL/5678/2012", experience: "12 years" },
  { id: 3, name: "Adv. Sunita Desai", speciality: "Consumer & Civil", rating: 4.7, cases: 760, distance: "2.1 km", eta: "8 min", price: 399, avatar: "SD", available: true, lang: ["Hindi", "English", "Marathi"], badge: null, phone: "+91 98765 43212", barCouncil: "MH/9012/2017", experience: "7 years" },
  { id: 4, name: "Adv. Arjun Kapoor", speciality: "Criminal Defense", rating: 4.9, cases: 1560, distance: "3.5 km", eta: "12 min", price: 799, avatar: "AK", available: true, lang: ["Hindi", "English"], badge: "Premium", phone: "+91 98765 43213", barCouncil: "MP/3456/2010", experience: "14 years" },
  { id: 5, name: "Adv. Meera Iyer", speciality: "Traffic & Insurance", rating: 4.6, cases: 540, distance: "1.8 km", eta: "6 min", price: 449, avatar: "MI", available: false, lang: ["Hindi", "English", "Tamil"], badge: null, phone: "+91 98765 43214", barCouncil: "TN/7890/2018", experience: "6 years" },
];

const CATEGORIES = [
  { id: "traffic", icon: "🚗", label: "Traffic Challan", desc: "Speeding, signal violation, wrong parking", color: "#FF6B35" },
  { id: "accident", icon: "🚑", label: "Road Accident", desc: "Accident claims, FIR assistance, insurance", color: "#E63946" },
  { id: "police", icon: "🛡️", label: "Police Matter", desc: "Wrongful detention, harassment, FIR issues", color: "#457B9D" },
  { id: "consumer", icon: "🛒", label: "Consumer Rights", desc: "Fraud, defective products, overcharging", color: "#2A9D8F" },
  { id: "property", icon: "🏠", label: "Property Dispute", desc: "Tenant issues, encroachment, eviction", color: "#E9C46A" },
  { id: "cyber", icon: "💻", label: "Cyber Crime", desc: "Online fraud, identity theft, harassment", color: "#6A4C93" },
];

const CASES_DATA = [
  {
    id: "C-2024-0847", title: "Traffic Challan — Red Light Violation", category: "traffic", categoryColor: "#FF6B35",
    lawyer: LAWYERS[0], status: "resolved", statusLabel: "Resolved", statusColor: "#2A9D8F",
    date: "2025-01-28", resolvedDate: "2025-02-01",
    amount: "₹1,000 challan", outcome: "Challan dismissed — no violation proven",
    timeline: [
      { date: "Jan 28", event: "Consultation booked", detail: "Connected with Adv. Priya Sharma for red light challan at MG Road crossing" },
      { date: "Jan 28", event: "Documents reviewed", detail: "Lawyer reviewed challan copy, dashcam footage, and traffic camera angles" },
      { date: "Jan 29", event: "Representation filed", detail: "Online grievance submitted to Traffic Police with supporting evidence" },
      { date: "Feb 01", event: "Challan dismissed", detail: "Traffic authority accepted representation. Challan cancelled. No fine payable." },
    ],
    documents: ["Challan Copy.pdf", "Dashcam Footage.mp4", "Grievance Application.pdf", "Dismissal Order.pdf"],
    notes: "Signal was yellow, not red. Dashcam clearly showed the vehicle entered the intersection before the light turned red. Challan was issued erroneously by the automated camera system.",
  },
  {
    id: "C-2024-0912", title: "Insurance Claim — Bike Accident", category: "accident", categoryColor: "#E63946",
    lawyer: LAWYERS[1], status: "active", statusLabel: "In Progress", statusColor: "#E9C46A",
    date: "2025-01-23", resolvedDate: null,
    amount: "₹45,000 claim", outcome: null,
    timeline: [
      { date: "Jan 23", event: "Emergency consultation", detail: "Connected with Adv. Rajesh Malhotra after bike accident near Vijay Nagar" },
      { date: "Jan 24", event: "FIR assistance", detail: "Lawyer guided through FIR filing process and insurance documentation" },
      { date: "Jan 26", event: "Claim submitted", detail: "Insurance claim filed with all medical bills, FIR copy, and damage assessment" },
      { date: "Feb 03", event: "Insurer response pending", detail: "Follow-up sent to insurance company. Awaiting surveyor appointment." },
    ],
    documents: ["FIR Copy.pdf", "Medical Bills.pdf", "Damage Photos.zip", "Insurance Claim Form.pdf"],
    notes: "Other party was at fault (ran a stop sign). FIR registered in our favor. Insurance surveyor visit expected within the next week. Claim amount covers medical expenses and bike repair.",
  },
  {
    id: "C-2024-0956", title: "Online Shopping Fraud — Fake Product", category: "consumer", categoryColor: "#2A9D8F",
    lawyer: LAWYERS[2], status: "active", statusLabel: "In Progress", statusColor: "#E9C46A",
    date: "2025-02-01", resolvedDate: null,
    amount: "₹12,500 refund", outcome: null,
    timeline: [
      { date: "Feb 01", event: "Consultation booked", detail: "Connected with Adv. Sunita Desai for consumer fraud complaint" },
      { date: "Feb 02", event: "Legal notice drafted", detail: "Formal legal notice sent to the e-commerce platform and seller" },
      { date: "Feb 05", event: "Platform responded", detail: "E-commerce platform acknowledged the complaint. Seller given 7 days to respond." },
    ],
    documents: ["Order Screenshot.png", "Product Photos.zip", "Legal Notice.pdf", "Platform Response.pdf"],
    notes: "Ordered a branded smartwatch, received a cheap counterfeit. Seller unresponsive. Legal notice sent under Consumer Protection Act, 2019. If no resolution in 15 days, will escalate to Consumer Forum.",
  },
  {
    id: "C-2024-0781", title: "Parking Towing — Illegal Tow", category: "traffic", categoryColor: "#FF6B35",
    lawyer: LAWYERS[0], status: "resolved", statusLabel: "Resolved", statusColor: "#2A9D8F",
    date: "2025-01-10", resolvedDate: "2025-01-12",
    amount: "₹2,500 towing fee", outcome: "Full refund of towing charges + compensation",
    timeline: [
      { date: "Jan 10", event: "SOS consultation", detail: "Emergency call — car towed from legal parking spot near Palasia" },
      { date: "Jan 10", event: "Immediate action", detail: "Lawyer called towing authority and cited parking rules. Demanded justification." },
      { date: "Jan 11", event: "Complaint filed", detail: "RTI filed + complaint to transport commissioner" },
      { date: "Jan 12", event: "Resolved", detail: "Towing charges fully refunded. ₹1,000 additional compensation received." },
    ],
    documents: ["Parking Receipt.pdf", "Towing Receipt.pdf", "Complaint Letter.pdf", "Refund Confirmation.pdf"],
    notes: "Car was parked in a designated paid parking zone with valid receipt. Towing was unauthorized. Quick resolution through direct intervention.",
  },
  {
    id: "C-2024-0998", title: "Cyber Fraud — UPI Scam", category: "cyber", categoryColor: "#6A4C93",
    lawyer: LAWYERS[3], status: "active", statusLabel: "Under Investigation", statusColor: "#457B9D",
    date: "2025-02-04", resolvedDate: null,
    amount: "₹28,000 lost", outcome: null,
    timeline: [
      { date: "Feb 04", event: "Consultation booked", detail: "Connected with Adv. Arjun Kapoor after losing ₹28,000 to a UPI phishing scam" },
      { date: "Feb 04", event: "Cyber complaint filed", detail: "Complaint registered on cybercrime.gov.in with all transaction details" },
      { date: "Feb 05", event: "Bank notified", detail: "Fraud report filed with bank. Account freeze requested on recipient's account." },
    ],
    documents: ["Transaction Screenshots.png", "Cyber Complaint Receipt.pdf", "Bank Fraud Report.pdf"],
    notes: "Received a fake customer care call claiming to be from the bank. Tricked into sharing UPI PIN. Immediate complaint filed. Bank investigation underway. Chances of partial recovery are good if acted within 24 hours (which we did).",
  },
];

const MESSAGES_DATA = [
  {
    id: 1, lawyer: LAWYERS[0], caseId: "C-2024-0847", caseTitle: "Traffic Challan — Red Light",
    unread: 0, lastTime: "Yesterday",
    messages: [
      { from: "lawyer", text: "Good news! I've reviewed the dashcam footage. The signal was clearly yellow when you entered the intersection.", time: "Jan 28, 2:15 PM" },
      { from: "user", text: "That's great! So the challan can be contested?", time: "Jan 28, 2:18 PM" },
      { from: "lawyer", text: "Absolutely. I'm filing an online grievance with the traffic authority today. I'll attach the dashcam clip and the camera angle analysis.", time: "Jan 28, 2:20 PM" },
      { from: "user", text: "Thank you so much. How long does this usually take?", time: "Jan 28, 2:22 PM" },
      { from: "lawyer", text: "Usually 2-4 days for automated camera challans. I'll keep you updated.", time: "Jan 28, 2:23 PM" },
      { from: "lawyer", text: "Update: The grievance has been accepted! Your challan has been dismissed. No fine to pay. I'm sending you the dismissal order now.", time: "Feb 01, 11:30 AM" },
      { from: "user", text: "Amazing! Thank you Priya ma'am, you saved me ₹1,000 and a lot of headache!", time: "Feb 01, 11:35 AM" },
      { from: "lawyer", text: "Happy to help! The dismissal order PDF is in your case documents. Feel free to reach out anytime. 😊", time: "Feb 01, 11:37 AM" },
    ],
  },
  {
    id: 2, lawyer: LAWYERS[1], caseId: "C-2024-0912", caseTitle: "Insurance Claim — Bike Accident",
    unread: 2, lastTime: "2 hours ago",
    messages: [
      { from: "lawyer", text: "I've reviewed the FIR and medical documents. The other party is clearly at fault. We have a strong case for the insurance claim.", time: "Jan 24, 10:00 AM" },
      { from: "user", text: "What's the next step?", time: "Jan 24, 10:05 AM" },
      { from: "lawyer", text: "I'll prepare the insurance claim form with all supporting documents. We're claiming ₹45,000 — medical expenses (₹18,000) + bike repair (₹22,000) + miscellaneous (₹5,000).", time: "Jan 24, 10:08 AM" },
      { from: "user", text: "Sounds good. Please go ahead.", time: "Jan 24, 10:10 AM" },
      { from: "lawyer", text: "Claim submitted successfully. Reference number: INS-2025-78432. Now we wait for the surveyor.", time: "Jan 26, 3:45 PM" },
      { from: "lawyer", text: "Quick update — I've sent a follow-up to the insurance company. They've assigned a surveyor. He should contact you within 3-4 days to inspect the bike.", time: "Feb 03, 9:20 AM" },
      { from: "lawyer", text: "Also, please keep all original medical bills safe. The surveyor might ask to see them. Don't accept any \"settlement\" calls directly from the other party's insurer — route everything through me.", time: "Feb 06, 10:15 AM" },
      { from: "lawyer", text: "One more thing — the surveyor is confirmed for this Saturday between 10 AM - 12 PM at your address. Please make sure the bike is accessible for inspection.", time: "Feb 06, 10:18 AM" },
    ],
  },
  {
    id: 3, lawyer: LAWYERS[2], caseId: "C-2024-0956", caseTitle: "Online Shopping Fraud",
    unread: 1, lastTime: "5 hours ago",
    messages: [
      { from: "lawyer", text: "I've drafted the legal notice. Sending it to you for review before dispatching it to the seller and the platform.", time: "Feb 02, 11:00 AM" },
      { from: "user", text: "Looks good to me. Please send it.", time: "Feb 02, 11:30 AM" },
      { from: "lawyer", text: "Legal notice sent via registered post and email. The seller has 15 days to respond. Meanwhile, the e-commerce platform has also been notified.", time: "Feb 02, 4:00 PM" },
      { from: "lawyer", text: "The platform has responded — they've acknowledged the complaint and given the seller 7 days to resolve it. If the seller doesn't respond, the platform will initiate a refund from their seller guarantee fund.", time: "Feb 05, 2:30 PM" },
      { from: "lawyer", text: "Hi! Just checking in — the seller's 7-day window ends on Feb 12. If no response, I'll escalate to the Consumer Forum immediately. Keep the fake product safe as evidence.", time: "Feb 06, 9:00 AM" },
    ],
  },
  {
    id: 4, lawyer: LAWYERS[3], caseId: "C-2024-0998", caseTitle: "Cyber Fraud — UPI Scam",
    unread: 3, lastTime: "1 hour ago",
    messages: [
      { from: "lawyer", text: "I've filed the cyber complaint. Reference: CC-2025-IND-45678. The complaint is now with the cyber cell for investigation.", time: "Feb 04, 3:00 PM" },
      { from: "user", text: "Do you think I'll get my money back?", time: "Feb 04, 3:05 PM" },
      { from: "lawyer", text: "Since we filed within 24 hours, the chances are decent. The bank has been notified and they're trying to freeze the recipient's account. If the money hasn't been withdrawn yet, recovery is likely.", time: "Feb 04, 3:08 PM" },
      { from: "lawyer", text: "Bank update — they've successfully frozen ₹19,200 in the scammer's account. The remaining ₹8,800 was already withdrawn. We're filing for recovery of the frozen amount.", time: "Feb 05, 4:30 PM" },
      { from: "lawyer", text: "The cyber cell wants you to come in for a statement recording. Can you visit the Cyber Police Station, Vijay Nagar, tomorrow between 11 AM - 1 PM? I'll send you the exact address.", time: "Feb 06, 11:00 AM" },
      { from: "lawyer", text: "Address: Cyber Crime Police Station, 2nd Floor, Vijay Nagar Police Complex, AB Road, Indore - 452010. Ask for Inspector Verma. Carry your phone, Aadhaar, and bank statement.", time: "Feb 06, 11:02 AM" },
      { from: "lawyer", text: "Also good news — the bank has confirmed they'll process the refund of ₹19,200 within 10 working days once the police report is filed. So tomorrow's visit is crucial.", time: "Feb 06, 11:05 AM" },
    ],
  },
];

const USER_PROFILE = {
  name: "Rahul Verma",
  email: "rahul.verma@gmail.com",
  phone: "+91 78690 12345",
  location: "Indore, Madhya Pradesh",
  joined: "November 2024",
  avatar: "RV",
  totalCases: 5,
  activeCases: 3,
  resolvedCases: 2,
  totalSpent: "₹4,847",
  savedAmount: "₹4,500",
};

const STEPS = ["Select Issue", "Choose Lawyer", "Confirm & Connect"];

const pulseKeyframes = `
@keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.3); } }
@keyframes slideUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes ripple { 0% { transform: scale(0.8); opacity: 1; } 100% { transform: scale(2.5); opacity: 0; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes countUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
@keyframes mapDot { 0%, 100% { box-shadow: 0 0 0 0 rgba(255,107,53,0.4); } 50% { box-shadow: 0 0 0 12px rgba(255,107,53,0); } }
@keyframes bounce { 0%, 80%, 100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
@import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,500;0,9..40,700&family=Fraunces:opsz,wght@9..144,600;9..144,800&display=swap');
`;

// ==================== SHARED STYLES ====================

const cardStyle = {
  background: "linear-gradient(145deg, #14141E, #1A1A26)",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 16,
  padding: "18px",
};

const sectionTitle = {
  fontSize: 13, letterSpacing: 1.5, textTransform: "uppercase",
  color: "#8A8A9A", fontWeight: 600, marginBottom: 16,
};

const pageHeader = (title, subtitle) => (
  <div style={{ padding: "20px 0 16px" }}>
    {subtitle && <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase", marginBottom: 4 }}>{subtitle}</div>}
    <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 800, margin: 0, color: "#F0EDE6" }}>{title}</h1>
  </div>
);

// ==================== MAIN APP ====================

export default function LegalOnDemand() {
  const [screen, setScreen] = useState("home");
  const [activeTab, setActiveTab] = useState("home");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLawyer, setSelectedLawyer] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [connectProgress, setConnectProgress] = useState(0);
  const [callTime, setCallTime] = useState(0);
  const [showSOS, setShowSOS] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState({});
  const [casesFilter, setCasesFilter] = useState("all");
  const [profileSection, setProfileSection] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [attachmentPreview, setAttachmentPreview] = useState(null);
  const timerRef = useRef(null);
  const chatEndRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (screen === "connecting") {
      const interval = setInterval(() => {
        setConnectProgress(prev => {
          if (prev >= 100) { clearInterval(interval); setScreen("active"); return 100; }
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, selectedChat]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  const handleCategorySelect = (cat) => { setSelectedCategory(cat); setScreen("lawyers"); };
  const handleLawyerSelect = (lawyer) => { setSelectedLawyer(lawyer); setScreen("confirm"); };
  const handleConnect = () => { setConnectProgress(0); setScreen("connecting"); };
  const handleEndCall = () => { clearInterval(timerRef.current); setCallTime(0); setScreen("home"); setActiveTab("home"); setSelectedCategory(null); setSelectedLawyer(null); };

  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === "home") { setScreen("home"); setSelectedCategory(null); setSelectedLawyer(null); setSelectedCase(null); setSelectedChat(null); }
    else if (tab === "cases") { setScreen("cases"); setSelectedCase(null); }
    else if (tab === "messages") { setScreen("messages"); setSelectedChat(null); }
    else if (tab === "profile") { setScreen("profile"); setProfileSection(null); }
  };

  const handleSendMessage = async () => {
    if ((!chatInput.trim() && !attachmentPreview) || !selectedChat) return;
    const key = selectedChat.id;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

    const newMsgs = [];
    if (attachmentPreview) {
      newMsgs.push({ from: "user", text: "", attachment: attachmentPreview, time: timeStr });
    }
    if (chatInput.trim()) {
      newMsgs.push({ from: "user", text: chatInput, time: timeStr });
    }

    const userText = chatInput.trim();
    setChatMessages(prev => ({ ...prev, [key]: [...(prev[key] || []), ...newMsgs] }));
    setChatInput("");
    setAttachmentPreview(null);

    // AI lawyer response
    if (userText) {
      setIsTyping(true);
      try {
        const caseData = CASES_DATA.find(c => c.id === selectedChat.caseId);
        const existingMsgs = getAllMessages(selectedChat);
        const recentContext = existingMsgs.slice(-6).map(m =>
          `${m.from === "user" ? "Client" : "Lawyer"}: ${m.text}`
        ).join("\n");

        const systemPrompt = `You are ${selectedChat.lawyer.name}, a verified Indian lawyer specializing in ${selectedChat.lawyer.speciality}. You are chatting with a client on NyayNow, an on-demand legal help platform.

Case: ${caseData ? caseData.title : selectedChat.caseTitle} (${selectedChat.caseId})
${caseData ? `Status: ${caseData.statusLabel}. Notes: ${caseData.notes}` : ""}

Guidelines:
- Be warm, professional and reassuring
- Give specific, actionable Indian legal advice
- Reference relevant Indian laws, sections, or procedures when applicable
- Keep responses concise (2-4 sentences usually, up to a short paragraph for complex questions)
- Use simple language the client can understand
- If they share a document/photo, acknowledge it and explain what you see or what you'll do with it
- Never say you're an AI — you are the lawyer`;

        const conversationHistory = existingMsgs.slice(-8).map(m => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.text || "(shared a file)"
        })).filter(m => m.content);

        conversationHistory.push({ role: "user", content: userText });

        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            system: systemPrompt,
            messages: conversationHistory,
          })
        });

        const data = await response.json();
        const lawyerText = data.content?.map(b => b.text || "").join("") || "I'll look into this and get back to you shortly.";
        const replyTime = new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });

        setIsTyping(false);
        setChatMessages(prev => ({
          ...prev,
          [key]: [...(prev[key] || []), ...newMsgs.slice(0, 0), { from: "lawyer", text: lawyerText, time: replyTime }]
        }));
      } catch (err) {
        setIsTyping(false);
        const replyTime = new Date().toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
        setChatMessages(prev => ({
          ...prev,
          [key]: [...(prev[key] || []), { from: "lawyer", text: "Sorry, I'm stepping away for a moment. I'll review your message and respond shortly. You can also try calling me directly for urgent matters.", time: replyTime }]
        }));
      }
    }
  };

  const handleFileAttach = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setAttachmentPreview({
        name: file.name,
        type: file.type.startsWith("image/") ? "image" : "file",
        size: (file.size / 1024).toFixed(1) + " KB",
        dataUrl: file.type.startsWith("image/") ? ev.target.result : null,
      });
    };
    reader.readAsDataURL(file);
  };

  const getAllMessages = (chat) => {
    const extra = chatMessages[chat.id] || [];
    return [...chat.messages, ...extra];
  };

  const filteredLawyers = LAWYERS.filter(l =>
    l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.speciality.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredCases = casesFilter === "all" ? CASES_DATA :
    casesFilter === "active" ? CASES_DATA.filter(c => c.status === "active") :
    CASES_DATA.filter(c => c.status === "resolved");

  const totalUnread = MESSAGES_DATA.reduce((sum, m) => sum + m.unread, 0);

  const stepIndex = screen === "lawyers" ? 1 : screen === "confirm" ? 2 : 0;

  // ==================== RENDER ====================

  return (
    <div style={{
      fontFamily: "'DM Sans', sans-serif", background: "#0A0A0F", minHeight: "100vh",
      maxWidth: 430, margin: "0 auto", position: "relative", overflow: "hidden", color: "#F0EDE6",
    }}>
      <style>{pulseKeyframes}</style>

      {/* Ambient background */}
      <div style={{ position: "fixed", top: -100, right: -100, width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />
      <div style={{ position: "fixed", bottom: -80, left: -80, width: 250, height: 250, borderRadius: "50%", background: "radial-gradient(circle, rgba(42,157,143,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      {/* ===== HOME SCREEN ===== */}
      {screen === "home" && (
        <div style={{ padding: "0 20px 100px", animation: "fadeIn 0.4s ease" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "20px 0 8px" }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: "#FF6B35", fontWeight: 700, marginBottom: 4 }}>● Legal Help On-Demand</div>
              <h1 style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 800, margin: 0, background: "linear-gradient(135deg, #F0EDE6, #FF6B35)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>NyayNow</h1>
            </div>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <button onClick={() => setShowSOS(!showSOS)} style={{ background: "#E63946", border: "none", color: "white", borderRadius: 12, padding: "8px 14px", fontSize: 12, fontWeight: 700, cursor: "pointer", letterSpacing: 1, boxShadow: "0 0 20px rgba(230,57,70,0.3)" }}>SOS</button>
              <div onClick={() => handleTabSwitch("profile")} style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #FF6B3533, #FF6B3511)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, cursor: "pointer", border: "1px solid rgba(255,107,53,0.2)", fontWeight: 700, color: "#FF6B35" }}>RV</div>
            </div>
          </div>

          {showSOS && (
            <div style={{ background: "linear-gradient(135deg, #E63946, #C1121F)", borderRadius: 16, padding: 20, marginTop: 12, animation: "slideUp 0.3s ease" }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>🚨 Emergency Legal SOS</div>
              <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 16 }}>Instantly connect with the nearest available lawyer. Best for wrongful arrests, accidents, or emergencies.</div>
              <button onClick={() => { setSelectedCategory(CATEGORIES[1]); setSelectedLawyer(LAWYERS[0]); handleConnect(); setShowSOS(false); }} style={{ width: "100%", padding: "14px", background: "rgba(255,255,255,0.2)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 12, color: "white", fontWeight: 700, fontSize: 15, cursor: "pointer", backdropFilter: "blur(10px)" }}>
                Connect Now — Free First 2 Min
              </button>
            </div>
          )}

          <div style={{ background: "linear-gradient(135deg, rgba(42,157,143,0.12), rgba(42,157,143,0.04))", border: "1px solid rgba(42,157,143,0.2)", borderRadius: 16, padding: "14px 18px", marginTop: 20, display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2A9D8F", animation: "pulse 2s infinite", flexShrink: 0 }} />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>24 lawyers online near you</div>
              <div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>Avg. response time: 3 minutes</div>
            </div>
          </div>

          <div style={{ marginTop: 28 }}>
            <h2 style={sectionTitle}>What do you need help with?</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {CATEGORIES.map((cat, i) => (
                <button key={cat.id} onClick={() => handleCategorySelect(cat)} style={{
                  ...cardStyle, padding: "20px 16px", textAlign: "left", cursor: "pointer", color: "#F0EDE6",
                  transition: "all 0.2s ease", position: "relative", overflow: "hidden",
                  animation: `slideUp 0.4s ease ${i * 0.06}s both`,
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = cat.color + "55"; e.currentTarget.style.transform = "translateY(-2px)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; e.currentTarget.style.transform = "translateY(0)"; }}
                >
                  <div style={{ position: "absolute", top: -20, right: -20, width: 80, height: 80, borderRadius: "50%", background: cat.color, opacity: 0.06 }} />
                  <div style={{ fontSize: 28, marginBottom: 10 }}>{cat.icon}</div>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{cat.label}</div>
                  <div style={{ fontSize: 11, color: "#8A8A9A", lineHeight: 1.4 }}>{cat.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginTop: 32 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ ...sectionTitle, marginBottom: 0 }}>Recent Activity</h2>
              <button onClick={() => handleTabSwitch("cases")} style={{ background: "none", border: "none", color: "#FF6B35", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>View All →</button>
            </div>
            {CASES_DATA.slice(0, 2).map((item, i) => (
              <div key={item.id} onClick={() => { setSelectedCase(item); setScreen("caseDetail"); setActiveTab("cases"); }} style={{
                ...cardStyle, borderRadius: 14, marginBottom: 10, cursor: "pointer",
                animation: `slideUp 0.4s ease ${0.3 + i * 0.08}s both`, transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{item.title}</div>
                    <div style={{ fontSize: 12, color: "#8A8A9A", marginTop: 4 }}>{item.lawyer.name} · {item.date}</div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: item.statusColor, background: item.statusColor + "18", padding: "4px 10px", borderRadius: 8 }}>
                    {item.statusLabel}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== LAWYERS LIST ===== */}
      {screen === "lawyers" && (
        <div style={{ padding: "0 20px 100px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ padding: "20px 0 12px", display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => { setScreen("home"); setActiveTab("home"); }} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#F0EDE6", width: 38, height: 38, borderRadius: 12, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
            <div>
              <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Step {stepIndex + 1} of 3</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>Choose Your Lawyer</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
            {STEPS.map((s, i) => (<div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= stepIndex ? "#FF6B35" : "rgba(255,255,255,0.08)", transition: "all 0.3s ease" }} />))}
          </div>
          {selectedCategory && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: selectedCategory.color + "18", border: `1px solid ${selectedCategory.color}33`, borderRadius: 10, padding: "8px 14px", marginBottom: 16 }}>
              <span style={{ fontSize: 16 }}>{selectedCategory.icon}</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: selectedCategory.color }}>{selectedCategory.label}</span>
            </div>
          )}
          <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "12px 16px", marginBottom: 20, display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ opacity: 0.5 }}>🔍</span>
            <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search by name or speciality..." style={{ background: "none", border: "none", color: "#F0EDE6", fontSize: 14, outline: "none", width: "100%", fontFamily: "inherit" }} />
          </div>
          <div style={{ display: "flex", gap: 8, marginBottom: 20, overflowX: "auto" }}>
            {["Nearest", "Top Rated", "Lowest Price", "Most Cases"].map((pill, i) => (
              <button key={pill} style={{ background: i === 0 ? "#FF6B35" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: "8px 14px", color: i === 0 ? "white" : "#8A8A9A", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>{pill}</button>
            ))}
          </div>
          {filteredLawyers.map((lawyer, i) => (
            <button key={lawyer.id} onClick={() => lawyer.available && handleLawyerSelect(lawyer)} style={{
              width: "100%", textAlign: "left", cursor: lawyer.available ? "pointer" : "default",
              ...cardStyle, borderRadius: 18, marginBottom: 12, color: "#F0EDE6", position: "relative",
              opacity: lawyer.available ? 1 : 0.5, transition: "all 0.2s ease", animation: `slideUp 0.4s ease ${i * 0.07}s both`,
            }}
              onMouseEnter={e => { if (lawyer.available) e.currentTarget.style.borderColor = "#FF6B3544"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              {lawyer.badge && (
                <span style={{ position: "absolute", top: 14, right: 14, fontSize: 10, fontWeight: 700, background: lawyer.badge === "Premium" ? "linear-gradient(135deg, #E9C46A, #F4A261)" : lawyer.badge === "Top Rated" ? "linear-gradient(135deg, #FF6B35, #E63946)" : "linear-gradient(135deg, #457B9D, #2A9D8F)", color: "white", padding: "3px 10px", borderRadius: 8, letterSpacing: 0.5 }}>
                  {lawyer.badge}
                </span>
              )}
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, flexShrink: 0, background: `linear-gradient(135deg, ${selectedCategory?.color || '#FF6B35'}44, ${selectedCategory?.color || '#FF6B35'}11)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, fontWeight: 700, color: selectedCategory?.color || '#FF6B35', border: `1px solid ${selectedCategory?.color || '#FF6B35'}33` }}>
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
                      {lawyer.lang.map(l => (<span key={l} style={{ fontSize: 10, background: "rgba(255,255,255,0.06)", borderRadius: 6, padding: "3px 8px", color: "#8A8A9A" }}>{l}</span>))}
                    </div>
                    <div style={{ fontFamily: "'Fraunces', serif", fontWeight: 700, fontSize: 18, color: "#FF6B35" }}>
                      ₹{lawyer.price}<span style={{ fontSize: 11, fontWeight: 400, color: "#8A8A9A" }}>/consult</span>
                    </div>
                  </div>
                </div>
              </div>
              {!lawyer.available && (
                <div style={{ position: "absolute", inset: 0, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(10,10,15,0.6)", backdropFilter: "blur(2px)" }}>
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
            <button onClick={() => setScreen("lawyers")} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#F0EDE6", width: 38, height: 38, borderRadius: 12, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
            <div>
              <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 600, letterSpacing: 1, textTransform: "uppercase" }}>Step 3 of 3</div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>Confirm & Connect</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
            {STEPS.map((s, i) => (<div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= 2 ? "#FF6B35" : "rgba(255,255,255,0.08)" }} />))}
          </div>
          <div style={{ ...cardStyle, borderRadius: 20, padding: 24, textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, borderRadius: "50%", background: `radial-gradient(circle, ${selectedCategory?.color || '#FF6B35'}15, transparent)` }} />
            <div style={{ width: 80, height: 80, borderRadius: 20, margin: "0 auto 16px", background: `linear-gradient(135deg, ${selectedCategory?.color || '#FF6B35'}55, ${selectedCategory?.color || '#FF6B35'}22)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: selectedCategory?.color || '#FF6B35', border: `2px solid ${selectedCategory?.color || '#FF6B35'}44` }}>
              {selectedLawyer.avatar}
            </div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{selectedLawyer.name}</div>
            <div style={{ fontSize: 13, color: "#8A8A9A", marginTop: 4 }}>{selectedLawyer.speciality}</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 24, background: "rgba(0,0,0,0.3)", borderRadius: 14, padding: 16 }}>
              <div><div style={{ fontSize: 22, fontWeight: 700, color: "#E9C46A", fontFamily: "'Fraunces', serif" }}>{selectedLawyer.rating}</div><div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>Rating</div></div>
              <div><div style={{ fontSize: 22, fontWeight: 700, color: "#2A9D8F", fontFamily: "'Fraunces', serif" }}>{selectedLawyer.cases}</div><div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>Cases</div></div>
              <div><div style={{ fontSize: 22, fontWeight: 700, color: "#FF6B35", fontFamily: "'Fraunces', serif" }}>{selectedLawyer.eta}</div><div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>ETA</div></div>
            </div>
          </div>
          <div style={{ ...cardStyle, padding: 20, marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8A8A9A", marginBottom: 16 }}>Pricing</div>
            {[{ label: "Consultation Fee", value: `₹${selectedLawyer.price}` }, { label: "Platform Fee", value: "₹49" }, { label: "GST (18%)", value: `₹${Math.round((selectedLawyer.price + 49) * 0.18)}` }].map((item, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 10, fontSize: 14 }}>
                <span style={{ color: "#8A8A9A" }}>{item.label}</span><span style={{ fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: 12, marginTop: 8, display: "flex", justifyContent: "space-between", fontSize: 16 }}>
              <span style={{ fontWeight: 700 }}>Total</span>
              <span style={{ fontWeight: 800, color: "#FF6B35", fontFamily: "'Fraunces', serif", fontSize: 20 }}>₹{selectedLawyer.price + 49 + Math.round((selectedLawyer.price + 49) * 0.18)}</span>
            </div>
          </div>
          <div style={{ ...cardStyle, padding: 20, marginTop: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: "#8A8A9A", marginBottom: 14 }}>What to Expect</div>
            {["15-minute video/voice consultation", "Document review & legal opinion", "Follow-up summary via email", "Option to extend at ₹200/10 min"].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#2A9D8F", flexShrink: 0 }} />
                <span style={{ fontSize: 13, color: "#B0B0B8" }}>{item}</span>
              </div>
            ))}
          </div>
          <button onClick={handleConnect} style={{ width: "100%", padding: "18px", marginTop: 24, background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: 16, color: "white", fontSize: 16, fontWeight: 700, cursor: "pointer", letterSpacing: 0.5, boxShadow: "0 8px 32px rgba(255,107,53,0.3)" }}>
            Connect Now — ₹{selectedLawyer.price + 49 + Math.round((selectedLawyer.price + 49) * 0.18)}
          </button>
          <div style={{ textAlign: "center", fontSize: 11, color: "#8A8A9A", marginTop: 10 }}>🔒 Secure payment via UPI, Card or Wallet</div>
        </div>
      )}

      {/* ===== CONNECTING ===== */}
      {screen === "connecting" && selectedLawyer && (
        <div style={{ padding: "0 20px", animation: "fadeIn 0.3s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center" }}>
          <div style={{ position: "relative", width: 120, height: 120, marginBottom: 40 }}>
            {[0, 0.5, 1].map(d => (<div key={d} style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "2px solid #FF6B35", animation: `ripple 2s infinite ${d}s` }} />))}
            <div style={{ width: 120, height: 120, borderRadius: "50%", background: "linear-gradient(135deg, #FF6B3544, #FF6B3522)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#FF6B35", position: "relative", zIndex: 1 }}>{selectedLawyer.avatar}</div>
          </div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Connecting you with</div>
          <div style={{ fontSize: 18, color: "#FF6B35", fontWeight: 600, marginBottom: 24 }}>{selectedLawyer.name}</div>
          <div style={{ width: "80%", height: 4, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden", marginBottom: 12 }}>
            <div style={{ width: `${connectProgress}%`, height: "100%", background: "linear-gradient(90deg, #FF6B35, #E63946)", borderRadius: 2, transition: "width 0.1s linear" }} />
          </div>
          <div style={{ fontSize: 13, color: "#8A8A9A" }}>
            {connectProgress < 30 ? "Verifying payment..." : connectProgress < 60 ? "Notifying lawyer..." : connectProgress < 90 ? "Setting up secure channel..." : "Almost there..."}
          </div>
        </div>
      )}

      {/* ===== ACTIVE CALL ===== */}
      {screen === "active" && selectedLawyer && (
        <div style={{ padding: "0 20px", animation: "fadeIn 0.4s ease", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", textAlign: "center" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2A9D8F", animation: "pulse 1.5s infinite" }} />
              <span style={{ fontSize: 12, color: "#2A9D8F", fontWeight: 600 }}>LIVE</span>
            </div>
            <span style={{ fontSize: 12, color: "#8A8A9A" }}>🔒 Encrypted</span>
          </div>
          <div style={{ width: 100, height: 100, borderRadius: "50%", background: "linear-gradient(135deg, #2A9D8F44, #2A9D8F22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 32, fontWeight: 700, color: "#2A9D8F", border: "3px solid #2A9D8F44", marginBottom: 24, animation: "mapDot 2s infinite" }}>{selectedLawyer.avatar}</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700 }}>{selectedLawyer.name}</div>
          <div style={{ fontSize: 13, color: "#8A8A9A", marginTop: 4 }}>{selectedCategory?.label}</div>
          <div style={{ fontFamily: "'Fraunces', serif", fontSize: 48, fontWeight: 700, color: "#2A9D8F", margin: "32px 0", letterSpacing: 4, animation: "countUp 0.5s ease" }}>{formatTime(callTime)}</div>
          <div style={{ display: "flex", gap: 20, marginTop: 16 }}>
            {[{ icon: "🔇", label: "Mute" }, { icon: "📹", label: "Video" }, { icon: "📎", label: "Share" }, { icon: "💬", label: "Chat" }].map(action => (
              <button key={action.label} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, width: 60, height: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#F0EDE6", gap: 4 }}>
                <span style={{ fontSize: 20 }}>{action.icon}</span><span style={{ fontSize: 9, color: "#8A8A9A" }}>{action.label}</span>
              </button>
            ))}
          </div>
          <button onClick={handleEndCall} style={{ marginTop: 40, width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #E63946, #C1121F)", border: "none", fontSize: 28, cursor: "pointer", color: "white", boxShadow: "0 8px 32px rgba(230,57,70,0.4)", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
          <div style={{ fontSize: 12, color: "#8A8A9A", marginTop: 12 }}>End Consultation</div>
        </div>
      )}

      {/* ===== CASES SCREEN ===== */}
      {screen === "cases" && !selectedCase && (
        <div style={{ padding: "0 20px 100px", animation: "fadeIn 0.3s ease" }}>
          {pageHeader("My Cases", "Legal Dashboard")}

          {/* Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: 24 }}>
            {[
              { label: "Total", value: USER_PROFILE.totalCases, color: "#FF6B35" },
              { label: "Active", value: USER_PROFILE.activeCases, color: "#E9C46A" },
              { label: "Resolved", value: USER_PROFILE.resolvedCases, color: "#2A9D8F" },
            ].map((s, i) => (
              <div key={i} style={{ ...cardStyle, textAlign: "center", padding: "16px 12px", animation: `slideUp 0.3s ease ${i * 0.05}s both` }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 28, fontWeight: 700, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {[{ key: "all", label: "All Cases" }, { key: "active", label: "Active" }, { key: "resolved", label: "Resolved" }].map(f => (
              <button key={f.key} onClick={() => setCasesFilter(f.key)} style={{
                background: casesFilter === f.key ? "#FF6B35" : "rgba(255,255,255,0.06)",
                border: "none", borderRadius: 10, padding: "8px 16px",
                color: casesFilter === f.key ? "white" : "#8A8A9A", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>{f.label}</button>
            ))}
          </div>

          {/* Case Cards */}
          {filteredCases.map((c, i) => (
            <div key={c.id} onClick={() => { setSelectedCase(c); setScreen("caseDetail"); }} style={{
              ...cardStyle, marginBottom: 12, cursor: "pointer", transition: "all 0.2s",
              animation: `slideUp 0.3s ease ${i * 0.06}s both`,
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = c.categoryColor + "44"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, background: c.categoryColor + "22", color: c.categoryColor, padding: "3px 8px", borderRadius: 6, fontWeight: 600 }}>{c.id}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: c.statusColor, background: c.statusColor + "18", padding: "3px 10px", borderRadius: 6 }}>{c.statusLabel}</span>
                </div>
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{c.title}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: `linear-gradient(135deg, ${c.categoryColor}44, ${c.categoryColor}11)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: c.categoryColor }}>{c.lawyer.avatar}</div>
                  <span style={{ fontSize: 12, color: "#8A8A9A" }}>{c.lawyer.name}</span>
                </div>
                <span style={{ fontSize: 12, color: "#8A8A9A" }}>{c.date}</span>
              </div>
              {c.amount && <div style={{ fontSize: 12, color: "#FF6B35", marginTop: 10, fontWeight: 600 }}>{c.amount}</div>}
            </div>
          ))}
        </div>
      )}

      {/* ===== CASE DETAIL ===== */}
      {screen === "caseDetail" && selectedCase && (
        <div style={{ padding: "0 20px 100px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ padding: "20px 0 12px", display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => { setSelectedCase(null); setScreen("cases"); }} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#F0EDE6", width: 38, height: 38, borderRadius: 12, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, color: selectedCase.categoryColor, fontWeight: 600 }}>{selectedCase.id}</div>
              <div style={{ fontSize: 16, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{selectedCase.title}</div>
            </div>
            <span style={{ fontSize: 11, fontWeight: 600, color: selectedCase.statusColor, background: selectedCase.statusColor + "18", padding: "5px 12px", borderRadius: 8 }}>{selectedCase.statusLabel}</span>
          </div>

          {/* Lawyer Card */}
          <div style={{ ...cardStyle, display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg, ${selectedCase.categoryColor}44, ${selectedCase.categoryColor}11)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, color: selectedCase.categoryColor }}>{selectedCase.lawyer.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedCase.lawyer.name}</div>
              <div style={{ fontSize: 12, color: "#8A8A9A" }}>{selectedCase.lawyer.speciality}</div>
            </div>
            <button onClick={() => {
              const chat = MESSAGES_DATA.find(m => m.caseId === selectedCase.id);
              if (chat) { setSelectedChat(chat); setScreen("chatDetail"); setActiveTab("messages"); }
            }} style={{ background: "#FF6B3522", border: "1px solid #FF6B3544", borderRadius: 10, padding: "8px 14px", color: "#FF6B35", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
              💬 Chat
            </button>
          </div>

          {/* Outcome */}
          {selectedCase.outcome && (
            <div style={{ background: "linear-gradient(135deg, rgba(42,157,143,0.12), rgba(42,157,143,0.04))", border: "1px solid rgba(42,157,143,0.2)", borderRadius: 14, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#2A9D8F", letterSpacing: 1, textTransform: "uppercase", marginBottom: 6 }}>Outcome</div>
              <div style={{ fontSize: 14, fontWeight: 600 }}>{selectedCase.outcome}</div>
            </div>
          )}

          {/* Notes */}
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ ...sectionTitle, marginBottom: 10 }}>Case Notes</div>
            <div style={{ fontSize: 13, color: "#B0B0B8", lineHeight: 1.7 }}>{selectedCase.notes}</div>
          </div>

          {/* Timeline */}
          <div style={{ ...cardStyle, marginBottom: 16 }}>
            <div style={{ ...sectionTitle, marginBottom: 16 }}>Timeline</div>
            {selectedCase.timeline.map((t, i) => (
              <div key={i} style={{ display: "flex", gap: 14, marginBottom: i < selectedCase.timeline.length - 1 ? 20 : 0, position: "relative" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 }}>
                  <div style={{ width: 10, height: 10, borderRadius: "50%", background: i === selectedCase.timeline.length - 1 ? selectedCase.statusColor : "rgba(255,255,255,0.15)", border: i === selectedCase.timeline.length - 1 ? `2px solid ${selectedCase.statusColor}` : "2px solid rgba(255,255,255,0.1)" }} />
                  {i < selectedCase.timeline.length - 1 && <div style={{ width: 1, flex: 1, background: "rgba(255,255,255,0.08)", marginTop: 4 }} />}
                </div>
                <div style={{ paddingBottom: 4 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 11, color: "#8A8A9A" }}>{t.date}</span>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{t.event}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#8A8A9A", marginTop: 4, lineHeight: 1.5 }}>{t.detail}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Documents */}
          <div style={{ ...cardStyle }}>
            <div style={{ ...sectionTitle, marginBottom: 12 }}>Documents ({selectedCase.documents.length})</div>
            {selectedCase.documents.map((doc, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                  {doc.endsWith(".pdf") ? "📄" : doc.endsWith(".mp4") ? "🎬" : doc.endsWith(".zip") ? "📦" : doc.endsWith(".png") ? "🖼" : "📁"}
                </div>
                <div style={{ flex: 1, fontSize: 13, fontWeight: 500 }}>{doc}</div>
                <button style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px 12px", color: "#8A8A9A", fontSize: 11, cursor: "pointer" }}>View</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===== MESSAGES SCREEN ===== */}
      {screen === "messages" && !selectedChat && (
        <div style={{ padding: "0 20px 100px", animation: "fadeIn 0.3s ease" }}>
          {pageHeader("Messages", `${totalUnread} unread`)}

          {MESSAGES_DATA.map((chat, i) => (
            <div key={chat.id} onClick={() => { setSelectedChat(chat); setScreen("chatDetail"); }} style={{
              ...cardStyle, marginBottom: 12, cursor: "pointer", transition: "all 0.2s",
              animation: `slideUp 0.3s ease ${i * 0.06}s both`,
              borderColor: chat.unread > 0 ? "rgba(255,107,53,0.2)" : "rgba(255,255,255,0.06)",
            }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B3544"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = chat.unread > 0 ? "rgba(255,107,53,0.2)" : "rgba(255,255,255,0.06)"; }}
            >
              <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #FF6B3544, #FF6B3511)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#FF6B35" }}>
                    {chat.lawyer.avatar}
                  </div>
                  {chat.unread > 0 && (
                    <div style={{ position: "absolute", top: -4, right: -4, width: 20, height: 20, borderRadius: "50%", background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "white", border: "2px solid #0A0A0F" }}>
                      {chat.unread}
                    </div>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                    <div style={{ fontSize: 14, fontWeight: 700 }}>{chat.lawyer.name}</div>
                    <span style={{ fontSize: 11, color: chat.unread > 0 ? "#FF6B35" : "#8A8A9A", fontWeight: chat.unread > 0 ? 600 : 400, flexShrink: 0 }}>{chat.lastTime}</span>
                  </div>
                  <div style={{ fontSize: 12, color: "#8A8A9A", marginBottom: 6 }}>{chat.caseTitle}</div>
                  <div style={{ fontSize: 13, color: chat.unread > 0 ? "#D0D0D8" : "#8A8A9A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {chat.messages[chat.messages.length - 1].text}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== CHAT DETAIL ===== */}
      {screen === "chatDetail" && selectedChat && (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", animation: "fadeIn 0.2s ease" }}>
          {/* Chat Header */}
          <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", gap: 12, flexShrink: 0, background: "rgba(10,10,15,0.95)", backdropFilter: "blur(20px)" }}>
            <button onClick={() => { setSelectedChat(null); setScreen("messages"); }} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#F0EDE6", width: 36, height: 36, borderRadius: 10, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
            <div style={{ position: "relative" }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: "linear-gradient(135deg, #FF6B3544, #FF6B3511)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color: "#FF6B35" }}>{selectedChat.lawyer.avatar}</div>
              <div style={{ position: "absolute", bottom: -1, right: -1, width: 10, height: 10, borderRadius: "50%", background: "#2A9D8F", border: "2px solid #0A0A0F" }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{selectedChat.lawyer.name}</div>
              <div style={{ fontSize: 11, color: isTyping ? "#FF6B35" : "#2A9D8F", transition: "color 0.3s" }}>
                {isTyping ? "typing..." : "● Online"}
              </div>
            </div>
            <button style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, width: 36, height: 36, cursor: "pointer", color: "#8A8A9A", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>📞</button>
            <button onClick={() => {
              const c = CASES_DATA.find(cs => cs.id === selectedChat.caseId);
              if (c) { setSelectedCase(c); setScreen("caseDetail"); setActiveTab("cases"); }
            }} style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 10, padding: "6px 12px", color: "#8A8A9A", fontSize: 11, cursor: "pointer", fontWeight: 600 }}>
              View Case
            </button>
          </div>

          {/* Case Banner */}
          <div style={{ padding: "10px 20px", background: "rgba(255,107,53,0.06)", borderBottom: "1px solid rgba(255,107,53,0.1)", flexShrink: 0 }}>
            <div style={{ fontSize: 11, color: "#FF6B35", fontWeight: 600 }}>📋 {selectedChat.caseId} — {selectedChat.caseTitle}</div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 8 }}>
            {/* Encrypted notice */}
            <div style={{ textAlign: "center", margin: "4px 0 12px" }}>
              <span style={{ fontSize: 10, color: "#8A8A9A", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "4px 12px" }}>
                🔒 Messages are end-to-end encrypted
              </span>
            </div>

            {getAllMessages(selectedChat).map((msg, i, arr) => {
              const prevMsg = arr[i - 1];
              const showTimeDivider = i === 0 || (prevMsg && msg.time && prevMsg.time && msg.time.split(",")[0] !== prevMsg.time.split(",")[0]);
              return (
                <div key={i}>
                  {showTimeDivider && msg.time && msg.time.includes(",") && (
                    <div style={{ textAlign: "center", margin: "12px 0 8px" }}>
                      <span style={{ fontSize: 10, color: "#8A8A9A", background: "rgba(255,255,255,0.04)", borderRadius: 8, padding: "3px 10px" }}>
                        {msg.time.split(",")[0]}
                      </span>
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: msg.from === "user" ? "flex-end" : "flex-start", animation: `slideUp 0.2s ease ${Math.min(i * 0.03, 0.3)}s both` }}>
                    {msg.from === "lawyer" && (
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #FF6B3533, #FF6B3511)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#FF6B35", marginRight: 8, marginTop: 2, flexShrink: 0 }}>
                        {selectedChat.lawyer.avatar}
                      </div>
                    )}
                    <div style={{
                      maxWidth: "78%", padding: "12px 16px", borderRadius: 16,
                      borderBottomRightRadius: msg.from === "user" ? 4 : 16,
                      borderBottomLeftRadius: msg.from === "lawyer" ? 4 : 16,
                      background: msg.from === "user" ? "linear-gradient(135deg, #FF6B35, #E65525)" : "rgba(255,255,255,0.06)",
                      color: msg.from === "user" ? "white" : "#F0EDE6",
                    }}>
                      {/* Attachment */}
                      {msg.attachment && (
                        <div style={{ marginBottom: msg.text ? 8 : 0 }}>
                          {msg.attachment.type === "image" && msg.attachment.dataUrl ? (
                            <img src={msg.attachment.dataUrl} alt={msg.attachment.name} style={{ maxWidth: "100%", borderRadius: 10, maxHeight: 200, objectFit: "cover" }} />
                          ) : (
                            <div style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,0.2)", borderRadius: 10, padding: "10px 14px" }}>
                              <span style={{ fontSize: 24 }}>📄</span>
                              <div>
                                <div style={{ fontSize: 13, fontWeight: 600 }}>{msg.attachment.name}</div>
                                <div style={{ fontSize: 11, opacity: 0.7 }}>{msg.attachment.size}</div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                      {msg.text && <div style={{ fontSize: 14, lineHeight: 1.6 }}>{msg.text}</div>}
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 4, marginTop: 6 }}>
                        <span style={{ fontSize: 10, color: msg.from === "user" ? "rgba(255,255,255,0.6)" : "#8A8A9A" }}>{msg.time}</span>
                        {msg.from === "user" && <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)" }}>✓✓</span>}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Typing Indicator */}
            {isTyping && (
              <div style={{ display: "flex", alignItems: "flex-end", gap: 8, animation: "fadeIn 0.3s ease" }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: "linear-gradient(135deg, #FF6B3533, #FF6B3511)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#FF6B35", flexShrink: 0 }}>
                  {selectedChat.lawyer.avatar}
                </div>
                <div style={{ background: "rgba(255,255,255,0.06)", borderRadius: 16, borderBottomLeftRadius: 4, padding: "14px 18px", display: "flex", gap: 5 }}>
                  {[0, 1, 2].map(j => (
                    <div key={j} style={{
                      width: 7, height: 7, borderRadius: "50%", background: "#8A8A9A",
                      animation: `pulse 1.2s infinite ${j * 0.2}s`,
                    }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Attachment Preview */}
          {attachmentPreview && (
            <div style={{ padding: "10px 20px", borderTop: "1px solid rgba(255,255,255,0.06)", background: "rgba(10,10,15,0.95)", display: "flex", alignItems: "center", gap: 12 }}>
              {attachmentPreview.type === "image" && attachmentPreview.dataUrl ? (
                <img src={attachmentPreview.dataUrl} alt="" style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
              ) : (
                <div style={{ width: 48, height: 48, borderRadius: 8, background: "rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📄</div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>{attachmentPreview.name}</div>
                <div style={{ fontSize: 11, color: "#8A8A9A" }}>{attachmentPreview.size}</div>
              </div>
              <button onClick={() => setAttachmentPreview(null)} style={{ background: "none", border: "none", color: "#E63946", fontSize: 18, cursor: "pointer", padding: 4 }}>✕</button>
            </div>
          )}

          {/* Quick Replies */}
          <div style={{ padding: "8px 20px 0", display: "flex", gap: 8, overflowX: "auto", flexShrink: 0 }}>
            {["What are my options?", "What documents do I need?", "How long will this take?", "What's the cost?"].map(q => (
              <button key={q} onClick={() => setChatInput(q)} style={{
                background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.15)",
                borderRadius: 20, padding: "6px 14px", color: "#FF6B35", fontSize: 11, fontWeight: 600,
                cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0, transition: "all 0.2s",
              }}>
                {q}
              </button>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: "10px 20px 24px", borderTop: "1px solid rgba(255,255,255,0.06)", display: "flex", gap: 8, flexShrink: 0, background: "rgba(10,10,15,0.95)", alignItems: "flex-end" }}>
            <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*,.pdf,.doc,.docx" onChange={handleFileAttach} />
            <button onClick={() => fileInputRef.current?.click()} style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "none", fontSize: 18, cursor: "pointer", color: "#8A8A9A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📎</button>
            <button style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.06)", border: "none", fontSize: 18, cursor: "pointer", color: "#8A8A9A", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>📷</button>
            <input value={chatInput} onChange={e => setChatInput(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSendMessage(); }}}
              placeholder="Type a message..." style={{ flex: 1, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "12px 16px", color: "#F0EDE6", fontSize: 14, outline: "none", fontFamily: "inherit" }} />
            <button onClick={handleSendMessage} disabled={isTyping} style={{
              width: 42, height: 42, borderRadius: 12, border: "none", fontSize: 18, cursor: isTyping ? "wait" : "pointer",
              color: "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s",
              background: (chatInput.trim() || attachmentPreview) && !isTyping ? "linear-gradient(135deg, #FF6B35, #E65525)" : "rgba(255,255,255,0.06)",
              boxShadow: (chatInput.trim() || attachmentPreview) && !isTyping ? "0 4px 16px rgba(255,107,53,0.3)" : "none",
            }}>
              {isTyping ? <div style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> : "→"}
            </button>
          </div>
        </div>
      )}

      {/* ===== PROFILE SCREEN ===== */}
      {screen === "profile" && !profileSection && (
        <div style={{ padding: "0 20px 100px", animation: "fadeIn 0.3s ease" }}>
          {pageHeader("Profile")}

          {/* User Card */}
          <div style={{ ...cardStyle, borderRadius: 20, padding: 24, textAlign: "center", marginBottom: 20, position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: -30, left: "50%", transform: "translateX(-50%)", width: 200, height: 200, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,107,53,0.1), transparent)" }} />
            <div style={{ width: 80, height: 80, borderRadius: 24, margin: "0 auto 16px", background: "linear-gradient(135deg, #FF6B35, #E63946)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, color: "white" }}>{USER_PROFILE.avatar}</div>
            <div style={{ fontSize: 22, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>{USER_PROFILE.name}</div>
            <div style={{ fontSize: 13, color: "#8A8A9A", marginTop: 4 }}>{USER_PROFILE.email}</div>
            <div style={{ fontSize: 12, color: "#8A8A9A", marginTop: 2 }}>📍 {USER_PROFILE.location} · Member since {USER_PROFILE.joined}</div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 24 }}>
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 14, padding: 16 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#FF6B35" }}>{USER_PROFILE.totalSpent}</div>
                <div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 4 }}>Total Spent</div>
              </div>
              <div style={{ background: "rgba(0,0,0,0.3)", borderRadius: 14, padding: 16 }}>
                <div style={{ fontFamily: "'Fraunces', serif", fontSize: 24, fontWeight: 700, color: "#2A9D8F" }}>{USER_PROFILE.savedAmount}</div>
                <div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 4 }}>Money Saved</div>
              </div>
            </div>
          </div>

          {/* Menu Sections */}
          {[
            { title: "Account", items: [
              { icon: "👤", label: "Personal Details", sub: "Name, email, phone, address", key: "personal" },
              { icon: "💳", label: "Payment Methods", sub: "UPI, cards, wallets", key: "payment" },
              { icon: "📍", label: "Saved Addresses", sub: "Home, office, other", key: "addresses" },
            ]},
            { title: "Preferences", items: [
              { icon: "🌐", label: "Language", sub: "English, Hindi", key: "language" },
              { icon: "🔔", label: "Notifications", sub: "Push, SMS, Email", key: "notifications" },
              { icon: "🛡️", label: "Privacy & Security", sub: "Password, 2FA, data", key: "privacy" },
            ]},
            { title: "Support", items: [
              { icon: "❓", label: "Help Center", sub: "FAQs, guides, tutorials", key: "help" },
              { icon: "📞", label: "Contact Support", sub: "Chat, call, email", key: "contact" },
              { icon: "⭐", label: "Rate NyayNow", sub: "Share your feedback", key: "rate" },
              { icon: "📜", label: "Terms & Policies", sub: "Terms of service, privacy policy", key: "terms" },
            ]},
          ].map((section, si) => (
            <div key={si} style={{ marginBottom: 20 }}>
              <h2 style={{ ...sectionTitle }}>{section.title}</h2>
              <div style={{ ...cardStyle, padding: 0, overflow: "hidden" }}>
                {section.items.map((item, i) => (
                  <button key={item.key} onClick={() => setProfileSection(item.key)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 14, padding: "16px 18px", background: "none", border: "none",
                    borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none", cursor: "pointer", color: "#F0EDE6", textAlign: "left",
                    transition: "all 0.15s",
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = "none"; }}
                  >
                    <span style={{ fontSize: 20, width: 36, height: 36, borderRadius: 10, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{item.label}</div>
                      <div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>{item.sub}</div>
                    </div>
                    <span style={{ color: "#8A8A9A", fontSize: 14 }}>›</span>
                  </button>
                ))}
              </div>
            </div>
          ))}

          <button style={{ width: "100%", padding: 16, background: "rgba(230,57,70,0.1)", border: "1px solid rgba(230,57,70,0.2)", borderRadius: 14, color: "#E63946", fontSize: 15, fontWeight: 700, cursor: "pointer", marginTop: 8 }}>
            Log Out
          </button>
          <div style={{ textAlign: "center", fontSize: 11, color: "#8A8A9A", marginTop: 16 }}>NyayNow v1.0.0 · Made in India 🇮🇳</div>
        </div>
      )}

      {/* ===== PROFILE DETAIL PAGES ===== */}
      {screen === "profile" && profileSection && (
        <div style={{ padding: "0 20px 100px", animation: "fadeIn 0.3s ease" }}>
          <div style={{ padding: "20px 0 16px", display: "flex", alignItems: "center", gap: 14 }}>
            <button onClick={() => setProfileSection(null)} style={{ background: "rgba(255,255,255,0.06)", border: "none", color: "#F0EDE6", width: 38, height: 38, borderRadius: 12, fontSize: 18, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>←</button>
            <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'Fraunces', serif" }}>
              {{ personal: "Personal Details", payment: "Payment Methods", addresses: "Saved Addresses", language: "Language", notifications: "Notifications", privacy: "Privacy & Security", help: "Help Center", contact: "Contact Support", rate: "Rate NyayNow", terms: "Terms & Policies" }[profileSection]}
            </div>
          </div>

          {profileSection === "personal" && (
            <div>
              {[
                { label: "Full Name", value: USER_PROFILE.name },
                { label: "Email", value: USER_PROFILE.email },
                { label: "Phone", value: USER_PROFILE.phone },
                { label: "Location", value: USER_PROFILE.location },
                { label: "Member Since", value: USER_PROFILE.joined },
              ].map((f, i) => (
                <div key={i} style={{ ...cardStyle, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 11, color: "#8A8A9A", marginBottom: 4 }}>{f.label}</div><div style={{ fontSize: 14, fontWeight: 600 }}>{f.value}</div></div>
                  {i < 4 && <button style={{ background: "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px 14px", color: "#FF6B35", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Edit</button>}
                </div>
              ))}
              <div style={{ ...cardStyle, marginTop: 16, padding: 20 }}>
                <div style={{ fontSize: 11, color: "#8A8A9A", marginBottom: 8 }}>Aadhaar Verification</div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#2A9D8F" }} />
                  <span style={{ fontSize: 14, fontWeight: 600, color: "#2A9D8F" }}>Verified</span>
                </div>
              </div>
            </div>
          )}

          {profileSection === "payment" && (
            <div>
              {[
                { type: "UPI", detail: "rahul@okicici", icon: "📱", primary: true },
                { type: "Debit Card", detail: "HDFC •••• 4521", icon: "💳", primary: false },
                { type: "Wallet", detail: "Paytm — ₹1,240 balance", icon: "👛", primary: false },
              ].map((p, i) => (
                <div key={i} style={{ ...cardStyle, marginBottom: 10, display: "flex", alignItems: "center", gap: 14 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>{p.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{p.type}</div>
                    <div style={{ fontSize: 12, color: "#8A8A9A", marginTop: 2 }}>{p.detail}</div>
                  </div>
                  {p.primary && <span style={{ fontSize: 10, fontWeight: 600, color: "#2A9D8F", background: "#2A9D8F22", padding: "3px 10px", borderRadius: 6 }}>Primary</span>}
                </div>
              ))}
              <button style={{ width: "100%", padding: 16, marginTop: 12, background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 14, color: "#8A8A9A", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Add Payment Method</button>
            </div>
          )}

          {profileSection === "addresses" && (
            <div>
              {[
                { label: "Home", address: "42, Vijay Nagar, Scheme No. 54, Indore, MP - 452010", icon: "🏠" },
                { label: "Office", address: "3rd Floor, Trade Center, AB Road, Indore, MP - 452001", icon: "🏢" },
              ].map((a, i) => (
                <div key={i} style={{ ...cardStyle, marginBottom: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 16 }}>{a.icon}</span>
                    <span style={{ fontSize: 14, fontWeight: 700 }}>{a.label}</span>
                  </div>
                  <div style={{ fontSize: 13, color: "#8A8A9A", lineHeight: 1.5 }}>{a.address}</div>
                </div>
              ))}
              <button style={{ width: "100%", padding: 16, marginTop: 12, background: "rgba(255,255,255,0.04)", border: "1px dashed rgba(255,255,255,0.15)", borderRadius: 14, color: "#8A8A9A", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>+ Add Address</button>
            </div>
          )}

          {profileSection === "notifications" && (
            <div>
              {[
                { label: "Push Notifications", sub: "Case updates, lawyer messages", on: true },
                { label: "SMS Alerts", sub: "OTP, payment confirmations", on: true },
                { label: "Email Updates", sub: "Case summaries, receipts, offers", on: false },
                { label: "Promotional", sub: "Discounts and new features", on: false },
              ].map((n, i) => (
                <div key={i} style={{ ...cardStyle, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 14, fontWeight: 600 }}>{n.label}</div><div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>{n.sub}</div></div>
                  <div style={{ width: 44, height: 26, borderRadius: 13, background: n.on ? "#2A9D8F" : "rgba(255,255,255,0.1)", cursor: "pointer", position: "relative", transition: "all 0.2s" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "white", position: "absolute", top: 3, left: n.on ? 21 : 3, transition: "all 0.2s" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {profileSection === "language" && (
            <div>
              {["English", "हिन्दी (Hindi)", "मराठी (Marathi)", "ਪੰਜਾਬੀ (Punjabi)", "தமிழ் (Tamil)", "తెలుగు (Telugu)"].map((lang, i) => (
                <div key={i} style={{ ...cardStyle, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", borderColor: i === 0 ? "#FF6B3544" : "rgba(255,255,255,0.06)" }}>
                  <span style={{ fontSize: 14, fontWeight: i === 0 ? 700 : 500 }}>{lang}</span>
                  {i === 0 && <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#FF6B35", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "white" }}>✓</div>}
                </div>
              ))}
            </div>
          )}

          {profileSection === "privacy" && (
            <div>
              {[
                { label: "Change Password", sub: "Last changed 3 months ago", action: "Update" },
                { label: "Two-Factor Authentication", sub: "Enabled via SMS", action: "Manage" },
                { label: "Login Sessions", sub: "1 active session", action: "View" },
                { label: "Download My Data", sub: "Get a copy of your account data", action: "Request" },
                { label: "Delete Account", sub: "Permanently delete your account", action: "Delete", danger: true },
              ].map((p, i) => (
                <div key={i} style={{ ...cardStyle, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div><div style={{ fontSize: 14, fontWeight: 600 }}>{p.label}</div><div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>{p.sub}</div></div>
                  <button style={{ background: p.danger ? "rgba(230,57,70,0.15)" : "rgba(255,255,255,0.06)", border: "none", borderRadius: 8, padding: "6px 14px", color: p.danger ? "#E63946" : "#FF6B35", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>{p.action}</button>
                </div>
              ))}
            </div>
          )}

          {profileSection === "help" && (
            <div>
              <div style={{ ...sectionTitle }}>Frequently Asked Questions</div>
              {[
                { q: "How quickly can I connect with a lawyer?", a: "On average, you'll be connected within 3 minutes. During peak hours, it may take up to 8 minutes. SOS mode connects you instantly." },
                { q: "Are the lawyers verified?", a: "Yes, every lawyer on NyayNow is verified through the Bar Council of India. We check their registration, experience, and track record before onboarding." },
                { q: "What if I'm not satisfied with the consultation?", a: "You can rate your experience and request a refund within 24 hours if the consultation didn't meet your expectations. We review all refund requests within 48 hours." },
                { q: "Is my conversation private?", a: "Absolutely. All calls and messages are end-to-end encrypted. We do not share your case details with anyone other than your assigned lawyer." },
                { q: "Can I get a follow-up consultation?", a: "Yes! After your consultation, you can book a follow-up with the same lawyer at a discounted rate. Your lawyer can also extend the session in real-time." },
              ].map((faq, i) => (
                <div key={i} style={{ ...cardStyle, marginBottom: 10 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>{faq.q}</div>
                  <div style={{ fontSize: 13, color: "#B0B0B8", lineHeight: 1.6 }}>{faq.a}</div>
                </div>
              ))}
            </div>
          )}

          {profileSection === "contact" && (
            <div>
              {[
                { icon: "💬", label: "Live Chat", sub: "Chat with our support team", detail: "Available 24/7" },
                { icon: "📞", label: "Call Us", sub: "+91 1800-123-NYAY (6929)", detail: "Mon-Sat, 9 AM - 9 PM" },
                { icon: "📧", label: "Email", sub: "support@nyaynow.in", detail: "Response within 4 hours" },
                { icon: "🐦", label: "Twitter / X", sub: "@NyayNow", detail: "DM us anytime" },
              ].map((c, i) => (
                <div key={i} style={{ ...cardStyle, marginBottom: 10, display: "flex", alignItems: "center", gap: 14, cursor: "pointer" }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{c.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{c.label}</div>
                    <div style={{ fontSize: 12, color: "#8A8A9A", marginTop: 2 }}>{c.sub}</div>
                  </div>
                  <span style={{ fontSize: 11, color: "#2A9D8F" }}>{c.detail}</span>
                </div>
              ))}
            </div>
          )}

          {profileSection === "rate" && (
            <div style={{ textAlign: "center", paddingTop: 40 }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>⭐</div>
              <div style={{ fontFamily: "'Fraunces', serif", fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Enjoying NyayNow?</div>
              <div style={{ fontSize: 14, color: "#8A8A9A", marginBottom: 32, lineHeight: 1.6 }}>Your feedback helps us improve legal access for everyone across India.</div>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, marginBottom: 32 }}>
                {[1,2,3,4,5].map(star => (<button key={star} style={{ fontSize: 36, background: "none", border: "none", cursor: "pointer", opacity: star <= 4 ? 1 : 0.3 }}>⭐</button>))}
              </div>
              <textarea placeholder="Tell us what you love or what we can improve..." style={{ width: "100%", height: 120, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 16, color: "#F0EDE6", fontSize: 14, fontFamily: "inherit", outline: "none", resize: "none" }} />
              <button style={{ width: "100%", padding: 16, marginTop: 16, background: "linear-gradient(135deg, #FF6B35, #E63946)", border: "none", borderRadius: 14, color: "white", fontSize: 15, fontWeight: 700, cursor: "pointer" }}>Submit Feedback</button>
            </div>
          )}

          {profileSection === "terms" && (
            <div>
              {[
                { label: "Terms of Service", date: "Last updated: Jan 15, 2025" },
                { label: "Privacy Policy", date: "Last updated: Jan 15, 2025" },
                { label: "Refund Policy", date: "Last updated: Dec 01, 2024" },
                { label: "Lawyer Code of Conduct", date: "Last updated: Nov 20, 2024" },
                { label: "Data Processing Agreement", date: "Last updated: Jan 15, 2025" },
              ].map((t, i) => (
                <div key={i} style={{ ...cardStyle, marginBottom: 10, display: "flex", justifyContent: "space-between", alignItems: "center", cursor: "pointer" }}>
                  <div><div style={{ fontSize: 14, fontWeight: 600 }}>{t.label}</div><div style={{ fontSize: 11, color: "#8A8A9A", marginTop: 2 }}>{t.date}</div></div>
                  <span style={{ color: "#8A8A9A", fontSize: 14 }}>›</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===== BOTTOM NAV ===== */}
      {!["connecting", "active", "chatDetail"].includes(screen) && (
        <div style={{ position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)", width: "100%", maxWidth: 430, background: "linear-gradient(180deg, transparent, #0A0A0F 30%)", padding: "30px 20px 20px", zIndex: 100 }}>
          <div style={{ background: "rgba(20,20,30,0.9)", backdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "12px 8px", display: "flex", justifyContent: "space-around" }}>
            {[
              { icon: "⚖️", label: "Home", tab: "home" },
              { icon: "📋", label: "Cases", tab: "cases" },
              { icon: "💬", label: "Messages", tab: "messages", badge: totalUnread },
              { icon: "👤", label: "Profile", tab: "profile" },
            ].map(tab => (
              <button key={tab.tab} onClick={() => handleTabSwitch(tab.tab)} style={{
                background: "none", border: "none", color: activeTab === tab.tab ? "#FF6B35" : "#8A8A9A",
                display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
                cursor: "pointer", padding: "6px 16px", borderRadius: 12, position: "relative",
              }}>
                <span style={{ fontSize: 20, position: "relative" }}>
                  {tab.icon}
                  {tab.badge > 0 && (
                    <span style={{ position: "absolute", top: -6, right: -10, width: 18, height: 18, borderRadius: "50%", background: "#FF6B35", fontSize: 9, fontWeight: 700, color: "white", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #14141E" }}>{tab.badge}</span>
                  )}
                </span>
                <span style={{ fontSize: 10, fontWeight: activeTab === tab.tab ? 700 : 500 }}>{tab.label}</span>
                {activeTab === tab.tab && <div style={{ width: 4, height: 4, borderRadius: "50%", background: "#FF6B35", marginTop: 2 }} />}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
