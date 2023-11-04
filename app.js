const sanitizeInput = (input) => {
    const tempElement = document.createElement('div');
    tempElement.innerText = input;
    return tempElement.innerHTML;
}

document.addEventListener("DOMContentLoaded", function () {
    const productForm = document.getElementById("product-form");
    const cartList = document.getElementById("cart-list");
    const totalPrice = document.getElementById("total-price");

    productForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = sanitizeInput(document.getElementById("name").value);
        const price = parseFloat(sanitizeInput(document.getElementById("price").value));
        const color = sanitizeInput(document.getElementById("color").value);

        if (isNaN(price) || price <= 0) {
            return;
        }

        const product = { name, price, color, quantity: 1 };
        addToCart(product);
        productForm.reset();
    });

    // Handle removing items from the cart
    function removeFromCart(index) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }

    // Handle updating the quantity
    function updateQuantity(index, quantity) {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart[index].quantity = parseInt(quantity);
        localStorage.setItem("cart", JSON.stringify(cart));
        displayCart();
    }

    // Display the cart
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