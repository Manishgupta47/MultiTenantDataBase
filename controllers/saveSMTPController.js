
import { getTenantDB } from '../config/dbManager.js';
import userSchema from '../models/userModel.js';

export const saveSMTPSettings = async (req, res) => {
 

  const { email, appPassword } = req.body;
  
  try {
   
    if (!req.user || !req.user._id || !req.user.adminId) {
      throw new Error("User info missing from request");
    }

    const userId = req.user._id;
    const adminId = req.user.adminId;

    const tenantDB = getTenantDB(adminId);
    const UserModel = tenantDB.model('User', userSchema);

  

    await UserModel.findByIdAndUpdate(userId, {
      $set: {
        smtp: {
          email,
          appPassword
        }
      }
    });

    res.redirect('/email/generate-email?success=SMTP credentials saved successfully!');
  } catch (error) {
    console.error(" SMTP Save Error:", error.message);
    res.redirect('/email/generate-email?error=Failed to save SMTP settings');
  }
};

