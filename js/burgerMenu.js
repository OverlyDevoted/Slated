const burgerBtn = document.getElementById("burger-btn");
const burgerMenu = document.getElementById("burger-menu");
burgerBtn.addEventListener("click", () => {
    burgerMenu.classList.toggle("active");
    if (burgerMenu.classList.contains("active"))
        document.body.style.overflow = "hidden";
    else
        document.body.style.overflow = "initial";
})