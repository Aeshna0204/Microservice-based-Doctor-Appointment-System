const express =require("express");
const authRoutes =require("./routes/authRoutes");
const { connectRedis } = require('./config/redis');
const app=express();
app.use(express.json());

(async () => {
  await connectRedis();
})();


app.use("/api/auth",authRoutes);

const PORT=process.env.PORT ||4001;
app.listen(PORT,()=>{
    console.log(`User service is running on port ${PORT}`)
});

module.exports=app;