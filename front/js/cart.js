// Global function to call all functions
function main(){
    addItemsToCart();
    checkForm(); 
    sendOrderData();
}

main();

// Recovery of the basket contained in local storage
function getCart(){
    return JSON.parse(localStorage.getItem("products"));
}

// Adding user-selected items to cart
function addItemsToCart(){
    let quantityTotal = 0;
    let totalPrice = 0;
    if (getCart() === null || getCart() == 0){
        document.querySelector("#cartAndFormContainer > h1").insertAdjacentText("beforeend", " est vide");
    }else{
        for (let i = 0; i < getCart().length; i++){
            fetch("http://localhost:3000/api/products/" + getCart()[i].productId)
                .then(res => res.json())
                .then(data =>{
                    const elementsCart = `
                    <article class="cart__item" data-id="${getCart()[i].productId}" data-color="${getCart()[i].productColor}">
                        <div class="cart__item__img">
                            <img src="${data.imageUrl}" alt="${data.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                            <h2>${data.name}</h2>
                            <p>${getCart()[i].productColor}</p>
                            <p>${data.price} €</p>
                            </div>
                            <div class="cart__item__content__settings">
                            <div class="cart__item__content__settings__quantity">
                                <p>Qté : ${getCart()[i].productQuantity}</p>
                                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${getCart()[i].productQuantity}">
                            </div>
                            <div class="cart__item__content__settings__delete">
                                <p class="deleteItem">Supprimer</p>
                            </div>
                            </div>
                        </div>
                    </article>`;
                    document.querySelector("#cart__items").insertAdjacentHTML("beforeend", elementsCart);
                    quantityTotal += getCart()[i].productQuantity * 1;
                    document.querySelector("#totalQuantity").innerHTML = quantityTotal;
                    totalPrice += getCart()[i].productQuantity * data.price;
                    document.querySelector("#totalPrice").innerHTML = totalPrice;
                    document.querySelectorAll(".itemQuantity").forEach(e =>{
                        e.addEventListener("change", changeQuantityProduct);
                    })
                    document.querySelectorAll(".deletItem").forEach(e =>{
                        e.addEventListener("click", removeProduct);
                    })
                })
                .catch(err => console.log(err))
        }
    }
}

/**
 * Save the cart in the localStorage
 * @param { Array.<Object> } cart 
 * @returns { String }
 */
function saveCart(cart){
    return localStorage.setItem("products", JSON.stringify(cart));
}

// Reloading the page from the current URL
function reloadPage(){
    return window.location.reload()
}

/**
 * Change the quantity of the product in the basket
 * @param { Object } e 
 */
function changeQuantityProduct(e){
    const searchProduct = e.target.closest("article");
    const quantityProduct = e.target.closest(".itemQuantity");
    let cart = getCart();
    if (quantityProduct.value <= 0){
        quantityProduct.value = 1;
    }
    if (quantityProduct.value >= 1){
        let findProduct = cart.find(product => product.productId == searchProduct.dataset.id && product.productColor == searchProduct.dataset.color);
        let newQuantity = quantityProduct.value;
        findProduct.productQuantity = newQuantity;
    }
    saveCart(cart);
    reloadPage();
}

/**
 * Removal of products from the basket
 * @param { Object } e 
 */
function removeProduct(e){
    const searchProduct = e.target.closest("article");
    let cart = getCart();
    cart = cart.filter(product => product.productId !== searchProduct.dataset.id || product.productColor !== searchProduct.dataset.color);
    saveCart(cart);
    reloadPage();
}

// Checking the information entered in the form
function checkForm(){
    const form = document.querySelector(".cart__order__form");
    form.firstName.addEventListener("change", () =>{
        validateFirstName();
    })
    form.lastName.addEventListener("change", () =>{
        validateLastName();
    })
    form.address.addEventListener("change", () =>{
        validateAddress();
    })
    form.city.addEventListener("change", () =>{
        validateCity();
    })
    form.email.addEventListener("change", () =>{
        validateEmail();
    })
}

