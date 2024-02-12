import { getData } from "./dataFetcher.js";

export const collections = await getData("https://65c5cde5e5b94dfca2e05138.mockapi.io/api/collection");

const collectionsContainer = document.getElementById("collections");
const oddContainer = collectionsContainer.querySelector(".odd");
const evenContainer = collectionsContainer.querySelector(".even");
collections.forEach((collection, idx) => {
    const { id, name, imageUrl } = collection
    const collectionEl = document.createElement("section");
    collectionEl.classList.add("collection-card");

    const nameDiv = document.createElement("div");
    nameDiv.classList.add("name-div", "h2");
    nameDiv.textContent = name;


    const imgContainer = document.createElement("img");
    imgContainer.src = imageUrl;
    imgContainer.alt = name + " collection hyperlink card";
    collectionEl.append(imgContainer, nameDiv);
    collectionEl.addEventListener("click", () => {
        window.location.assign(`./products/?category=${id}`)
    })
    collectionEl.addEventListener("pointerover", () => {
        console.log("enters")
        imgContainer.classList.add("zoom")
    })

    collectionEl.addEventListener("pointerout", () => {
        imgContainer.classList.remove("zoom")
    })
    const imageOnLoad = () => {
        if (idx % 2 == 0)
            evenContainer.append(collectionEl);
        else
            oddContainer.prepend(collectionEl)
            imgContainer.removeEventListener("click", imageOnLoad);
    }
    imgContainer.addEventListener("load", imageOnLoad)
})