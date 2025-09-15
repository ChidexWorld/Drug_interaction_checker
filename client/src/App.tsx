import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import LandingPage from "./components/LandingPage";
import DrugInteractionChecker from "./components/DrugInteractionChecker";
import DrugInteractionChecker2 from "./components/DrugInteractionChecker2";
import ConditionsList from "./components/ConditionsList";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';

  return (
    <div className="min-h-screen bg-red-50">
      {!isLandingPage && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/drug-info" element={<DrugInteractionChecker />} />
          <Route path="/interaction-checker" element={<DrugInteractionChecker2 />} />
          <Route path="/conditions" element={<ConditionsList />} />
        </Routes>
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        aria-label="Notification"
      />
    </div>
  );
}

function App() {
  console.log("App component is rendering");

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
