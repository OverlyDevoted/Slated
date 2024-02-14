const carts = document.getElementsByClassName("cart");

const createCounter = (burger = false) => {
    const span = document.createElement("span");
    span.classList.add("cart-counter");
    if (burger)
        span.classList.add("burger-cart")
    return span;
}

export const updateCounters = () => {
    const data = JSON.parse(localStorage.getItem("cart"));

    if (data == null) {
        return;
    }

    if (data.length > 0) {
        for (let cart of carts) {
            const spans = cart.querySelectorAll(".cart-counter");

            if (spans.length) {
                for (let span of spans) {
                    span.textContent = data.reduce((accum, cur) => accum + +cur.count, 0);
                    if (cart.matches("aside .cart"))
                        span.classList.add("burger-cart")
                }
            }
            else {
                const newSpan = createCounter(cart.matches("aside .cart"))
                newSpan.textContent = data.reduce((accum, cur) => accum + +cur.count, 0);
                cart.append(newSpan);
            }
        }
    }
}

updateCounters();