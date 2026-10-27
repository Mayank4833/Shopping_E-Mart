var products = [
  { id: 1, name: "Mouse",      category: "Electronics", price: 600,  image: "images/mouse.jpeg" },
  { id: 2, name: "Earbuds",    category: "Electronics", price: 1800, image: "images/earbuds.jpeg" },
  { id: 3, name: "Keyboard",   category: "Electronics", price: 3500, image: "images/keyboard.jpeg" },
  { id: 4, name: "Notebook",   category: "Stationery",  price: 120,  image: "images/notebook.jpeg" },
  { id: 5, name: "Pen Pack",   category: "Stationery",  price: 180,  image: "images/pens.jpeg" },
  { id: 6, name: "Calculator", category: "Stationery",  price: 850,  image: "images/calculator.jpeg" },
  { id: 7, name: "Backpack",   category: "Bags",        price: 1500, image: "images/backpack.jpeg" },
  { id: 8, name: "Laptop Bag", category: "Bags",        price: 700,  image: "images/laptopbag.jpeg" }
];

var cart = [];

var discountPercent = 0;
var discountFlat = 0;


function showProducts() {
  var searchText = document.getElementById("search").value.toLowerCase();
  var category = document.getElementById("category").value;
  var sortType = document.getElementById("sort").value;

  var result = [];
  for (var i = 0; i < products.length; i++) {
    var p = products[i];
    var matchName = p.name.toLowerCase().includes(searchText);
    var matchCategory = (category == "all" || p.category == category);

    if (matchName && matchCategory) {
      result.push(p);
    }
  }

  if (sortType == "low") {
    result.sort(function (a, b) { return a.price - b.price; });
  } else if (sortType == "high") {
    result.sort(function (a, b) { return b.price - a.price; });
  } else if (sortType == "name") {
    result.sort(function (a, b) { return a.name.localeCompare(b.name); });
  }

  var html = "";
  for (var i = 0; i < result.length; i++) {
    var p = result[i];
    html += "<div class='product'>" +
              "<img src='" + p.image + "' alt='" + p.name + "'>" +
              "<h4>" + p.name + "</h4>" +
              "<p>₹" + p.price + "</p>" +
              "<button onclick='addToCart(" + p.id + ")'>Add to Cart</button>" +
            "</div>";
  }

  if (result.length == 0) {
    html = "<p>No products found.</p>";
  }
  document.getElementById("productList").innerHTML = html;
}

function addToCart(id) {
  // If item is already in cart, just increase quantity
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].id == id) {
      cart[i].qty = cart[i].qty + 1;
      showCart();
      return;
    }
  }

  for (var i = 0; i < products.length; i++) {
    if (products[i].id == id) {
      cart.push({
        id: id,
        name: products[i].name,
        price: products[i].price,
        qty: 1
      });
    }
  }
  showCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);   // remove 1 item at this position
  showCart();
}


function changeQty(index, change) {
  cart[index].qty = cart[index].qty + change;

  // If quantity becomes 0, remove the item
  if (cart[index].qty == 0) {
    cart.splice(index, 1);
  }
  showCart();
}

function showCart() {
  var html = "";
  var subtotal = 0;

  for (var i = 0; i < cart.length; i++) {
    var item = cart[i];
    var itemTotal = item.price * item.qty;
    subtotal = subtotal + itemTotal;

    html += "<div class='cart-item'>" +
              "<b>" + item.name + "</b> (₹" + item.price + ")<br>" +
              "<button onclick='changeQty(" + i + ", -1)'>-</button> " +
              item.qty +
              " <button onclick='changeQty(" + i + ", 1)'>+</button> " +
              " = ₹" + itemTotal + " " +
              "<button onclick='removeFromCart(" + i + ")'>Remove</button>" +
            "</div>";
  }

  if (cart.length == 0) {
    html = "<p>Cart is empty</p>";
  }
  document.getElementById("cartList").innerHTML = html;

  // Calculate discount and total
  var discount = (subtotal * discountPercent / 100) + discountFlat;
  if (subtotal == 0) {
    discount = 0;
  }
  var total = subtotal - discount;

  document.getElementById("subtotal").innerText = subtotal;
  document.getElementById("discount").innerText = discount;
  document.getElementById("total").innerText = total;
}


function applyCoupon() {
  var code = document.getElementById("couponInput").value.toUpperCase();
  var msg = document.getElementById("couponMsg");

  discountPercent = 0;
  discountFlat = 0;

  if (code == "SAVE10") {
    discountPercent = 10;
    msg.innerText = "10% discount applied!";
  } else if (code == "FLAT100") {
    discountFlat = 100;
    msg.innerText = "Rs. 100 discount applied!";
  } else {
    msg.innerText = "Invalid coupon";
  }
  showCart();
}


function openCheckout() {
  if (cart.length == 0) {
    alert("Your cart is empty!");
    return;
  }
  document.getElementById("payAmount").innerText = document.getElementById("total").innerText;
  document.getElementById("checkoutBox").style.display = "block";
}

function closeCheckout() {
  document.getElementById("checkoutBox").style.display = "none";
}

function placeOrder() {
  var name = document.getElementById("name").value;
  var address = document.getElementById("address").value;
  var phone = document.getElementById("phone").value;

  if (name == "" || address == "" || phone == "") {
    alert("Please fill all the details");
    return;
  }

  alert("Thank you " + name + "! Your order is placed.");

  cart = [];
  discountPercent = 0;
  discountFlat = 0;
  document.getElementById("couponMsg").innerText = "";
  closeCheckout();
  showCart();
}


showProducts();
showCart();
