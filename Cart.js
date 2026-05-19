    const cartItemsContainer = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function saveCart() {
      localStorage.setItem("cart", JSON.stringify(cart));
      updateCartCount();
    }

    function updateCartCount() {
      let totalItems = 0;
      cart.forEach(item => {
        totalItems += item.quantity;
      });
      if(cartCount) cartCount.innerText = totalItems;
    }

    function renderCart() {
      updateCartCount();

      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
          <div class="bg-white rounded-3xl p-10 md:p-16 text-center">
            <h2 class="text-3xl font-semibold mb-4">Your cart is empty</h2>
            <p class="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
            <a href="index.html" class="bg-black hover:bg-[#062b1f] text-white px-8 py-4 rounded-md uppercase tracking-widest text-xs transition-colors inline-block">
              Continue Shopping
            </a>
          </div>
        `;
        document.getElementById("subtotal").innerText = "$0";
        document.getElementById("tax").innerText = "$0";
        document.getElementById("total").innerText = "$0";
        return;
      }

      cartItemsContainer.innerHTML = "";
      let subtotal = 0;

      cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;

        cartItemsContainer.innerHTML += `
          <div class="bg-white rounded-3xl p-5 md:p-6">
            <div class="flex flex-col md:grid md:grid-cols-4 gap-6 items-center">
              <div class="flex gap-4 w-full">
                <img src="${item.image}" class="w-24 h-28 rounded-xl object-cover"/>
                <div>
                  <h3 class="text-lg font-medium mb-2">${item.name}</h3>
                  <p class="text-sm text-gray-500 uppercase">Color: ${item.color}</p>
                  <p class="text-sm text-gray-500 uppercase mb-3">Size: ${item.size}</p>
                  <button onclick="removeItem(${index})" class="text-red-500 text-sm">Remove</button>
                </div>
              </div>
              <div class="flex justify-center">
                <div class="flex items-center border border-gray-300 rounded-md overflow-hidden">
                  <button onclick="changeQuantity(${index}, -1)" class="px-4 py-2 hover:bg-gray-100 transition">-</button>
                  <span class="px-5">${item.quantity}</span>
                  <button onclick="changeQuantity(${index}, 1)" class="px-4 py-2 hover:bg-gray-100 transition">+</button>
                </div>
              </div>
              <div class="text-center font-medium">$${item.price}</div>
              <div class="text-right text-lg font-semibold">$${itemTotal.toFixed(2)}</div>
            </div>
          </div>
        `;
      });

      const tax = subtotal * 0.08;
      const total = subtotal + tax;

      document.getElementById("subtotal").innerText = `$${subtotal.toFixed(2)}`;
      document.getElementById("tax").innerText = `$${tax.toFixed(2)}`;
      document.getElementById("total").innerText = `$${total.toFixed(2)}`;
    }

    function changeQuantity(index, amount) {
      cart[index].quantity += amount;
      if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
      }
      saveCart();
      renderCart();
    }

    function removeItem(index) {
      cart.splice(index, 1);
      saveCart();
      renderCart();
    }

    renderCart();