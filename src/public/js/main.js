const socket = io();

const productListContainer = document.querySelector('#productList');
const formData = document.querySelector('#formData');
const title = document.querySelector('#title');
const description = document.querySelector('#description');
const code = document.querySelector('#code');
const price = document.querySelector('#price');
const stats = document.querySelector('#status');
const stock = document.querySelector('#stock');
const category = document.querySelector('#category');
const thumbnails = document.querySelector('#thumbnails');

// Product Data Template Function
const productData = (data) => {
  if (data.length > 0) {
    const div = document.createElement('div');
    div.className = 'product-list-container';
    data.forEach((e) => {
      div.innerHTML += `<div><h2>${e.title}</h2> <button data-id="${e.id}" class='delete'>Eliminar</button></div>`;
    });

    productListContainer.appendChild(div);

    const btnEliminar = document.querySelectorAll('.delete');
    btnEliminar.forEach((e) => {
      e.addEventListener('click', () => {
        let identificador = e.dataset.id;
        socket.emit('client:idProductoaBorrar', identificador);
      });
    });

    return div;
  } else {
    const h2 = document.createElement('h2');
    h2.textContent = 'NO HAY PRODUCTOS';
    productListContainer.appendChild(h2);
  }
};

// Load initial products from DB
socket.on('server:initialProducts', (data) => {
  while (productListContainer.firstChild) {
    productListContainer.firstChild.remove();
  }
  productData(data);
});

// Delete products
socket.on('server:productoBorrado', (data) => {
  while (productListContainer.firstChild) {
    productListContainer.firstChild.remove();
  }
  productData(data);
});

// MANEJO DE DATOS FORM
formData.addEventListener('submit', (e) => {
  e.preventDefault();

  let newProduct = {
    title: title.value.toLowerCase(),
    description: description.value.toLowerCase(),
    code: code.value.toLowerCase(),
    price: Number(price.value),
    status: Boolean(stats.value),
    stock: Number(stock.value),
    category: category.value.toLowerCase(),
    thumbnails: Array(thumbnails.value),
  };

  socket.emit('client:newproduct', newProduct);

  socket.on('server:newProductAdded', (data) => {
    while (productListContainer.firstChild) {
      productListContainer.firstChild.remove();
    }

    productData(data);
  });
});
