// Shopping cart functionality
let cart = [];

// Initialize cart from localStorage
function initCart() {
    const savedCart = localStorage.getItem('demoShopCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Toggle cart sidebar
function toggleCart() {
    document.getElementById('cart-sidebar').classList.toggle('active');
}

// Add item to cart
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
    showNotification(`${productName} added to cart!`);
    saveCartToStorage();
}

// Remove item from cart
function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
    saveCartToStorage();
}

// Update quantity
function updateQuantity(index, change) {
    cart[index].quantity += change;
    
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    
    updateCart();
    saveCartToStorage();
}

// Update cart display
function updateCart() {
    const cartCount = document.getElementById('cart-count');
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    // Update cart count
    cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    
    // Update cart items
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="empty-cart">Your cart is empty</p>';
    } else {
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            cartItems.innerHTML += `
                <div class="cart-item">
                    <div>
                        <strong>${item.name}</strong>
                        <br>$${item.price} x ${item.quantity}
                    </div>
                    <div>
                        <button onclick="updateQuantity(${index}, -1)">-</button>
                        <button onclick="updateQuantity(${index}, 1)">+</button>
                        <button onclick="removeFromCart(${index})" style="color: red; margin-left: 10px;">Remove</button>
                    </div>
                </div>
            `;
        });
        
        cartTotal.textContent = total.toFixed(2);
    }
}

// Show notification
function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.add('show');
    
    setTimeout(() => {
        notification.classList.remove('show');
    }, 2000);
}

// Checkout function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!');
        return;
    }
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    showNotification(`Order placed! Total: $${total.toFixed(2)}`);
    
    // Clear cart after checkout
    cart = [];
    updateCart();
    saveCartToStorage();
    toggleCart();
}

// Save cart to localStorage
function saveCartToStorage() {
    localStorage.setItem('demoShopCart', JSON.stringify(cart));
}

// Scroll to products
function scrollToProducts() {
    document.getElementById('products').scrollIntoView({ 
        behavior: 'smooth' 
    });
}

// Close cart when clicking outside
document.addEventListener('click', function(event) {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartIcon = document.querySelector('.cart-icon');
    
    if (cartSidebar.classList.contains('active') && 
        !cartSidebar.contains(event.target) && 
        !cartIcon.contains(event.target)) {
        cartSidebar.classList.remove('active');
    }
});

// Initialize when page loads
document.addEventListener('DOMContentLoaded', function() {
    initCart();
    
    // Add smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});