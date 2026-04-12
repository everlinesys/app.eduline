import { Navigate, Outlet } from "react-router-dom";
import { getUser } from "../auth";

export default function ProtectedRoute({ role }) {
  const user = getUser();

  if (!user) return <Navigate to="/welcome" replace />;

  if (role && user.role !== role)
    return <Navigate to="/" replace />;

  return <Outlet />;
}
