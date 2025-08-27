import { Navigate, useLocation } from "react-router-dom";
import { LOADING, REDIRECT_QUERY_PARAM } from "../../constants/appConstants";
import LoadingScreen from "./LoadingScreen";
import { useSelector } from "react-redux";
import React from "react";

// Protected.jsx
export default function Protected({ children }) {
  const { isLoggedIn, status } = useSelector((s) => s.user);
  const location = useLocation();

  const loading = status === LOADING || status === 'idle';

  if (loading) {
    return <LoadingScreen/>;
  }
  
  if (!isLoggedIn) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?${REDIRECT_QUERY_PARAM}=${redirect}`} replace />;
  }

  return <>{children}</>;
}