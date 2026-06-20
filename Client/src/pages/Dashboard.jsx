import { useEffect, useState } from "react";
import { getMyTradeoffs, deleteTradeoff, updateTradeoffStatus } from "../api/tradeoff";
import { getProfile } from "../api/auth";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import RoastChatWidget from "../components/RoastChatWidget";
import "./css/Dashboard.css";

export default function Dashboard() {
  const [tradeoffs, setTradeoffs] = useState([]);
  const [user, setUser] = useState(null);
  const [isRoastOpen, setIsRoastOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMyTradeoffs();
      const userData = await getProfile();
      setUser(userData);
      setTradeoffs(data.result);
    };
    fetchData();
  }, []);

  const mainTradeoffs = tradeoffs.filter((t) => t.status === "purchased");
  const pendingDecisions = tradeoffs.filter((t) => t.status === "pending");

  const totalHoursMonth = user ? user.workingHoursPerDay * user.workingDaysPerMonth : 0;
  const hoursUsed = mainTradeoffs.reduce((acc, curr) => acc + curr.hoursRequired, 0);
  const hoursLeft = totalHoursMonth - hoursUsed;

  const latest = mainTradeoffs[0];

  const handleBuyNow = async (id) => {
    await updateTradeoffStatus(id, "purchased");
    setTradeoffs((prev) =>
      prev.map((t) => (t._id === id ? { ...t, status: "purchased" } : t))
    );
  };

  const handleDelete = async (id) => {
    await deleteTradeoff(id);
    setTradeoffs((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <>
      <Navbar />

      <div className="dashboard">
        {/* HERO */}
        <div className="hero">
          <div className="hero-left">
            <h1 className="welcome">
              Welcome <span className="username">{user?.name}</span>
            </h1>

            {latest && (
              <p className="last-decision-text">
                Your last purchase cost you {latest.hoursRequired} hours
              </p>
            )}
          </div>

          <button
            className="check-btn"
            onClick={() => navigate("/check-price")}
          >
            Check Price
          </button>
        </div>

        {/* LAYOUT CONTAINER */}
        <div className="dashboard-content">

          {/* CENTER: MAIN TRADEOFF LIST + BOTTOM ACTIONS */}
          <div className="tradeoff-section">
            <h2 className="section-title">Your TradeOffs</h2>
            <div className="tradeoff-list">
              {mainTradeoffs.length === 0 ? (
                <p>No tradeoffs yet</p>
              ) : (
                mainTradeoffs.map((t) => (
                  <div className="card" key={t._id}>
                    <h3 className="item-name">
                      {t.itemName.charAt(0).toUpperCase() +
                        t.itemName.slice(1)}
                    </h3>

                    <div className="card-info">
                      <div>
                        <span className="label">Price</span>
                        <p>₹{t.price}</p>
                      </div>

                      <div>
                        <span className="label">Time Cost</span>
                        <p>{t.hoursRequired} hours</p>
                      </div>

                      <div>
                        <span className="label">Impact</span>
                        <p className={`impact impact-${t.impactLevel?.toLowerCase()}`}>{t.impactLevel}</p>
                      </div>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(t._id)}
                    >
                      Delete
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* BOTTOM BUTTONS NOW UNDER TRADEOFF'S SECTION */}
            <div className="bottom-actions-container">
              <div className="bottom-actions">
                <button
                  className="secondary-btn"
                  onClick={() => alert("under development!")}
                >
                  <span className="btn-content">
                    <span>View Analytics</span>
                    <svg height="20" viewBox="0 -960 960 960" width="20">
                      <path
                        fill="#888"
                        d="m136-240-56-56 296-298 160 160 208-206H640v-80h240v240h-80v-104L536-320 376-480 136-240Z"
                      />
                    </svg>
                  </span>
                </button>

                <button
                  className="secondary-btn"
                  onClick={() => alert("under development!")}
                >
                  <span className="btn-content">
                    <span>Upload a Doc</span>
                    <svg height="20" viewBox="0 -960 960 960" width="20">
                      <path
                        fill="#888"
                        d="M320-440h320v-80H320v80Zm0 120h320v-80H320v80Zm0 120h200v-80H320v80ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Z"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              <button
                className="secondary-btn generate-btn"
                onClick={() => setIsRoastOpen(true)}
              >
                <span className="btn-content">
                  <span>Get Roasted 🔥</span>
                  <svg height="20" viewBox="0 -960 960 960" width="20">
                    <path
                      fill="#a78bfa"
                      d="m480-120-40-100q-20-56-62-98t-98-62l-100-40 100-40q56-20 98-62t62-98l40-100 40 100q20 56 62 98t98 62l100 40-100 40q-56 20-98 62t-62 98l-40 100ZM680-680l-20-50q-10-28-31-49t-49-31l-50-20 50-20q28-10 49-31t31-49l20-50 20 50q10 28 31 49t49 31l50 20-50 20q-28 10-49 31t-31 49l-20 50Z"
                    />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* RIGHT: PENDING DECISIONS BOX */}
          <div className="pending-panel">
            {/* HOURS WIDGET */}
            <div className="hours-widget">
              <h2 className="section-title">Monthly Time Overview</h2>
              <div className="hours-stats card">
                <div className="stat-group">
                  <span className="label">Total Available</span>
                  <p className="stat-value">{totalHoursMonth.toFixed(1)}h</p>
                </div>
                <div className="stat-group">
                  <span className="label">Used Until Now</span>
                  <p className="stat-value">{hoursUsed.toFixed(1)}h</p>
                </div>
                <div className="stat-group highlight">
                  <span className="label">Remaining</span>
                  <p className="stat-value impact">{hoursLeft.toFixed(1)}h</p>
                </div>
              </div>
            </div>

            <h2 className="section-title">Pending Decisions (24h)</h2>
            <div className="pending-list">
              {pendingDecisions.length === 0 ? (
                <p>No pending decisions</p>
              ) : (
                pendingDecisions.map((t) => (
                  <div className="card pending-card" key={t._id}>
                    <h3 className="item-name">
                      {t.itemName.charAt(0).toUpperCase() +
                        t.itemName.slice(1)}
                    </h3>

                    <div className="card-info pending-info">
                      <div>
                        <p className="impact">{t.hoursRequired}h</p>
                      </div>
                      <div>
                        <p>₹{t.price}</p>
                      </div>
                      <div>
                        <p className={`impact impact-${t.impactLevel?.toLowerCase()}`}>{t.impactLevel}</p>
                      </div>
                    </div>

                    <div className="pending-actions">
                      <button
                        className="check-btn small-btn"
                        onClick={() => handleBuyNow(t._id)}
                      >
                        Buy Now
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(t._id)}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <RoastChatWidget isOpen={isRoastOpen} onClose={() => setIsRoastOpen(false)} />
    </>
  );
}