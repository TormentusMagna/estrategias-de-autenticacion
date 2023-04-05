import CartManager from '../CartManager.js';
import { resolve } from 'path';
import __dirname from '../../../utils.js';

const adminCarts = new CartManager(resolve(__dirname, 'files', 'carrito.json'));

// Add new cart
const addCart = async () => {
  return await adminCarts.addCart();
};

// Get products from a specific cart
const getCartProducts = async (cid) => {
  return await adminCarts.getCartProducts(cid);
};

// Add products to a specific cart
const addProductsToCart = async (cid, pid) => {
  return await adminCarts.addProductsToCart(cid, pid);
};

export { addCart, getCartProducts, addProductsToCart };
