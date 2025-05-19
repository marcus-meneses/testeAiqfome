import { Request, Response, NextFunction, RequestHandler } from "express";
import { Fakestore } from "@/common/services/FakeStore";

export class FakeStoreHandler {
  private static fakestore: Fakestore = new Fakestore();

  public static getAllProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await FakeStoreHandler.fakestore.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  public static getProductById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = parseInt(req.params.id);
      const product =  await FakeStoreHandler.fakestore.getProductById(productId);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };
}
