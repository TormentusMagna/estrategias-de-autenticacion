import { Router } from 'express';
import {
  addCart,
  getCartProducts,
  addProductsToCart,
} from '../controllers/cartControllers.js';

const router = Router();

router.get('/carts', (req, res) => {
  res.send('RUTA PRINCIPAL DE CARTS');
});

router.post('/api/carts', addCart);
router.get('/api/carts/:cid', getCartProducts);

router.post('/api/carts/:cid/product/:pid', addProductsToCart);

export default router;
