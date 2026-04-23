(function () {
    var LAST_ORDER_KEY = 'leo_last_order';

    function money(value) {
        return new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: 'EUR'
        }).format(value);
    }

    function render() {
        var target = document.querySelector('[data-order-summary]');
        if (!target) {
            return;
        }

        var raw = localStorage.getItem(LAST_ORDER_KEY);
        if (!raw) {
            target.innerHTML = '<p>Aucune commande recente. Retournez a la collection pour creer votre selection.</p>';
            return;
        }

        try {
            var order = JSON.parse(raw);
            target.innerHTML = [
                '<p><strong>Reference:</strong> ' + order.reference + '</p>',
                '<p><strong>Client:</strong> ' + order.customer + '</p>',
                '<p><strong>Email:</strong> ' + order.email + '</p>',
                '<p><strong>Articles:</strong> ' + order.itemCount + '</p>',
                '<p><strong>Total:</strong> ' + money(order.total) + '</p>'
            ].join('');
        } catch (e) {
            target.innerHTML = '<p>Impossible de charger le recapitulatif de commande.</p>';
        }
    }

    document.addEventListener('DOMContentLoaded', render);
})();
