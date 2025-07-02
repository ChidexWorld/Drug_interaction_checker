import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";
import ConditionsSymptoms from "./components/ConditionsSymptoms";
import DrugDatabase from "./components/DrugDatabase";
import DrugInteractionChecker from "./components/DrugInteractionChecker";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
function App() {
  console.log("App component is rendering");

  return (
    <Router>
      <div className="min-h-screen bg-red-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<DrugInteractionChecker />} />
            <Route path="/drugs" element={<DrugDatabase />} />
            <Route path="/conditions" element={<ConditionsSymptoms />} />
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

// function App() {
//   console.log("App component is rendering");
//   return <div>Hello World jj</div>;
// }

// export default App;
