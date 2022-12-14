// Global function to call all functions
function main (){
    addProducts();
    addProductsToCart();
  }
  
  main();
  
  // Retrieve the id of the product to display
  function getProductId(){
    return new URL(window.location.href).searchParams.get("id");
  }
  
  // Insert a product and its details in the page product
  function addProducts(){
    fetch(`http://localhost:3000/api/products/${getProductId()}`)
      .then(res => res.json())
      .then(data =>{
        createProducts(data);
      })
      .catch(err =>{
        console.log(err);
        document.querySelector("#title").insertAdjacentText("beforebegin", "Désolé, une erreur vient de survenir. Nous traitons le problème.");
      })
    }
  
  /**
   * Dynamic creation and integration of products in the page product
   * @param { Array.<Object> } api 
   */
  function createProducts(api){
    document.querySelector(".item__img").insertAdjacentHTML("beforeend", `
    <img src="${api.imageUrl}" alt="${api.altTxt}">`);
    document.getElementById("title").insertAdjacentText("beforeend", `${api.name}`);
    document.getElementById("price").insertAdjacentText("beforeend", `${api.price}`);
    document.getElementById("description").insertAdjacentText("beforeend", `${api.description}`);
    let colorOption = "";
    for (let color of api.colors){
      colorOption += `<option value="${color}">${color}</option>`
    }
    document.querySelector("#colors").insertAdjacentHTML("beforeend", colorOption);
  }
  
  // Adding the product or products to cart
  function addProductsToCart(){
    const addToCart = document.getElementById("addToCart");
    addToCart.addEventListener("click", (e) =>{
      const productId = getProductId();
      const productColor = document.querySelector("#colors").value;
      const productQuantity = parseInt(document.getElementById("quantity").value);
      if(productColor == ""){
        alert("SVP, choisissez une couleur.");
        e.preventDefault();
      }else if(productQuantity <= 0 || productQuantity > 100){
        alert("SVP, mettez une quantité valide.");
        e.preventDefault();
      }else{
        const addProduct = {productId, productColor, productQuantity}
        let cart = JSON.parse(localStorage.getItem("products"));
        if(cart == null){
          cart = [];
        }
        let exitCartLoop = 0;
        for(let i = 0; i < cart.length; i++){
          if(cart[i].productId === productId && cart[i].productColor === productColor){
            cart[i].productQuantity += productQuantity;
            exitCartLoop = 1;
          }
        }
        if(exitCartLoop == 0){
          cart.push(addProduct);
        }
        localStorage.setItem("products", JSON.stringify(cart));
        popUpToGoCart();
      }
    })
  }

  // A pop up window to give the possibility to go to the basket
  function popUpToGoCart(){
    if(window.confirm("Le produit a été ajouté au panier. Souhaitez-vous aller au panier ?")){
      window.location.href = "cart.html";
    }
  }