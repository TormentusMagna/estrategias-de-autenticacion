import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import expressEjsLayouts from 'express-ejs-layouts';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { resolve } from 'path';
import __dirname from './utils.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import viewRoutes from './routes/viewRoutes.js';
import * as ProductModel from './dao/filesystem/models/ProductModel.js';
import db from './dao/db/db.js';

// Start app
const app = express();
const server = createServer(app);
const io = new Server(server);

// DB CONNECTION
db();

// Settings
app.set('view engine', 'ejs');
app.set('views', resolve(__dirname, 'views'));
app.set('layout', resolve(__dirname, 'views', 'layout.ejs'));
app.set('layout extractScripts', true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(resolve(__dirname, 'public')));
app.use(expressEjsLayouts);

// Routing
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', viewRoutes);

// ERROR 404 PAGE NOT FOUND HANDLER
app.get('*', (req, res) => {
  res.send('ERROR 404 PAGE NOT FOUND');
});

// Launch app
const port = process.env.PORT || 3000;
server.listen(port, () => console.log(port));

// Socket io actions
io.on('connection', async (socket) => {
  console.log('CLIENTE CONECTADO');
  console.log(socket.id);
  console.log('================================');
  let listaProductosDB = [];
  listaProductosDB = await ProductModel.getProducts();

  socket.emit('server:initialProducts', listaProductosDB);

  socket.on('client:idProductoaBorrar', (data) => {
    listaProductosDB = listaProductosDB.filter((p) => p.id !== parseInt(data));
    socket.emit('server:productoBorrado', listaProductosDB);
  });

  socket.on('client:newproduct', (data) => {
    const productID = listaProductosDB.length + 1;
    const newProduct = { id: productID, ...data };
    listaProductosDB.push(newProduct);
    socket.emit('server:newProductAdded', listaProductosDB);
  });
});
