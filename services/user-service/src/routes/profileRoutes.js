const express = require("express");
const router=express.Router();
const profileController=require("../controllers/profileController");
const uploadImage=require("../middlewares/uploadMiddleware");
const verifyJWT = require("shared/authMiddleware");


router.get("/ping", (req, res) => {
  res.send("pong");
});

router.get("/get-all-users",verifyJWT,profileController.getAllUsers);

router.get("/get-user-by-id/:id",verifyJWT,profileController.getUserById);

router.put("/update-user-details",verifyJWT,uploadImage.single("profilePic"),profileController.updateUserDetails);

module.exports=router;