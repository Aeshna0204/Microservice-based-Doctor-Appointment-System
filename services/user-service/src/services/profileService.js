const prisma = require('../config/prismaClient.js');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { redisClient, redisPublisher } = require('../config/redis.js');

exports.getAllUsers = async () => {
    const users= await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            age: true,
            mobileNumber: true,
            address: true,
            profilePic: true
        }
    });
    if(!users || users.length === 0) {
        throw new Error("No users found");
    }
    return users;
}


exports.getUserById=async(userId)=>{

    if(!userId){
        throw new Error("User ID is required in Service");
    }
    const user=await prisma.user.findUnique({
        where:{id:userId}
    });

    return user;
        
}

exports.updateUserDetails=async(userId, updateData)=>{
    
   try{
     const user=await prisma.user.update({
        where:{id:userId},
        data: updateData
    });
    return user;

   }catch(error){
    if(error.code==="P2025"){
        return null;//user not found
    }
    throw error;
   }
   
}