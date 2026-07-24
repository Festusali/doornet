// Centralized Script for managing orders & multi-platform tracking (Meta & TikTok)

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

// Assigns corresponding value to price based on Net quantity
function getPrice(quantity) {
  const prices = {
    1: "₦26,500",
    2: "₦48,000",
    3: "₦70,500",
    4: "₦92,000",
    5: "₦110,000",
    6: "₦126,000",
    7: "₦140,000",
    8: "₦160,000",
    9: "₦180,000",
    10: "₦200,000",
  };
  return prices[quantity] || "₦0.00";
}

// Helper to get raw numerical price for Pixel SDK payloads
function getRawPrice(quantity) {
  const rawPrices = {
    1: 25000,
    2: 45000,
    3: 66000,
    4: 86000,
    5: 105000,
    6: 120000,
  };
  return rawPrices[quantity] || 0;
}

function checkForm() {
  const form = document.orderForm;
  form.price.value = getPrice(form.quantity.value);
  return true;
}

/**
 * Executes Advanced Matching and tracks events via Meta and TikTok Pixels
 * @param {HTMLFormElement} form
 * @param {string} ttEvent - TikTok event name ('AddToCart' or 'InitiateCheckout')
 * @param {string} fbEvent - Meta event name ('AddToCart' or 'InitiateCheckout')
 */
function trackConversionEvents(form, ttEvent, fbEvent) {
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const quantity = parseInt(form.quantity.value) || 1;
  const rawPrice = getRawPrice(form.quantity.value);

  // --- 1. ADVANCED MATCHING DATA SETUP ---
  const ttIdentify = {};
  const fbUserData = {};

  if (email) {
    ttIdentify.email = email;
    fbUserData.em = email.toLowerCase();
  }
  if (phone) {
    ttIdentify.phone_number = phone;
    fbUserData.ph = phone.replace(/\D/g, ""); // strip non-numeric characters for Meta
  }

  // --- 2. TIKTOK PIXEL TRACKING ---
  if (typeof ttq !== "undefined") {
    if (Object.keys(ttIdentify).length > 0) {
      ttq.identify(ttIdentify);
    }
    ttq.track(ttEvent, {
      contents: [
        {
          content_id: "SMN-001",
          content_name: "Screen Magnetic Net",
          quantity: quantity,
          price: rawPrice,
        },
      ],
      value: rawPrice,
      currency: "NGN",
    });
  }

  // --- 3. META (FACEBOOK) PIXEL TRACKING ---
  if (typeof fbq !== "undefined") {
    if (Object.keys(fbUserData).length > 0) {
      // Re-initialize with user data parameters to unlock Advanced Matching execution
      fbq("init", "999699278983855", fbUserData);
    }
    fbq("track", fbEvent, {
      content_ids: ["SMN-001"],
      content_type: "product",
      content_name: "Screen Magnetic Net",
      value: rawPrice,
      currency: "NGN",
    });
  }
}

// Intercept Standard Form Submission Pipeline
document.orderForm.addEventListener("submit", function (e) {
  checkForm();

  // Fire AddToCart event safely on both platforms
  trackConversionEvents(this, "AddToCart", "AddToCart");

  disableOrderButtons();
});

// Intercept WhatsApp Routing Pipeline
document
  .getElementById("whatsappOrderBtn")
  .addEventListener("click", function () {
    const form = document.orderForm;

    if (!form.reportValidity()) {
      return;
    }

    checkForm();

    // Fire InitiateCheckout tracking matching both environments
    trackConversionEvents(form, "InitiateCheckout", "InitiateCheckout");

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

// Video Autoplay Control Logic
document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(".unmute-video");

  videos.forEach((video) => {
    video.muted = false;

    let playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then((_) => {
          console.log("Unmuted playing of the media");
        })
        .catch((error) => {
          console.log("Autoplay with sound was blocked. Playing muted.", error);
          setTimeout(() => {
            video.muted = true;
            video.play();
          }, 5000);
          video.muted = false;
          video.play();
        });
    }
  });
});
