(function () {
  function redirectToWhatsApp(orderId) {
    const pendingOrder = sessionStorage.getItem("pendingWhatsappOrder");
    if (!pendingOrder) return;

    let order;
    try {
      order = JSON.parse(pendingOrder);
    } catch (error) {
      sessionStorage.removeItem("pendingWhatsappOrder");
      return;
    }

    const message =
      `Hello, I placed an order for "${order.product_name}".\n\n` +
      `Order ID: ${orderId}\n\n` +
      `Full Name: ${order.fullname}\n` +
      `Email: ${order.email}\n` +
      `Phone Number: ${order.phone}\n` +
      `Alternative Phone: ${order.alt_phone}\n` +
      `Quantity: ${order.quantity}\n` +
      `Amount: ${order.price}\n` +
      `State: ${order.state}\n` +
      `Delivery Address: ${order.address}`;

    sessionStorage.removeItem("pendingWhatsappOrder");
    window.location.replace(
      "https://wa.me/2347067868317?text=" + encodeURIComponent(message),
    );
  }

  window.addEventListener("load", function () {
    window.setTimeout(function () {
      const params = new URLSearchParams(window.location.search);
      const orderId = params.get("order_id");
      const price = Number(params.get("price")) || 25000;
      const quantity = Number(params.get("quantity")) || 1;

      if (!orderId) {
        redirectToWhatsApp("");
        return;
      }

      const trackingKey = `purchase_tracked_${orderId}`;
      if (!sessionStorage.getItem(trackingKey)) {
        if (window.ttq) {
          ttq.track("Purchase", {
            contents: [
              {
                content_id: "SMN-001",
                content_name: "Screen Magnetic Net",
                quantity,
                price,
              },
            ],
            value: price,
            currency: "NGN",
          });
        }

        if (typeof window.fbq === "function") {
          fbq("track", "Purchase", {
            content_ids: ["SMN-001"],
            content_type: "product",
            content_name: "Screen Magnetic Net",
            value: price,
            currency: "NGN",
          });
        }

        sessionStorage.setItem(trackingKey, "true");
      }

      window.setTimeout(function () {
        redirectToWhatsApp(orderId);
      }, 1500);
    }, 1200);
  });
})();
