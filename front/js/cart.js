// Global function to call all functions
function main(){
    addProducts();
    checkForm(); 
    sendOrderData();
}

main();

// Recovery of the basket contained in local storage
function getCart(){
    return JSON.parse(localStorage.getItem("products"));
}

// Display a summary table of purchases in the Cart page
function addProducts(){
    let totalQuantity = 0;
    let totalPrice = 0;
    if (getCart() == null || getCart() == 0){
        document.querySelector("#cartAndFormContainer > h1").insertAdjacentText("beforeend", " est vide");
    }else{
        for (let i = 0; i < getCart().length; i++){
            fetch("http://localhost:3000/api/products/" + getCart()[i].productId)
                .then(res => res.json())
                .then(data =>{
                    createProducts(getCart()[i], data);
                    totalQuantity += getCart()[i].productQuantity * 1;
                    document.querySelector("#totalQuantity").innerHTML = totalQuantity;
                    totalPrice += getCart()[i].productQuantity * data.price;
                    document.querySelector("#totalPrice").innerHTML = totalPrice;
                    changeProductQuantity();
                    removeProduct();
                })
                .catch(err => console.log(err))
        }
    }
}

/**
 * Dynamic creation of items in the page cart
 * @param { Array.<Object> } local 
 * @param { Array.<Object> } api 
 */
function createProducts(local, api){
    const productCard = `
    <article class="cart__item" data-id="${local.productId}" data-color="${local.productColor}">
        <div class="cart__item__img">
            <img src="${api.imageUrl}" alt="${api.altTxt}">
        </div>
        <div class="cart__item__content">
            <div class="cart__item__content__description">
            <h2>${api.name}</h2>
            <p>${local.productColor}</p>
            <p>${api.price} €</p>
            </div>
            <div class="cart__item__content__settings">
            <div class="cart__item__content__settings__quantity">
                <p>Qté : ${local.productQuantity}</p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${local.productQuantity}">
            </div>
            <div class="cart__item__content__settings__delete">
                <p class="deleteItem">Supprimer</p>
            </div>
            </div>
        </div>
    </article>`;
    document.querySelector("#cart__items").insertAdjacentHTML("beforeend", productCard);
}

/**
 * Save the cart in the localStorage
 * @param { Array.<Object> } cart 
 * @returns { Array.<Object> }
 */
function saveCart(cart){
    return localStorage.setItem("products", JSON.stringify(cart));
}

// Reloading the page from the current URL
function reloadPage(){
    return window.location.reload()
}

// Manage the modification of products in the cart page
function changeProductQuantity(){
    const itemQuantitys = document.querySelectorAll(".itemQuantity");
    itemQuantitys.forEach(itemQuantity =>{
        itemQuantity.addEventListener("change", (e) => {
            const targetProduct = e.target.closest("article");
            const targetProductQuantity = e.target.closest(".itemQuantity");
            let cart = getCart();
            if (targetProductQuantity.value <= 0 || targetProductQuantity.value > 100){
                targetProductQuantity.value = 1;
            }
            if (targetProductQuantity.value >= 1){
                let findProduct = cart.find(product => product.productId == targetProduct.dataset.id && product.productColor == targetProduct.dataset.color);
                let newProductQuantiy = targetProductQuantity.value;
                findProduct.productQuantity = newProductQuantiy;
            }
            saveCart(cart);
            reloadPage();
        })
    })
}

// Manage the deletion products in the cart page
function removeProduct(){
    const deleteItems = document.querySelectorAll(".deleteItem");
    deleteItems.forEach(deleteItem =>{
        deleteItem.addEventListener("click", (e) =>{
            const targetProduct = e.target.closest("article");
            let cart = getCart();
            cart = cart.filter(product => product.productId !== targetProduct.dataset.id || product.productColor !== targetProduct.dataset.color);
            saveCart(cart);
            reloadPage();
        })
    })
}

// Retrieve and analyze the data entered by the user in the form
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
    const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
    if (regexName(firstName.value.trim())){
        showSuccess(firstNameErrorMsg)
        return true
    }else{
        showError(firstNameErrorMsg, "Veuillez entrer un prénom valide (ex : Jean ou jean-marie)");
        return false
    }
}

// Validation of the data entered for the last name
function validateLastName(){
    const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
    if (regexName(lastName.value.trim())){
        showSuccess(lastNameErrorMsg);
        return true 
    }else{
        showError(lastNameErrorMsg, "Veuillez entrer un nom valide (ex : D'arc ou dupont)");
        return false
    }
}

// Validation of the data entered for the address
function validateAddress(){
    const addressErrorMsg = document.querySelector("#addressErrorMsg");
    const regexAddress = /^[a-zA-Zé'è`çà¨^ù.,0-9., \-]{5,75}$/;
     if (regexAddress.test(address.value.trim())){
        showSuccess(addressErrorMsg);
        return true
    }else{
        showError(addressErrorMsg, "Veuillez entrer une adresse valide (ex : 15 bd de la République)");
        return false        
    }
}

// Validation of the data entered for the city
function validateCity(){
    const cityErrorMsg = document.querySelector("#cityErrorMsg");
    const regexCity = /^[a-zA-Zé'è`çà¨^ù.\-]{3,30}$/;
    if (regexCity.test(city.value.trim())){
        showSuccess(cityErrorMsg);
        return true
    }else{
        showError(cityErrorMsg, "Veuillez entrer une ville valide (ex : Paris ou toulouse)");
        return false
    }
}

// Validation of the data entered for the email
function validateEmail(){
    const emailErrorMsg = document.querySelector("#emailErrorMsg");
    const regexEmail =  /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regexEmail.test(email.value.trim())){
        showSuccess(emailErrorMsg);
        return true 
    }else{
        showError(emailErrorMsg, "Veuillez entrer un email valide (ex : monemail@exemple.fr)");
        return false
    }
}

/**
 * Storage of the information entered in the form and the id of the products contained in the basket
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
