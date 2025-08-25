import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import DrugInteractionChecker from "./components/DrugInteractionChecker";
import DrugInteractionChecker2 from "./components/DrugInteractionChecker2";
import ConditionsList from "./components/ConditionsList";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";

function App() {
  console.log("App component is rendering");

  return (
    <Router>
      <div className="min-h-screen bg-red-50">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<DrugInteractionChecker />} />
            <Route path="/drug-interactions" element={<DrugInteractionChecker2 />} />
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
    </Router>
  );
}

export default App;
