document.addEventListener('DOMContentLoaded', async () => {
    // Kiểm tra đã đăng nhập (hỗ trợ cả localStorage và sessionStorage)
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    
    // Nếu không có token, không cần đăng nhập để xem giỏ hàng từ localStorage
    // Chỉ cần có sản phẩm trong localStorage là được
    const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Sử dụng helper cục bộ để gắn token vào header
    const API_HEADERS = {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
    };


    async function fetchCart() {
        try {
            // Đọc từ localStorage trước
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            
            if (localCart.length > 0) {
                // Nếu có dữ liệu trong localStorage, hiển thị luôn
                renderCart(localCart);
                return;
            }
            
            // Nếu không có trong localStorage, thử lấy từ API
            const res = await fetch('/api/cart', { headers: API_HEADERS });
            if (!res.ok) throw new Error('Failed to fetch cart');
            const items = await res.json();
            
            // Lưu vào localStorage
            localStorage.setItem('cart', JSON.stringify(items));
            renderCart(items);
        } catch (error) {
            console.error(error);
            // Nếu API lỗi, vẫn hiển thị từ localStorage
            const localCart = JSON.parse(localStorage.getItem('cart') || '[]');
            renderCart(localCart);
        }
    }

    function renderCart(items) {
        const tbody = document.getElementById('cart-items-body');
        const emptyMsg = document.getElementById('empty-cart-msg');
        const cartGrid = document.querySelector('.cart-grid');

        if (items.length === 0) {
            tbody.innerHTML = '';
            emptyMsg.style.display = 'block';
            // Tắt nút checkout nếu cần
            return;
        } else {
            emptyMsg.style.display = 'none';
        }

        let subtotal = 0;
        const formatter = new Intl.NumberFormat('vi-VN', {
             style: 'currency',
             currency: 'VND'
        });

        tbody.innerHTML = items.map(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;
            const itemId = item.id || item.cart_id; // Support both localStorage and API format
            return `
                <tr>
                    <td>
                        <div class="cart-item-info">
                            <img src="${item.image_url}" alt="${item.name}">
                            <span>${item.name}</span>
                        </div>
                    </td>
                    <td>${formatter.format(item.price)}</td>
                    <td>
                        <input type="number" class="qty-input" value="${item.quantity}" min="1" 
                               onchange="updateQty(${itemId}, this.value)">
                    </td>
                    <td>${formatter.format(itemTotal)}</td>
                    <td>
                        <button class="remove-btn" onclick="removeItem(${itemId})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');

        document.getElementById('subtotal').textContent = formatter.format(subtotal);
        document.getElementById('total-price').textContent = formatter.format(subtotal + 30000); // + phí vận chuyển
    }

    window.updateQty = async (itemId, newQty) => {
        // Update localStorage
        let cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const index = cart.findIndex(item => item.id === itemId);
        
        if (index > -1) {
            cart[index].quantity = parseInt(newQty);
            localStorage.setItem('cart', JSON.stringify(cart));
            fetchCart(); // Refresh display
        }
        
        // Try to update API as well
        try {
            await fetch('/api/cart', { 
                method: 'PUT',
                headers: API_HEADERS,
                body: JSON.stringify({ cartId: itemId, quantity: newQty })
            });
        } catch (error) {
            console.error('API update failed:', error);
        }
    };


    // Custom confirm dialog
    window.showConfirm = function(message, onConfirm) {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        
        overlay.innerHTML = `
            <div class="confirm-dialog">
                <h3>Xác nhận</h3>
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="confirm-btn confirm-btn-cancel">Hủy</button>
                    <button class="confirm-btn confirm-btn-confirm">Xác nhận</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        const cancelBtn = overlay.querySelector('.confirm-btn-cancel');
        const confirmBtn = overlay.querySelector('.confirm-btn-confirm');
        
        cancelBtn.onclick = () => {
            overlay.remove();
        };
        
        confirmBtn.onclick = () => {
            overlay.remove();
            onConfirm();
        };
        
        overlay.onclick = (e) => {
            if (e.target === overlay) {
                overlay.remove();
            }
        };
    };

    window.removeItem = async (itemId) => {
        showConfirm('Bạn có chắc chắn muốn xóa sản phẩm này?', async () => {
            // Remove from localStorage
            let cart = JSON.parse(localStorage.getItem('cart') || '[]');
            cart = cart.filter(item => item.id !== itemId);
            localStorage.setItem('cart', JSON.stringify(cart));
            fetchCart(); // Refresh display
            
            // Try to remove from API as well
            try {
                await fetch(`/api/cart/${itemId}`, { 
                    method: 'DELETE',
                    headers: API_HEADERS
                });
            } catch (error) {
                console.error('API delete failed:', error);
            }
        });
    };

    fetchCart();
});
