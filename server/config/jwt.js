import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const generateToken = (userId) => {
    try {
        const token = jwt.sign({userId }, process.env.JWT_SECRET, { expiresIn: '5d' });
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Token generation failed');
    }
};

export default generateToken;