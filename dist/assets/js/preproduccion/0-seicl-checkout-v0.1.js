$(function () {
    init();
});

function init() {
    carrito.init();
}

var carrito = {
    init: function () {
        setInterval(carrito.decimales, 2500);
    },
    decimales: function () {

        var $el = $(".total-selling-price, .monetary, .new-product-price, .sla-value, .sight, .description .price.pull-right, .shipping-option-item-value, .delivery-windows .radio span, .old-product-price.muted");

        $el.each(function (i, e) {
            $(e).html($(e).html().replace(",00", ""));
        });

    }
};