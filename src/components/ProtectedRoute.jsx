import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
//   console.log("token in protect:",token);
return token ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
