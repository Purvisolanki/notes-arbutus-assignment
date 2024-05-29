import './App.css';
import { Routes, Route,  useNavigate } from 'react-router-dom';
import ProfilePage from './pages/ProfilePage';
import SignUpPage from './onboarding/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import { useEffect, useState } from 'react';
import LoginPage from './onboarding/LoginPage';
import RequiresAuth from './Authentication/Auth';

function App() {

  return (
    <Routes>
      {/* {!user && <Route path='/' element={<Auth auth={() => setUser(true)} />} />}

      {user && (
        <>
          <Route path='/profile' element={<ProfilePage handleLogout={handleLogout} />} />
          <Route path='/dashboard' element={<Dashboard />} />
        </>
      )}

      <Route path='*' element={<Navigate to={user ? '/profile' : '/'}/>} /> */}
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage/>} />
      <Route path='/register' element={<SignUpPage />}/>
      <Route path='/dashboard' element={<RequiresAuth><DashboardPage /></RequiresAuth>} />
      <Route path='/profile' element={<RequiresAuth><ProfilePage /></RequiresAuth>} />

    </Routes>

    // <Login />
  );
}

export default App;
