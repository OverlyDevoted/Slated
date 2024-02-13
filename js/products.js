import { getData } from "./dataFetcher.js";

const productsContainer = document.getElementById("products-container");

const loadProducts = (...args) => {
    let loaded = false;
    args.forEach((productArray) => {
        let processedProducts = productArray;


        processedProducts.forEach((product) => {
            loaded = true;
            productsContainer.append(generateProductCard(product));
        })
    })
    if (!loaded) {
        productsContainer.textContent = "No products of this category were found";
    }
}
const generateProductCard = (product) => {
    const li = document.createElement("li");
    li.classList.add("product-card");
    li.addEventListener("click", (e) => {
        const a = document.createElement("a");
        a.href = `./view/?product=${product.id}&collection=${product.collectionId}`;
        a.click();
    })

    const imgContainer = document.createElement("div");
    imgContainer.classList.add("image-container");
    const img = document.createElement("img");
    img.src = product.imageUrl;
    img.addEventListener("pointerenter", (e) => {
        e.target.classList.add("zoom")
    })
    img.addEventListener("pointerleave", (e) => {
        e.target.classList.remove("zoom")
    })
    imgContainer.append(img);

    const infoContainer = document.createElement("div");
    infoContainer.classList.add("info-container")
    const nameSpan = document.createElement("span");
    nameSpan.textContent = product.name;

    const priceSpan = document.createElement("span");
    priceSpan.textContent = product.price;

    infoContainer.append(nameSpan, priceSpan);
    li.append(imgContainer, infoContainer);
    return li;
}

const searchParams = new URLSearchParams(window.location.search);
let idxs = [];
const categorySearch = searchParams.get("category");
if (categorySearch) {
    if (/^\d{1,3}(,\d{1,3}){0,2}$/.test(categorySearch)) {
        idxs = categorySearch.split(",")
    }
}

let collections = await getData("https://65c5cde5e5b94dfca2e05138.mockapi.io/api/collection")
if (idxs.length) {
    collections = collections.filter(({ id }) => idxs.includes(id));
}

const products = [];
// console.log(collections)
for (let { id } of collections) {
    const data = await getData(`https://65c5cde5e5b94dfca2e05138.mockapi.io/api/collection/${id}/product`);
    console.log(data);
    products.push(...data);
}
products.sort((a, b) => a.price - b.price);
loadProducts(products);
