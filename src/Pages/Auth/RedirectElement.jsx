import React from 'react'
import { Navigate } from 'react-router-dom';
import useUserStore from '../../Routes/Store';

const RedirectElement = () => {
     const { userDisplay } = useUserStore();

     if (userDisplay.uid) return <Navigate to='/' />
     return <Navigate to='login' />
}

export default RedirectElement