// Created an event listener to perform after the DOM has been loaded 
document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("product-form");
    const cartList = document.getElementById("cart-list");
    const totalPrice = document.getElementById("total-price");

    productForm.addEventListener("submit", function (e) {
        //Made sure to prevent the browser from handling the form submission in the default way
        e.preventDefault();

        const name = document.getElementById("name").value;
        const price = parseFloat(document.getElementById("price").value);
        const color = document.getElementById("color").value;

        //Checked to see if the value for price is a logical one and stopped the app upon inputing a value that is inappropriate
        if (isNaN(price) || price <= 0) {
            return;
        }

        const product = { name, price, color, quantity: 1 };
        addToCart(product);
        productForm.reset();
    });

    //Handle removing items from the cart
    cartList.addEventListener("click", function (e) {
        if (e.target.classList.contains("delete-btn")) {
            const index = parseInt(e.target.dataset.index);
            removeFromCart(index);
        }
        if (e.target.classList.contains("quantity-input")) {
            const index = parseInt(e.target.dataset.index);
            updateQuantity(index, e.target.value);
        }
    });

    //Handle adding and persisting items to the cart using html5 local storage api
    function addToCart(product) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const existingProductIndex = cart.findIndex(
            (item) =>
                item.name === product.name &&
                item.color === product.color
        );
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity += 1;
        } else {
            cart.push(product);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }

    //Handle removing items from the cart using local storage
    function removeFromCart(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }

    //Handle updating the quantity using local storage
    function updateQuantity(index, quantity) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart[index].quantity = parseInt(quantity);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }

    function displayCart() {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        let total = 0;
        cartList.innerHTML = "";

        cart.forEach((product, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>${product.name} - ${product.color}</span>
                <input type="number" class="quantity-input" data-index="${index}" value="${product.quantity}">
                <span>$${(product.price * product.quantity).toFixed(2)}</span>
                <button class="btn btn-warning delete-btn" data-index="${index}">Delete</button>
            `;
            cartList.appendChild(listItem);
           //Calculate the total price for the products in the cart
            total += product.price * product.quantity;
        });

        totalPrice.textContent = total.toFixed(2);
    }

    displayCart();
});
