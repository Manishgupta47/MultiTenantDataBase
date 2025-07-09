import jwt from "jsonwebtoken";
import AdminModel from "../models/adminModel.js";

export const isAdmin = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    if (!token) return res.redirect("/admin/login");

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await AdminModel.findById(decoded.id).select("-password");
    if (!admin) return res.redirect("/admin/login?error=Admin not found");

    req.admin = admin;
    req.Id = decoded.Id;
    req.adminId = decoded.id;

    next();
  } catch (err) {
    console.error("Admin Token Error:", err);
    return res.redirect("/admin/login?error=Session expired");
  }
};

export const isUser = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.redirect('/user/login');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    req.user = {
      _id: decoded.id,            
      email: decoded.email,
      name: decoded.name,
      adminId: decoded.adminId      
    };

    next();
  } catch (err) {
    return res.redirect('/user/login?error=Invalid session');
  }
};





