// Recovery of the basket contained in local storage
function getCart(){
    return JSON.parse(localStorage.getItem("products"));
}

// 
/**
 * Send a request using the fecth api to retrieve information from a product
 * @param { (String | Array | Integer) } localStorage 
 */
function requestIdFetch(localStorage,){
    const urlApi = "http://localhost:3000/api/products/" + localStorage.productId;
    console.log(urlApi);
    fetch(urlApi)
        .then(function(res){
            if (res.ok){
                return res.json();
        }
        })
        .then(function(data){
            creationOfElements(localStorage, data);
        })
        .catch(function(err){
            console.log(err);
        })
}

/**
 * Dynamic creation of cart elements
 * @param { (String | Array | Integer) } localStorage 
 * @param { (String | Array | Integer) } api
 */
 function creationOfElements(localStorage, api){
    const elementsCart = `
        <article class="cart__item" data-id="${localStorage.productId}" data-color="${localStorage.productColor}">
            <div class="cart__item__img">
                <img src="${api.imageUrl}" alt="${api.altTxt}">
            </div>
            <div class="cart__item__content">
                <div class="cart__item__content__description">
                <h2>${api.name}</h2>
                <p>${localStorage.productColor}</p>
                <p>${api.price} €</p>
                </div>
                <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                    <p>Qté : ${localStorage.productQuantity}</p>
                    <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${localStorage.productQuantity}">
                </div>
                <div class="cart__item__content__settings__delete">
                    <p class="deleteItem">Supprimer</p>
                </div>
                </div>
            </div>
        </article>`;
        document.querySelector("#cart__items").insertAdjacentHTML("beforeend", elementsCart);
        addTotalQuantity(localStorage);
        addTotalPrice(localStorage, api);
}

// Save basket quantity
const saveCartQuantity = [];

// Calculation of total quantity
function addTotalQuantity(local){
    saveCartQuantity.push(local.productQuantity * 1);
    const reducer = (previousValue, currentValue) => previousValue + currentValue;
    const totalQuantity = saveCartQuantity.reduce(reducer);
    document.querySelector("#totalQuantity").innerHTML = `${totalQuantity}`;
}
// Save basket prices
const saveCartPrice = [];

// Calculation of the total 
function addTotalPrice(local, api){
    saveCartPrice.push(local.productQuantity * api.price);
    const reducer = (previousValue, currentValue) => previousValue + currentValue;
    const totalPrice = saveCartPrice.reduce(reducer);
    document.querySelector("#totalPrice").innerHTML = `${totalPrice}`;
}

// Dynamic integration of elements in the basket
function addElements(){
    if (getCart() === null){
        document.querySelector("#cartAndFormContainer > h1").insertAdjacentText("beforeend", " est vide");
    }else{
        for (let i = 0; i < getCart().length; i++){
            requestIdFetch(getCart()[i]);
        }
        setTimeout(() => {changeProductQuantity()}, 1000);
        // changeProductQuantity();
    }
}

addElements();

// Save the cart in the localStorage
function saveCart(cart){
    return localStorage.setItem("products", JSON.stringify(cart));
}

// Change the quantity of the product in the basket
function changeProductQuantity(){
    const changeQuantitys = document.querySelectorAll(".itemQuantity");
    console.log(changeQuantitys);
    changeQuantitys.forEach(changeQuantity => 
        changeQuantity.addEventListener("change", (e) => {
            const searchProduct = e.target.closest("article");
            const quantityProduct = e.target.closest(".itemQuantity");
            let cart = getCart();
            if (quantityProduct.value <= 0){
                quantityProduct.value = 1;
                saveCart(cart);
            }else{
                let findProduct = cart.find(product => product.productId == searchProduct.dataset.id && product.productColor == searchProduct.dataset.color);
                let newQuantity = changeQuantity.value;
                findProduct.productQuantity = newQuantity;
                console.log(findProduct);
                saveCart(cart);
            }
    }));
}
