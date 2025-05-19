import { Request, Response, NextFunction, RequestHandler } from "express";
import { Fakestore } from "@/common/services/FakeStore";

export class ProductHandler {
  private static fakestore: Fakestore = new Fakestore();

  public static addProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = parseInt(req.body.id);
      const userId = parseInt(req.body.userId);
      const product = await ProductHandler.fakestore.getProductById(productId);
      if (!product) {
        res.status(404).json({ message: "Product not found" });
        return;
      }
      res.status(201).json({ message: "Product added successfully" });
    }
    catch (error) {
      next(error);
    }
  };

  public static getAllProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const products = await ProductHandler.fakestore.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  public static getProductById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = parseInt(req.params.id);
      const product =  await ProductHandler.fakestore.getProductById(productId);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };

  public static getProductsByUserId: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.params.id);
      const products = await ProductHandler.fakestore.getProductById(userId);
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };
  public static deleteProduct: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = parseInt(req.params.id);
      const userId = parseInt(req.body.userId);
      const result = await ProductHandler.fakestore.getProductById(userId);
      if (result) {
        res.status(200).json({ message: "Product deleted successfully" });
      } else {
        res.status(404).json({ message: "Product not found" });
      }
    } catch (error) {
      next(error);
    }
  }
}
