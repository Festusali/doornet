// Script for managing orders for Screen Magnetic Door Net

// Assigns corresponding value to price based on Net quantity
function checkForm() {
  orderQty = document.orderForm.quantity;
  if (orderQty.value == 1) {
    document.orderForm.price.value = "₦20,000";
    return true;
  }
  if (orderQty.value == 2) {
    document.orderForm.price.value = "₦38,000";
    return true;
  }
  if (orderQty.value == 3) {
    document.orderForm.price.value = "₦55,500";
    return true;
  }
  if (orderQty.value == 4) {
    document.orderForm.price.value = "₦72,000";
    return true;
  }
  if (orderQty.value == 5) {
    document.orderForm.price.value = "₦87,500";
    return true;
  }
  if (orderQty.value == 6) {
    document.orderForm.price.value = "₦102,000";
    return true;
  }
}
