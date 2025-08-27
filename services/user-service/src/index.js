require('module-alias/register');
const express =require("express");
const authRoutes =require("./routes/authRoutes");
const profileRoutes=require("./routes/profileRoutes");
const { connectRedis } = require('./config/redis');
const app=express();
app.use(express.json());

(async () => {
  await connectRedis();
})();


app.use("/api/auth",authRoutes);

app.use("/api/profile",profileRoutes);
console.log("Profile routes loaded");

const PORT=process.env.PORT ||4001;
app.listen(PORT,()=>{
    console.log(`User service is running on port ${PORT}`)
});

module.exports=app;