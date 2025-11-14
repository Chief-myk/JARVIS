import express from "express";
import { askToAssistant, getCurrentUser, updateAssistant } from "../controllers/dataCtrl.js";
import isAuth from "../middlewares/isAuth.js";
import upload from "../middlewares/multer.js"

const datarouter = express.Router();

datarouter.get('/current', isAuth, getCurrentUser);
datarouter.post('/update', isAuth, upload.single("assistantImage"), updateAssistant);
datarouter.post('/askToAssistant', isAuth,  askToAssistant);

export default datarouter;