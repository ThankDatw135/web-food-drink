document.addEventListener('DOMContentLoaded', () => {
    // Helper để lấy token từ cả 2 nguồn
    window.getToken = function() {
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    }

    // Helper để lấy user info
    window.getUser = function() {
        const userStr = localStorage.getItem('user') || sessionStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }

    // Ensure showToast is available
    if (!window.showToast) {
        window.showToast = function(message, type = 'info') {
            let container = document.querySelector('.toast-container');
            if (!container) {
                container = document.createElement('div');
                container.className = 'toast-container';
                document.body.appendChild(container);
            }
            let icon = 'fa-info-circle';
            if (type === 'success') icon = 'fa-check-circle';
            if (type === 'error') icon = 'fa-exclamation-circle';
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `<i class="fas ${icon}"></i><span>${message}</span>`;
            container.appendChild(toast);
            setTimeout(() => {
                toast.style.animation = 'slideOut 0.3s forwards';
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        }
    }

    // Ensure showConfirm is available
    if (!window.showConfirm) {
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
    }

    // Xử lý đăng nhập
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const rememberMe = document.getElementById('remember-me').checked;
            
            const btn = loginForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            btn.disabled = true;

            const res = await API.post('/auth/login', { email, password });
            
            btn.innerHTML = originalText;
            btn.disabled = false;

            if (res && res.token) {
                if (rememberMe) {
                    localStorage.setItem('token', res.token);
                    localStorage.setItem('user', JSON.stringify(res.user));
                } else {
                    sessionStorage.setItem('token', res.token);
                    sessionStorage.setItem('user', JSON.stringify(res.user));
                }
                showToast('Đăng nhập thành công!', 'success');
                setTimeout(() => window.location.href = '/html/index.html', 1000);
            } else {
                showToast(res?.message || 'Đăng nhập thất bại', 'error');
            }
        });
    }

    // Xử lý đăng ký
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const btn = registerForm.querySelector('button');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
            btn.disabled = true;

            const res = await API.post('/auth/register', { name, email, password });
            
            btn.innerHTML = originalText;
            btn.disabled = false;

            if (res && res.message === 'Đăng ký thành công') {
                showToast('Đăng ký thành công! Vui lòng đăng nhập.', 'success');
                setTimeout(() => window.location.href = '/html/login.html', 1500);
            } else {
                showToast(res?.message || 'Đăng ký thất bại', 'error');
            }
        });
    }

    // Helper đăng xuất
    window.logout = function() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        sessionStorage.removeItem('token');
        sessionStorage.removeItem('user');
        window.location.href = '/html/login.html';
    }

    // Kiểm tra trạng thái xác thực (Cập nhật giao diện đơn giản)
    const user = window.getUser();
    if (user) {
        // Cập nhật điều hướng nếu tồn tại
        const loginBtn = document.querySelector('.login-btn');
        if (loginBtn) {
            // Create avatar + name display
            const initials = user.name.charAt(0).toUpperCase();
            const avatarHTML = user.avatar_url 
                ? `<img src="${user.avatar_url}" alt="${user.name}" style="width: 32px; height: 32px; border-radius: 50%; object-fit: cover; margin-right: 8px;">` 
                : `<div style="width: 32px; height: 32px; border-radius: 50%; background: var(--gradient-1); display: flex; align-items: center; justify-content: center; font-weight: 700; margin-right: 8px;">${initials}</div>`;
            
            loginBtn.innerHTML = `<div style="display: flex; align-items: center;">${avatarHTML}<span>${user.name}</span></div>`;
            loginBtn.href = '#';
            loginBtn.classList.add('user-menu-trigger');
            
            // Tạo dropdown menu
            const dropdown = document.createElement('div');
            dropdown.className = 'user-dropdown';
            
            // Avatar for dropdown header
            const dropdownAvatarHTML = user.avatar_url
                ? `<img src="${user.avatar_url}" alt="${user.name}" style="width: 100%; height: 100%; border-radius: 50%; object-fit: cover;">`
                : initials;
            
            dropdown.innerHTML = `
                <div class="user-dropdown-header">
                    <div class="user-avatar">${dropdownAvatarHTML}</div>
                    <div class="user-info">
                        <div class="user-name">${user.name}</div>
                        <div class="user-email">${user.email}</div>
                    </div>
                </div>
                <div class="user-dropdown-divider"></div>
                <a href="/html/profile.html" class="user-dropdown-item">
                    <i class="fas fa-user"></i>
                    <span>Thông tin cá nhân</span>
                </a>
                <a href="/html/settings.html" class="user-dropdown-item">
                    <i class="fas fa-cog"></i>
                    <span>Cài đặt</span>
                </a>
                <a href="/html/history.html" class="user-dropdown-item">
                    <i class="fas fa-history"></i>
                    <span>Lịch sử hoạt động</span>
                </a>
                <div class="user-dropdown-divider"></div>
                <a href="#" class="user-dropdown-item logout-item" onclick="event.preventDefault(); window.logout();">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Đăng xuất</span>
                </a>
            `;
            
            // Insert dropdown after login button
            loginBtn.parentElement.style.position = 'relative';
            loginBtn.parentElement.appendChild(dropdown);
            
            // Toggle dropdown on click
            loginBtn.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdown.classList.toggle('show');
            };
            
            // Close dropdown when clicking outside
            document.addEventListener('click', (e) => {
                if (!loginBtn.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.classList.remove('show');
                }
            });
        }
    }
});
