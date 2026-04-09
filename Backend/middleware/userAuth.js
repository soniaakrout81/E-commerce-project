import HandelError from "../utils/handelError.js";
import HandleAsyncError from "./HandleAsyncError.js";
import jwt from "jsonwebtoken";
import User from "../models/usersModel.js";


export const verifyUserAuth = HandleAsyncError(async (req, res, next) => {

    const { token } = req.cookies;
    if(!token){

        return next(new HandelError("Authentication is missing! Please login to access resource", 401 ));

    }
    
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_KEY)
    req.user = await User.findById(decodedData.id);
    next();
    

});
export const roleBasedAccess = (requiredRole) => {
  return HandleAsyncError(async (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const userRole = req.user.role;

    if (userRole !== requiredRole) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }


    next();
  });
};