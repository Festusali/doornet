// Script for managing orders for Screen Magnetic Door Net

// Assigns corresponding value to price based on Net quantity
function checkForm() {
    orderQty = document.orderForm.quantity
    if (orderQty.value == 1) {
        document.orderForm.price.value = "₦25,500";
        return true;
    }
    if (orderQty.value == 2) {
        document.orderForm.price.value = "₦46,000";
        return true;
    }
    if (orderQty.value == 3) {
        document.orderForm.price.value = "₦67,500";
        return true;
    }
    if (orderQty.value == 4) {
        document.orderForm.price.value = "₦88,000";
        return true;
    }
    if (orderQty.value == 5) {
        document.orderForm.price.value = "₦107,500";
        return true;
    }
    if (orderQty.value == 6) {
        document.orderForm.price.value = "₦126,000";
        return true;
    }
}
