import { useState } from "react";
import { registerUser, loginUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { FiLoader } from "react-icons/fi";
import "./css/Signup.css";
import logoIcon from "../assets/date-time-setting.svg";

export default function Signup() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    monthlyIncome: "",
    workingHoursPerDay: "",
    workingDaysPerMonth: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await registerUser(form);
      const loginData = await loginUser({ email: form.email, password: form.password });
      localStorage.setItem("token", loginData.token);
      navigate("/dashboard"); 
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-card">
        <div className="slider-wrapper">
          <div 
            className="slider" 
            style={{ transform: `translateX(-${currentStep * 100}%)` }}
          >
            {/* Step 0: Basic Info */}
            <div className="step-content">
              <div className="step-header">
                <img src={logoIcon} alt="TradeOff Logo" className="logo" />
                <h2>Let's get started</h2>
                <p>Create your account</p>
              </div>
              <div className="input-group">
                <label>Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="John Doe" 
                />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={form.email} 
                  onChange={handleChange} 
                  placeholder="john@example.com" 
                />
              </div>
              <div className="input-group">
                <label>Password</label>
                <input 
                  type="password" 
                  name="password" 
                  value={form.password} 
                  onChange={handleChange} 
                  placeholder="••••••••" 
                />
              </div>
              <div className="action-buttons">
                <button className="btn-primary full-width" onClick={nextStep}>Next</button>
              </div>
            </div>

            {/* Step 1: Monthly Income */}
            <div className="step-content">
              <div className="step-header">
                <h2>Financials</h2>
                <p>What is your monthly income?</p>
              </div>
              <div className="input-group main-question">
                <input 
                  type="number" 
                  name="monthlyIncome" 
                  value={form.monthlyIncome} 
                  onChange={handleChange} 
                  placeholder="$0.00" 
                />
              </div>
              <div className="action-buttons split">
                <button className="btn-secondary" onClick={prevStep}>Back</button>
                <button className="btn-primary" onClick={nextStep}>Next</button>
              </div>
            </div>

            {/* Step 2: Working Hours */}
            <div className="step-content">
              <div className="step-header">
                <h2>Work Routine</h2>
                <p>How many hours do you work per day?</p>
              </div>
              <div className="input-group main-question">
                <input 
                  type="number" 
                  name="workingHoursPerDay" 
                  value={form.workingHoursPerDay} 
                  onChange={handleChange} 
                  placeholder="e.g. 8" 
                />
              </div>
              <div className="action-buttons split">
                <button className="btn-secondary" onClick={prevStep}>Back</button>
                <button className="btn-primary" onClick={nextStep}>Next</button>
              </div>
            </div>

            {/* Step 3: Working Days & Submit */}
            <div className="step-content">
              <div className="step-header">
                <h2>Almost there</h2>
                <p>How many days do you work per month?</p>
              </div>
              <div className="input-group main-question">
                <input 
                  type="number" 
                  name="workingDaysPerMonth" 
                  value={form.workingDaysPerMonth} 
                  onChange={handleChange} 
                  placeholder="e.g. 20" 
                />
              </div>
              <div className="action-buttons split">
                <button className="btn-secondary" onClick={prevStep} disabled={isLoading}>Back</button>
                <button className="btn-primary" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <FiLoader className="spinner" /> Creating account...
                    </>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