/**
 * Show error message for form field validation
 * @param { HTMLElement } input 
 * @param { String } message 
 */
 function showError(input, message){
    const formField = input;
    formField.innerText = message;
}

/**
 * Show success message for form field validation
 * @param { HTMLElement } input 
 */
function showSuccess(input){
    const formField = input;
    formField.innerText = "";
}
/**
 * Regex to check first and last name
 * @param { HTMLElement } name 
 * @returns { Function(HTMLElement) }
 */
function regexName(name){
    const regex = /^[a-zA-Zé'è`çà¨^ù.\-]{2,25}$/;
    return regex.test(name)
}

// Validation of the data entered for the first name
function validateFirstName(){
    const errorMsgFirstName = document.querySelector("#firstNameErrorMsg");
    if (regexName(firstName.value.trim())){
        showSuccess(errorMsgFirstName)
        return true
    }else{
        showError(errorMsgFirstName, "Veuillez entrer un prénom valide (ex : Jean ou jean-marie)");
        return false
    }
}

// Validation of the data entered for the last name
function validateLastName(){
    const errorMsgLastName = document.querySelector("#lastNameErrorMsg");
    if (regexName(lastName.value.trim())){
        showSuccess(errorMsgLastName);
        return true 
    }else{
        showError(errorMsgLastName, "Veuillez entrer un nom valide (ex : D'arc ou dupont)");
        return false
    }
}

// Validation of the data entered for the address
function validateAddress(){
    const errorMsgAddress = document.querySelector("#addressErrorMsg");
    const regexAddress = /^[a-zA-Zé'è`çà¨^ù.,0-9., \-]{5,75}$/;
     if (regexAddress.test(address.value.trim())){
        showSuccess(errorMsgAddress);
        return true
    }else{
        showError(errorMsgAddress, "Veuillez entrer une adresse valide (ex : 15 bd de la République)");
        return false        
    }
}

// Validation of the data entered for the city
function validateCity(){
    const errorMsgCity = document.querySelector("#cityErrorMsg");
    const regexCity = /^[a-zA-Zé'è`çà¨^ù.\-]{3,30}$/;
    if (regexCity.test(city.value.trim())){
        showSuccess(errorMsgCity);
        return true
    }else{
        showError(errorMsgCity, "Veuillez entrer une ville valide (ex : Paris ou nantes)");
        return false
    }
}

// Validation of the data entered for the email
function validateEmail(){
    const errorMsgEmail = document.querySelector("#emailErrorMsg");
    const regexEmail =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regexEmail.test(email.value.trim())){
        showSuccess(errorMsgEmail);
        return true 
    }else{
        showError(errorMsgEmail, "Veuillez entrer un email valide (ex : monemail@exemple.fr)");
        return false
    }
}

/**
 * Storage of information entered in the form
 * @returns { Object.<Object> }
 */
function storeOrderData(){
    const productId = [];
    if (getCart() != null){
        for (let i = 0; i < getCart().length; i++){
            productId.push(getCart()[i].productId)
        }
    }
    const order = {
            contact:{
                firstName: firstName.value,
                lastName: lastName.value,
                address: address.value,
                city: city.value,
                email: email.value
            },
            products: productId
    }
    return order
}

// Sending the order after checking the data entered by the user
function sendOrderData(){
    const form = document.querySelector(".cart__order__form");
    form.order.addEventListener("click", (e) =>{ 
        e.preventDefault();
        const orderData = storeOrderData();
        if (getCart() === null || getCart() == 0 ){
            alert("Votre panier est vide.");
        }else if (validateFirstName() && validateLastName() && validateAddress() && validateCity() && validateEmail()){
            fetch("http://localhost:3000/api/products/order", {     
                method: "POST",
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json"
                },
                body: JSON.stringify(orderData),  
            })
            .then((res) =>{
                return res.json();
                })
            .then((data) =>{
                localStorage.clear();
                document.location.href = `./confirmation.html?orderId=${data.orderId}`;
            })
            .catch(err => console.log(err))
        }else{
            alert("Le formulaire est incomplet ou invalide.");
        }
    })
}
