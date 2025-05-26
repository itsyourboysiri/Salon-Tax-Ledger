import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alert } from '../../components/AlertBoxes/alertBox';

const AdminSignup = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const navigate = useNavigate();


  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Check if passwords match
      if (formData.password !== formData.confirmPassword) {
        alert.error("Passwords don't match!");
        return;
      }
  
      const response = await fetch('http://localhost:5000/api/admin/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password
        })
      });
      
      const data = await response.json();
      if (response.ok) {
        alert.success("Signup successful!");
        navigate('/admin-login');
      } else {
        alert.error(data.message || 'Signup failed');
      }
    } catch (err) {
      console.error('Signup error:', err);
      alert.error('Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#620F28] to-[#986611] p-4">
    <div className="w-full max-w-md bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl shadow-xl overflow-hidden p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#2C0613] mb-2">Admin Signup</h2>
          <p className="text-[#2C0613]/80">Create your administrator account</p>
        </div>
  
        <div className="space-y-4">
          <div>
            <label className="block text-[#2C0613]/80 text-sm font-medium mb-1">Username</label>
            <input
              name="username"
              placeholder="Enter your username"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-[#2C0613] placeholder-[#2C0613]/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>
  
          <div>
            <label className="block text-[#2C0613]/80 text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              placeholder="your@email.com"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-[#2C0613] placeholder-[#2C0613]/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>
  
          <div>
            <label className="block text-[#2C0613]/80 text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-[#2C0613] placeholder-[#2C0613]/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>
  
          <div>
            <label className="block text-[#2C0613]/80 text-sm font-medium mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm your password"
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-[#2C0613] placeholder-[#2C0613]/50 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all"
            />
          </div>
        </div>
  
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-[#2C0613] font-bold py-3 px-4 rounded-lg hover:from-yellow-600 hover:to-yellow-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg"
         onClick={handleSubmit}
       >
          Sign Up
        </button>
  
        <p className="text-center text-[#2C0613]/70 text-sm">
          Already have an account?{' '}
          <a href="/admin-login" className="text-[#2C0613] hover:text-[#2C0613]/90 transition-colors font-medium">
            Login here
          </a>
        </p>
      </form>
    </div>
  </div>
  );
};

export default AdminSignup;
