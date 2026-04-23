(function () {
    var CART_KEY = 'leo_cart';

    function getCart() {
        try {
            var raw = localStorage.getItem(CART_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            return [];
        }
    }

    function setCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function cartCount(cart) {
        return cart.reduce(function (sum, item) {
            return sum + item.qty;
        }, 0);
    }

    function updateCartBadge() {
        var cart = getCart();
        var count = cartCount(cart);
        var badges = document.querySelectorAll('[data-cart-count]');
        badges.forEach(function (badge) {
            badge.textContent = String(count);
        });
    }

    function showToast(message) {
        var toast = document.querySelector('[data-toast]');
        if (!toast) {
            toast = document.createElement('div');
            toast.className = 'toast';
            toast.setAttribute('data-toast', '1');
            document.body.appendChild(toast);
        }

        toast.textContent = message;
        toast.classList.add('show');
        window.clearTimeout(showToast.timer);
        showToast.timer = window.setTimeout(function () {
            toast.classList.remove('show');
        }, 1800);
    }

    function addToCart(payload) {
        var cart = getCart();
        var existing = cart.find(function (item) {
            return item.id === payload.id;
        });

        if (existing) {
            existing.qty += 1;
        } else {
            cart.push({
                id: payload.id,
                name: payload.name,
                price: payload.price,
                image: payload.image,
                qty: 1
            });
        }

        setCart(cart);
        updateCartBadge();
        showToast('Ajoute au panier : ' + payload.name);
    }

    function initAddButtons() {
        var addButtons = document.querySelectorAll('[data-add-to-cart]');
        addButtons.forEach(function (button) {
            button.addEventListener('click', function () {
                var id = button.getAttribute('data-id');
                var name = button.getAttribute('data-name');
                var image = button.getAttribute('data-image');
                var price = Number(button.getAttribute('data-price'));

                if (!id || !name || Number.isNaN(price)) {
                    return;
                }

                addToCart({
                    id: id,
                    name: name,
                    image: image || '',
                    price: price
                });
            });
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        updateCartBadge();
        initAddButtons();
    });

    document.addEventListener('cart:updated', function () {
        updateCartBadge();
    });
})();
