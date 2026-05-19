
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        const cartCount = document.getElementById("cartCount");

        function updateCartCount() {
            let totalItems = 0;
            cart.forEach(item => {
                totalItems += item.quantity;
            });
            if(cartCount) {
                cartCount.innerText = totalItems;
            }
        }

        function addToCart(name, price, image, color, size) {
     
            const existingItemIndex = cart.findIndex(item => item.name === name && item.color === color && item.size === size);

            if (existingItemIndex > -1) {
                cart[existingItemIndex].quantity += 1;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    image: image,
                    color: color,
                    size: size,
                    quantity: 1
                });
            }

            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartCount();
            alert(`${name} has been added to your cart!`);
        }
        updateCartCount();