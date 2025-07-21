// Script for managing orders for Screen Magnetic Door Net

// Assigns corresponding value to price based on Net quantity
function checkForm() {
  orderQty = document.orderForm.quantity;
  if (orderQty.value == 1) {
    document.orderForm.price.value = "₦20,000";
    return true;
  }
  if (orderQty.value == 2) {
    document.orderForm.price.value = "₦40,000";
    return true;
  }
  if (orderQty.value == 3) {
    document.orderForm.price.value = "₦60,000";
    return true;
  }
  if (orderQty.value == 4) {
    document.orderForm.price.value = "₦80,000";
    return true;
  }
  if (orderQty.value == 5) {
    document.orderForm.price.value = "₦100,000";
    return true;
  }
  if (orderQty.value == 6) {
    document.orderForm.price.value = "₦120,000";
    return true;
  }
  if (orderQty.value == 7) {
    document.orderForm.price.value = "₦140,000";
    return true;
  }
  if (orderQty.value == 8) {
    document.orderForm.price.value = "₦160,000";
    return true;
  }
  if (orderQty.value == 9) {
    document.orderForm.price.value = "₦180,000";
    return true;
  }
  if (orderQty.value == 10) {
    document.orderForm.price.value = "₦200,000";
    return true;
  }
}
