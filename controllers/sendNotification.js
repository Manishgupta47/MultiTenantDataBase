import { getTenantDB } from "../config/dbManager.js";
import notificationSchema from "../models/notificationModel.js";
import userSchema from "../models/userModel.js";
import { sendNotificationEmail } from "../utils/adminSendEmail.js";
  
export const renderSendNotification = async (req, res) => {
  const { Id } = req.admin;
  const db = getTenantDB(Id);
  const Notification = db.model("Notification", notificationSchema);

  const notifications = await Notification.find().sort({ createdAt: -1 });

  res.render("sendNotifications", { notifications });
};

export const sendNotification = async (req, res) => {
  const { title, message, userEmail } = req.body;
  const { Id } = req.admin;

  const db = getTenantDB(Id);
  const Notification = db.model("Notification", notificationSchema);
  const User = db.model("User", userSchema);

  try {
    let targetEmail = null;
    let userName = null;

    if (userEmail) {
     
      const user = await User.findOne({ email: userEmail.trim().toLowerCase() });
      if (!user) {
        return res.status(404).send("User not found with provided email.");
      }
      targetEmail = user.email;
      userName = user.name;

      const newNotification = new Notification({
        title,
        message,
        email: targetEmail,
      });
      await newNotification.save();

      await sendNotificationEmail(user); 

    } else {
     
      const users = await User.find({});

      const validUsers = users.filter(u => u.email); 

      const notifications = validUsers.map(u => ({
        title,
        message,
        email: u.email,
      }));

      await Notification.insertMany(notifications); 

      await Promise.all(validUsers.map(user => sendNotificationEmail(user))); 
    }

    res.redirect("/admin/dashboard?success=Notification sent successfully");

  } catch (err) {
    console.error(" Error sending notification:", err);
    res.status(500).send("Error sending notification");
  }
};

export const deleteNotification = async (req, res) => {
  const { Id } = req.admin;
  const { id } = req.params;

  const db = getTenantDB(Id);
  const Notification = db.model("Notification", notificationSchema);

  try {
    await Notification.findByIdAndDelete(id);
    res.redirect("/admin/send-notification");
  } catch (err) {
    res.status(500).send("Failed to delete notification");
  }
};

