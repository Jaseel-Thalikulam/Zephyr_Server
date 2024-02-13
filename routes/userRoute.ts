import { Router } from "express";
import { createUserWithMicrosoftOrGoogle, getGithubAccessToken } from "../controllers/userController";
import { getNewAccessToken } from "../controllers/tokenController";
import { isAuthenticated } from "../middlewares/isAuthenticated";
const user = Router();


user.get('/getGithubAccessToken',getGithubAccessToken)
user.post('/createUserWithMicrosoftOrGoogle',createUserWithMicrosoftOrGoogle)
user.post('/getNewAccessToken',getNewAccessToken)
user.get('/Chats',isAuthenticated,()=>console.log("Called Chats"))



export { user };