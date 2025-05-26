const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Notification = require('./notificationModal'); 

// Get notifications for admin (only admin-type notifications)
router.get('/notifications', async (req, res) => {
    try {
      const notifications = await Notification.find({
        recipientType: 'admin'  // Only fetch admin notifications
      })
        .sort({ createdAt: -1 })
        .limit(50);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Get notifications count for admin (unread admin notifications)
router.get('/notifications/count', async (req, res) => {
    try {
      const count = await Notification.countDocuments({
        recipientType: 'admin',
        read: false
      });
      res.json({ count });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Mark notification as read (only admin notifications)
router.put('/notifications/:id/read', async (req, res) => {
    try {
      const notification = await Notification.findOneAndUpdate(
        { 
          _id: req.params.id,
          recipientType: 'admin' // Ensure only admin notifications can be marked as read by admin
        },
        { read: true },
        { new: true }
      );
      
      if (!notification) {
        return res.status(404).json({ message: 'Admin notification not found' });
      }
      
      console.log("Admin notification marked as read:", notification);
      res.json(notification);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Mark all admin notifications as read
router.put('/notifications/mark-all-read', async (req, res) => {
    try {
      const result = await Notification.updateMany(
        { 
          read: false,
          recipientType: 'admin' // Only mark admin notifications as read
        },
        { $set: { read: true } }
      );
      res.json({ 
        message: 'All admin notifications marked as read',
        modifiedCount: result.modifiedCount
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Clear all admin notifications
router.delete('/notifications/clear', async (req, res) => {
    try {
      const result = await Notification.deleteMany({
        recipientType: 'admin' // Only delete admin notifications
      });
      res.json({ 
        message: 'All admin notifications cleared',
        deletedCount: result.deletedCount
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Get recent admin activity (last 10 admin actions)
router.get('/notifications/recent-activity', async (req, res) => {
    try {
      const recentActivity = await Notification.find({
        recipientType: 'admin',
        type: 'admin-action'
      })
        .sort({ createdAt: -1 })
        .limit(10)
        .select('message metadata.confirmedBy metadata.declinedBy metadata.action metadata.salonName metadata.name createdAt');
      
      res.json(recentActivity);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

// Get admin notifications by action type (confirmed/declined)
router.get('/notifications/by-action/:action', async (req, res) => {
    try {
      const { action } = req.params;
      const notifications = await Notification.find({
        recipientType: 'admin',
        'metadata.action': action
      })
        .sort({ createdAt: -1 })
        .limit(20);
      
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
});

module.exports = router;