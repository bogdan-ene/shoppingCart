// Created an event listener to perform after the DOM has been loaded 
document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("product-form");
    const cartList = document.getElementById("cart-list");
    const totalPrice = document.getElementById("total-price");

    productForm.addEventListener("submit", function (e) {
        // Made sure to prevent the browser from handling the form submission in the default way
        e.preventDefault();

        const name = document.getElementById("name").value;
        const price = parseFloat(document.getElementById("price").value);
        const color = document.getElementById("color").value;

        // Checked to see if the value for price is a logical one and stopped the app upon inputting a value that is inappropriate
        if (isNaN(price) || price <= 0) {
            return;
        }

        const product = { name, price, color, quantity: 1 };
        addToCart(product);
        productForm.reset();
    });

    // Handle removing items from the cart
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

    // Handle adding and persisting items to the cart using HTML5 local storage API
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

    // Handle removing items from the cart using local storage
    function removeFromCart(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }

    // Handle updating the quantity using local storage
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
            const listItemContent = document.createElement("span");
            listItemContent.textContent = `${product.name} - ${product.color}`;
            listItem.appendChild(listItemContent);

            const quantityInput = document.createElement("input");
            quantityInput.type = "number";
            quantityInput.classList.add("quantity-input");
            quantityInput.dataset.index = index;
            quantityInput.value = product.quantity;
            listItem.appendChild(quantityInput);

            const totalSpan = document.createElement("span");
            totalSpan.textContent = `$${(product.price * product.quantity).toFixed(2)}`;
            listItem.appendChild(totalSpan);

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("btn", "btn-warning", "delete-btn");
            deleteBtn.dataset.index = index;
            deleteBtn.textContent = "Delete";
            listItem.appendChild(deleteBtn);

            cartList.appendChild(listItem);
            // Calculate the total price for the products in the cart
            total += product.price * product.quantity;
        });

        totalPrice.textContent = total.toFixed(2);
    }

    displayCart();
});
