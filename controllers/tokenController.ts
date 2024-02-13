import { Request,Response } from "express";
import jwt from 'jsonwebtoken';
import { ITokenUser } from "../Interfaces/ITokenUser";
import User from "../model/UserModel";
import { IAccessTokenResponse } from "../Interfaces/IAccessTokenResponse";



export const generateAccessToken = async (userId: string): Promise<IAccessTokenResponse> => {
    

    
    if (userId) {
    
       
       const token = await jwt.sign({ userId }, "mySecretKey", {
            expiresIn: "1m",
       });
        
        return{success:true,token}
    }
    
    return {success:false}

    };
  

export const generateRefreshToken = async (userId:string) => {
    return jwt.sign({userId}, "mySecretKey", {
      expiresIn: "1w",
    });
};
  

export const getNewAccessToken = async (req:Request, res:Response) => {
    try {

        const { refreshToken } = req.body
      
        if (!refreshToken) {
      
            return res.status(401).json({ success: false, message: "Unauthorized" })
            
        }

        const isRefreshTokenValid = await verifyRefreshToken(refreshToken)
 
        if (isRefreshTokenValid.success) {

            const accessToken = await generateAccessToken(isRefreshTokenValid.id)
            
            if (accessToken.success) {
                
               return res.status(201).json({ success: true, message: "Created New Access Token", accessToken: accessToken.token })
                
            } else {

                return res.status(401).json({ success: false, message: "Invalid Refresh Token" })
                
            }

        }

        return res.status(401).json({success:false,message:"Refresh Token Expired"})
        
    } catch (err) {

        console.log(err);

       return res.status(500).json({message:"Internal Server Error"})
    
    }
    
}


const verifyRefreshToken = async (refreshToken: string) => {
    try {
  
        
        const decoded = jwt.verify(refreshToken, "mySecretKey");

        if (typeof decoded !== 'string' && decoded.userId) {

            return { success: true, id: decoded.userId };

        } else {
            
            console.log(decoded, "The decoded String");
            
            return{success:false}
        }
    
    } catch (err) {
        console.log(err)
        return {success:false}
    }

}