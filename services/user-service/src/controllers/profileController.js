
const profileService=require("../services/profileService");


exports.getAllUsers=async(req,res)=>{
    try{

        const users=await profileService.getAllUsers();
        if(!users){
            return res.status(500).json({message:"Failed to fetch users, please try again later"});
        }
        return res.status(200).json({message:"Users fetched successfully",users:users});


    }catch(error){
        return res.status(500).json({message:error.message});
    }
}

exports.getUserById=async(req,res)=>{
    try{
        const userId=req.params.id;
        if(!userId){
            return res.status(400).json({message:"UserId is required"});
        }
        const user=await profileService.getUserById(userId);
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        return res.status(200).json({message:"User Details:",user:user});

    }catch(error){

    }
}

exports.updateUserDetails=async(req,res)=>{
    try{
        const userId=req.user.userId;
        if(!userId){
            return res.status(400).json({message:"UserId is required"});
        }
        const {name, age, mobileNumber,address}=req.body;
        const updateData={};
        if(req.file){
            updateData.profilePic=req.file.path;
        }
        else if(req.body.removeProfilePic==="true"){
            updateData.profilePic=null;
        }

        if(name!==undefined){
            updateData.name=name;
        }
        if(age!==undefined){
            updateData.age=parseInt(age);
        }
        if(mobileNumber!==undefined){
            updateData.mobileNumber=mobileNumber;
        }
        if(address!==undefined){
            updateData.address=address;
        }

        if(Object.keys(updateData).length===0){
            return res.status(400).json({message:"No valid fields to update"});
        }

        const updatedUser= await profileService.updateUserDetails(userId, updateData);
        if(!updatedUser){
            return res.status(404).json({message:"User Not Found"});
        }
        return res.status(200).json({message:"User details updated successfully"});


    }catch(error){
        return res.status(500).json({message:"Internal Server Error",error:error.message});
    }
}