import { Request, Response, NextFunction, RequestHandler } from "express";
import { UserRepository } from "@/user/repositories/userRepository";
import * as CustomError from "@common/services/CustomError";
import jwt from "jsonwebtoken";

import { Config } from "@common/services/Config";
import { Logger } from "../services/Logger";

const configuration = Config.Instance;
const logger = Logger.Instance;
export class AuthenticationHandler {
  public static login: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    /** 
      #swagger.tags = ['User']
      #swagger.summary = 'Login user'
      #swagger.description = 'Login user and return token'
    
      #swagger.requestBody = {  
         required: true,  
         schema: { "$ref": "#/components/schemas/LoginUser" }  
      }  
     */  

    try {
      const userRepository = new UserRepository();
      const { email, password } = req.body;
      const user = await userRepository.findByCredentials(email, password);

      if (user) {
        const token = jwt.sign(user, configuration.get("RANDOM_KEY"), {
          expiresIn: "1h",
        });

        res.status(200).json({ user: user, token: token });
      } else {
        throw new CustomError.UnauthorizedError("Invalid email or password");
      }
    } catch (error) {
      next(error);
    }
  };

     
    
    

  public static authenticate: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

      // #swagger.auto = false

    try {
      const token = req.headers["authorization"];
      if (token) {
        const decoded = jwt.verify(token.replace(/^Bearer\s/, ''), configuration.get("RANDOM_KEY"));
        if (decoded) {
          req.body.user = decoded;
          next();
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      next(error);
    }
  };


      
     
       
  public static ownData: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

     // #swagger.auto = false

    if (!req.body) {
      req.body = {};
    }
    req.body.ownData = true;
    next();
  };

  public static refreshToken: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const oldToken = req.headers["authorization"];
      if (oldToken) {
        const newToken = "new_token_12345";
        res.status(200).json({ token: newToken });
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      next(error);
    }
  };
}
