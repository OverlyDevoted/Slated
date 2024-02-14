import { getData } from "./dataFetcher.js";

const collection = await getData("https://65c5cde5e5b94dfca2e05138.mockapi.io/api/collection");
const categorySelection = document.getElementById("collection");
const sizesDiv = document.getElementById("sizes");
let sizeInputs = [];
const generateSize = (size) => {
    const divContainer = document.createElement("div");
    divContainer.classList.add("my-025")

    const label = document.createElement("label");
    label.setAttribute("for", size);
    label.textContent = size;
    const input = document.createElement("input");
    input.setAttribute("name", size);
    input.setAttribute("id", size);
    input.setAttribute("type", "number");
    input.value = 1;
    sizeInputs.push(input);
    divContainer.append(label, input);
    return divContainer;
}

const generateOption = (id, name) => {
    // console.log(item);
    const option = document.createElement("option");
    option.setAttribute("value", id)
    option.textContent = name;
    return option;
}

const generateSizeInputs = (id) => {
    sizesDiv.innerHTML = "";
    sizeInputs.length = 0;
    collection[id].sizes.forEach(size => {
        sizesDiv.append(generateSize(size));
    })
}
categorySelection.addEventListener("change", (e) => {
    generateSizeInputs(e.target.value);
});
generateSizeInputs(0);

collection.forEach((item, idx) => {
    categorySelection.add(generateOption(idx, item.name));
});

const form = document.getElementById("clothing-form");
const notificationDiv = document.getElementById("notification");
form.addEventListener("submit", async e => {
    e.preventDefault();
    const name = document.getElementById("name");
    const description = document.getElementById("description");
    const imageUrl = document.getElementById("imageUrl");
    const price = document.getElementById("price");
    const selectedCollection = document.getElementById("collection");
    const sizeInputValues = sizeInputs.map(size => size.value);
    const postData = { name: name.value, description: description.value, imageUrl: imageUrl.value, price: price.value, count: [...sizeInputValues] };
    await getData(`https://65c5cde5e5b94dfca2e05138.mockapi.io/api/collection/${collection[selectedCollection.value].id}/product`, "POST", JSON.stringify(postData));
    notificationDiv.textContent = "Successfully added new item " + name.value;
    name.value = "";
    description.value = "";
    imageUrl.value = "";
    price.value = "";
})