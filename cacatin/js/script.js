// Script for managing orders for Screen Magnetic Door Net

// Assigns corresponding value to price based on Net quantity
function checkForm() {
  orderQty = document.orderForm.quantity;
  if (orderQty.value == 1) {
    document.orderForm.price.value = "₦25,000";
    return true;
  }
  if (orderQty.value == 2) {
    document.orderForm.price.value = "₦46,000";
    return true;
  }
  if (orderQty.value == 3) {
    document.orderForm.price.value = "₦69,000";
    return true;
  }
  if (orderQty.value == 4) {
    document.orderForm.price.value = "₦92,000";
    return true;
  }
  if (orderQty.value == 5) {
    document.orderForm.price.value = "₦115,000";
    return true;
  }
  if (orderQty.value == 6) {
    document.orderForm.price.value = "₦138,000";
    return true;
  }
  if (orderQty.value == 7) {
    document.orderForm.price.value = "₦161,000";
    return true;
  }
  if (orderQty.value == 8) {
    document.orderForm.price.value = "₦184,000";
    return true;
  }
  if (orderQty.value == 9) {
    document.orderForm.price.value = "₦207,000";
    return true;
  }
  if (orderQty.value == 10) {
    document.orderForm.price.value = "₦230,000";
    return true;
  }
}
