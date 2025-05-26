import React, { useEffect, useState } from 'react';
import { FaUserEdit, FaCamera } from 'react-icons/fa';
import Navbar from '../navbar/navbar';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { alert } from '../AlertBoxes/alertBox';

const UserProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState('');


  const fetchUser = async () => {
    const username = sessionStorage.getItem('username');
    try {
      const res = await fetch(`http://localhost:5000/api/users/userprofile/${username}`);
      const data = await res.json();
      setUser(data);
      console.log("photo:",data.photo)
      if (data.photo) {
        
        setPreview(`http://localhost:5000/api/users${data.photo}`);
      }
      setLoading(false);
    } catch (err) {
      console.error('Fetch error:', err);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (!selectedFile) {
      setPreview('');
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // Clean up
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const handleFileChange = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(null);
      if (user.photo) {
        setPreview(`http://localhost:5000/api/users${data.photo}`);
      }
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    const username = sessionStorage.getItem('username');
    const formData = new FormData();

    // Append all user data
    Object.keys(user).forEach(key => {
      formData.append(key, user[key]);
    });

    // Append the file if selected
    if (selectedFile) {
      formData.append('photo', selectedFile);
    }

    try {
      const res = await fetch(`http://localhost:5000/api/users/update-userprofile/${username}`, {
        method: 'PUT',
        body: formData, // Don't set Content-Type header - browser will do it automatically
      });

      if (res.ok) {
        const updatedUser = await res.json();
        sessionStorage.setItem('photo', updatedUser.photo || '');
        alert.success("User profile updated successfully");
        fetchUser(); // Refresh user data
      }
    } catch (err) {
      console.error('Update error:', err);
      alert.error("Failed to update profile");
    }
  };


  if (loading || !user) {
    return <p className="text-center mt-10">Loading user data...</p>;
  }

  return (
    <div className="bg-[#F9F6EE] min-h-screen">
      <Navbar />
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg mt-8 p-8">
        <div className="flex flex-col items-center mb-6 mt-4">
          <h2 className="mt-2 text-2xl font-bold text-[#380817]">Edit Profile</h2>

{/* Profile Photo Upload */}
<div className="relative m-4">
  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#986611] bg-gray-100 flex items-center justify-center">
    {preview ? (
      <img
        src={preview}
        alt="Profile"
        className="w-full h-full object-cover"
        onError={(e) => {
          console.error('Image failed to load:', preview);
          // Reset preview to show fallback icon
          setPreview('');
        }}
      />
    ) : (
      <FaUserEdit className="text-gray-400 text-4xl" />
    )}
  </div>

  {/* Camera Icon Overlay */}
  <label
    htmlFor="photo-upload"
    className="absolute bottom-2 right-2 bg-[#986611] text-white rounded-full p-2 cursor-pointer shadow-md hover:bg-[#7b4e0f] transition"
  >
    <FaCamera className="text-lg" />
    <input
      id="photo-upload"
      type="file"
      accept="image/*"
      onChange={handleFileChange}
      className="hidden"
    />
  </label>
</div>
        


        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-6 px-8 max-w-4xl mx-auto">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#986611]"
            />
          </div>

          {/* Date of Birth */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Date of Birth</label>
            <DatePicker
              selected={user.dob ? new Date(user.dob) : null}
              onChange={(date) =>
                setUser((prev) => ({
                  ...prev,
                  dob: date.toISOString().split('T')[0],
                }))
              }
              dateFormat="yyyy-MM-dd"
              placeholderText="Select your date of birth"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-[#D4B78F] bg-[#FFF8E1] text-[#4B3B0A] placeholder-[#B9A58A] focus:outline-none focus:ring-2 focus:ring-[#986611] transition duration-300 ease-in-out"
              wrapperClassName="w-full"
            />
            <div className="absolute top-9 left-3 text-[#986611] pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3M16 7V3M4 11h16M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <input
              type="text"
              name="phone"
              value={user.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#986611]"
            />
          </div>

          {/* NIC */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIC Number</label>
            <input
              type="text"
              name="NIC"
              value={user.NIC}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#986611]"
            />
          </div>

          {/* TIN */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">TIN Number</label>
            <input
              type="number"
              name="TINnumber"
              value={user.TINnumber}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#986611]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#986611]"
            />
          </div>

          {/* Home Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Home Address</label>
            <input
              type="text"
              name="address"
              value={user.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#986611]"
            />
          </div>

          {/* Salon Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salon Name</label>
            <input
              type="text"
              name="salonName"
              value={user.salonName}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#986611]"
            />
          </div>

          {/* Salon Address */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salon Address</label>
            <input
              type="text"
              name="salonAddress"
              value={user.salonAddress}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#986611]"
            />
          </div>

          {/* Number of Stories */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Stories</label>
            <input
              type="number"
              name="stories"
              value={user.stories}
              onChange={(e) => {
                const count = parseInt(e.target.value) || 0;
                const updatedAreas = [...(user.area || [])];

                if (count > updatedAreas.length) {
                  for (let i = updatedAreas.length; i < count; i++) {
                    updatedAreas.push(0);
                  }
                } else {
                  updatedAreas.length = count;
                }

                setUser((prev) => ({
                  ...prev,
                  stories: count,
                  area: updatedAreas,
                }));
              }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#986611]"
            />
          </div>
        </form>

        {/* Dynamic Area Inputs */}
        {user.area && user.area.length > 0 && (
          <div className="mt-6 px-8 max-w-4xl mx-auto">
            <label className="block text-sm font-medium text-gray-700 mb-2">Salon Area per Story</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {user.area.map((val, idx) => (
                <div key={idx}>
                  <label className="text-sm text-gray-600">Story {idx + 1}</label>
                  <input
                    type="number"
                    value={val}
                    onChange={(e) => {
                      const updated = [...user.area];
                      updated[idx] = parseFloat(e.target.value) || 0;
                      setUser((prev) => ({ ...prev, area: updated }));
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#986611]"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="px-8 max-w-4xl mx-auto">
          <button
            onClick={handleSave}
            className="w-full mt-8 bg-[#986611] text-white py-3 rounded-lg hover:bg-[#7b4e0f] transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>

  );

};

export default UserProfilePage;
