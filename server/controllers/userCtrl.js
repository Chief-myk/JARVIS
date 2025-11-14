import generateToken from "../config/jwt.js";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, password: hashedPassword });

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict',
            secure : false, // Set to true if using HTTPS

            maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
        });
        console.log("Generated Token:", token); // Debugging line

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.log('Error in register controller:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid email" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'Strict',
            secure : false, // Set to true if using HTTPS
            maxAge: 5 * 24 * 60 * 60 * 1000 // 5 days
        });
        console.log("Generated Token:", token); // Debugging line

        res.status(201).json({ message: "User registered successfully" });

    } catch (error) {
        console.log('Error in register controller:', error);
        res.status(500).json({ message: "Internal server error" });
    }
}; 

export const logout = (req, res) => {
    try{
    res.clearCookie('token')
    res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log('Error in logout controller:', error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export default {login , logout , register}