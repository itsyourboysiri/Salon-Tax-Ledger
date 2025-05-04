import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState(1);

  const increaseStories = () => setStories((prev) => prev + 1);
  const decreaseStories = () => setStories((prev) => (prev > 1 ? prev - 1 : 1));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.target;
    const userRegformData = new FormData(form);
    const userregdata = Object.fromEntries(userRegformData.entries());

    const phone = userregdata.phone?.trim();
    const password = userregdata.password?.trim();
    const email = userregdata.email?.trim();
    const nic = userregdata.nic?.trim();
    const tin = userregdata.tinno?.trim();
    const confirmPassword = userregdata.confirmPassword?.trim();
    const areaInputs = form.querySelectorAll(".areaInput");

    const oldNICPattern = /^[0-9]{9}[VXvx]$/;
    const newNICPattern = /^[0-9]{12}$/;
    if (!oldNICPattern.test(nic) && !newNICPattern.test(nic)) {
      alert("Invalid NIC format (e.g., 123456789V or 200012345678)");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]+$/.test(tin)) {
      alert("TIN should only contain numbers");
      return;
    }

    if (!/^0[1-9]\d{8}$/.test(phone)) {
      alert("Invalid Sri Lankan phone number (e.g., 0712345678 or 0112345678)");
      return;
    }

    if (password.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert("Password must be at least 6 characters long and contain at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    for (let input of areaInputs) {
      if (isNaN(input.value) || Number(input.value) <= 0) {
        alert("Salon area must be a positive number.");
        return;
      }
    }

    userregdata.stories = stories;
    userregdata.area = Array.from(areaInputs).map((input) => Number(input.value));

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userregdata)
      });

      if (!response.ok) throw new Error("Registration failed!");

      const result = await response.json();
      alert(result.message);
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error);
      alert("Registration failed!");
    }
  };

  const generateAreaInputs = () => (
    <div>
      {[...Array(stories)].map((_, index) => (
        <input
          key={index}
          type="number"
          name={`area${index}`}
          className="areaInput w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]"
          placeholder={`Area of Story ${index + 1}`}
        />
      ))}
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#620F28] via-[#986611] to-[#41091B] bg-[length:300%_300%] animate-gradient-x" />

      {/* Blur overlay */}
      <div className="absolute inset-0 backdrop-blur-xl bg-black/10" />

      {/* Form container */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg lg:max-w-xl p-6 sm:p-8 bg-[#FFFDF8] text-[#1E040C] rounded-2xl shadow-2xl animate-fadeIn">

        <h2 className="text-2xl font-bold text-center text-[#986611] mb-6">User Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Personal Info */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium">Full Name</label>
            <input type="text" id="name" name="name" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>
          <div>
            <label htmlFor="dob" className="block text-sm font-medium">Date of Birth</label>
            <input type="date" id="dob" name="dob" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>
          <div>
            <label htmlFor="address" className="block text-sm font-medium">Address</label>
            <input type="text" id="address" name="address" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium">Phone Number</label>
            <input type="tel" id="phone" name="phone" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>
          <div>
            <label htmlFor="nic" className="block text-sm font-medium">National Identity Card</label>
            <input type="text" id="nic" name="nic" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>
          <div>
            <label htmlFor="tinno" className="block text-sm font-medium">TIN Number</label>
            <input type="text" id="tinno" name="tinno" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>

          {/* Salon Details */}
          <h2 className="text-xl font-semibold text-left text-[#620F28] mt-6">Salon Details</h2>
          <div>
            <label htmlFor="salonName" className="block text-sm font-medium">Salon Name</label>
            <input type="text" id="salonName" name="salonName" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>
          <div>
            <label htmlFor="salonAddress" className="block text-sm font-medium">Salon Address</label>
            <input type="text" id="salonAddress" name="salonAddress" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>
          <div>
            <label className="block text-sm font-medium">How many stories in the salon?</label>
            <div className="flex items-center space-x-2 mt-2">
              <button type="button" onClick={decreaseStories} className="p-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300">-</button>
              <input type="text" id="stories" name="stories" value={stories} readOnly className="w-16 text-center p-2 bg-white text-black border border-gray-300 rounded-lg" />
              <button type="button" onClick={increaseStories} className="p-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300">+</button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium">Area of the Salon (sq ft)</label>
            <div id="areaInputs">{generateAreaInputs()}</div>
          </div>

          {/* Profile Info */}
          <h2 className="text-xl font-semibold text-left text-[#620F28] mt-6">Profile Details</h2>
          <div>
            <label htmlFor="username" className="block text-sm font-medium">Username</label>
            <input type="text" id="username" name="username" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input type="email" id="email" name="email" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium">Password</label>
            <input type="password" id="password" name="password" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
          </div>
          <button type="submit" className="w-full p-2 bg-[#620F28] hover:bg-[#986611] text-white font-semibold rounded-lg transition">Register</button>
        </form>

        <p className="mt-4 text-sm text-center">
          Already have an account?{" "}
          <span className="text-[#986611] hover:underline cursor-pointer" onClick={() => navigate('/')}>Sign in</span>
        </p>
      </div>
    </div>
  );
};

export default UserRegistrationForm;
