window.addEventListener("load", function () {
  window.setTimeout(function () {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get("order_id");
    const price = Number(params.get("price")) || 25000;
    const quantity = Number(params.get("quantity")) || 1;

    if (!orderId) return;

    const trackingKey = `purchase_tracked_${orderId}`;
    if (sessionStorage.getItem(trackingKey)) return;

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
  }, 1200);
});
