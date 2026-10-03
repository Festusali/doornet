// Kinaxy Doornet — centralized pricing, order handling and conversion tracking.
// The backend remains authoritative for persisted order data.

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

const naira = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

function getRawPrice(quantity) {
  return PRODUCT_CONFIG.pricing[Number(quantity)] || 0;
}

function getPrice(quantity) {
  const raw = getRawPrice(quantity);
  return raw ? naira.format(raw) : "₦0";
}

function getPackLabel(quantity) {
  const value = Number(quantity);
  return `${value} ${value === 1 ? "pack" : "packs"}`;
}

function setText(id, value) {
  const element = document.getElementById(id);
  if (element) element.textContent = value;
}

function populateQuantityOptions() {
  const select = document.getElementById("quantity");
  if (!select) return;

  const currentValue = select.value || String(PRODUCT_CONFIG.defaultQuantity);

  select.innerHTML = Object.entries(PRODUCT_CONFIG.pricing)
    .map(([quantity, price]) => {
      const value = Number(quantity);
      const savings = PRODUCT_CONFIG.normalPrice * value - price;
      const savingsLabel =
        value > 1 && savings > 0 ? ` · Save ${naira.format(savings)}` : "";
      return `<option value="${value}">${getPackLabel(value)} — ${naira.format(price)}${savingsLabel}</option>`;
    })
    .join("");

  select.value = PRODUCT_CONFIG.pricing[currentValue]
    ? currentValue
    : String(PRODUCT_CONFIG.defaultQuantity);
}

function updatePriceUI(quantity) {
  const rawPrice = getRawPrice(quantity);
  const formattedPrice = getPrice(quantity);

  setText("heroPrice", getPrice(1));
  setText("formPrice", formattedPrice);
  setText("stickyPrice", formattedPrice);
  setText("formQuantityLabel", getPackLabel(quantity));

  const form = document.forms.orderForm;
  if (form && form.price) {
    form.price.value = formattedPrice;
  }

  return rawPrice;
}

function checkForm() {
  const form = document.forms.orderForm;
  if (!form) return false;

  if (!form.quantity.value || !getRawPrice(form.quantity.value)) {
    return false;
  }

  updatePriceUI(form.quantity.value);
  return true;
}

function disableOrderButtons() {
  const normalBtn = document.getElementById("orderNowBtn");
  const whatsappBtn = document.getElementById("whatsappOrderBtn");

  if (normalBtn) {
    normalBtn.disabled = true;
    normalBtn.innerHTML = "Submitting…";
  }

  if (whatsappBtn) {
    whatsappBtn.disabled = true;
    whatsappBtn.innerHTML = "Submitting…";
  }
}

function trackConversionEvents(form, ttEvent, fbEvent) {
  const email = form.email.value.trim();
  const phone = form.phone.value.trim();
  const quantity = Number(form.quantity.value) || 1;
  const rawPrice = getRawPrice(quantity);

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

  if (typeof ttq !== "undefined" && ttq) {
    if (Object.keys(ttIdentify).length) {
      ttq.identify(ttIdentify);
    }

    ttq.track(ttEvent, {
      contents: [
        {
          content_id: PRODUCT_CONFIG.id,
          content_name: form.product_name.value,
          quantity,
          price: rawPrice,
        },
      ],
      value: rawPrice,
      currency: "NGN",
    });
  }

  if (typeof fbq === "function") {
    if (Object.keys(fbUserData).length) {
      fbq("init", "999699278983855", fbUserData);
    }

    fbq("track", fbEvent, {
      content_ids: [PRODUCT_CONFIG.id],
      content_type: "product",
      content_name: form.product_name.value,
      value: rawPrice,
      currency: "NGN",
    });
  }
}

function setupOrderForm() {
  const form = document.forms.orderForm;
  if (!form) return;

  populateQuantityOptions();
  updatePriceUI(form.quantity.value || PRODUCT_CONFIG.defaultQuantity);

  form.quantity.addEventListener("change", () => {
    updatePriceUI(form.quantity.value);
  });

  form.addEventListener("submit", function () {
    if (!checkForm()) return;

    trackConversionEvents(this, "AddToCart", "AddToCart");
    disableOrderButtons();
  });

  const whatsappButton = document.getElementById("whatsappOrderBtn");

  if (whatsappButton) {
    whatsappButton.addEventListener("click", function () {
      if (!form.reportValidity()) return;
      if (!checkForm()) return;

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
}

document.addEventListener("DOMContentLoaded", () => {
  setupOrderForm();

  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  // Keep the mobile sticky CTA visible, but don't cover the order form submit area.
  const stickyBar = document.querySelector(".mobile-order-bar");
  const orderSection = document.querySelector(".order-section");

  if (stickyBar && orderSection && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      ([entry]) => {
        stickyBar.style.opacity = entry.isIntersecting ? "0" : "1";
        stickyBar.style.pointerEvents = entry.isIntersecting ? "none" : "auto";
      },
      { threshold: 0.05 },
    );
    observer.observe(orderSection);
  }
});
