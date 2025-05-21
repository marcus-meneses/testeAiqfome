import { Request, Response, NextFunction, RequestHandler } from "express";
import { UserRepository } from "@user/repositories/userRepository";
import { User } from "@user/models/userModel";
import * as CustomError from "@common/services/CustomError";
export class UserHandler {
  public static getAllUsers: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    /** 
     #swagger.tags = ['User']
     #swagger.summary = 'Get all users'
     #swagger.description = 'Get all users and return user data'

     #swagger.responses[200] = {  
        description: 'List of users',  
        schema: { "$ref": "#/components/schemas/ListUsersResponse" }
      }
      #swagger.responses[500] = {
        description: 'Internal server error',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
      }
      #swagger.responses[400] = {
        description: 'No users found',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
      }
     
     
     */

    const userRepository = new UserRepository();
    try {
      const users = await userRepository.findAll();
      if (users == null) {
        res.status(400).json({ message: "No users found" });
      } else {
        const usersWithoutPassword = users.map((user) => {
          const { password, ...userWithoutPassword } = user;
          return userWithoutPassword;
        });
        res.status(200).json(usersWithoutPassword);
      }
    } catch (error) {
      next(error);
    }
  };

  public static getUserById: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const userRepository = new UserRepository();

    /** 
     #swagger.tags = ['User']
     #swagger.summary = 'Get user'
     #swagger.description = 'Get user by ID and return user data'
     
     #swagger.parameters['id'] = { in:'path', description: 'User ID', required: true, type: 'string' }
 
     #swagger.responses[200] = {  
        description: 'User Object',  
        schema: { "$ref": "#/components/schemas/GetUserResponse" }
      }
      #swagger.responses[500] = {
        description: 'Internal server error',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
      }
      #swagger.responses[400] = {
        description: 'No users found',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
      }
       
     */

    try {
      const userId = req.params.id;

      const objectRestrains = res.locals.ownData ? res.locals : null;

      if (objectRestrains) {
        if (
          objectRestrains.userData[objectRestrains.ownData.tokenField] !==
          userId
        ) {
          throw new CustomError.ForbiddenError(
            "Forbidden access",
            "Resource not owned by user"
          );
        }
      }

      const user = await userRepository.findById(userId);
      if (user == null) {
        res.status(400).json({ message: "User not found" });
      } else {
        const { password, ...userWithoutPassword } = user;
        res.status(200).json(userWithoutPassword);
      }
    } catch (error) {
      next(error);
    }
  };

  public static registerUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    /** 
      #swagger.tags = ['User']
      #swagger.summary = 'Create user'
      #swagger.description = 'Create new user and return user data'
        
      #swagger.requestBody = {  
        required: true,  
        schema: { "$ref": "#/components/schemas/CreateUser" }  
      }  

      #swagger.responses[200] = {  
        description: 'User Object',  
        schema: { "$ref": "#/components/schemas/GetUserResponse" }
      }

       #swagger.responses[400] = {
        description: 'No users found',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
      }

      #swagger.responses[500] = {
        description: 'Internal server error',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
      }
     */
    try {
      const { name, email, password } = req.body;
      const userRepository = new UserRepository();

      const newUser = (await userRepository.create({
        name,
        email,
        password,
      })) as User;

      if (newUser == null) {
        res.status(409).json({ message: "User registration failed" });
      } else {
        const { password, ...returnData } = newUser;
        res.status(201).json(returnData);
      }
    } catch (error) {
      throw new CustomError.CreationFailedError(
        "User registration failed",
        error
      );
    }
  };

  public static updateUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    /** 
     #swagger.tags = ['User']
     #swagger.summary = 'Update user'
     #swagger.description = 'Update user and return user data'
     
     #swagger.requestBody = {  
        required: true,  
        schema: { "$ref": "#/components/schemas/UpdateUser" }  
     }  
      #swagger.parameters['id'] = { in:'path', description: 'User ID', required: true, type: 'string' }
      

     #swagger.responses[200] = {  
        description: 'User Updated Object',  
        schema: { "$ref": "#/components/schemas/GetUserResponse" }
     }

     #swagger.responses[400] = {
        description: 'Update Failed',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
     }

     #swagger.responses[500] = {
        description: 'Internal server error',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
      }
       
     */

    try {
      const userRepository = new UserRepository();
      const userId = req.params.id;
      const { id, name, email } = req.body;

      const objectRestrains = res.locals.ownData ? res.locals : null;

      if (objectRestrains) {
        if (
          objectRestrains.userData[objectRestrains.ownData.tokenField] !==
          userId
        ) {
          throw new CustomError.ForbiddenError(
            "Forbidden access",
            "Resource not owned by user"
          );
        }
      }

      const updatedUser = await userRepository.update(userId, {
        id,
        name,
        email,
      });

      if (updatedUser == null) {
        res.status(400).json({ message: "User update failed" });
      } else {
        const { password, ...returnData } = updatedUser;
        res.status(200).json(returnData);
      }
    } catch (error) {
      next(error);
    }
  };

  public static deleteUser: RequestHandler = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      /** 
     #swagger.tags = ['User']
     #swagger.summary = 'Delete user'
     #swagger.description = 'Delete user by ID and return user data'
     
     #swagger.parameters['id'] = { in:'path', description: 'User ID', required: true, type: 'string' }
 
     #swagger.responses[200] = {  
        description: 'User Deleted Object',  
        schema: { "$ref": "#/components/schemas/GetUserResponse" }
      }
      #swagger.responses[500] = {
        description: 'Internal server error',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
      }
      #swagger.responses[400] = {
        description: 'No users found',
        schema: { "$ref": "#/components/schemas/ErrorResponse" }
      }
       
     */

      const userRepository = new UserRepository();
      const userId = req.params.id;

      const objectRestrains = res.locals.ownData ? res.locals : null;

      if (objectRestrains) {
        if (
          objectRestrains.userData[objectRestrains.ownData.tokenField] !==
          userId
        ) {
          throw new CustomError.ForbiddenError(
            "Forbidden access",
            "Resource not owned by user"
          );
        }
      }

      const deleteUser = await userRepository.delete(userId);
      console.log(deleteUser);
      if (deleteUser == null) {
        res.status(400).json({ message: "User deletion failed" });
      } else {
        res.status(200).json({ message: "User deleted successfully" });
      }
    } catch (error) {
      next(error);
    }
  };
}
