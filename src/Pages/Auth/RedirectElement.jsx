import React from 'react'
import { Navigate } from 'react-router-dom';
import useUserStore from '../../Hooks/Zustand/Store';

const RedirectElement = () => {
     const globalState = useUserStore();

     if (globalState.uid) return <Navigate to='/' />
     return <Navigate to='login' />
}

export default RedirectElement