// import * as CartModel from '../dao/filesystem/models/CartModel.js';
import CartModel from '../dao/db/models/CartModel.js';
import ProductModel from '../dao/db/models/ProductModel.js';

// Add a new cart
const addCart = async (req, res) => {
  try {
    // Filesystem ACTIONS
    // ======================
    // const newCart = await CartModel.addCart();
    // if (newCart.ERROR) return res.status(500).json(newCart);
    // return res.status(201).json(newCart);

    // Mongoose ACTIONS
    // ======================
    const newCart = {
      products: [],
    };
    const addCart = await CartModel.create(newCart);
    return res.status(201).json({ msg: `New cart created` });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ ERROR: `${err.message}` });
  }
};

// Get products from a specific cart
const getCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;

    // Filesystem ACTIONS
    // ======================
    // const productsInCart = await CartModel.getCartProducts(cid);
    // if (productsInCart.ERROR === 'The cart not exists')
    //   return res.status(404).json(productsInCart);
    // if (productsInCart.ERROR) return res.status(500).json(productsInCart);
    // return res.status(200).json(productsInCart);

    // Mongoose ACTIONS
    // ======================
    const productsInCart = await CartModel.findById({ _id: cid });
    if (productsInCart === null) throw new Error(`The cart not exists`);
    return res.status(200).json(productsInCart.products);
  } catch (err) {
    if (JSON.stringify(err.message).includes(`Cast to ObjectId failed`))
      return res.status(406).json({ ERROR: `Can\'t find cart` });
    if (err.message === `The cart not exists`)
      return res.status(404).json({ ERROR: `${err.message}` });
    return res.status(500).json({ ERROR: `${err.message}` });
  }
};

// Add products to a specific cart
const addProductsToCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Filesystem ACTIONS
    // ======================
    // const newProduct = await CartModel.addProductsToCart(cid, pid);
    // if (newProduct.ERROR === 'The cart not exists')
    //   return res.status(404).json(newProduct);
    // if (newProduct.ERROR === 'The product not exists')
    //   return res.status(404).json(newProduct);
    // if (newProduct.ERROR) return res.status(500).json(newProduct);
    // if (newProduct.msg === 'The product quantity was updated successfully')
    //   return res.status(200).json(newProduct);
    // if (newProduct.msg === 'New product was added successfully to cart')
    //   return res.status(201).json(newProduct);

    // Mongoose ACTIONS
    // ======================
    // TODOS LOS CARRITOS
    const carts = await CartModel.find();

    // CARRITO
    const cartSelected = await CartModel.findById({ _id: cid });
    if (cartSelected === null) throw new Error(`The cart not exists`);

    // PRODUCTO
    const productSelected = await ProductModel.findById({ _id: pid });
    if (productSelected === null) throw new Error(`The product not exists`);

    if (cartSelected.products.length > 0) {
      const productAlreadyInCart = cartSelected.products.some(
        (p) => parseInt(p.product) === parseInt(pid)
      );

      if (productAlreadyInCart) {
        const productInCart = cartSelected.products.find(
          (p) => parseInt(p.product) === parseInt(pid)
        );
        const quantity = productInCart.quantity + 1;

        const updateQuantity = cartSelected.products.map((p) =>
          parseInt(p.product) === parseInt(pid) ? { ...p, quantity } : p
        );

        cartSelected.products = updateQuantity;

        console.log(cartSelected);
        const up = await CartModel.findByIdAndUpdate(
          { _id: cid },
          { ...cartSelected }
        );
        return res.status(200).json({ msg: `Product quantity was updated` });
      } else {
        // ADD PRODUCT STEPS=======
        // =========================
        const product = {
          product: pid,
          quantity: 1,
        };
        cartSelected.products.push(product);
        const addingProduct = await CartModel.findByIdAndUpdate(
          { _id: cid },
          { products: cartSelected.products }
        );
        return res.status(201).json({ msg: `New product added to cart` });
      }
    } else {
      return res.status(200).json({ msg: `Cart is empty` });
    }
  } catch (err) {
    console.log(err);
    if (JSON.stringify(err.message).includes(`Cast to ObjectId failed`))
      return res.status(406).json({ ERROR: `${err.message}` });
    if (err.message === `The cart not exists`)
      return res.status(404).json({ ERROR: `${err.message}` });
    if (err.message === `The product not exists`)
      return res.status(404).json({ ERROR: `${err.message}` });

    return res.status(500).json({ ERROR: `${err.message}` });
  }
};

export { addCart, getCartProducts, addProductsToCart };
