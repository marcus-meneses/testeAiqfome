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
      #swagger.responses[200] = {  
        description: 'Login successful',  
        schema: { "$ref": "#/components/schemas/LoginResponse" }  
      }
      #swagger.responses[401] = {
        description: 'Invalid email or password',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
      }
      #swagger.responses[500] = {
        description: 'Internal server error',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
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
    // #swagger.security = [{ "Bearer": [] }]
    // #swagger.auto = false


    try {
      const token = req.headers["authorization"];
      if (token) {
        const decoded = jwt.verify(
          token.replace(/^Bearer\s/, ""),
          configuration.get("RANDOM_KEY")
        );
        if (decoded) {
        const { iat, exp, ...userData } = decoded as any;
        res.locals.userData = userData;

        if (res.locals.ownData.enforce) {
          res.locals.ownData.tokenField = res.locals.ownData.tokenField;
        }

          next();
        } else {
          res.status(401).json({ message: "Unauthorized" });
        }
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {

      throw new CustomError.UnauthorizedError("Invalid token", error);
    }
  };



  public static ownData(tokenField: string): RequestHandler {
    return async (req: Request, res: Response, next: NextFunction) => {
      // #swagger.auto = false

      res.locals = {
        ownData: {
          enforce: true,
          tokenField: tokenField,
        },
      }

      next();
    };
  }

  public static refreshToken: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
       const token = req.headers["authorization"];
      if (token) {
        const decoded = jwt.verify(
          token.replace(/^Bearer\s/, ""),
          configuration.get("RANDOM_KEY")
        );
        if (decoded) {
          const { iat, exp, ...userData } = decoded as any;
          const newToken = jwt.sign(userData, configuration.get("RANDOM_KEY"), {
            expiresIn: "1h",
          });
          res.status(200).json({ token: newToken });
        }
      } else {
        res.status(401).json({ message: "Unauthorized" });
      }
    } catch (error) {
      next(error);
    }
  };
}
