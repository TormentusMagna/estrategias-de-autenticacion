//import * as ProductModel from '../dao/filesystem/models/ProductModel.js';
import ProductModel from '../dao/db/models/ProductModel.js';

// Get products
const getProducts = async (req, res) => {
  try {
    let { limit, page, query, sort } = req.query;

    // Filesystem ACTIONS
    // ======================
    // const products = await ProductModel.getProducts(limit);
    // if (products.ERROR) return res.status(500).json(products);
    // return res.status(200).json(products);

    // Mongoose ACTIONS
    // ======================
    if (limit === undefined || limit === '0' || limit === '') limit = '10';
    if (page === undefined || page === '0' || page === '') page = '1';
    if (query !== undefined) query = query;
    if (sort !== undefined) sort = sort;

    const products = await ProductModel.find()
      .select('-__v')
      .limit(limit)
      .where({ category: `${query}` })
      .sort(sort);

    return res.status(200).json({
      status: 'success',
      payload: products,
      totalPages: 'Total de páginas',
      prevPage: 'Página anterior',
      nextPage: 'Página siguiente',
      page: page,
      hasPrevPage: false,
      hasNextPage: true,
      prevLink: 'Link directo a la página previa (null si hasPrevPage=false)',
      nextLink:
        'Link directo a la página siguiente (null si hasNextPage=false)',
    });
  } catch (err) {
    // AGREGAR AQUI EL JSON COMPLETO COMO EL DE ARRIBA
    return res.status(500).json({ ERROR: `${err.message}` });
  }
};

// Get product
const getProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    // Filesystem ACTIONS
    // ======================
    // const product = await ProductModel.getProduct(pid);
    // if (product.ERROR === 'The product not exists')
    //   return res.status(404).json(product);
    // if (product.ERROR) return res.status(500).json(product);
    // return res.status(200).json(product);

    // Mongoose ACTIONS
    // ======================
    const product = await ProductModel.findOne({ _id: pid });
    if (product === null) throw new Error(`The product not exists`);
    return res.status(200).json(product);
  } catch (err) {
    if (err.message === 'The product not exists')
      return res.status(404).json({ ERROR: `${err.message}` });
    if (JSON.stringify(err.message).includes('Cast to ObjectId failed'))
      return res.status(406).json({ ERROR: `Searching fails` });
    return res.status(500).json({ ERROR: `${err.message}` });
  }
};

// Add product
const addProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Filesystem ACTIONS
    // ======================
    // const newProduct = await ProductModel.addProduct(productData);
    // if (newProduct.ERROR === 'ID property is an invalid field')
    //   return res.status(400).json(newProduct);
    // if (newProduct.ERROR) return res.status(500).json(newProduct);
    // return res.status(201).json(newProduct);

    // Mongoose ACTIONS
    // ======================
    if (productData.id || productData._id)
      throw new Error(`ID property is an invalid field`);
    await ProductModel.create(productData);
    return res.status(201).json({ msg: `New product created` });
  } catch (err) {
    if (err.message === `ID property is an invalid field`)
      return res.status(406).json({ ERROR: `${err.message}` });
    return res.status(500).json({ ERROR: `${err.message}` });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const { pid } = req.params;
    const productData = req.body;

    // Filesystem ACTIONS
    // ======================
    // const productUpdated = await ProductModel.updateProduct(pid, productData);
    // if (productUpdated.ERROR === 'The product not exists')
    //   return res.status(404).json(productUpdated);
    // if (productUpdated.ERROR === 'ID property is an invalid field')
    //   return res.status(400).json(productUpdated);
    // if (productUpdated.ERROR) return res.status(500).json(productUpdated);
    // return res.status(201).json(productUpdated);

    // Mongoose ACTIONS
    // ======================
    if (productData.id || productData._id)
      throw new Error(`ID property is an invalid field`);
    const productUpdated = await ProductModel.findByIdAndUpdate(
      { _id: pid },
      productData
    );
    if (productUpdated === null) throw new Error(`The product not exists`);
    return res.status(201).json({ msg: 'Product data updated' });
  } catch (err) {
    if (JSON.stringify(err.message).includes('Cast to ObjectId failed'))
      return res.status(406).json({ ERROR: `Can\'t find product to update` });
    if (err.message === `The product not exists`)
      return res.status(404).json({ ERROR: `${err.message}` });
    if (err.message === `ID property is an invalid field`)
      return res.status(406).json({ ERROR: `${err.message}` });
    return res.status(500).json({ ERROR: `${err.message}` });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const { pid } = req.params;

    // Filesystem ACTIONS
    // ======================
    // const productDeleted = await ProductModel.deleteProduct(pid);
    // if (productDeleted.ERROR === 'The product not exists')
    //   return res.status(404).json(productDeleted);
    // if (productDeleted.ERROR) return res.status(500).json(productDeleted);
    // return res.status(200).json(productDeleted);

    // Mongoose ACTIONS
    // ======================
    const productDeleted = await ProductModel.findByIdAndDelete({ _id: pid });
    if (productDeleted === null) throw new Error(`The product not exists`);
    return res.status(200).json({ msg: `Product has been deleted` });
  } catch (err) {
    if (err.message === `The product not exists`)
      return res.status(404).json({ ERROR: `${err.message}` });
    if (JSON.stringify(err.message).includes(`Cast to ObjectId failed`))
      return res.status(406).json({ ERROR: `Can\'t find product to delete` });
    return res.status(500).json({ ERROR: `${err.message}` });
  }
};

export { getProducts, getProduct, addProduct, updateProduct, deleteProduct };
