import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import * as CustomError from "@common/services/CustomError";

import { Config } from "@common/services/Config";
import { Logger } from "@common/services/Logger";

const configuration = Config.Instance;
const logger = Logger.Instance;
export class ErrorHandler {
  public static handleError : ErrorRequestHandler = async(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) =>{
    if (err instanceof CustomError.Parent) {
      res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof Error) {
        logger.error(err.message+" "+err.stack);
      res.status(500).json({ message: "Unexpected Server Error" });
    }
  }
}
