import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import CheckPrice from "./pages/CheckPrice";
import Signup from "./pages/Signup";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/check-price" element={<CheckPrice />} />
        <Route path="/signup" element={<Signup/> } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;