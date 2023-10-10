document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("product-form");
    const cartList = document.getElementById("cart-list");
    const totalPrice = document.getElementById("total-price");

    productForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const price = parseFloat(document.getElementById("price").value);
        const color = document.getElementById("color").value;

        if (isNaN(price) || price <= 0) {
            return;
        }

        const product = { name, price, color, quantity: 1 };
        addToCart(product);
        productForm.reset();
    });

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

    function removeFromCart(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }

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
            total += product.price * product.quantity;
        });

        totalPrice.textContent = total.toFixed(2);
    }

    displayCart();
});
