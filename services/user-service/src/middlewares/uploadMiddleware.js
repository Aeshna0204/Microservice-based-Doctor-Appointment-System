const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinaryConfig");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // use the config
  params: {
    folder: "profile_pics", // where images will be saved in your Cloudinary account
    allowed_formats: ["jpg", "jpeg", "png"],
    transformation: [{ width: 500, height: 500, crop: "limit" }],
  },
});

const uploadImage = multer({ storage: storage });

module.exports = uploadImage;
