// Script for managing orders for Screen Magnetic Door Net

function disableOrderButtons() {
  const normalBtn = document.getElementById("orderNowBtn");
  const whatsappBtn = document.getElementById("whatsappOrderBtn");

  if (normalBtn) {
    normalBtn.disabled = true;
    normalBtn.innerText = "Submitting...";
  }

  if (whatsappBtn) {
    whatsappBtn.disabled = true;
    whatsappBtn.innerText = "Submitting...";
  }
}

document.orderForm.addEventListener("submit", function () {
  disableOrderButtons();
});

// Assigns corresponding value to price based on Net quantity
function getPrice(quantity) {
  const prices = {
    1: "₦25,000",
    2: "₦45,000",
    3: "₦66,000",
    4: "₦86,000",
    5: "₦105,000",
    6: "₦120,000",
  };

  return prices[quantity] || "₦0.00";
}

function checkForm() {
  const form = document.orderForm;
  form.price.value = getPrice(form.quantity.value);

  return true;
}

// Assign order channel as whatsapp
document
  .getElementById("whatsappOrderBtn")
  .addEventListener("click", function () {
    const form = document.orderForm;

    if (!form.reportValidity()) {
      return;
    }

    checkForm();

    const message = {
      fullname: form.fullname.value,
      email: form.email.value,
      phone: form.phone.value,
      altPhone: form.alt_phone.value,
      quantity: form.quantity.value,
      price: form.price.value,
      state: form.state.value,
      address: form.address.value,
      product: form.productName.value,
    };

    sessionStorage.setItem("pendingWhatsappOrder", JSON.stringify(message));

    disableOrderButtons();

    form.submit();
  });

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
