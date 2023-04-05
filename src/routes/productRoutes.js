import { Router } from 'express';
import {
  getProducts,
  getProduct,
  addProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/productControllers.js';

const router = Router();

router.get('/products', getProducts);
router.get('/products/:pid', getProduct);

router.route('/api/products').get(getProducts).post(addProduct);

router
  .route('/api/products/:pid')
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default router;
