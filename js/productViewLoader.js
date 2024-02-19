import { updateCounters } from "./cartManager.js";
import { getData } from "./dataFetcher.js";

const maxOptions = 10;

const getIds = () => {
    const searchParams = new URLSearchParams(window.location.search);

    const productId = searchParams.get("product");
    if (!productId || !/^\d{1,3}$/.test(productId)) return null;
    const collectionId = searchParams.get("collection");
    if (!collectionId || !/^\d{1,3}$/.test(collectionId)) return null;
    return { collection: collectionId, product: productId };
}

const ids = getIds();

let errorTimeout;
const errorDiv = document.getElementById("product-error");

//technically not only errors can be displayed 
const setError = (message) => {
    errorDiv.textContent = message;
    clearTimeout(errorTimeout)
    errorTimeout = setTimeout(() => {
        errorDiv.textContent = "";
    }, 10000);
}

if (ids) {
    const collectionData = await getData(`https://65c5cde5e5b94dfca2e05138.mockapi.io/api/collection/${ids.collection}`);
    const sizes = collectionData.sizes;
    const data = await getData(`https://65c5cde5e5b94dfca2e05138.mockapi.io/api/collection/${ids.collection}/product/${ids.product}`, "GET", null)
    
    const img = document.querySelector("#image-container > img");
    img.src = data.imageUrl;

    const productName = document.getElementById("product-name");
    productName.textContent = data.name;

    const productDescription = document.getElementById("product-description");
    productDescription.textContent = data.description;

    const productPrice = document.getElementById("product-price");
    productPrice.textContent = data.price;

    const sizeSelector = document.getElementById("size");
    const countSelector = document.getElementById("quantity");
    const submitBtn = document.getElementById("submit-btn");

    const setSoldout = () => {
        const option = document.createElement("option");
        option.setAttribute("value", 0);
        option.setAttribute("selected", true);
        option.textContent = "Sold out";
        option.disabled = true;
        countSelector.disabled = true;
        submitBtn.disabled = true;
        countSelector.append(option);
    }
    const setOption = (id) => {
        for (let i = 0; i < Math.min(data.count[id],maxOptions); i++) {
            const option = document.createElement("option");
            option.setAttribute("value", i + 1);
            option.textContent = i + 1;
            countSelector.append(option);
        }

        countSelector.disabled = false;
        submitBtn.disabled = false;
    }

    sizeSelector.addEventListener("change", (e) => {
        countSelector.innerHTML = "";

        if (data.count[e.target.value] > 0) {
            setOption(e.target.value);
        }
        else {
            setSoldout();
        }
    })


    if (data.count.length > 1) {
        data.count.forEach((val, idx) => {
            const sizeOption = document.createElement("option");
            sizeOption.setAttribute("value", idx);
            sizeOption.textContent = sizes[idx];
            sizeSelector.append(sizeOption);

        });
    }

    if (data.count[0] > 0) {
        setOption(0);
    }
    else {
        setSoldout()
    }

    const purchaseForm = document.getElementById("purchase-options-form");
    purchaseForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const cartItem = { ...ids, size: sizeSelector.value, count: countSelector.value, imageUrl: data.imageUrl, name: data.name, price: data.price, fullCount: data.count, sizeName: sizeSelector.options[sizeSelector.value].text };
        if (cartItem.count > 0) {

            let cartData = JSON.parse(localStorage.getItem("cart"));
            if (!cartData)
                cartData = [];
            //check existance

            if (!cartData.some((val) => val.product == cartItem.product)) {
                cartData.push(cartItem);
                localStorage.setItem("cart", JSON.stringify(cartData));

                setError("Successfully added item to the cart")
                updateCounters();
            }
            else {
                const existingIdx = cartData.findIndex((item) =>
                    item.product == cartItem.product && item.count != cartItem.count);

                if (existingIdx > -1) {
                    cartData[existingIdx].count = cartItem.count;
                    localStorage.setItem("cart", JSON.stringify(cartData));

                    setError("Successfully updated item in the cart")
                    updateCounters();
                    return;
                }




                setError("Item already exists in the cart");
            }
        }
    })
}
