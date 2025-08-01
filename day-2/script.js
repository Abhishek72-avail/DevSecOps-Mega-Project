// Modern E-commerce JavaScript - ShopEase
class ShopEase {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('cart')) || [];
        this.wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
        this.currentSection = 'home';
        this.heroSlideIndex = 0;
        this.heroSlideInterval = null;
        
        this.init();
    }

    init() {
        this.hideLoadingScreen();
        this.setupEventListeners();
        this.loadData();
        this.updateCartCount();
        this.startHeroSlider();
        this.startDealTimer();
    }

    hideLoadingScreen() {
        setTimeout(() => {
            const loadingScreen = document.getElementById('loading-screen');
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 300);
        }, 1500);
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.showSection(section);
                this.closeMobileNav();
            });
        });

        // Mobile menu
        document.getElementById('mobile-menu-toggle').addEventListener('click', () => {
            this.toggleMobileNav();
        });

        document.getElementById('mobile-nav-close').addEventListener('click', () => {
            this.closeMobileNav();
        });

        // Search
        document.getElementById('search-btn').addEventListener('click', () => {
            this.performSearch();
        });

        document.getElementById('search-input').addEventListener('input', (e) => {
            this.showSearchSuggestions(e.target.value);
        });

        // Hero slider
        document.querySelectorAll('.indicator').forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                this.goToSlide(index);
            });
        });

        // Cart actions
        document.getElementById('clear-cart-btn').addEventListener('click', () => {
            this.clearCart();
        });

        // Modal
        document.getElementById('modal-overlay').addEventListener('click', () => {
            this.closeModal();
        });

        document.getElementById('modal-close').addEventListener('click', () => {
            this.closeModal();
        });

        // Category filters
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.filterCategories(e.target.dataset.filter);
            });
        });
    }

    // Sample data
    getSampleData() {
        return {
            categories: [
                { id: 1, name: 'Fashion', icon: 'fas fa-tshirt', filter: 'fashion' },
                { id: 2, name: 'Electronics', icon: 'fas fa-laptop', filter: 'electronics' },
                { id: 3, name: 'Home & Living', icon: 'fas fa-home', filter: 'home' },
                { id: 4, name: 'Beauty', icon: 'fas fa-heart', filter: 'beauty' },
                { id: 5, name: 'Sports', icon: 'fas fa-dumbbell', filter: 'sports' },
                { id: 6, name: 'Books', icon: 'fas fa-book', filter: 'books' },
                { id: 7, name: 'Toys', icon: 'fas fa-gamepad', filter: 'toys' },
                { id: 8, name: 'Automotive', icon: 'fas fa-car', filter: 'automotive' }
            ],
            products: [
                {
                    id: 1,
                    title: 'Wireless Bluetooth Headphones',
                    price: 2999,
                    originalPrice: 4999,
                    discount: 40,
                    rating: 4.5,
                    reviews: 1250,
                    category: 'electronics',
                    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=300&h=200&fit=crop',
                    badge: 'Best Seller',
                    description: 'Premium wireless headphones with noise cancellation and 30-hour battery life.'
                },
                {
                    id: 2,
                    title: 'Cotton Casual T-Shirt',
                    price: 599,
                    originalPrice: 999,
                    discount: 40,
                    rating: 4.2,
                    reviews: 890,
                    category: 'fashion',
                    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop',
                    badge: 'New',
                    description: '100% cotton comfortable t-shirt available in multiple colors and sizes.'
                },
                {
                    id: 3,
                    title: 'Smart Fitness Watch',
                    price: 8999,
                    originalPrice: 12999,
                    discount: 31,
                    rating: 4.7,
                    reviews: 2100,
                    category: 'electronics',
                    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&h=200&fit=crop',
                    badge: 'Hot Deal',
                    description: 'Advanced fitness tracking with heart rate monitor and GPS functionality.'
                },
                {
                    id: 4,
                    title: 'Decorative Table Lamp',
                    price: 1499,
                    originalPrice: 2499,
                    discount: 40,
                    rating: 4.3,
                    reviews: 456,
                    category: 'home',
                    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=200&fit=crop',
                    badge: 'Limited',
                    description: 'Modern LED table lamp with adjustable brightness and USB charging port.'
                },
                {
                    id: 5,
                    title: 'Organic Face Cream',
                    price: 899,
                    originalPrice: 1299,
                    discount: 31,
                    rating: 4.6,
                    reviews: 678,
                    category: 'beauty',
                    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=200&fit=crop',
                    badge: 'Organic',
                    description: 'Natural anti-aging face cream with vitamin E and hyaluronic acid.'
                },
                {
                    id: 6,
                    title: 'Gaming Mechanical Keyboard',
                    price: 3499,
                    originalPrice: 4999,
                    discount: 30,
                    rating: 4.8,
                    reviews: 1890,
                    category: 'electronics',
                    image: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=300&h=200&fit=crop',
                    badge: 'Gaming',
                    description: 'RGB backlit mechanical keyboard with blue switches and programmable keys.'
                },
                {
                    id: 7,
                    title: 'Designer Handbag',
                    price: 2999,
                    originalPrice: 4999,
                    discount: 40,
                    rating: 4.4,
                    reviews: 567,
                    category: 'fashion',
                    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=300&h=200&fit=crop',
                    badge: 'Trending',
                    description: 'Premium leather handbag with multiple compartments and adjustable strap.'
                },
                {
                    id: 8,
                    title: 'Yoga Mat Premium',
                    price: 1299,
                    originalPrice: 1999,
                    discount: 35,
                    rating: 4.5,
                    reviews: 789,
                    category: 'sports',
                    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300&h=200&fit=crop',
                    badge: 'Eco-Friendly',
                    description: 'Non-slip yoga mat made from natural rubber with alignment guides.'
                }
            ]
        };
    }

    loadData() {
        const data = this.getSampleData();
        this.renderCategories(data.categories);
        this.renderProducts(data.products, 'featured-products');
        this.renderProducts(data.products.slice(0, 4), 'deals-products');
        this.renderDetailedCategories(data.categories);
        this.renderCart();
    }

    renderCategories(categories) {
        const container = document.getElementById('categories-grid');
        container.innerHTML = categories.map(category => `
            <div class="category-card" onclick="shopEase.showCategoryProducts('${category.filter}')">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <div class="category-name">${category.name}</div>
            </div>
        `).join('');
    }

    renderDetailedCategories(categories) {
        const container = document.getElementById('categories-detailed-grid');
        container.innerHTML = categories.map(category => `
            <div class="category-card" data-filter="${category.filter}">
                <div class="category-icon">
                    <i class="${category.icon}"></i>
                </div>
                <div class="category-name">${category.name}</div>
            </div>
        `).join('');
    }

    renderProducts(products, containerId) {
        const container = document.getElementById(containerId);
        container.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.title}" loading="lazy">
                    <div class="product-badge">${product.badge}</div>
                    <button class="product-wishlist" onclick="shopEase.toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <div class="product-rating">
                        <div class="stars">
                            ${this.generateStars(product.rating)}
                        </div>
                        <span class="rating-text">(${product.reviews})</span>
                    </div>
                    <div class="product-price">
                        <span class="current-price">₹${product.price.toLocaleString()}</span>
                        <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
                        <span class="discount">${product.discount}% OFF</span>
                    </div>
                    <div class="product-actions">
                        <button class="add-to-cart-btn" onclick="shopEase.addToCart(${product.id})">
                            Add to Cart
                        </button>
                        <button class="quick-view-btn" onclick="shopEase.showProductModal(${product.id})">
                            <i class="fas fa-eye"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }

    generateStars(rating) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        let stars = '';
        
        for (let i = 0; i < fullStars; i++) {
            stars += '<i class="fas fa-star star"></i>';
        }
        
        if (hasHalfStar) {
            stars += '<i class="fas fa-star-half-alt star"></i>';
        }
        
        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars += '<i class="far fa-star star"></i>';
        }
        
        return stars;
    }

    showSection(sectionName) {
        // Hide all sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target section
        document.getElementById(`${sectionName}-section`).classList.add('active');
        
        // Update navigation
        document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        document.querySelectorAll(`[data-section="${sectionName}"]`).forEach(link => {
            link.classList.add('active');
        });
        
        this.currentSection = sectionName;
    }

    toggleMobileNav() {
        const mobileNav = document.getElementById('mobile-nav');
        mobileNav.classList.toggle('active');
    }

    closeMobileNav() {
        const mobileNav = document.getElementById('mobile-nav');
        mobileNav.classList.remove('active');
    }

    startHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        this.heroSlideInterval = setInterval(() => {
            this.heroSlideIndex = (this.heroSlideIndex + 1) % slides.length;
            this.updateHeroSlide();
        }, 5000);
    }

    goToSlide(index) {
        this.heroSlideIndex = index;
        this.updateHeroSlide();
        
        // Reset interval
        clearInterval(this.heroSlideInterval);
        this.startHeroSlider();
    }

    updateHeroSlide() {
        const slides = document.querySelectorAll('.hero-slide');
        const indicators = document.querySelectorAll('.indicator');
        
        slides.forEach((slide, index) => {
            slide.classList.toggle('active', index === this.heroSlideIndex);
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.heroSlideIndex);
        });
    }

    startDealTimer() {
        const endTime = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours from now
        
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            document.getElementById('hours').textContent = hours.toString().padStart(2, '0');
            document.getElementById('minutes').textContent = minutes.toString().padStart(2, '0');
            document.getElementById('seconds').textContent = seconds.toString().padStart(2, '0');
            
            if (distance < 0) {
                clearInterval(timer);
                document.getElementById('deal-timer').innerHTML = '<span class="timer-label">Deal Ended!</span>';
            }
        }, 1000);
    }

    addToCart(productId) {
        const data = this.getSampleData();
        const product = data.products.find(p => p.id === productId);
        
        if (product) {
            const existingItem = this.cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                this.cart.push({ ...product, quantity: 1 });
            }
            
            this.saveCart();
            this.updateCartCount();
            this.renderCart();
            this.showToast('Product added to cart!', 'success');
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        this.showToast('Product removed from cart!', 'success');
    }

    updateQuantity(productId, quantity) {
        const item = this.cart.find(item => item.id === productId);
        if (item) {
            item.quantity = Math.max(1, quantity);
            this.saveCart();
            this.updateCartCount();
            this.renderCart();
        }
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
        this.renderCart();
        this.showToast('Cart cleared!', 'success');
    }

    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const count = this.cart.reduce((total, item) => total + item.quantity, 0);
        document.querySelectorAll('.cart-count').forEach(element => {
            element.textContent = count;
            element.style.display = count > 0 ? 'flex' : 'none';
        });
    }

    renderCart() {
        const container = document.getElementById('cart-content');
        
        if (this.cart.length === 0) {
            container.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <h3>Your cart is empty</h3>
                    <p>Add some products to get started!</p>
                    <button class="continue-shopping-btn" onclick="shopEase.showSection('home')">
                        Continue Shopping
                    </button>
                </div>
            `;
            document.getElementById('cart-summary').innerHTML = '';
            return;
        }
        
        container.innerHTML = this.cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.title}">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${item.title}</h3>
                    <div class="cart-item-price">₹${item.price.toLocaleString()}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="shopEase.updateQuantity(${item.id}, ${item.quantity - 1})">
                            <i class="fas fa-minus"></i>
                        </button>
                        <input type="number" class="quantity-input" value="${item.quantity}" 
                               onchange="shopEase.updateQuantity(${item.id}, parseInt(this.value))">
                        <button class="quantity-btn" onclick="shopEase.updateQuantity(${item.id}, ${item.quantity + 1})">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item-btn" onclick="shopEase.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `).join('');
        
        this.renderCartSummary();
    }

    renderCartSummary() {
        const subtotal = this.cart.reduce((total, item) => total + (item.price * item.quantity), 0);
        const shipping = subtotal > 500 ? 0 : 50;
        const total = subtotal + shipping;
        
        document.getElementById('cart-summary').innerHTML = `
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>₹${subtotal.toLocaleString()}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>${shipping === 0 ? 'Free' : '₹' + shipping}</span>
            </div>
            <div class="summary-row summary-total">
                <span>Total:</span>
                <span>₹${total.toLocaleString()}</span>
            </div>
            <button class="checkout-btn" onclick="shopEase.checkout()">
                Proceed to Checkout
            </button>
        `;
    }

    checkout() {
        this.showToast('Checkout functionality coming soon!', 'warning');
    }

    showProductModal(productId) {
        const data = this.getSampleData();
        const product = data.products.find(p => p.id === productId);
        
        if (product) {
            document.getElementById('product-modal-content').innerHTML = `
                <div class="product-modal-image">
                    <img src="${product.image}" alt="${product.title}">
                </div>
                <h2 class="product-modal-title">${product.title}</h2>
                <div class="product-modal-rating">
                    <div class="stars">
                        ${this.generateStars(product.rating)}
                    </div>
                    <span class="rating-text">(${product.reviews} reviews)</span>
                </div>
                <div class="product-modal-price">
                    <span class="current-price">₹${product.price.toLocaleString()}</span>
                    <span class="original-price">₹${product.originalPrice.toLocaleString()}</span>
                    <span class="discount">${product.discount}% OFF</span>
                </div>
                <p class="product-modal-description">${product.description}</p>
                <div class="product-modal-actions">
                    <button class="add-to-cart-btn" onclick="shopEase.addToCart(${product.id}); shopEase.closeModal();">
                        Add to Cart
                    </button>
                    <button class="quick-view-btn" onclick="shopEase.toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i> Wishlist
                    </button>
                </div>
            `;
            
            document.getElementById('product-modal').classList.add('active');
        }
    }

    closeModal() {
        document.getElementById('product-modal').classList.remove('active');
    }

    toggleWishlist(productId) {
        const index = this.wishlist.indexOf(productId);
        if (index > -1) {
            this.wishlist.splice(index, 1);
            this.showToast('Removed from wishlist!', 'success');
        } else {
            this.wishlist.push(productId);
            this.showToast('Added to wishlist!', 'success');
        }
        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    }

    performSearch() {
        const query = document.getElementById('search-input').value.trim();
        if (query) {
            this.showToast(`Searching for "${query}"...`, 'success');
            // Implement search functionality here
        }
    }

    showSearchSuggestions(query) {
        const suggestions = document.getElementById('search-suggestions');
        
        if (query.length < 2) {
            suggestions.classList.remove('active');
            return;
        }
        
        // Sample suggestions
        const sampleSuggestions = [
            'Wireless Headphones',
            'Smart Watch',
            'Cotton T-Shirt',
            'Gaming Keyboard',
            'Yoga Mat',
            'Face Cream'
        ];
        
        const filteredSuggestions = sampleSuggestions.filter(item => 
            item.toLowerCase().includes(query.toLowerCase())
        );
        
        if (filteredSuggestions.length > 0) {
            suggestions.innerHTML = filteredSuggestions.map(suggestion => `
                <div class="suggestion-item" onclick="shopEase.selectSuggestion('${suggestion}')">
                    ${suggestion}
                </div>
            `).join('');
            suggestions.classList.add('active');
        } else {
            suggestions.classList.remove('active');
        }
    }

    selectSuggestion(suggestion) {
        document.getElementById('search-input').value = suggestion;
        document.getElementById('search-suggestions').classList.remove('active');
        this.performSearch();
    }

    filterCategories(filter) {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelector(`[data-filter="${filter}"]`).classList.add('active');
        
        const categoryCards = document.querySelectorAll('#categories-detailed-grid .category-card');
        
        categoryCards.forEach(card => {
            if (filter === 'all' || card.dataset.filter === filter) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    }

    showCategoryProducts(category) {
        this.showSection('categories');
        this.filterCategories(category);
    }

    showToast(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const iconMap = {
            success: 'fas fa-check-circle',
            error: 'fas fa-exclamation-circle',
            warning: 'fas fa-exclamation-triangle'
        };
        
        toast.innerHTML = `
            <div class="toast-content">
                <i class="${iconMap[type]} toast-icon"></i>
                <span class="toast-message">${message}</span>
                <button class="toast-close" onclick="this.parentElement.parentElement.remove()">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.getElementById('toast-container').appendChild(toast);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (toast.parentElement) {
                toast.remove();
            }
        }, 3000);
    }
}

// Initialize the application
const shopEase = new ShopEase();

// Close mobile nav when clicking outside
document.addEventListener('click', (e) => {
    const mobileNav = document.getElementById('mobile-nav');
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    
    if (!mobileNav.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
        mobileNav.classList.remove('active');
    }
});

// Close search suggestions when clicking outside
document.addEventListener('click', (e) => {
    const searchContainer = document.querySelector('.search-container');
    const suggestions = document.getElementById('search-suggestions');
    
    if (!searchContainer.contains(e.target)) {
        suggestions.classList.remove('active');
    }
});

// Handle keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        shopEase.closeModal();
        shopEase.closeMobileNav();
        document.getElementById('search-suggestions').classList.remove('active');
    }
});

// Smooth scroll for anchor links
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

// Add scroll effects
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY > 100) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
    }
});

// Lazy loading for images
const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || img.src;
            img.classList.remove('lazy');
            observer.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
