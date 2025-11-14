import express from "express";
import { register , login , logout } from "../controllers/userCtrl.js";

const authrouter = express.Router();

authrouter.post('/register', register);
authrouter.post('/login', login);
authrouter.get('/logout', logout);

export default authrouter