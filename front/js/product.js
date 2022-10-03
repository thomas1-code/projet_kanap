// Global function to call all functions
function main (){
    requestIdFetch();
    addCart();
  }
  
  main();
  
  // Retrieve product id to display
  function getProductId(){
    return new URL(window.location.href).searchParams.get("id");
  }
  
  // Send a request using the fecth api to retrieve information from a product
  function requestIdFetch(){
    fetch(`http://localhost:3000/api/products/${getProductId()}`)
      .then(res => res.json())
      .then(data =>{
        creationOfElements(data);
      })
      .catch(err => console.log(err))
    }
  
  /**
   * Dynamic creation and integration of elements in the product.html page
   * @param { (String | Array | Integer) } api 
   */
  function creationOfElements(api){
    document.querySelector(".item__img").insertAdjacentHTML("beforeend", `
    <img src="${api.imageUrl}" alt="${api.altTxt}">`);
    document.getElementById("title").insertAdjacentText("beforeend", `${api.name}`);
    document.getElementById("price").insertAdjacentText("beforeend", `${api.price}`);
    document.getElementById("description").insertAdjacentText("beforeend", `${api.description}`);
    for (let color of api.colors){
    document.querySelector("#colors").insertAdjacentHTML("beforeend", `
    <option value="${color}">${color}</option>`);
    }
  }
  
  // Adding the product or products to the local storage
  function addCart(){
    const addToCart = document.getElementById("addToCart");
    addToCart.addEventListener("click", (e) =>{
      const productId = getProductId();
      const productColor = document.querySelector("#colors").value;
      const productQuantity = parseInt(document.getElementById("quantity").value);
      if (productColor == ""){
        alert("SVP, choisissez une couleur.");
        e.preventDefault();
      }else if (productQuantity <= 0 || productQuantity > 100){
        alert("SVP, mettez une quantité valide.");
        e.preventDefault();
      }else{
        let addProduct = {productId, productColor, productQuantity}
        let cart = JSON.parse(localStorage.getItem("products"));
        if (cart == null){
          cart = [];
        }
        let exitProductLoop = 0;
        for (let i = 0; i < cart.length; i++){
          if (cart[i].productId === productId && cart[i].productColor === productColor){
            cart[i].productQuantity += productQuantity;
            exitProductLoop = 1;
          }
        }
        if(exitProductLoop == 0){
          cart.push(addProduct);
        }
        localStorage.setItem("products", JSON.stringify(cart));
        popUpToGoCart();
      }
    })
  }

  // A pop up window to give the possibility to go to the basket
  function popUpToGoCart (){
    if(window.confirm("Le produit a été ajouté au panier. Souhaitez-vous aller au panier ?")){
      window.location.href = "cart.html";
    }
  }