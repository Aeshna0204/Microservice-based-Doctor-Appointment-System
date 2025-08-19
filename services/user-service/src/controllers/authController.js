const authService=require("../services/authService");

exports.register=async(req,res)=>{
    try{
        
        const {name,email,password,mobileNumber,address}=req.body;
        const age=parseInt(req.body.age);
        const role ="user";
        const profilePicUrl=req.file?.path || null; // Get the uploaded file path or null if not provided
    
        if(!name ||!email || !password ||!role ||!age){
            return res.status(400).json({message:"please provide name, email , passowrd , age and role"});
        }
        const user=await authService.register(name,email,password,role,age,mobileNumber,address,profilePicUrl);
       
        if(!user){
            return res.status(500).json({message:"User registration failed"});
        }
        return res.status(200).json({message:"user registered successfully",user});

    }catch(error){
        return res.status(500).json({message:error.message});

    }
};

exports.login=async(req,res)=>{
    try{
        const {email,password}=req.body;
        if(!email || !password){
            return res.status(400).json({message:"Please provide email and password"});
        }
    
        const {id,role,token}=await authService.login(email,password);
        if(!id||!role|| !token){
            return res.status(401).json({message:"Invalid email or password, login unsucessfull"});
        }
        return res.status(200).json({message:"Login successfull",id:id,role:role,token:token});
    }catch(error){
        return res.status(500).json({message:error.message});
    }
};

exports.forgetPassword=async(req,res)=>{
    try{
        const {email}=req.body;
        if(!email){
            return res.status(400).json({message:"Please provide email"});
        }
        const {otp,message}= await authService.forgetPassword(email);
        if(!otp){
            return res.status(500).json({message:"Failed to generate OTP, please try again later"});
        }
        return res.status(200).json({message:message,otp:otp});

    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

exports.resetPassword=async(req,res)=>{
    try{
        const {email,otp,newPassword}=req.body;
        if(!email||!otp||!newPassword){
            return res.status(500).json({message:"Please provide email, otp and new password"});
        }
        const {message}=await authService.resetPassword(email,otp,newPassword);
        return res.status(200).json({message:message});

    }catch(error){
        return res.status(500).json({message:error.message});

    }
}

exports.getAllUsers=async(req,res)=>{
    try{

        const users=await authService.getAllUsers();
        if(!users){
            return res.status(500).json({message:"Failed to fetch users, please try again later"});
        }
        return res.status(200).json({message:"Users fetched successfully",users:users});


    }catch(error){
        return res.status(500).json({message:error.message});
    }
}