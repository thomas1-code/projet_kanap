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

