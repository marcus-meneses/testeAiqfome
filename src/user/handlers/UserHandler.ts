import { Request, Response, NextFunction, RequestHandler } from "express";


export class UserHandler {
    // Define the type of the request handler
    public static getAllUsers: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Simulate fetching users from a database or service
            const users = [
                { id: 1, name: "John Doe" },
                { id: 2, name: "Jane Smith" },
            ];
            res.status(200).json(users);
        } catch (error) {
            next(error);
        }
    };

    public static registerUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            // Simulate user registration logic
            const { username, password } = req.body;
            if (username && password) {
                // Simulate successful registration
                res.status(201).json({ message: "User registered successfully" });
            } else {
                res.status(400).json({ message: "Invalid input" });
            }
        } catch (error) {
            next(error);
        }
    }
}
