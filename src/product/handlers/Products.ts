import { Router } from 'express';

const productRouter = Router();

productRouter.get('/', (req, res) => {
  res.json({ message: 'Hello, API!' });
});

export default productRouter;
