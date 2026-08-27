// Centralized Script for managing orders & multi-platform tracking
// (Meta & TikTok)

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

// Product pricing used by the frontend.
// Backend should remain authoritative for persisted order data.
function getPrice(quantity) {
  const prices = {
    1: "₦25,000",
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

// Raw numerical price for Meta/TikTok payloads.
function getRawPrice(quantity) {
  const rawPrices = {
    1: 25000,
    2: 48000,
    3: 70500,
    4: 92000,
    5: 110000,
    6: 126000,
    7: 140000,
    8: 160000,
    9: 180000,
    10: 200000,
  };

  return rawPrices[quantity] || 0;
}

function checkForm() {
  const form = document.forms["orderForm"];

  if (!form) {
    return false;
  }

  form.price.value = getPrice(form.quantity.value);

  return true;
}

/**
 * Executes Advanced Matching and tracks events via Meta and TikTok Pixels.
 *
 * @param {HTMLFormElement} form
 * @param {string} ttEvent
 * @param {string} fbEvent
 */
function trackConversionEvents(form, ttEvent, fbEvent) {
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const quantity = parseInt(form.quantity.value, 10) || 1;
  const rawPrice = getRawPrice(form.quantity.value);

  const ttIdentify = {};
  const fbUserData = {};

  if (email) {
    ttIdentify.email = email;
    fbUserData.em = email.toLowerCase();
  }

  if (phone) {
    ttIdentify.phone_number = phone;
    fbUserData.ph = phone.replace(/\D/g, "");
  }

  // TikTok Pixel
  if (typeof ttq !== "undefined") {
    if (Object.keys(ttIdentify).length > 0) {
      ttq.identify(ttIdentify);
    }

    ttq.track(ttEvent, {
      contents: [
        {
          content_id: "SMN-001",
          content_name: form.product_name.value,
          quantity: quantity,
          price: rawPrice,
        },
      ],
      value: rawPrice,
      currency: "NGN",
    });
  }

  // Meta Pixel
  if (typeof fbq !== "undefined") {
    if (Object.keys(fbUserData).length > 0) {
      fbq("init", "999699278983855", fbUserData);
    }

    fbq("track", fbEvent, {
      content_ids: ["SMN-001"],
      content_type: "product",
      content_name: form.product_name.value,
      value: rawPrice,
      currency: "NGN",
    });
  }
}

// Standard form submission
const orderForm = document.forms["orderForm"];

if (orderForm) {
  orderForm.addEventListener("submit", function () {
    if (!checkForm()) {
      return;
    }

    trackConversionEvents(this, "AddToCart", "AddToCart");

    disableOrderButtons();
  });
}

// WhatsApp ordering
const whatsappOrderBtn = document.getElementById("whatsappOrderBtn");

if (whatsappOrderBtn) {
  whatsappOrderBtn.addEventListener("click", function () {
    const form = document.forms["orderForm"];

    if (!form) {
      return;
    }

    if (!form.reportValidity()) {
      return;
    }

    checkForm();

    trackConversionEvents(form, "InitiateCheckout", "InitiateCheckout");

    const message = {
      fullname: form.fullname.value,
      email: form.email.value,
      phone: form.phone.value,
      alt_phone: form.alt_phone.value,
      quantity: form.quantity.value,
      price: form.price.value,
      state: form.state.value,
      address: form.address.value,
      product_name: form.product_name.value,
      order_source: form.order_source.value,
    };

    sessionStorage.setItem("pendingWhatsappOrder", JSON.stringify(message));

    disableOrderButtons();

    form.submit();
  });
}

// Video autoplay control
document.addEventListener("DOMContentLoaded", function () {
  const videos = document.querySelectorAll(".unmute-video");

  videos.forEach((video) => {
    video.muted = false;

    const playPromise = video.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log("Unmuted playing of the media");
        })
        .catch((error) => {
          console.log("Autoplay with sound was blocked. Playing muted.", error);

          setTimeout(() => {
            video.muted = true;
            video.play();
          }, 5000);
        });
    }
  });
});
