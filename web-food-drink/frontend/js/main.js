document.addEventListener('DOMContentLoaded', () => {
    // Global cache for products
    window.productsCache = [];

    // 1. Hiệu ứng Ripple
    document.querySelectorAll('.ripple').forEach(btn => {
        btn.addEventListener('click', function(e) {
            let x = e.clientX - e.target.offsetLeft;
            let y = e.clientY - e.target.offsetTop;
            
            let ripple = document.createElement('span');
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });

    // 2. Load Products Function with Pagination
    let currentPage = 1;
    const productsPerPage = 20;
    
    async function loadProducts(query = '', page = 1) {
        try {
            const url = `/products?search=${encodeURIComponent(query)}&page=${page}&limit=${productsPerPage}`;
            console.log('Loading products from:', url);
            
            const response = await API.get(url);
            console.log('Products received:', response);
            
            // Handle both old and new API response format
            const products = response.data || response || [];
            const pagination = response.pagination || null;
            
            // Cache products globally
            window.productsCache = products;
            
            const productGrid = document.getElementById('product-list');
            
            if (!productGrid) {
                console.error('Product grid element not found!');
                return;
            }
            
            productGrid.innerHTML = '';

            if (!products || products.length === 0) {
                console.log('No products found');
                productGrid.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1;">Không tìm thấy sản phẩm nào.</p>';
                renderPagination(null);
                return;
            }

            console.log(`Rendering ${products.length} products`);
            products.forEach(p => {
                const card = document.createElement('div');
                card.className = 'product-card glass-card';
                card.style.overflow = 'hidden';
                card.style.transition = '0.4s';
                
                const formatter = new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                });

                card.innerHTML = `
                    <div class="img-container" style="height: 200px; overflow: hidden;">
                        <img src="${p.image_url || 'https://via.placeholder.com/300'}" style="width: 100%; height: 100%; object-fit: cover; transition: 0.4s;" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300'">
                    </div>
                    <div class="p-4" style="padding: 1.5rem;">
                        <h3 style="margin-bottom: 0.5rem;">${p.name}</h3>
                        <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 1rem; height: 40px; overflow: hidden;">${p.description || ''}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: var(--primary); font-weight: bold; font-size: 1.1rem;">${formatter.format(p.price)}</span>
                            <button class="add-btn ripple" onclick="addToCart(${p.id})" style="background: var(--primary); border: none; padding: 0.6rem 1.2rem; border-radius: 8px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.9rem; font-weight: 500; transition: all 0.3s ease;">
                                <i class="fas fa-shopping-cart"></i>
                                <span>Thêm vào giỏ</span>
                            </button>
                        </div>
                    </div>
                `;
                
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-10px)';
                    const img = card.querySelector('img');
                    if(img) img.style.transform = 'scale(1.1)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                    const img = card.querySelector('img');
                    if(img) img.style.transform = 'scale(1)';
                });

                productGrid.appendChild(card);
            });
            
            // Render pagination
            renderPagination(pagination);
            
            console.log('Products rendered successfully');
        } catch (error) {
            console.error('Error loading products:', error);
            const productGrid = document.getElementById('product-list');
            if (productGrid) {
                productGrid.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1; color: #f44336;">Lỗi khi tải sản phẩm. Vui lòng thử lại.</p>';
            }
            renderPagination(null);
        }
    }
    
    function renderPagination(pagination) {
        let paginationContainer = document.getElementById('pagination-container');
        
        // Create container if not exists
        if (!paginationContainer) {
            paginationContainer = document.createElement('div');
            paginationContainer.id = 'pagination-container';
            paginationContainer.style.cssText = 'display: flex; justify-content: center; align-items: center; gap: 0.5rem; margin-top: 2rem; flex-wrap: wrap;';
            
            const productGrid = document.getElementById('product-list');
            if (productGrid && productGrid.parentElement) {
                productGrid.parentElement.appendChild(paginationContainer);
            }
        }
        
        if (!pagination || pagination.totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }
        
        const { page, totalPages } = pagination;
        let html = '';
        
        // Previous button
        html += `<button class="pagination-btn" ${page <= 1 ? 'disabled' : ''} onclick="changePage(${page - 1})" style="padding: 0.5rem 1rem; background: ${page <= 1 ? 'rgba(255,255,255,0.05)' : 'var(--primary)'}; border: 1px solid var(--glass-border); border-radius: 8px; color: white; cursor: ${page <= 1 ? 'not-allowed' : 'pointer'}; transition: 0.3s;">
            <i class="fas fa-chevron-left"></i>
        </button>`;
        
        // Page numbers
        const maxVisible = 5;
        let startPage = Math.max(1, page - Math.floor(maxVisible / 2));
        let endPage = Math.min(totalPages, startPage + maxVisible - 1);
        
        if (endPage - startPage < maxVisible - 1) {
            startPage = Math.max(1, endPage - maxVisible + 1);
        }
        
        if (startPage > 1) {
            html += `<button class="pagination-btn" onclick="changePage(1)" style="padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 8px; color: white; cursor: pointer; transition: 0.3s;">1</button>`;
            if (startPage > 2) {
                html += `<span style="color: #aaa; padding: 0 0.5rem;">...</span>`;
            }
        }
        
        for (let i = startPage; i <= endPage; i++) {
            html += `<button class="pagination-btn ${i === page ? 'active' : ''}" onclick="changePage(${i})" style="padding: 0.5rem 1rem; background: ${i === page ? 'var(--primary)' : 'rgba(255,255,255,0.05)'}; border: 1px solid ${i === page ? 'var(--primary)' : 'var(--glass-border)'}; border-radius: 8px; color: white; cursor: pointer; transition: 0.3s; font-weight: ${i === page ? '600' : '400'};">${i}</button>`;
        }
        
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                html += `<span style="color: #aaa; padding: 0 0.5rem;">...</span>`;
            }
            html += `<button class="pagination-btn" onclick="changePage(${totalPages})" style="padding: 0.5rem 1rem; background: rgba(255,255,255,0.05); border: 1px solid var(--glass-border); border-radius: 8px; color: white; cursor: pointer; transition: 0.3s;">${totalPages}</button>`;
        }
        
        // Next button
        html += `<button class="pagination-btn" ${page >= totalPages ? 'disabled' : ''} onclick="changePage(${page + 1})" style="padding: 0.5rem 1rem; background: ${page >= totalPages ? 'rgba(255,255,255,0.05)' : 'var(--primary)'}; border: 1px solid var(--glass-border); border-radius: 8px; color: white; cursor: ${page >= totalPages ? 'not-allowed' : 'pointer'}; transition: 0.3s;">
            <i class="fas fa-chevron-right"></i>
        </button>`;
        
        paginationContainer.innerHTML = html;
        
        // Add hover effect
        document.querySelectorAll('.pagination-btn:not([disabled])').forEach(btn => {
            btn.addEventListener('mouseenter', function() {
                if (!this.classList.contains('active')) {
                    this.style.background = 'rgba(255, 71, 87, 0.3)';
                }
            });
            btn.addEventListener('mouseleave', function() {
                if (!this.classList.contains('active')) {
                    this.style.background = 'rgba(255,255,255,0.05)';
                }
            });
        });
    }
    
    window.changePage = function(page) {
        currentPage = page;
        const searchInput = document.querySelector('.search-box input');
        const query = searchInput ? searchInput.value : '';
        loadProducts(query, page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Initial load
    loadProducts();

    // 3. Xử lý tìm kiếm Real-time
    const searchInput = document.querySelector('.search-box input');
    
    // Debounce helper
    function debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    if (searchInput) {
        // Tìm kiếm ngay khi gõ (delay 500ms)
        searchInput.addEventListener('input', debounce((e) => {
            const query = e.target.value;
            currentPage = 1; // Reset to first page
            loadProducts(query, currentPage);
        }, 500));
    }

    // 4. Category Filter
    const categoryButtons = document.querySelectorAll('.cat-btn');
    let currentCategory = '';
    
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                categoryButtons.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');
                
                // Get category from button text
                const btnText = btn.textContent.trim().toLowerCase();
                console.log('Button clicked:', btnText);
                
                if (btnText === 'tất cả') {
                    currentCategory = '';
                } else if (btnText === 'đồ ăn') {
                    currentCategory = 'food';
                } else if (btnText === 'đồ uống') {
                    currentCategory = 'drink';
                }
                
                console.log('Category filter:', currentCategory);
                
                // Reset to first page and load products
                currentPage = 1;
                const query = searchInput ? searchInput.value : '';
                loadProductsByCategory(query, currentPage, currentCategory);
            });
        });
    }
    
    // Load products with category filter
    async function loadProductsByCategory(query = '', page = 1, category = '') {
        try {
            let url = `/products?search=${encodeURIComponent(query)}&page=${page}&limit=${productsPerPage}`;
            if (category) {
                url += `&category=${category}`;
            }
            
            console.log('Loading products from:', url);
            
            const response = await API.get(url);
            console.log('Products received:', response);
            
            const products = response.data || response || [];
            const pagination = response.pagination || null;
            
            window.productsCache = products;
            
            const productGrid = document.getElementById('product-list');
            
            if (!productGrid) {
                console.error('Product grid element not found!');
                return;
            }
            
            productGrid.innerHTML = '';

            if (!products || products.length === 0) {
                console.log('No products found');
                productGrid.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1;">Không tìm thấy sản phẩm nào.</p>';
                renderPagination(null);
                return;
            }

            console.log(`Rendering ${products.length} products`);
            products.forEach(p => {
                const card = document.createElement('div');
                card.className = 'product-card glass-card';
                card.style.overflow = 'hidden';
                card.style.transition = '0.4s';
                
                const formatter = new Intl.NumberFormat('vi-VN', {
                    style: 'currency',
                    currency: 'VND'
                });

                card.innerHTML = `
                    <div class="img-container" style="height: 200px; overflow: hidden;">
                        <img src="${p.image_url || 'https://via.placeholder.com/300'}" style="width: 100%; height: 100%; object-fit: cover; transition: 0.4s;" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300'">
                    </div>
                    <div class="p-4" style="padding: 1.5rem;">
                        <h3 style="margin-bottom: 0.5rem;">${p.name}</h3>
                        <p style="color: #aaa; font-size: 0.9rem; margin-bottom: 1rem; height: 40px; overflow: hidden;">${p.description || ''}</p>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <span style="color: var(--primary); font-weight: bold; font-size: 1.1rem;">${formatter.format(p.price)}</span>
                            <button class="add-btn ripple" onclick="addToCart(${p.id})" style="background: var(--primary); border: none; padding: 0.6rem 1.2rem; border-radius: 8px; color: white; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 0.5rem; font-size: 0.9rem; font-weight: 500; transition: all 0.3s ease;">
                                <i class="fas fa-shopping-cart"></i>
                                <span>Thêm vào giỏ</span>
                            </button>
                        </div>
                    </div>
                `;
                
                card.addEventListener('mouseenter', () => {
                    card.style.transform = 'translateY(-10px)';
                    const img = card.querySelector('img');
                    if(img) img.style.transform = 'scale(1.1)';
                });
                card.addEventListener('mouseleave', () => {
                    card.style.transform = 'translateY(0)';
                    const img = card.querySelector('img');
                    if(img) img.style.transform = 'scale(1)';
                });

                productGrid.appendChild(card);
            });
            
            renderPagination(pagination);
            
            console.log('Products rendered successfully');
        } catch (error) {
            console.error('Error loading products:', error);
            const productGrid = document.getElementById('product-list');
            if (productGrid) {
                productGrid.innerHTML = '<p style="text-align:center; width:100%; grid-column: 1/-1; color: #f44336;">Lỗi khi tải sản phẩm. Vui lòng thử lại.</p>';
            }
            renderPagination(null);
        }
    }

    // Global Toast Notification Helper
    window.showToast = function(message, type = 'info') {
        // Create container if not exists
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        // Create Icon
        let icon = 'fa-info-circle';
        if (type === 'success') icon = 'fa-check-circle';
        if (type === 'error') icon = 'fa-exclamation-circle';

        // Create Toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
        
        container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s forwards';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Hàm cập nhật badge giỏ hàng
    function updateCartBadge() {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const badge = document.querySelector('.cart-btn .badge');
        if (badge) {
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            badge.textContent = totalItems;
        }
    }

    // Hàm thêm vào giỏ hàng (Enhanced with localStorage)
    window.addToCart = async function(productId) {
        console.log('Adding product to cart:', productId);
        
        // Use helper if available, otherwise fallback
        const token = window.getToken ? window.getToken() : (localStorage.getItem('token') || sessionStorage.getItem('token'));
        
        if (!token) {
            showToast('Bạn cần đăng nhập để mua hàng', 'error');
            setTimeout(() => window.location.href = '/html/login.html', 1500);
            return;
        }
        
        // Lấy thông tin sản phẩm từ cache
        const product = window.productsCache.find(p => p.id === productId);
        
        if (!product) {
            console.error('Product not found in cache:', productId);
            showToast('Không tìm thấy sản phẩm', 'error');
            return;
        }
        
        try {
            // Lưu vào localStorage ngay
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            const existingIndex = cart.findIndex(item => item.id === productId);
            
            if (existingIndex > -1) {
                cart[existingIndex].quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image_url: product.image_url,
                    quantity: 1
                });
            }
            
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartBadge();
            showToast('Đã thêm vào giỏ hàng thành công!', 'success');
            
            // Thử gọi API backend (không block nếu lỗi)
            try {
                await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 
                        'Content-Type': 'application/json', 
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify({ productId, quantity: 1 })
                });
            } catch (apiError) {
                console.log('API sync failed (non-critical):', apiError);
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            showToast('Lỗi khi thêm vào giỏ hàng', 'error');
        }
    }

    // Cập nhật badge khi trang load
    updateCartBadge();
});
