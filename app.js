//Cart
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");

//Open Cart
cartIcon.onclick = (e) => {
  cart.classList.add("active");
  addCartClicked(e);
};

//Close Cart
closeCart.onclick = () => {
  cart.classList.remove("active");
  document.querySelector(".cart-content").innerHTML = "";
};

//Buy Button
function buyButtonClicked() {
  alert("Sifariş verildi.Tesekurrler😊");
}

//Add to Cart (Basket)
function addCartClicked(e) {
  axios.get("http://localhost:3000/inCartIds").then(({ data }) => {
    data.forEach(({ price, title, img, id, quantity }) => {
      const cardContent = document.querySelector(".cart-content");
      cardContent.innerHTML += `
      <div id="cart-box-${id}" class="cart-box"> <img src="${img}" alt="" class="cart-img">
        <div class="detail-box">
        <div class="cart-product-title">${title}</div>
        <div class="cart-price">${price} Azn</div>
        <input id="_input_${id}" type="number" value="${quantity}" class="cart-quantity"
        onchange="onQuantityUpdate(event)"
        />
        </div>
        <i class="bx bxs-trash-alt cart-remove" onclick="removeProductFromCart(event)"></i>
        </div>
   `;
    });
  });
  calculateTotal();
}

axios.get("http://localhost:3000/products")
  .then(({ data }) => {
    writeAllItems(data)
  });

function writeAllItems(data) {
  const shoptContent = document.querySelector(".shop-content");
  shoptContent.innerHTML = ''
  data.forEach(({ price, title, img, id }) => {
    const productBox = document.createElement("div");
    productBox.className = "product-box";
    productBox.innerHTML += `<img src="${img}" alt="" class="product-img">
      <h2 class="product-title">${title}</h2>
      <span class="price">${price} Azn</span>`;
    const cart = document.createElement("i");
    cart.className = `fas fa-shopping-cart add-cart`;
    cart.onclick = () => {
      addCart(price, title, img, 1);
    };
    productBox.appendChild(cart);
    shoptContent.appendChild(productBox);
  });
}

function addCart(price, title, img, quantity) {
  axios
    .post("http://localhost:3000/inCartIds", {
      price,
      title,
      img,
      quantity,
    })
    .then(() => {
      alert("Sebete elave edildi.😊");
    }).then(() => {
      updateInCartCount()
    })
}

function updateInCartCount() {
  axios.get("http://localhost:3000/inCartIds").then(({ data }) => {
    document.querySelector('.card-quantity').textContent = data.length
  })
}
//Remove to Cart
function removeProductFromCart(e) {
  const id = e.target.parentElement.id.split("cart-box-")[1];
  axios.delete(`http://localhost:3000/inCartIds/${id}`).then(() => {
    document.getElementById(`cart-box-${id}`).remove();
    calculateTotal();
  }).then(() => {
    updateInCartCount()
  })
}

function onQuantityUpdate(e) {
  const id = +e.target.id.split("_input_")[1];
  axios
    .patch(`http://localhost:3000/inCartIds/${id}`, {
      quantity: e.target.value,
    })
    .then(() => {
      calculateTotal();
    });
}

//Total price
function calculateTotal() {
  axios.get(`http://localhost:3000/inCartIds`).then(({ data }) => {
    const cem = data.reduce((a, b) => a + b.price * b.quantity, 0);
    document.querySelector(".total-price").textContent = `${cem} Azn`;
  });
}

document.querySelector('.btnn').onclick = function () {
  const searchTerm = document.getElementById('search-input').value.toLowerCase()
  // API endpoint for fetching products
  const endpoint = searchTerm ? "http://localhost:3000/products?title=" + searchTerm : 'http://localhost:3000/products'

  // Fetch products from API
  axios.get(endpoint)
    .then(({ data }) => {
      writeAllItems(data)
    })
    .catch(error => console.error(error));
}
