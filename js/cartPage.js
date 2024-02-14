import { getData } from "./dataFetcher.js";

const cartData = JSON.parse(localStorage.getItem("cart"));
const cartContainer = document.getElementById("card-container");
const purchase = async () => {
    const putPromises = [];
    for (let item of cartData) {
        //send put request
        const newCount = item.fullCount;
        newCount[item.size] = Math.max(0, item.fullCount[item.size] - item.count);
        putPromises.push(getData(`https://65c5cde5e5b94dfca2e05138.mockapi.io/api/collection/${item.collection}/product/${item.product}`, "PUT", JSON.stringify({ count: newCount })));

    }
    try {
        const putRes = await Promise.all(putPromises);
        localStorage.removeItem("cart");
        cartContainer.innerHTML = "Successful purchase"
        setTimeout(() => {
            const aBack = document.createElement("a")
            aBack.href = "./../";
            aBack.click();
        }, 3000);

        console.log(putRes)
        
        for (let item of putRes) {
            const count = item.count.reduce((accum, cur) => accum + Math.max(cur, 0), 0)
            if (count <= 0) {
                getData(`https://65c5cde5e5b94dfca2e05138.mockapi.io/api/collection/${item.collection}/product/${item.product}`, "DELETE");
            }
        }
    }
    catch (e) {
        console.log("Something went wrong while purchasing", e);
        const purchaseInfo = document.getElementById("purchase-info")
        purchaseInfo.textContent = "Something went wrong while purchasing. Please try again later.";
    }
}
const setupPage = () => {

    if (!cartData) {
        cartContainer.textContent = "No items in the cart";
        return;
    }

    cartContainer.innerHTML =
        "<div class='loader'></div>" +
        "<div>" +
        "<table id='cart-table' class='mt-4'>" +
        "<thead><tr>" +
        "<th>Image</th>" +
        "<th>Name</th>" +
        "<th>Count</th>" +
        "<th>Price</th>" +
        "</tr></thead>" +
        "<tbody id='table-body'></tbody>" +
        "</table>" +
        "<button id='purchase-btn'>Purchase</button>" +
        "<div id='purchase-info'></div>"
    "</div>";

    const tableBody = document.getElementById("table-body");
    const purchaseBtn = document.getElementById("purchase-btn");
    purchaseBtn.addEventListener(("click"), (e) => {
        purchase();
    })
    const createRow = (item) => {
        console.log(item)
        const tr = document.createElement("tr");

        const imgTd = document.createElement("td");
        const img = document.createElement("img");
        img.src = item.imageUrl;
        imgTd.append(img);

        const nameTd = document.createElement("td");
        nameTd.textContent = item.name;

        const countTd = document.createElement("td");
        countTd.textContent = item.count;

        const priceTd = document.createElement("td");
        priceTd.textContent = +item.count * +item.price;

        tr.append(imgTd, nameTd, countTd, priceTd);
        return tr;
    }

    cartData.forEach((item) => {
        tableBody.append(createRow(item));
    })
}
setupPage()