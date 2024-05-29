import React from 'react'
// import { useSelector, useDispatch } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'
const RequiresAuth = ({ children }) => {
    const location = useLocation()
    // const { token } = useSelector((state) => state.user)
    const isLoggedIn = localStorage.getItem('isLoggedIn')
    return (
        isLoggedIn ? children : <Navigate to="/login" state={{ from: location }} />
    )
}
export default RequiresAuth