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

    public static getUserById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.id);
            // Simulate fetching a user by ID from a database or service
            const user = { id: userId, name: "John Doe" };
            res.status(200).json(user);
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

    public static updateUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.id);
            const { name } = req.body;
            // Simulate updating a user in a database or service
            res.status(200).json({ message: `User ${userId} updated successfully`, name });
        } catch (error) {
            next(error);
        }
    };

    public static deleteUser: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = parseInt(req.params.id);
            // Simulate deleting a user from a database or service
            res.status(200).json({ message: `User ${userId} deleted successfully` });
        } catch (error) {
            next(error);
        }
    };
}
