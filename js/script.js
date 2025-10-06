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

document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(".unmute-video");

  videos.forEach((video) => {
    video.muted = false; // Try to play unmuted first

    let playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          // Autoplay started!
          console.log("Unmuted playing of the media");
        })
        .catch((error) => {
          // Autoplay was prevented.
          // Show a "Play" button or simply play it muted.
          console.log("Autoplay with sound was blocked. Playing muted.", error);
          console.log("False unmuted playing of the media after 5 seconds");
          setTimeout(() => {
            video.muted = true;
            video.play();
          }, 5000); // Play muted after 5 seconds
          video.muted = false;
          video.play();
        });
    }
  });
});
