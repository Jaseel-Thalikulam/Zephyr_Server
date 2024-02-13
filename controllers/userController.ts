import { Request,Response } from "express";
import axios from "axios"
import { IGithubUserDataResponse } from "../Interfaces/IGithubUserDataResponse";
import User from "../model/UserModel";
import { IUser } from "../Interfaces/IUser";
import { IMongooseUser } from "../Interfaces/ImongooseUser";
import { ITokens } from "../Interfaces/ITokens";
import { ITokenUser } from "../Interfaces/ITokenUser";
import { generateAccessToken, generateRefreshToken } from "./tokenController";
import { IAccessTokenResponse } from "../Interfaces/IAccessTokenResponse";

export const getGithubAccessToken = async (req: Request, res: Response) => {
    try {
       

        const CLIENT_ID = process.env.GITHUB_AUTH_CLIENT_ID as string
        const CLIENT_SECRET = process.env.GITHUB_AUTH_CLIENT_SECRET as string
        const Code = req.query.code
        const params = '?client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&code=' + Code;
        
      
        
        const response = await axios.post("https://github.com/login/oauth/access_token" + params, {
            headers: {
                'Accept': 'application/json',
              },
        })
        

        const Data: string = response.data;

        const parts = Data.split('&');

// Find the part that starts with 'access_token='
const accessTokenPart = parts.find(part => part.startsWith('access_token='));

// If 'access_token=' is found, extract the token value
const accessToken = accessTokenPart ? accessTokenPart.split('=')[1] : null;
        

        if (accessToken) {
            
            
            const response = await axios.get<IGithubUserDataResponse>("https://api.github.com/user",{
                    headers: {
                            "Authorization":"Bearer "+accessToken
                        }
                    })
            if (response.data && response.data.email) {
                        
                const { avatar_url, email, name } = response.data
                
                const userDetail: IUser = {
                    name:name,
                    email: email,
                    gateWay: "Github_Auth",
                }
                
                
                const Tokens :ITokens=await getOrCreateUser(userDetail)
        
                const { success, accessToken, refreshToken } = Tokens
                if (success) {
                    return res.status(200).json({message:"SuccessFully LoggedIn",accessToken,refreshToken})
                }
        
                return res.status(401).json({message:"Kindly try again",accessToken,refreshToken})
            }
                }
        
    } catch (err) {

        console.log(err)
        return res.status(500).json({success:false,message:"Internal Server Error"})
        
  }
};

export const  createUserWithMicrosoftOrGoogle = async (req:Request,res:Response) => {
    try {
        
        const userDetail:IUser = req.body.user

      const Tokens :ITokens=await getOrCreateUser(userDetail)
        
        const { success, accessToken, refreshToken } = Tokens
        
        if (success) {
            return res.status(200).json({message:"SuccessFully LoggedIn",accessToken,refreshToken})
        }

        return res.status(401).json({message:"Kindly try again",accessToken,refreshToken})
        
    } catch (err) {

        console.log(err);
        
    }
}

const getOrCreateUser = async (userDetail:IUser):Promise<ITokens> => {
    try {
    
        let  userData = await User.findOne({email:userDetail.email})
        
        if (!userData) {
            
            userData = await User.create(userDetail);
       
                return await createToken(userData)
            
        } else {
            
      return await createToken(userData)
      
    }
    } catch (err) {
        console.log(err)
        return{success:false}
}

}

const createToken = async (userData:IMongooseUser):Promise<ITokens> => {
    try {

        const { _id } = userData
        
       
        const accessToken:IAccessTokenResponse = await generateAccessToken(_id)
        const refreshToken:string = await generateRefreshToken(_id)
        if (accessToken.success && refreshToken) {
     
            return { success: true, accessToken: accessToken.token, refreshToken }
            
        }
        return { success: false }
        
    } catch (err) {
        console.log(err);
      return {success:false}
        
    }
}


