document.addEventListener("DOMContentLoaded", function () {

  console.log("✅ DOM fully loaded and parsed"); // Debugging

  const ease = "power4.inOut";

  // Page Load Animation (Hides Loader after Animation)
  revealTransition().then(() => {
      gsap.set(".block", { visibility: "hidden" });
  });

  // Click Navigation Animation
  document.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", (event) => {
          event.preventDefault();
          const href = link.getAttribute("href");

          if (href && !href.startsWith("#") && href !== window.location.pathname) {
              animateTransition().then(() => {
                  window.location.href = href;
              });
          }
      });
  });

  // GSAP Animation for .user-details (coming from the bottom)
  gsap.from(".user-details", {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: "power3.out"
  });

  // GSAP Staggered Animation for .order-item in #order-list
  gsap.from("#order-list .order-item", {
      y: 50,
      opacity: 0,
      duration: 1,
      delay: 0.5,
      ease: "power3.out",
      stagger: 0.2
  });

  // ✅ Processing Order Items on Load
  document.querySelectorAll(".order-item .item-name").forEach(itemEl => {
      let text = itemEl.textContent.trim();
      console.log("📌 Processing item:", text); // Debugging

      let match = text.match(/^(.*?) \(Shop ID: \d+\)$/);
      if (match) {
          console.log("✅ Matched item:", match[1]); // Debugging
          itemEl.textContent = `${match[1]} (Shop ID: ${extractShopID(text)})`;
      }
  });

  updatePrice(); // ✅ Update prices on page load

  // ✅ Increase Quantity
  document.querySelectorAll('.increase').forEach(button => {
      button.addEventListener('click', function () {
          const input = document.querySelector(`.quantity-input[data-item="${this.dataset.item}"]`);
          input.value = parseInt(input.value) + 1;
          updatePrice();
      });
  });

  // ✅ Decrease Quantity
  document.querySelectorAll('.decrease').forEach(button => {
      button.addEventListener('click', function () {
          const input = document.querySelector(`.quantity-input[data-item="${this.dataset.item}"]`);
          input.value = Math.max(1, parseInt(input.value) - 1);
          updatePrice();
      });
  });

  // ✅ Pay by Cash
  document.getElementById('order-form').addEventListener('submit', function (event) {
      const orderItems = collectOrderItems();
      document.getElementById('order-items-input').value = JSON.stringify(orderItems);
      console.log(orderItems);
  });

  // ✅ Pay Online
  document.getElementById('online-payment-form').addEventListener('submit', function (event) {
      const orderItems = collectOrderItems();
      document.getElementById('online-order-items-input').value = JSON.stringify(orderItems);
      let total = orderItems.reduce((sum, item) => sum + parseFloat(item.total_price), 0);
      document.getElementById('online-total-input').value = total.toFixed(2);
      console.log(orderItems);
      console.log('Total:', total.toFixed(2));
  });

});

// ✅ Reveal Animation (Runs on Page Load)
function revealTransition() {
  return new Promise((resolve) => {
      gsap.to(".block", { scaleY: 1 });
      gsap.to(".block", {
          scaleY: 0,
          duration: 1.5,
          ease: "power4.inOut",
          onComplete: resolve
      });
  });
}

// ✅ Animate Loader when Navigating to a Different Page
function animateTransition() {
  return new Promise((resolve) => {
      gsap.set(".block", { visibility: "visible", scaleY: 0 });
      gsap.to(".block", {
          scaleY: 1,
          duration: 1.5,
          ease: "power4.inOut",
          onComplete: resolve
      });
  });
}

// ✅ Function to collect order items
function collectOrderItems() {
  const items = [];
  document.querySelectorAll('.order-item').forEach(item => {
      let itemName = item.querySelector('.item-name').textContent.trim();
      const quantity = parseInt(item.querySelector('.quantity-input').value);
      const price = parseFloat(item.querySelector('.item-price').textContent.replace('₹', ''));
      const totalPrice = price * quantity;
      let shopID = extractShopID(itemName);

      if (shopID) {
          itemName = itemName.replace(/\(Shop ID: \d+\)/g, "").trim() + ` (Shop ID: ${shopID})`;
      }

      items.push({
          item_name: itemName,
          quantity: quantity,
          price: price.toFixed(2),
          total_price: totalPrice.toFixed(2)
      });
  });

  return items;
}

// ✅ Extract Shop ID from Item Name
function extractShopID(text) {
  let match = text.match(/\(Shop ID: (\d+)\)/);
  return match ? match[1] : null;
}

// ✅ Calculate total price dynamically
function updatePrice() {
  let total = 0;
  document.querySelectorAll('.order-item').forEach(item => {
      const price = parseFloat(item.querySelector('.item-price').textContent.replace('₹', ''));
      const quantity = parseInt(item.querySelector('.quantity-input').value);
      total += price * quantity;
  });
  document.getElementById('total-price').textContent = total.toFixed(2);
  document.getElementById('total-input').value = total.toFixed(2);
}


