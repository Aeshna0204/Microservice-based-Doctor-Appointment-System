const prisma = require('../config/prismaClient.js');
const bycrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { redisClient, redisPublisher } = require('../config/redis.js');


exports.register = async (name, email, password, role, age, mobileNumber, address, profilePic) => {
    const hashedPassword = await bycrypt.hash(password, 10);
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error("User already registered with this email");
    }
    const user = await prisma.user.create({
        data: { name, email, password: hashedPassword, role, age, mobileNumber, address, profilePic }
    });
    if (!user) {
        throw new Error("User registration failed, please try again later");
    }
    return user;
}

exports.login = async (email, password) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });
    if (!user) {
        throw new Error("User not Found or not registered yet");
    }
    const { id, role } = user;
    const isPasswordValid = await bycrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new Error("Password is incorrect , your username and password is mismatched")
    }

    // if sahi hai toh token generate karna hai
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '10minutes' });
    return { id, role, token };
}


// function to generate a 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.forgetPassword = async (email) => {
    const cleanEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email: cleanEmail }
    });
    if (!user) {
        throw new Error("Email not registered");
    }

    const otp = generateOTP();

    const key = `otp:${cleanEmail}`;
    console.log("key",key);
    await redisClient.set(key, String(otp), { EX: 600 });

    // Debug check
    const verifyOtp = await redisClient.get(key);
    console.log("OTP stored in Redis:", verifyOtp);

    // Publish event for Mailer Service
    await redisPublisher.publish('send_email_channel', JSON.stringify({
        type: 'send_email',
        to: cleanEmail,
        subject: 'Password Reset OTP',
        text: `Your OTP is ${otp}`
    }));

    return { message: `OTP sent to your email ${otp}`, otp:otp };
};


exports.resetPassword = async (email, otp, newPassword) => {
    const user = await prisma.user.findUnique({
        where: { email }
    });

    if (!user) {
        throw new Error("Email not registered");
    }
    const storedOtp = await redisClient.get(`otp:${email}`);

    console.log({ storedOtp, otp });

    if (!storedOtp || storedOtp !== String(otp)) {
        throw new Error('Invalid or expired OTP')
    }

    const hashedPassword = await bycrypt.hash(newPassword, 10);
    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    })
    await redisClient.del(`otp:${email}`);
    return { message: "Password reset successful" };
}

