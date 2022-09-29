// Recovery of the basket contained in local storage
function getCart(){
    return JSON.parse(localStorage.getItem("products"));
}

// Adding user selected items to cart
function addItemsToCart(){
    if (getCart() === null || getCart() == 0){
        document.querySelector("#cartAndFormContainer > h1").insertAdjacentText("beforeend", " est vide");
    }else{
        for (let i = 0; i < getCart().length; i++){
            fetch("http://localhost:3000/api/products/" + getCart()[i].productId)
                .then(res => res.json())
                .then(api =>{
                    const elementsCart = `
                    <article class="cart__item" data-id="${getCart()[i].productId}" data-color="${getCart()[i].productColor}">
                        <div class="cart__item__img">
                            <img src="${api.imageUrl}" alt="${api.altTxt}">
                        </div>
                        <div class="cart__item__content">
                            <div class="cart__item__content__description">
                            <h2>${api.name}</h2>
                            <p>${getCart()[i].productColor}</p>
                            <p>${api.price} €</p>
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
                    const changeQuantity = document.querySelectorAll(".itemQuantity");
                    for (let change of changeQuantity) {
                        change.addEventListener("change", (e) =>{
                            changeProductQuantity(e);
                        })
                    }
                    const removeBtn = document.querySelectorAll(".deleteItem");
                    for (let remove of removeBtn){
                        remove.addEventListener("click", (e) =>{
                            removeProduct(e);
                        })
                    }
                })
                .catch(err => console.log(err))
        }
    }
}

addItemsToCart();

// Calculation of total quantity
function addTotalQuantity(){
    let quantityTotal = 0;
    if (getCart() != null){
        for (let i = 0 ; i < getCart().length; i++){
            quantityTotal += getCart()[i].productQuantity * 1;
        }
        document.querySelector("#totalQuantity").innerHTML = quantityTotal;
    }
}

addTotalQuantity();

// Calculation of the total price
function addTotalPrice(){
    let totalPrice = 0;
    if (getCart() != null){
        for (let i = 0; i < getCart().length; i++){
            fetch("http://localhost:3000/api/products/" + getCart()[i].productId)
                .then(res => res.json())
                .then(data =>{
                totalPrice += getCart()[i].productQuantity * data.price;
                document.querySelector("#totalPrice").innerHTML = totalPrice;
                })
                .catch(err => console.log(err))
        }
    }
}

addTotalPrice();

// Save the cart in the localStorage
function saveCart(cart){
    return localStorage.setItem("products", JSON.stringify(cart));
}

// Reloading the resource from the current URL
function reloadPage(){
    return window.location.reload()
}

// Change the quantity of the product in the basket
function changeProductQuantity(e){
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
        console.log(findProduct);
    }
    saveCart(cart);
    reloadPage();
}

// Removal of products from the basket
function removeProduct(e){
    const searchProduct = e.target.closest("article");
    let cart = getCart();
    cart = cart.filter(product => product.productId !== searchProduct.dataset.id || product.productColor !== searchProduct.dataset.color);
    saveCart(cart);
    reloadPage();
}

// Checking the information entered in the form
function validationInput(){
    const input = document.querySelector(".cart__order__form");
    input.firstName.addEventListener("change", function (){
        validateFirstName(this);
    })
    input.lastName.addEventListener("change", function (){
        validateLastName(this);
    })
    input.address.addEventListener("change", function (){
        validateAddress(this);
    })
    input.city.addEventListener("change", function (){
        validateCity(this);
    })
    input.email.addEventListener("change", function (){
        validateEmail(this);
    })
}

validationInput();

/**
 * Validation of the data entered for the first name
 * @param {(String)} inputFirstName 
 * @returns 
 */
function validateFirstName(inputFirstName){
    const errorMsgFirstName = document.querySelector("#firstNameErrorMsg");
    const regexName = new RegExp("^[a-zA-Zé'è`çà¨^ù.\-]{2,25}$");
    if (regexName.test(inputFirstName.value)){
        errorMsgFirstName.innerText = "";
        return true
    }else{
        errorMsgFirstName.innerText = "Veuillez entrer un prénom valide (ex : Jean ou jean-marie)";
        return false
    }
}

/**
 * Validation of the data entered for the last name
 * @param { (String) } inputLastName 
 * @returns 
 */
function validateLastName(inputLastName){
    const errorMsgLastName = document.querySelector("#lastNameErrorMsg");
    const regexName = new RegExp("^[a-zA-Zé'è`çà¨^ù.\-]{2,25}$");
    if (regexName.test(inputLastName.value)){
        errorMsgLastName.innerText = "";
        return true 
    }else{
        errorMsgLastName.innerText = "Veuillez entrer un nom valide (ex : D'arc ou dupont)";
        return false
    }
}

/**
 * Validation of the data entered for the address
 * @param { ((String)) } inputAddress
 * @returns 
 */
function validateAddress(inputAddress){
    const errorMsgAddress = document.querySelector("#addressErrorMsg");
    const regexAddress = new RegExp("^[a-zA-Zé'è`çà¨^ù.,0-9., \-]{5,75}$");
     if (regexAddress.test(inputAddress.value)){
        errorMsgAddress.innerText = "";
        return true
    }else{
        errorMsgAddress.innerText = "Veuillez entrer une adresse valide (ex : 15 bd de la République)";
        return false        
    }
}

/**
 * Validation of the data entered for the city
 * @param { (String | Integer) } inputCity 
 * @returns 
 */
function validateCity(inputCity){
    const errorMsgCity = document.querySelector("#cityErrorMsg");
    const regexCity = new RegExp("^[a-zA-Zé'è`çà¨^ù.\-]{3,30}$");
    if (regexCity.test(inputCity.value)){
        errorMsgCity.innerText = "";
        return true
    }else{
        errorMsgCity.innerText = "Veuillez entrer une ville valide (ex : Paris ou nantes)";
        return false
    }
}

/**
 * Validation of the data entered for the email
 * @param { (String | Integer) } inputEmail 
 * @returns 
 */
function validateEmail(inputEmail){
    const errorMsgEmail = document.querySelector("#emailErrorMsg");
    const regexEmail =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regexEmail.test(inputEmail.value)){
        errorMsgEmail.innerText = "";
        return true 
    }else{
        errorMsgEmail.innerText = "Veuillez entrer un email valide (ex : monemail@exemple.fr)";
        return false
    }
}

// Storage of information entered in the form
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
    const input = document.querySelector(".cart__order__form");
    input.order.addEventListener("click", (e) =>{ 
        e.preventDefault();
        let orderData = storeOrderData();
        if (getCart() === null || getCart() == 0 ){
            console.log("rien dans le panier");
        
        }else if (validateFirstName(input.firstName) && validateLastName(input.lastName) && validateAddress(input.address) && validateCity(input.city) && validateEmail(input.email)){
            console.log("formulaire valide");
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
                console.log(data);
                // localStorage.clear();
            })
            .catch(err => console.log(err))
            // input.order.submit();
        }else{
            e.preventDefault();
            alert("Veuillez compléter le formulaire");
            console.log("le formulaire");
        }
    })
}

sendOrderData();