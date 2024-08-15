import "./App.css";
import ChangePassword from "./pages/ChangePassword";
import Complaints from "./pages/Complaints";
import Dashboard from "./pages/Dashboard";
import LoanRequests from "./pages/LoanRequests";
import Login from "./pages/Login";
import NewPromotion from "./pages/NewPromotion";
import Promotions from "./pages/Promotions";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <div style={{ height: "100%" }}>
        <div style={{ backgroundColor: "#EFF3F0", minHeight: "100vh" }}>
          <Routes>
            <Route exact path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/complaints" element={<Complaints />} />
            <Route path="/changePassword" element={<ChangePassword />} />
            <Route path="/loanRequests" element={<LoanRequests />} />
            <Route path="/newPromotion" element={<NewPromotion />} />
            <Route path="/promotions" element={<Promotions />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
