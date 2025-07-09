import { getTenantDB } from "../config/dbManager.js";
import notificationSchema from "../models/notificationModel.js";

export const markAsRead = async (req, res) => {
  try {
    const { adminId, email } = req.user; 
    const { id } = req.params;

    const db = getTenantDB(adminId);
    const Notification = db.model("Notification", notificationSchema);

    const notification = await Notification.findById(id);

    if (!notification || (notification.email && notification.email !== email)) {
      return res.status(403).send("Unauthorized to mark this notification as read.");
    }

    await Notification.findByIdAndUpdate(id, { isRead: true });

    res.redirect("/user/notifications");
  } catch (err) {
    console.error("Mark as read error:", err);
    res.status(500).send("Could not mark as read.");
  }
};

  