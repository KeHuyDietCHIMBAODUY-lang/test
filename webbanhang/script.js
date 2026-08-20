/* ==========================================
   AURA KICKS - INTERACTIVE JAVASCRIPT
   ========================================== */

// =====================
// HEADER SCROLL EFFECT
// =====================
const header = document.getElementById('main-header');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// =====================
// MOBILE NAV DRAWER
// =====================
const menuToggle = document.getElementById('menu-toggle-btn');
const mobileNav = document.getElementById('mobile-nav-drawer');
const navBackdrop = document.getElementById('nav-backdrop');
const mobileCloseBtn = document.getElementById('mobile-close-btn');

function openMobileNav() {
    mobileNav.classList.add('open');
    navBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeMobileNav() {
    mobileNav.classList.remove('open');
    navBackdrop.classList.remove('open');
    document.body.style.overflow = '';
}

menuToggle.addEventListener('click', openMobileNav);
mobileCloseBtn.addEventListener('click', closeMobileNav);
navBackdrop.addEventListener('click', closeMobileNav);

// Close mobile nav on link click
document.querySelectorAll('.mobile-link, #mobile-cta-btn').forEach(link => {
    link.addEventListener('click', closeMobileNav);
});

// =====================
// SHOPPING CART
// =====================
let cart = [];

const cartToggleBtn = document.getElementById('cart-toggle-btn');
const cartDrawer = document.getElementById('cart-drawer');
const cartCloseBtn = document.getElementById('cart-close-btn');
const cartBackdrop = document.getElementById('cart-backdrop');
const cartCount = document.getElementById('cart-count');
const cartItemsContainer = document.getElementById('cart-items-container');
const emptyCartMsg = document.getElementById('empty-cart-msg');
const cartTotalPrice = document.getElementById('cart-total-price');
const cartFooter = document.getElementById('cart-footer');

function openCart() {
    cartDrawer.classList.add('open');
    cartBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartDrawer.classList.remove('open');
    cartBackdrop.classList.remove('open');
    document.body.style.overflow = '';
}

cartToggleBtn.addEventListener('click', openCart);
cartCloseBtn.addEventListener('click', closeCart);
cartBackdrop.addEventListener('click', closeCart);

// Cart Shop Now
document.getElementById('cart-shop-now').addEventListener('click', closeCart);

function formatCurrency(value) {
    return value.toLocaleString('vi-VN') + 'đ';
}

function renderCart() {
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.qty, 0);
    cartCount.textContent = totalItems;

    // Remove existing cart items (not the empty msg)
    const existingItems = cartItemsContainer.querySelectorAll('.cart-item');
    existingItems.forEach(el => el.remove());

    if (cart.length === 0) {
        emptyCartMsg.style.display = 'flex';
        cartFooter.style.display = 'none';
        return;
    }

    emptyCartMsg.style.display = 'none';
    cartFooter.style.display = 'block';

    cart.forEach(item => {
        const itemEl = document.createElement('div');
        itemEl.className = 'cart-item';
        itemEl.innerHTML = `
            <img src="${item.img}" alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <span class="cart-item-title">${item.name}</span>
                <span class="cart-item-price">${formatCurrency(item.price)}</span>
                <div class="cart-item-qty">
                    <button class="qty-btn" data-action="decrease" data-id="${item.id}">−</button>
                    <span>${item.qty}</span>
                    <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                </div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}" aria-label="Xoá">
                <i class="fa-solid fa-trash-can"></i>
            </button>
        `;
        cartItemsContainer.appendChild(itemEl);
    });

    // Total
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    cartTotalPrice.textContent = formatCurrency(total);
}

function addToCart(id, name, price, img) {
    const existing = cart.find(item => item.id === id);
    if (existing) {
        existing.qty++;
    } else {
        cart.push({ id, name, price: parseInt(price), img, qty: 1 });
    }
    renderCart();
    showToast(`✅ Đã thêm "${name}" vào giỏ hàng!`);
    openCart();
}

// Add to cart buttons
document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const { id, name, price, img } = btn.dataset;
        addToCart(id, name, price, img);

        // Bounce animation
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 300);
    });
});

