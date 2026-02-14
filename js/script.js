let cart = [];

function addToCart(product) {
  cart.push(product);
  renderCart();
}

function renderCart() {
  const cartList = document.getElementById("cart-items");
  cartList.innerHTML = "";
  cart.forEach(item => {
    let li = document.createElement("li");
    li.textContent = item;
    cartList.appendChild(li);
  });
}

function checkout() {
  const pedido = {
    cliente: { nombre: "Cliente Demo", correo: "demo@mail.com", telefono: "999999999" },
    productos: cart,
    estado: "pendiente"
  };

  fetch("http://localhost:3000/api/pedidos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(pedido)
  });

  alert("Compra enviada. Gracias!");
  cart = [];
  renderCart();
}
