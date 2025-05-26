import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { alert } from '../AlertBoxes/alertBox';
import { FaCamera, FaUpload } from 'react-icons/fa';

const UserRegistrationForm = () => {
  const navigate = useNavigate();
  const [stories, setStories] = useState(1);
  const [profileImage, setProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [areas, setAreas] = useState([0]);

  const increaseStories = () => {
    setStories(prev => prev + 1);
    setAreas(prev => [...prev, 0]);
  };

  const decreaseStories = () => {
    if (stories > 1) {
      setStories(prev => prev - 1);
      setAreas(prev => prev.slice(0, -1));
    }
  };

  const handleAreaChange = (index, value) => {
    const newAreas = [...areas];
    newAreas[index] = Number(value);
    setAreas(newAreas);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);

    // Get all form values
    const formValues = Object.fromEntries(formData.entries());
    const { phone, password, email, nic, tinno, confirmPassword } = formValues;

    // Validation checks
    const oldNICPattern = /^[0-9]{9}[VXvx]$/;
    const newNICPattern = /^[0-9]{12}$/;
    if (!oldNICPattern.test(nic) && !newNICPattern.test(nic)) {
      alert.error("Invalid NIC format (e.g., 123456789V or 200012345678)");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      alert.error("Please enter a valid email address.");
      return;
    }

    if (!/^[0-9]+$/.test(tinno)) {
      alert.error("TIN should only contain numbers");
      return;
    }

    if (!/^0[1-9]\d{8}$/.test(phone)) {
      alert.error("Invalid Sri Lankan phone number (e.g., 0712345678 or 0112345678)");
      return;
    }

    if (password.length < 6 || !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      alert.error("Password must be at least 6 characters long and contain at least one special character.");
      return;
    }

    if (password !== confirmPassword) {
      alert.error("Passwords do not match!");
      return;
    }

    // Check area values
    if (areas.some(area => isNaN(area) || area <= 0)) {
      alert.error("Salon area must be a positive number.");
      return;
    }

    // Prepare the data to send
    const userData = {
      ...formValues,
      stories,
      area: areas,
    };

    // Create FormData for file upload
    const finalFormData = new FormData();
    Object.entries(userData).forEach(([key, value]) => {
      if (key !== 'profileImage') {
        finalFormData.append(key, value);
      }
    });
    
    if (profileImage) {
      finalFormData.append('profileImage', profileImage);
    }

    try {
      const response = await fetch("http://localhost:5000/api/users/register", {
        method: "POST",
        body: finalFormData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed!");
      }

      const result = await response.json();
      alert.success("Registration successful!");
      navigate("/");
    } catch (error) {
      console.error("Error registering user:", error);
      alert.error(error.message || "Registration failed!");
    }
  };

  const generateAreaInputs = () => (
    <div className="space-y-2">
      {areas.map((area, index) => (
        <input
          key={index}
          type="number"
          value={area}
          onChange={(e) => handleAreaChange(index, e.target.value)}
          className="areaInput w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]"
          placeholder={`Area of Story ${index + 1} (sq ft)`}
          required
          min="1"
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
        <h2 className="text-2xl font-bold text-center text-[#620F28] mb-6">User Registration</h2>
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-[#620F28]">
              {imagePreview ? (
                <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <FaCamera className="text-3xl text-gray-400" />
              )}
            </div>
            <label 
              htmlFor="profileImage"
              className="absolute -bottom-2 -right-2 bg-[#620F28] text-white p-2 rounded-full cursor-pointer hover:bg-[#986611] transition"
              title="Upload profile image"
            >
              <FaCamera className="text-sm" />
              <input
                type="file"
                id="profileImage"
                name="profileImage"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4" encType="multipart/form-data">
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
          <div>
            <label htmlFor="email" className="block text-sm font-medium">Email</label>
            <input type="email" id="email" name="email" required className="w-full mt-1 p-2 bg-white text-black border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#986611]" />
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
              <input type="text" value={stories} readOnly className="w-16 text-center p-2 bg-white text-black border border-gray-300 rounded-lg" />
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