import { Request, Response, NextFunction, RequestHandler } from "express";
import { Fakestore } from "@/common/services/FakeStore";

export class FakeStoreHandler {
  private static fakestore: Fakestore = new Fakestore();

  public static getAllProducts: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {


    /** 
      #swagger.tags = ['FakeStore']
      #swagger.summary = 'Get all products'
      #swagger.description = 'Get all products and return product data'
 
      #swagger.responses[200] = {  
         description: 'List of products',  
         schema: { "$ref": "#/components/schemas/ListFakeProductsResponse" }
       }
       #swagger.responses[500] = {
         description: 'Internal server error',
         schema: { "$ref": "#/components/schemas/ErrorResponse" }
       }
       #swagger.responses[400] = {
         description: 'No products found',
         schema: { "$ref": "#/components/schemas/ErrorResponse" }
       }
      
      
      */
    
    try {
      const products = await FakeStoreHandler.fakestore.getAllProducts();
      res.status(200).json(products);
    } catch (error) {
      next(error);
    }
  };

  public static getProductById: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

    /** 
      #swagger.tags = ['FakeStore']
      #swagger.summary = 'Get product'
      #swagger.description = 'Get product by ID and return product data'

      #swagger.parameters['id'] = { in:'path', description: 'User ID', required: true, type: 'string' }
       
      #swagger.responses[200] = {  
         description: 'Product',  
         schema: { "$ref": "#/components/schemas/GetFakeProductResponse" }
       }
       #swagger.responses[500] = {
         description: 'Internal server error',
         schema: { "$ref": "#/components/schemas/ErrorResponse" }
       }
       #swagger.responses[400] = {
         description: 'No product found',
         schema: { "$ref": "#/components/schemas/ErrorResponse" }
       }
      
      
      */
    try {
      const productId = parseInt(req.params.id);
      const product =  await FakeStoreHandler.fakestore.getProductById(productId);
      res.status(200).json(product);
    } catch (error) {
      next(error);
    }
  };
}
