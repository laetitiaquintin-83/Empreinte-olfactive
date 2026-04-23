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

    function money(value) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    }

    function render() {
        var cart = getCart();
        var list = document.querySelector('[data-cart-list]');
        var empty = document.querySelector('[data-cart-empty]');
        var subtotalEl = document.querySelector('[data-subtotal]');
        var totalEl = document.querySelector('[data-total]');
        var checkoutLink = document.querySelector('[data-checkout-link]');

        if (!list || !empty || !subtotalEl || !totalEl) {
            return;
        }

        if (cart.length === 0) {
            list.innerHTML = '';
            empty.hidden = false;
            subtotalEl.textContent = money(0);
            totalEl.textContent = money(0);
            if (checkoutLink) {
                checkoutLink.classList.add('is-disabled');
                checkoutLink.setAttribute('aria-disabled', 'true');
            }
            return;
        }

        empty.hidden = true;
        if (checkoutLink) {
            checkoutLink.classList.remove('is-disabled');
            checkoutLink.setAttribute('aria-disabled', 'false');
        }
        list.innerHTML = cart.map(function (item) {
            return [
                '<article class="cart-item">',
                '  <img src="' + item.image + '" alt="' + item.name + '">',
                '  <div>',
                '    <h3>' + item.name + '</h3>',
                '    <p class="product-price">' + money(item.price) + '</p>',
                '    <div class="cart-item-actions">',
                '      <button class="qty-btn" data-action="decrease" data-id="' + item.id + '">-</button>',
                '      <span>Quantite: ' + item.qty + '</span>',
                '      <button class="qty-btn" data-action="increase" data-id="' + item.id + '">+</button>',
                '      <button class="remove-btn" data-action="remove" data-id="' + item.id + '">Retirer</button>',
                '    </div>',
                '  </div>',
                '  <strong>' + money(item.price * item.qty) + '</strong>',
                '</article>'
            ].join('');
        }).join('');

        var subtotal = cart.reduce(function (sum, item) {
            return sum + item.price * item.qty;
        }, 0);

        subtotalEl.textContent = money(subtotal);
        totalEl.textContent = money(subtotal);
        bindActions();
    }

    function updateQty(id, action) {
        var cart = getCart();
        var item = cart.find(function (line) {
            return line.id === id;
        });

        if (!item) {
            return;
        }

        if (action === 'increase') {
            item.qty += 1;
        }

        if (action === 'decrease') {
            item.qty = Math.max(1, item.qty - 1);
        }

        if (action === 'remove') {
            cart = cart.filter(function (line) {
                return line.id !== id;
            });
        }

        setCart(cart);
        render();
        document.dispatchEvent(new CustomEvent('cart:updated'));
    }

    function bindActions() {
        document.querySelectorAll('[data-action]').forEach(function (btn) {
            btn.addEventListener('click', function () {
                var id = btn.getAttribute('data-id');
                var action = btn.getAttribute('data-action');
                if (!id || !action) {
                    return;
                }
                updateQty(id, action);
            });
        });
    }

    function bindClearButton() {
        var clearBtn = document.querySelector('[data-clear-cart]');
        if (!clearBtn) {
            return;
        }

        clearBtn.addEventListener('click', function () {
            setCart([]);
            render();
            document.dispatchEvent(new CustomEvent('cart:updated'));
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        render();
        bindClearButton();
    });
})();
