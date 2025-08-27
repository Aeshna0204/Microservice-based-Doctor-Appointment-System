const express = require("express");
const router=express.Router();
const authController=require("../controllers/authController");
const uploadImage=require("../middlewares/uploadMiddleware");

router.post("/register-user",uploadImage.single("profilePic"),authController.register);
router.post("/login-user",authController.login);

router.post("/forget-password",authController.forgetPassword);

router.post("/reset-password", authController.resetPassword); 


module.exports=router;