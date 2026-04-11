import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { calculateTradeoff, createTradeoff } from "../api/tradeoff";
import Navbar from "../components/Navbar";
import "./css/CheckPrice.css";

export default function CheckPrice() {
  const [itemName, setItemName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [result, setResult] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const data = await calculateTradeoff({ price: Number(price) });
    if (data.tradeoff) {
      setResult(data.tradeoff);
    }
  };

  const handleAction = async (status) => {
    await createTradeoff({ itemName, price: Number(price), category, status });
    setItemName("");
    setPrice("");
    setCategory("");
    navigate("/dashboard");
  };

  return (
    <>
      <Navbar />

      <div className="checkprice-container">
        <div className="checkprice-header-card">
          <h1>Pause,<br/> Then Decide.</h1>
          <p>Understand what this purchase really costs you.</p>
        </div>

        <div className="checkprice-card">
          <div className="form-group">
            <label>Item</label>
            <input
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              placeholder="e.g. iPhone 15"
            />
          </div>

          <div className="form-group">
            <label>Price (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 80000"
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">Select category</option>
              <option value="need">Need</option>
              <option value="want">Want</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <button className="check-btn" onClick={handleSubmit}>
            Calculate TradeOff
          </button>
        </div>

        {/* RESULT CARD */}
        {result && (
          <div className="checkprice-card result-card">
            <h2>{result.hoursRequired} hours of your life</h2>
            <p>Impact: {result.impactLevel}</p>

            <div className="result-actions">
              <button
                className="check-btn"
                onClick={() => handleAction("purchased")}
              >
                Buy Now
              </button>

              <button
                className="secondary-btn"
                onClick={() => handleAction("pending")}
              >
                Wait 24h
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
