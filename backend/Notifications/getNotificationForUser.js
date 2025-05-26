const express = require('express');
const router = express.Router();
const Notification = require('./notificationModal');

// GET /api/users/notifications - Get only user notifications
router.get('/notifications', async (req, res) => {
  try {
    const { username, page = 1, limit = 20, unreadOnly = false } = req.query;
    
    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Build query to exclude admin notifications and filter by user
    let query = {
      $or: [
        { recipient: username },
        { 'metadata.username': username }
      ],
      recipientType: 'user' // Only get user notifications
    };

    if (unreadOnly === 'true') {
      query.read = false;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .lean();

    const totalNotifications = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({ ...query, read: false });

    res.json({
      success: true,
      data: {
        notifications: notifications.map(notification => ({
          ...notification,
          // Format dates for frontend
          createdAt: new Date(notification.createdAt).toLocaleString(),
          // Add human-readable type
          type: formatNotificationType(notification.type)
        })),
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(totalNotifications / parseInt(limit)),
          totalNotifications,
          hasNextPage: parseInt(page) < Math.ceil(totalNotifications / parseInt(limit)),
          hasPrevPage: parseInt(page) > 1,
          limit: parseInt(limit)
        },
        unreadCount
      }
    });

  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
      error: error.message
    });
  }
});

// PUT /api/users/notifications/mark-all-read - Mark all notifications as read
router.put('/notifications/mark-all-read', async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({
        success: false,
        message: 'Username is required'
      });
    }

    // Update all unread notifications for this user
    const result = await Notification.updateMany(
      {
        $or: [
          { recipient: username },
          { 'metadata.username': username }
        ],
        recipientType: 'user',
        read: false // Only target unread ones
      },
      { $set: { read: true } } // Mark them as read
    );

    // Return success with the count of marked notifications
    res.json({
      success: true,
      message: `Marked ${result.modifiedCount} notifications as read`,
      unreadCount: 0 // Force-update frontend to show 0 unread
    });

  } catch (error) {
    console.error('Error marking all as read:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to mark all notifications as read',
      error: error.message
    });
  }
});

// Helper function to format notification types
function formatNotificationType(type) {
  const types = {
    'tax-submission': 'Tax Submission',
    'payment-received': 'Payment Received',
    'appointment-reminder': 'Appointment Reminder',
    'system-alert': 'System Alert'
  };
  return types[type] || type;
}

module.exports = router;