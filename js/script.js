// Script for managing orders for Screen Magnetic Door Net

// Assigns corresponding value to price based on Net quantity
function checkForm() {
  orderQty = document.orderForm.quantity;
  if (orderQty.value == 1) {
    document.orderForm.price.value = "₦25,000";
    return true;
  }
  if (orderQty.value == 2) {
    document.orderForm.price.value = "₦45,000";
    return true;
  }
  if (orderQty.value == 3) {
    document.orderForm.price.value = "₦66,000";
    return true;
  }
  if (orderQty.value == 4) {
    document.orderForm.price.value = "₦86,000";
    return true;
  }
  if (orderQty.value == 5) {
    document.orderForm.price.value = "₦105,000";
    return true;
  }
  if (orderQty.value == 6) {
    document.orderForm.price.value = "₦120,000";
    return true;
  }
}