// Cart item actions (qty change & remove)
cartItemsContainer.addEventListener('click', (e) => {
    const qtyBtn = e.target.closest('.qty-btn');
    const removeBtn = e.target.closest('.cart-item-remove');

    if (qtyBtn) {
        const id = qtyBtn.dataset.id;
        const action = qtyBtn.dataset.action;
        const item = cart.find(i => i.id === id);
        if (!item) return;

        if (action === 'increase') {
            item.qty++;
        } else if (action === 'decrease') {
            item.qty--;
            if (item.qty <= 0) {
                cart = cart.filter(i => i.id !== id);
            }
        }
        renderCart();
    }

    if (removeBtn) {
        const id = removeBtn.dataset.id;
        cart = cart.filter(i => i.id !== id);
        renderCart();
        showToast('🗑️ Đã xóa sản phẩm khỏi giỏ hàng.');
    }
});

// Checkout button
document.getElementById('checkout-btn').addEventListener('click', () => {
    if (cart.length === 0) return;
    showToast('🎉 Chức năng thanh toán sẽ sớm ra mắt!');
    closeCart();
});

// =====================
// QUICK VIEW MODAL
// =====================
const modal = document.getElementById('quick-view-modal');
const modalBackdrop = document.getElementById('modal-backdrop');
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalAddToCartBtn = document.getElementById('modal-add-to-cart-btn');

const products = {
    '1': { name: 'Aura Air Premium White', cat: 'Sneaker Chạy Bộ', price: 3200000, oldPrice: 4000000, img: 'assets/hero.jpg' },
    '2': { name: 'Aura Zoom Neon Black', cat: 'Sneaker Thể Thao', price: 2800000, oldPrice: 3500000, img: 'assets/product1.jpg' },
    '3': { name: 'Aura Classic Minimal Beige', cat: 'Casual Sneaker', price: 2400000, oldPrice: 3000000, img: 'assets/product2.jpg' },
};

let currentModalProduct = null;

function openModal(id) {
    const product = products[id];
    if (!product) return;
    currentModalProduct = { id, ...product };

    document.getElementById('modal-img').src = product.img;
    document.getElementById('modal-cat').textContent = product.cat;
    document.getElementById('modal-title').textContent = product.name;
    document.getElementById('modal-price').textContent = formatCurrency(product.price);
    document.getElementById('modal-old-price').textContent = formatCurrency(product.oldPrice);

    modal.classList.add('open');
    modalBackdrop.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('open');
    modalBackdrop.classList.remove('open');
    document.body.style.overflow = '';
    currentModalProduct = null;
}

document.querySelectorAll('.quick-view-btn').forEach(btn => {
    btn.addEventListener('click', () => openModal(btn.dataset.id));
});

modalCloseBtn.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', closeModal);

modalAddToCartBtn.addEventListener('click', () => {
    if (!currentModalProduct) return;
    addToCart(currentModalProduct.id, currentModalProduct.name, currentModalProduct.price, currentModalProduct.img);
    closeModal();
});

// Size buttons
document.querySelectorAll('.size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.size-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// =====================
// COUNTDOWN TIMER
// =====================
function initCountdown() {
    // Set target 2 days 14 hours from now
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 2);
    endDate.setHours(endDate.getHours() + 14);
    endDate.setMinutes(endDate.getMinutes() + 45);

    function updateCountdown() {
        const now = new Date();
        const diff = endDate - now;

        if (diff <= 0) return;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
}

initCountdown();

// =====================
// NEWSLETTER FORM
// =====================
document.getElementById('newsletter-form').addEventListener('submit', (e) => {
    e.preventDefault();
    const successMsg = document.getElementById('newsletter-success');
    e.target.style.display = 'none';
    successMsg.style.display = 'block';
    showToast('🎉 Đăng ký thành công! Kiểm tra email của bạn nhé.');
});

// =====================
// TOAST NOTIFICATION
// =====================
function showToast(message) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i><span>${message}</span>`;
    container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            toast.classList.add('show');
        });
    });

    setTimeout(() => {
        toast.classList.add('removing');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

// =====================
// SCROLL REVEAL ANIMATION
// =====================
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

// Observe product cards, testimonial cards, spec items
document.querySelectorAll('.product-card, .testimonial-card, .spec-item, .hero-stats .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(40px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Initial render
renderCart();
