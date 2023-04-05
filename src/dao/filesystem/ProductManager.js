import { readFile, writeFile } from 'fs/promises';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  // Get products
  getProducts = async (limit) => {
    try {
      const products = await JSON.parse(await readFile(this.path));
      if (limit !== undefined) {
        const filterLimit = await products.filter(
          (p) => p.id <= parseInt(limit)
        );
        return filterLimit;
      }
      return products;
    } catch (err) {
      return { ERROR: `${err.message}` };
    }
  };

  // Get product
  getProduct = async (pid) => {
    try {
      const products = await JSON.parse(await readFile(this.path));
      const productExists = await products.some((p) => p.id === parseInt(pid));
      if (productExists) {
        const product = await products.find((p) => p.id === parseInt(pid));
        return product;
      } else {
        throw new Error('The product not exists');
      }
    } catch (err) {
      return { ERROR: `${err.message}` };
    }
  };

  // Add product
  addProduct = async (productData) => {
    try {
      if (productData.id) throw new Error('ID property is an invalid field');
      const products = await JSON.parse(await readFile(this.path));
      const newProduct = {
        id: (await products.length) + 1,
        ...productData,
      };
      await products.push(newProduct);
      const productAdded = JSON.stringify(products);
      await writeFile(this.path, productAdded);
      return { msg: 'The product was added successfully' };
    } catch (err) {
      return { ERROR: `${err.message}` };
    }
  };

  // Update product
  updateProduct = async (pid, productData) => {
    try {
      if (productData.id) throw new Error('ID property is an invalid field');
      const products = await JSON.parse(await readFile(this.path));
      const productExists = await products.some((p) => p.id === parseInt(pid));
      if (productExists) {
        const update = await products.map((p) =>
          p.id === parseInt(pid) ? { ...p, ...productData } : p
        );
        const updatedData = JSON.stringify(update);
        await writeFile(this.path, updatedData);
        return { msg: 'The product was updated successfully' };
      } else {
        throw new Error('The product not exists');
      }
    } catch (err) {
      return { ERROR: `${err.message}` };
    }
  };

  // Delete product
  deleteProduct = async (pid) => {
    try {
      const products = await JSON.parse(await readFile(this.path));
      const productExists = await products.some((p) => p.id === parseInt(pid));
      if (productExists) {
        const del = await products.filter((p) => p.id !== parseInt(pid));
        const productDeleted = JSON.stringify(del);
        await writeFile(this.path, productDeleted);
        return { msg: 'The product was deleted successfully' };
      } else {
        throw new Error('The product not exists');
      }
    } catch (err) {
      return { ERROR: `${err.message}` };
    }
  };
}

export default ProductManager;
