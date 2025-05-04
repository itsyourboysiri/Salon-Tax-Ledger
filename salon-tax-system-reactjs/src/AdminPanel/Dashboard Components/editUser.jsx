import React from 'react';
import { X } from 'lucide-react';

const EditUsers = ({ editUser, onClose, onChange, onUpdate }) => {
  if (!editUser) return null;

  // Update individual area field
  const handleAreaChange = (index, value) => {
    const updatedAreas = [...(editUser.area || [])];
    updatedAreas[index] = parseFloat(value) || 0;
  
    // Sync if user edited an area outside current stories count (edge case)
    if (updatedAreas.length > editUser.stories) {
      updatedAreas.length = editUser.stories;
    }
  
    onChange({ target: { name: 'area', value: updatedAreas } });
  };

  // Adjust area fields when story count changes
  const handleStoriesChange = (e) => {
    const storyCount = parseInt(e.target.value) || 0;
    let updatedAreas = Array.from({ length: storyCount }, (_, i) =>
      editUser.area && i < editUser.area.length ? editUser.area[i] : 0
    );
  
    onChange({ target: { name: 'stories', value: storyCount } });
    onChange({ target: { name: 'area', value: updatedAreas } });
  };
  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-4xl h-[90vh] overflow-y-auto p-8 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-2 text-center">Edit Personal Information</h2>
        <p className="text-gray-500 mb-6 text-center">Update your details to keep your profile up-to-date.</p>

        {/* 🖼️ Profile Image */}
        <div className="mb-6 flex justify-center">
          <div className="relative group">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onloadend = () => {
                  onChange({ target: { name: 'photo', value: reader.result } });
                };
                if (file) reader.readAsDataURL(file);
              }}
              className="hidden"
              id="upload-photo"
            />
            <label htmlFor="upload-photo" className="cursor-pointer">
              <div className="w-28 h-28 rounded-full border-2 border-dashed border-gray-300 hover:border-blue-500 overflow-hidden relative flex items-center justify-center">
                {editUser.photo ? (
                  <img
                    src={editUser.photo}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400">Click to upload</span>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition duration-200 flex items-center justify-center text-white text-sm font-medium opacity-0 group-hover:opacity-100">
                  Change
                </div>
              </div>
            </label>
          </div>
        </div>

        {/* ✍️ Personal Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              name="name"
              value={editUser.name || ''}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              name="dob"
              value={editUser.dob || ''}
              onChange={onChange}
              type="date"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input
              name="address"
              value={editUser.address || ''}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
            <input
              name="phone"
              value={editUser.phone || ''}
              onChange={onChange}
              type="tel"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">NIC</label>
            <input
              name="NIC"
              value={editUser.NIC || ''}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salon Name</label>
            <input
              name="salonName"
              value={editUser.salonName || ''}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Salon Address</label>
            <input
              name="salonAddress"
              value={editUser.salonAddress || ''}
              onChange={onChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stories</label>
            <input
              name="stories"
              value={editUser.stories || ''}
              onChange={handleStoriesChange}
              type="number"
              min="0"
              className="w-full border border-gray-300 rounded-lg px-4 py-2"
            />
          </div>
        </div>

        {/* 🏢 Area Fields */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Area (sqft) for each story</label>
          <div className="space-y-2">
            {editUser.area?.map((value, index) => (
              <input
                key={index}
                type="number"
                value={value}
                onChange={(e) => handleAreaChange(index, e.target.value)}
                placeholder={`Story ${index + 1} area`}
                className="w-full border border-gray-300 rounded-lg px-4 py-2"
              />
            ))}
          </div>
        </div>

        {/* 📧 Email */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            value={editUser.email || ''}
            onChange={onChange}
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2"
          />
        </div>

        {/* 💾 Action Buttons */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Close
          </button>
          <button
            onClick={onUpdate}
            className="px-5 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUsers;
