import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alert } from '../../components/AlertBoxes/alertBox';


export default function AdminLogin() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const navigate = useNavigate(); // Initialize navigate


  const handleChange = (e) => {
    setCredentials(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/admin/signin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          username: credentials.username, 
          password: credentials.password 
        }),
        credentials: 'include' // Important for sessions/cookies if using them
      });

      const data = await response.json();
      if (response.ok) {
        if (response.ok) {
          // Store admin data in localStorage (frontend session)
          localStorage.setItem('adminSession', JSON.stringify({
            isAuthenticated: true,
            admin: data.admin,
            expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24-hour expiry
          }));

          const session = await localStorage.getItem("adminSession")
          console.log("Saved session data:",session)
  
          alert.success('Login successful!');
          navigate('/admin-home');
        }
      } else {
        alert.error(data.message || 'Login failed');
      }
    } catch (err) {
      console.error('Login error:', err);
      alert.error('Something went wrong during login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-yellow-100 p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-12">

          <img src="/logo.png" alt="Logo" className="w-100 mx-auto" />
          <h1 className="text-yellow-900 font-bold text-3xl mb-4">SALON TAX LEDGER</h1>
        </div>


        {/* Login Form */}
        <div className="text-center">
          {/* <h2 className="text-xl font-bold mb-8" style={{color: '#380817'}}>Admin Login</h2> */}

          <div className="space-y-6">
            <div className="text-left">
              <label className="block text-lg font-medium mb-2" style={{ color: '#380817' }}>Username</label>
              <input
                type="text"
                name="username"
                value={credentials.username}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-full bg-white bg-opacity-90 text-gray-800 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all"
                placeholder="Enter your username"
              />
            </div>

            <div className="text-left">
              <label className="block text-lg font-medium mb-2" style={{ color: '#380817' }}>Password</label>
              <input
                type="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-4 rounded-full bg-white bg-opacity-90 text-gray-800 placeholder-gray-500 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-all"
                placeholder="Enter your password"
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 font-bold text-xl py-4 rounded-full hover:from-yellow-500 hover:to-yellow-600 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Submit
            </button>
          </div>

          <div className="mt-8 text-center">
            <a
              href="/admin-signup"
              className="inline-block px-8 py-3 border-2 border-yellow-400 text-yellow-400 font-semibold text-lg rounded-full hover:bg-yellow-400 hover:text-yellow-900 transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1"
            >
              Create an account
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}