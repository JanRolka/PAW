import { BrowserRouter, Routes, Route } from "react-router-dom";
import LogIn from "./LogIn.js";
import DoctorHome from "./DoctorHome.js";
import PatientHome from "./PatientHome.js";
import ProtectedRoute from "./ProtectedRoute.js";
import AuthForm from "./AuthForm.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AuthForm />} />

        <Route
          path="/doctor"
          element={
            <ProtectedRoute role="doctor">
              <DoctorHome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/patient"
          element={
            <ProtectedRoute role="patient">
              <PatientHome />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;


