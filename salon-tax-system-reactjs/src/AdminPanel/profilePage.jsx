import { useState, useEffect } from 'react';
import { Pencil } from 'lucide-react';
import { Camera } from 'lucide-react';
import { alert } from '../components/AlertBoxes/alertBox';
import TopAndSideBar from './Dashboard Components/sideBar';

export default function ProfileSection() {
  const [userInfo, setUserInfo] = useState({
    username: "",
    email: "",
    profilePicture: ""
  });
 
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({
    username: "",
    email: "",
    profilePicture: ""
  });
  const [selectedFile, setSelectedFile] = useState(null);

  const fetchAdminData = async (username) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/profile/${username}`, {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        return await response.json();
      }
      throw new Error('Failed to fetch admin data');
    } catch (error) {
      console.error('Error fetching admin data:', error);
      return null;
    }
  };

  useEffect(() => {
    const loadAdminData = async () => {
      const session = JSON.parse(localStorage.getItem('adminSession'));

      if (session?.admin?.username) {
        const freshData = await fetchAdminData(session.admin.username);

        if (freshData) {
          const updatedInfo = {
            username: freshData.username,
            email: freshData.email,
            profilePicture: freshData.profilePicture || '/default-profile.png'
          };

          setUserInfo(updatedInfo);
          setEditedInfo(updatedInfo);

          localStorage.setItem('adminSession', JSON.stringify({
            ...session,
            admin: {
              ...session.admin,
              ...updatedInfo
            }
          }));
        }
      }
    };

    loadAdminData();
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setEditedInfo(prev => ({
          ...prev,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const session = JSON.parse(localStorage.getItem('adminSession'));

      if (!session?.admin?.username) {
        alert.error('Session expired. Please log in again.');
        return;
      }

      if (!editedInfo.username || !editedInfo.email) {
        alert.error('Username and email are required.');
        return;
      }

      const formData = new FormData();
      formData.append('username', editedInfo.username.trim());
      formData.append('email', editedInfo.email.trim());
      formData.append('currentUsername', session.admin.username);

      if (selectedFile) {
        formData.append('profilePicture', selectedFile);
      }

      const response = await fetch('http://localhost:5000/api/admin/update-profile', {
        method: 'PUT',
        body: formData,
        credentials: 'include'
      });

      const data = await response.json();

      if (response.ok) {
        const updatedProfile = {
          username: data.username,
          email: data.email,
          profilePicture: data.profilePicture || userInfo.profilePicture
        };

        setUserInfo(updatedProfile);
        setEditedInfo(updatedProfile);

        localStorage.setItem('adminSession', JSON.stringify({
          ...session,
          admin: {
            ...session.admin,
            ...updatedProfile
          }
        }));

        setIsEditing(false);
        setSelectedFile(null);
        alert.success('Profile updated successfully!');
      } else {
        alert.error(data.message || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert.error('Something went wrong during update');
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSelectedFile(null);
    setEditedInfo({
      username: userInfo.username,
      email: userInfo.email,
      profilePicture: userInfo.profilePicture
    });
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <TopAndSideBar>
        <div className="container mx-auto">


          <div className="mb-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 flex justify-between items-center border-b border-gray-100">
                <h3 className="text-lg font-medium" style={{ color: '#2C0613' }}>Personal Information</h3>
                {!isEditing ? (
                  <button
                    onClick={handleEditClick}
                    className="flex items-center px-3 py-1 border border-gray-300 rounded text-sm"
                    style={{ color: '#2C0613' }}
                  >
                    <Pencil size={16} className="mr-1" />
                    Edit
                  </button>
                ) : (
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      style={{ backgroundColor: '#986611' }}
                      className="px-3 py-1 text-white rounded text-sm hover:opacity-90"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-3 py-1 border border-gray-300 rounded text-sm"
                      style={{ color: '#2C0613' }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex justify-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={isEditing ? editedInfo.profilePicture : userInfo.profilePicture}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-1 border-yellow-400 ring-1 ring-yellow-400"
                      onError={(e) => {
                        e.target.src = '/default-profile.png';
                      }}
                    />
                    {isEditing && (
                      <label className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md border border-gray-300 cursor-pointer hover:bg-gray-50">
                        <Camera size={18} className="text-yellow-500" />
                        <input
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleFileChange}
                        />
                      </label>
                    )}
                  </div>

                </div>

                <div className="flex flex-col md:flex-row justify-center gap-8">
                  <div className="text-center md:text-left">
                    <p className="text-sm mb-1" style={{ color: '#2C0613' }}>Username</p>
                    {isEditing ? (
                      <input
                        type="text"
                        name="username"
                        value={editedInfo.username}
                        onChange={handleInputChange}
                        className="border-2 border-yellow-400 rounded p-1 font-medium focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                        style={{ color: '#2C0613' }}
                        required
                      />
                    ) : (
                      <p className="font-medium" style={{ color: '#2C0613' }}>
                        {userInfo.username || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="text-center md:text-left">
                    <p className="text-sm mb-1" style={{ color: '#2C0613' }}>Email</p>
                    {isEditing ? (
                      <input
                        type="email"
                        name="email"
                        value={editedInfo.email}
                        onChange={handleInputChange}
                        className="border-2 border-yellow-400 rounded p-1 font-medium focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                        style={{ color: '#2C0613' }}
                        required
                      />
                    ) : (
                      <p className="font-medium" style={{ color: '#2C0613' }}>
                        {userInfo.email || 'Not provided'}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </TopAndSideBar>
    </div>
  );
}
