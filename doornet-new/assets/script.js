// Kinaxy door net script

// Product configs
const PRODUCT_CONFIG = {
  name: "Screen Magnetic Net",
  id: "SMN-001",
  defaultQuantity: 1,
  normalPrice: 32000,
  pricing: {
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
  },
};

// Format price in Naira
const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

const rawPrice = (q) => PRODUCT_CONFIG.pricing[Number(q)] || 0;
const packLabel = (q) => `${Number(q)} ${Number(q) === 1 ? "pack" : "packs"}`;

// Update price and quantity labels
function updatePrice(q) {
  const form = document.forms.orderForm,
    price = naira.format(rawPrice(q));
  document.getElementById("formPrice").textContent = price;
  document.getElementById("stickyPrice").textContent = price;
  document.getElementById("formQuantityLabel").textContent = packLabel(q);
  form.price.value = price;
}

// Track conversion events for TikTok and Facebook
function trackConversionEvents(form, ttEvent, fbEvent) {
  const email = form.email.value.trim(),
    phone = form.phone.value.trim(),
    quantity = Number(form.quantity.value) || 1,
    value = rawPrice(quantity),
    ttIdentify = {},
    fbUserData = {};

  if (email) {
    ttIdentify.email = email;
    fbUserData.em = email.toLowerCase();
  }

  if (phone) {
    ttIdentify.phone_number = phone;
    fbUserData.ph = phone.replace(/\D/g, "");
  }

  // Track TikTok Pixel events if available
  if (window.ttq) {
    if (Object.keys(ttIdentify).length) ttq.identify(ttIdentify);
    ttq.track(ttEvent, {
      contents: [
        {
          content_id: PRODUCT_CONFIG.id,
          content_name: form.product_name.value,
          quantity,
          price: value,
        },
      ],
      value,
      currency: "NGN",
    });
  }

  // Track Facebook Pixel events if available
  if (typeof window.fbq === "function") {
    if (Object.keys(fbUserData).length)
      fbq("init", "1736284044134655", fbUserData);
    fbq("track", fbEvent, {
      content_ids: [PRODUCT_CONFIG.id],
      content_type: "product",
      content_name: form.product_name.value,
      value,
      currency: "NGN",
    });
  }
}

// Initialize form and event listeners on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  const form = document.forms.orderForm,
    quantity = form.quantity;

  quantity.innerHTML = Object.entries(PRODUCT_CONFIG.pricing)
    .map(([q, price]) => {
      const n = Number(q),
        saving = PRODUCT_CONFIG.normalPrice * n - price,
        suffix = n > 1 && saving > 0 ? ` · Save ${naira.format(saving)}` : "";
      return `<option value="${n}">${packLabel(n)} — ${naira.format(price)}${suffix}</option>`;
    })
    .join("");

  quantity.value = String(PRODUCT_CONFIG.defaultQuantity);
  updatePrice(quantity.value);
  quantity.addEventListener("change", () => updatePrice(quantity.value));

  form.addEventListener("submit", () => {
    updatePrice(quantity.value);
    trackConversionEvents(form, "AddToCart", "AddToCart");
    document.getElementById("orderNowBtn").disabled = true;
    document.getElementById("whatsappOrderBtn").disabled = true;
    document.getElementById("orderNowBtn").textContent = "Submitting…";
    document.getElementById("whatsappOrderBtn").textContent = "Submitting…";
  });

  // Handle WhatsApp order button click
  document.getElementById("whatsappOrderBtn").addEventListener("click", () => {
    if (!form.reportValidity()) return;
    updatePrice(quantity.value);
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
    document.getElementById("orderNowBtn").disabled = true;
    document.getElementById("whatsappOrderBtn").disabled = true;
    document.getElementById("whatsappOrderBtn").textContent = "Submitting…";
    form.submit();
  });

  // Set the current year in the footer
  document.getElementById("year").textContent = new Date().getFullYear();
  const bar = document.getElementById("mobileCta"),
    card = document.getElementById("orderForm");

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(
      ([entry]) => {
        bar.style.opacity = entry.isIntersecting ? "0" : "1";
        bar.style.pointerEvents = entry.isIntersecting ? "none" : "auto";
      },
      { threshold: 0.05 },
    ).observe(card);
  }
});
