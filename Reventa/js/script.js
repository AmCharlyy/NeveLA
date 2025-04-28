// Configuración de Mercado Pago (usa tus credenciales REALES aquí)
const MERCADO_PAGO_PUBLIC_KEY = 'TEST-4479ff70-2878-4768-a510-47ed5e0373ad';
const MERCADO_PAGO_ACCESS_TOKEN = 'TEST-8294327960196811-042815-012a07d8dc7e9c6f652f0ffc03066162-1948980736';

// Datos de productos
const products = [
    {
        id: 1,
        title: "Camiseta Básica Negra",
        price: 120,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "Nuevo"
    },
    {
        id: 2,
        title: "Jeans Slim Fit",
        price: 250,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "Popular"
    },
    {
        id: 3,
        title: "Sudadera con Capucha",
        price: 300,
        image: "https://images.unsplash.com/photo-1527719327859-c6ce80353573?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "Oferta"
    },
    {
        id: 4,
        title: "Shorts Deportivos",
        price: 150,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 5,
        title: "Blusa Elegante",
        price: 180,
        image: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "Nuevo"
    },
    {
        id: 6,
        title: "Chamarra de Mezclilla",
        price: 400,
        image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    },
    {
        id: 7,
        title: "Vestido Floral",
        price: 280,
        image: "https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "Oferta"
    },
    {
        id: 8,
        title: "Conjunto Deportivo",
        price: 350,
        image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
    }
];

// Variables del carrito
let cart = [];
const cartIcon = document.getElementById('cartIcon');
const cartCount = document.getElementById('cartCount');
const cartSidebar = document.getElementById('cartSidebar');
const closeCart = document.getElementById('closeCart');
const overlay = document.getElementById('overlay');
const productsGrid = document.getElementById('productsGrid');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');
const notification = document.getElementById('notification');
const walletContainer = document.getElementById('wallet_container');

// Mostrar productos
function displayProducts() {
    productsGrid.innerHTML = '';
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<span class="product-badge">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-price">$${product.price.toFixed(2)}</p>
                <div class="product-actions">
                    <div class="quantity-selector">
                        <button class="quantity-btn minus" data-id="${product.id}">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" data-id="${product.id}">
                        <button class="quantity-btn plus" data-id="${product.id}">+</button>
                    </div>
                    <button class="add-to-cart" data-id="${product.id}">Agregar</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Mostrar carrito
function displayCart() {
    cartItems.innerHTML = '';
    if (cart.length === 0) {
        cartItems.innerHTML = '<p>Tu carrito está vacío</p>';
        walletContainer.innerHTML = '';
        return;
    }

    let total = 0;
    cart.forEach(item => {
        const product = products.find(p => p.id === item.id);
        total += product.price * item.quantity;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${product.image}" alt="${product.title}" class="cart-item-image">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${product.title}</h4>
                <p class="cart-item-price">$${(product.price * item.quantity).toFixed(2)}</p>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" data-id="${product.id}">-</button>
                    <input type="number" class="cart-item-quantity" value="${item.quantity}" min="1" data-id="${product.id}">
                    <button class="quantity-btn plus" data-id="${product.id}">+</button>
                    <button class="remove-item" data-id="${product.id}">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    cartTotal.textContent = `$${total.toFixed(2)}`;
    initializeMercadoPagoButton(total);
}

// Inicializar el botón de Mercado Pago
function initializeMercadoPagoButton(total) {
    walletContainer.innerHTML = '';
    
    const mp = new MercadoPago(MERCADO_PAGO_PUBLIC_KEY, {
        locale: 'es-MX'
    });

    // Crear botón de pago
    mp.bricks().create("wallet", "wallet_container", {
        initialization: {
            preferenceId: null, // Se actualizará al hacer clic en pagar
        },
        customization: {
            visual: {
                buttonBackground: '#4CAF50',
                borderRadius: '6px'
            }
        }
    });
}

// Actualizar contador del carrito
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = count;
}

// Mostrar notificación
function showNotification() {
    notification.classList.add('show');
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
}

// Agregar producto al carrito
function addToCart(productId, quantity = 1) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({ id: productId, quantity });
    }
    
    updateCartCount();
    displayCart();
    showNotification();
}

