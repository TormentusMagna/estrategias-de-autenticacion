import { readFile, writeFile } from 'fs/promises';
import * as ProductModel from '../filesystem/models/ProductModel.js';

class CartManager {
  constructor(path) {
    this.path = path;
  }

  // Add a new cart
  addCart = async () => {
    try {
      const carts = await JSON.parse(await readFile(this.path));
      const newCart = {
        id: (await carts.length) + 1,
        products: [],
      };
      await carts.push(newCart);
      const newCartAdded = JSON.stringify(carts);
      await writeFile(this.path, newCartAdded);
      return { msg: 'New cart added successfully' };
    } catch (err) {
      return { ERROR: `${err.message}` };
    }
  };

  // Get products from a specific cart
  getCartProducts = async (cid) => {
    try {
      const carts = await JSON.parse(await readFile(this.path));
      const cartExists = await carts.some((p) => p.id === parseInt(cid));
      if (cartExists) {
        const cartSelected = await carts.find((p) => p.id === parseInt(cid));

        if (cartSelected.products.length > 0) {
          return cartSelected.products;
        }

        return { msg: 'The cart is empty' };
      } else {
        throw new Error('The cart not exists');
      }
    } catch (err) {
      return { ERROR: `${err.message}` };
    }
  };

  // Add products to a specific cart/=============REVISAR
  addProductsToCart = async (cid, pid) => {
    try {
      const carts = JSON.parse(await readFile(this.path));
      const cartExists = await carts.some((p) => p.id === parseInt(cid));
      if (cartExists) {
        const products = await ProductModel.getProducts();
        const productExists = await products.some(
          (p) => p.id === parseInt(pid)
        );
        if (productExists) {
          //
          const cartSelected = await carts.find((p) => p.id === parseInt(cid));

          const productAlreadyInCart = await cartSelected.products.some(
            (p) => p.product === parseInt(pid)
          );

          if (productAlreadyInCart) {
            const productInCart = await cartSelected.products.find(
              (p) => p.product === parseInt(pid)
            );
            const quantity = (await productInCart.quantity) + 1;
            const updateQuantity = await cartSelected.products.map((p) =>
              p.product === parseInt(pid) ? { ...p, quantity } : p
            );
            cartSelected.products = updateQuantity;
            const cartsUpdated = await carts.map((p) =>
              p.id === parseInt(cid) ? { ...cartSelected } : p
            );
            const newData = JSON.stringify(cartsUpdated);
            await writeFile(this.path, newData);
            return {
              msg: 'The product quantity was updated successfully',
            };
          } else {
            const productToAdd = { product: parseInt(pid), quantity: 1 };
            cartSelected.products.push(productToAdd);
            const productAddedToCart = await carts.map((p) =>
              p.id === parseInt(cid) ? { ...p, ...cartSelected } : p
            );
            const newData = JSON.stringify(productAddedToCart);
            await writeFile(this.path, newData);
            return { msg: 'New product was added successfully to cart' };
          }
        } else {
          throw new Error('The product not exists');
        }
      } else {
        throw new Error('The cart not exists');
      }
    } catch (err) {
      return { ERROR: `${err.message}` };
    }
  };
}

export default CartManager;
