const API_URL = typeof CONFIG !== 'undefined' ? CONFIG.API_URL : '/api';

class API {
    static async get(endpoint) {
        try {
            const token = window.getToken ? window.getToken() : (localStorage.getItem('token') || sessionStorage.getItem('token'));
            const headers = {};
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}${endpoint}`, {
                headers: headers
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            return null;
        }
    }

    static async post(endpoint, data) {
        try {
            const token = window.getToken ? window.getToken() : (localStorage.getItem('token') || sessionStorage.getItem('token'));
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            return null;
        }
    }

    static async put(endpoint, data) {
        try {
            const token = window.getToken ? window.getToken() : localStorage.getItem('token');
            const headers = {
                'Content-Type': 'application/json'
            };
            if (token) headers['Authorization'] = `Bearer ${token}`;

            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'PUT',
                headers: headers,
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Network response was not ok');
            return await response.json();
        } catch (error) {
            console.error('API PUT Error:', error);
            return null;
        }
    }
}