// Actualizar cantidad en carrito
function updateCartItem(productId, quantity) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        if (quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        } else {
            item.quantity = quantity;
        }
    }
    
    updateCartCount();
    displayCart();
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    displayCart();
}

// Crear preferencia de pago con Mercado Pago
async function createMercadoPagoPreference() {
    try {
        const items = cart.map(item => {
            const product = products.find(p => p.id === item.id);
            return {
                title: product.title,
                unit_price: product.price,
                quantity: item.quantity,
                currency_id: 'MXN'
            };
        });

        const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${MERCADO_PAGO_ACCESS_TOKEN}`
            },
            body: JSON.stringify({
                items: items,
                back_urls: {
                    success: window.location.href,
                    failure: window.location.href,
                    pending: window.location.href
                },
                auto_return: 'approved',
                statement_descriptor: 'MAYOREO MODA'
            })
        });

        const preference = await response.json();
        return preference.id;
    } catch (error) {
        console.error('Error al crear preferencia:', error);
        throw error;
    }
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    displayProducts();
    
    // Abrir carrito
    cartIcon.addEventListener('click', () => {
        cartSidebar.classList.add('open');
        overlay.classList.add('active');
    });
    
    // Cerrar carrito
    closeCart.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
    
    // Cerrar carrito con overlay
    overlay.addEventListener('click', () => {
        cartSidebar.classList.remove('open');
        overlay.classList.remove('active');
    });
    
    // Agregar al carrito
    productsGrid.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const quantityInput = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            const quantity = parseInt(quantityInput.value);
            addToCart(productId, quantity);
        }
        
        // Incrementar cantidad
        if (e.target.classList.contains('plus')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            input.value = parseInt(input.value) + 1;
        }
        
        // Decrementar cantidad
        if (e.target.classList.contains('minus')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const input = document.querySelector(`.quantity-input[data-id="${productId}"]`);
            if (parseInt(input.value) > 1) {
                input.value = parseInt(input.value) - 1;
            }
        }
    });
    
    // Manejar eventos del carrito
    cartItems.addEventListener('click', (e) => {
        // Incrementar cantidad en carrito
        if (e.target.classList.contains('plus')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const input = document.querySelector(`.cart-item-quantity[data-id="${productId}"]`);
            updateCartItem(productId, parseInt(input.value) + 1);
        }
        
        // Decrementar cantidad en carrito
        if (e.target.classList.contains('minus')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            const input = document.querySelector(`.cart-item-quantity[data-id="${productId}"]`);
            updateCartItem(productId, parseInt(input.value) - 1);
        }
        
        // Eliminar producto del carrito
        if (e.target.classList.contains('remove-item') || e.target.closest('.remove-item')) {
            const productId = parseInt(e.target.getAttribute('data-id') || e.target.closest('.remove-item').getAttribute('data-id'));
            removeFromCart(productId);
        }
    });
    
    // Cambiar cantidad en carrito con input
    cartItems.addEventListener('change', (e) => {
        if (e.target.classList.contains('cart-item-quantity')) {
            const productId = parseInt(e.target.getAttribute('data-id'));
            updateCartItem(productId, parseInt(e.target.value));
        }
    });
    
    // Botón de Mercado Pago
    checkoutBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            alert('Tu carrito está vacío');
            return;
        }
        
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Procesando...';
        
        try {
            const preferenceId = await createMercadoPagoPreference();
            
            const mp = new MercadoPago(MERCADO_PAGO_PUBLIC_KEY, {
                locale: 'es-MX'
            });
            
            // Abrir checkout de Mercado Pago
            mp.checkout({
                preference: {
                    id: preferenceId
                },
                autoOpen: true // Esto abre automáticamente el checkout
            });
        } catch (error) {
            console.error('Error:', error);
            alert('Ocurrió un error al procesar el pago: ' + error.message);
        } finally {
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pagar con Mercado Pago';
        }
    });
});