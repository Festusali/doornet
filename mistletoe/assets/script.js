// Script for managing orders for Mistletoe Tea

// Assigns corresponding value to price based on product quantity
function checkForm() {
  orderQty = document.orderForm.quantity;
  if (orderQty.value == 2) {
    document.orderForm.price.value = "₦20,000";
    return true;
  }
  if (orderQty.value == 4) {
    document.orderForm.price.value = "₦30,000";
    return true;
  }
  if (orderQty.value == 6) {
    document.orderForm.price.value = "₦40,000";
    return true;
  }
  if (orderQty.value == 10) {
    document.orderForm.price.value = "₦60,000";
    return true;
  }
}
