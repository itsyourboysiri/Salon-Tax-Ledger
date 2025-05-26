import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, X } from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const username = sessionStorage.getItem('username');
      if (!username) return;

      const response = await fetch(`http://localhost:5000/api/users/notifications?username=${username}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data = await response.json();
      
      if (data.success) {
        setNotifications(data.data.notifications);
        setUnreadCount(data.data.unreadCount);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/notifications/${id}/mark-read`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: sessionStorage.getItem('username') })
      });

      if (response.ok) {
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Optimistic UI update - immediately clear unread count
      setUnreadCount(0);
      
      // Update notifications to appear as read in UI
      setNotifications(prevNotifications => 
        prevNotifications.map(notification => ({
          ...notification,
          read: true
        }))
      );
  
      // Then make the actual API call
      const response = await fetch('http://localhost:5000/api/users/notifications/mark-all-read', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: sessionStorage.getItem('username') })
      });
  
      // If API fails, revert the changes
      if (!response.ok) {
        fetchNotifications(); // Refresh to get correct state
        throw new Error('Failed to mark all as read');
      }
    } catch (error) {
      console.error('Error:', error);
      // Optionally show error feedback to user
    }
  };

  const getNotificationIcon = (type) => {
    switch(type.toLowerCase()) {
      case 'payment-received':
        return <CheckCircle className="text-green-500" size={16} />;
      case 'system-alert':
        return <AlertCircle className="text-yellow-500" size={16} />;
      default:
        return <Info className="text-blue-500" size={16} />;
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-[#2a0e16] transition-colors"
        aria-label="Notifications"
      >
        <Bell size={20} className="text-[#FFF3CF]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center ">
            <h3 className="font-semibold text-black">Notifications</h3>
            <div className="flex items-center space-x-2">
              <button 
                onClick={markAllAsRead}
                className="text-xs text-[#986611] hover:text-[#583617]"
              >
                Mark all as read
              </button>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-[#583617]"
              >
                <X size={16} />
              </button>
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#986611]"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell size={24} className="mx-auto mb-2 text-gray-400" />
                <p>No notifications yet</p>
                <p className="text-sm mt-1">We'll notify you when something arrives</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div 
                  key={notification._id} 
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer ${!notification.read ? 'bg-blue-50' : ''}`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="flex items-start">
                    <div className="mt-1 mr-3">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <span className="font-medium text-gray-900">{notification.type}</span>
                        <span className="text-xs text-gray-500">
                          {notification.createdAt}
                        </span>
                      </div>
                      <p className="text-sm mt-1 text-gray-600">{notification.message}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          
          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 text-center">
              <button 
                onClick={fetchNotifications}
                className="text-xs text-[#986611] hover:text-[#7a520d]"
              >
                Refresh Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;