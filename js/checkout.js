(function () {
    var CART_KEY = 'leo_cart';
    var LAST_ORDER_KEY = 'leo_last_order';

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

    function subtotal(cart) {
        return cart.reduce(function (sum, item) {
            return sum + item.price * item.qty;
        }, 0);
    }

    function renderSummary(cart) {
        var list = document.querySelector('[data-checkout-list]');
        var subtotalEl = document.querySelector('[data-checkout-subtotal]');
        var totalEl = document.querySelector('[data-checkout-total]');
        var gate = document.querySelector('[data-checkout-gate]');

        if (!list || !subtotalEl || !totalEl || !gate) {
            return;
        }

        if (cart.length === 0) {
            gate.hidden = false;
            list.innerHTML = '';
            subtotalEl.textContent = money(0);
            totalEl.textContent = money(0);
            return;
        }

        gate.hidden = true;
        list.innerHTML = cart.map(function (item) {
            return [
                '<article class="summary-item">',
                '  <img src="' + item.image + '" alt="' + item.name + '">',
                '  <div>',
                '    <strong>' + item.name + '</strong>',
                '    <p>Quantite: ' + item.qty + '</p>',
                '  </div>',
                '  <strong>' + money(item.price * item.qty) + '</strong>',
                '</article>'
            ].join('');
        }).join('');

        var total = subtotal(cart);
        subtotalEl.textContent = money(total);
        totalEl.textContent = money(total);
    }

    function orderReference() {
        var stamp = Date.now().toString();
        return 'EO-' + stamp.slice(-6);
    }

    function bindCheckout(cart) {
        var form = document.querySelector('[data-checkout-form]');
        if (!form) {
            return;
        }

        form.addEventListener('submit', function (event) {
            event.preventDefault();

            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }

            if (cart.length === 0) {
                return;
            }

            var data = new FormData(form);
            var customer = data.get('prenom') + ' ' + data.get('nom');
            var total = subtotal(cart);
            var payload = {
                reference: orderReference(),
                customer: customer,
                email: data.get('email'),
                total: total,
                createdAt: new Date().toISOString(),
                itemCount: cart.reduce(function (sum, item) { return sum + item.qty; }, 0)
            };

            localStorage.setItem(LAST_ORDER_KEY, JSON.stringify(payload));
            setCart([]);
            document.dispatchEvent(new CustomEvent('cart:updated'));
            window.location.href = 'confirmation.html';
        });
    }

    document.addEventListener('DOMContentLoaded', function () {
        var cart = getCart();
        renderSummary(cart);
        bindCheckout(cart);
    });
})();
