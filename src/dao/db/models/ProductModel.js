import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  title: String,
  description: String,
  code: String,
  price: Number,
  status: Boolean,
  stock: Number,
  category: String,
  thumbnails: Array,
});

const ProductModel = model('Product', ProductSchema);

export default ProductModel;
