// SPJ Clothes - Products Data
const products = [
    // Men's Clothing
    { id: 1, name: "Classic Italian Suit", category: "clothing", price: 35000.00, image: "https://images.unsplash.com/photo-1594938298598-7096e21ce2c7?q=80&w=800&auto=format&fit=crop" },
    { id: 2, name: "Premium Denim Jacket", category: "clothing", price: 12500.00, image: "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?q=80&w=800&auto=format&fit=crop" },
    { id: 3, name: "Essential White Shirt", category: "clothing", price: 4500.00, image: "https://images.unsplash.com/photo-1620012253295-c15bc3e65e4e?q=80&w=800&auto=format&fit=crop" },
    { id: 4, name: "Tailored Chinos", category: "clothing", price: 6500.00, image: "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop" },

    // Perfumes
    { id: 5, name: "Ocean Breeze Elegance", category: "perfumes", price: 18500.00, image: "https://images.unsplash.com/photo-1594035910387-fea47794261f?q=80&w=800&auto=format&fit=crop" },
    { id: 6, name: "Midnight Noir Cologne", category: "perfumes", price: 25000.00, image: "https://images.unsplash.com/photo-1615634260167-c8cdede054de?q=80&w=800&auto=format&fit=crop" },
    { id: 7, name: "Woody Musk Signature", category: "perfumes", price: 15000.00, image: "https://images.unsplash.com/photo-1523293115678-d29062e088a5?q=80&w=800&auto=format&fit=crop" },

    // Belts
    { id: 8, name: "Classic Leather Belt", category: "belts", price: 3500.00, image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop" },
    { id: 9, name: "Reversible Formal Belt", category: "belts", price: 5500.00, image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=800&auto=format&fit=crop" },
    { id: 10, name: "Casual Braided Belt", category: "belts", price: 2500.00, image: "https://images.unsplash.com/photo-1624222247344-550fb60583dc?q=80&w=800&auto=format&fit=crop" },

    // Slippers & Shoes
    { id: 11, name: "Comfort Plus Slippers", category: "slippers", price: 3500.00, image: "https://images.unsplash.com/photo-1621317585141-94944d1bc945?q=80&w=800&auto=format&fit=crop" },
    { id: 12, name: "Plush Indoor Sliders", category: "slippers", price: 2500.00, image: "https://images.unsplash.com/photo-1595185913508-faec1bcbb950?q=80&w=800&auto=format&fit=crop" }
];

// Initialize Cart
let cart = JSON.parse(localStorage.getItem('spj_cart')) || [];

// Initialization
document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // Initialize Toast Container
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.id = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#c9933b;font-size:1.2rem;"></i><span id="toast-msg">Item added to cart!</span>`;
    document.body.appendChild(toast);
});

// Update Cart Count in Header
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const countBadges = document.querySelectorAll('.cart-count');

    countBadges.forEach(badge => {
        badge.innerText = totalItems;
        if (totalItems > 0) {
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

// Add Item to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showToast(`Added ${product.name} to cart!`);
}

// Remove from cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    // Dispatch custom event to tell cart page to re-render if it exists
    document.dispatchEvent(new Event('cartUpdated'));
}

// Update quantity
function updateQuantity(productId, delta) {
    const item = cart.find(i => i.id === productId);
    if (item) {
        item.quantity += delta;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            document.dispatchEvent(new Event('cartUpdated'));
        }
    }
}

// Save Cart to Local Storage
function saveCart() {
    localStorage.setItem('spj_cart', JSON.stringify(cart));
}

// Toast notification
function showToast(message) {
    const toast = document.getElementById('toast');
    const msg = document.getElementById('toast-msg');
    if (toast && msg) {
        msg.innerText = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

// Generate Product Card HTML
function generateProductCard(product) {
    return `
        <div class="product-card rounded-2xl overflow-hidden group">
            <div class="relative product-img-wrapper max-h-[300px]">
                <img src="${product.image}" alt="${product.name}" class="w-full h-full object-cover aspect-[4/5]">
                
                <div class="absolute inset-0 add-to-cart-overlay flex items-center justify-center gap-4">
                    <button onclick="addToCart(${product.id})" class="btn-accent px-6 py-3 rounded-full font-medium flex items-center gap-2 shadow-lg">
                        <i class="fa-solid fa-cart-plus"></i> Add to Cart
                    </button>
                </div>
                <div class="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-gray-800 tracking-wider uppercase shadow-sm">
                    ${product.category}
                </div>
            </div>
            
            <div class="p-6">
                <h3 class="font-semibold text-lg text-gray-900 mb-1 line-clamp-1">${product.name}</h3>
                <div class="flex justify-between items-center mt-3">
                    <span class="text-xl font-bold" style="color: var(--accent-color)">Rs. ${product.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <button onclick="addToCart(${product.id})" class="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors lg:hidden">
                        <i class="fa-solid fa-cart-plus text-gray-700"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}
