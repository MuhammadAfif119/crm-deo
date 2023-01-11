import { doc, getDoc } from "firebase/firestore";
import React, { useState, useEffect, useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import AuthContext from "./hooks/AuthContext";


function ProtectedRoutesUser({ children }) {
  
  const { currentUser } = useContext(AuthContext)
  const location = useLocation()


  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  if (currentUser) return children;
}

export default ProtectedRoutesUser;
