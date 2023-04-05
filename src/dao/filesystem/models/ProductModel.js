import ProductManager from '../ProductManager.js';
import { resolve } from 'path';
import __dirname from '../../../utils.js';

const adminProducts = new ProductManager(
  resolve(__dirname, 'files', 'productList.json')
);

// Get products
const getProducts = async (limit) => {
  return await adminProducts.getProducts(limit);
};

// Get product
const getProduct = async (pid) => {
  return await adminProducts.getProduct(pid);
};

// Add product
const addProduct = async (productData) => {
  return await adminProducts.addProduct(productData);
};

// Update product
const updateProduct = async (pid, productData) => {
  return await adminProducts.updateProduct(pid, productData);
};

// Delete product
const deleteProduct = async (pid) => {
  return await adminProducts.deleteProduct(pid);
};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
