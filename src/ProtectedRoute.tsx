import { Navigate } from "react-router-dom";

function ProtectedRoute({ role, children }) {
  const storedUser = localStorage.getItem("userData"); // matches your onLogin
  const storedRole = localStorage.getItem("userRole"); // matches your onLogin

  const user = storedUser ? JSON.parse(storedUser) : null;

  if (!user) {
    return <Navigate to="/" replace />;
  }

  if (role && storedRole !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;

