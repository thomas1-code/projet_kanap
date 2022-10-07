// Insert products in the homepage
function addProducts(){
    fetch("http://localhost:3000/api/products/")
      .then(res => res.json())
      .then(data =>{
        createProducts(data);
      })
      .catch(err =>{
        console.log(err);
        document.getElementById("items").innerText = "Désolé, une erreur vient de survenir. Nous traitons le problème.";
      })
    }
    
  addProducts();
  
  /**
   * Dynamic creation of products in the homepage
   * @param { Array.<Object> } api
   */
  function createProducts(api){
    for(let result of api){
      const productCard = `
      <a href="./product.html?id=${result._id}">
        <article>
          <img src="${result.imageUrl}" alt="${result.altTxt}">
          <h3 class="productName">${result.name}</h3>
          <p class="productDescription">${result.description}</p>
        </article>
      </a>`;
      document.querySelector("#items").insertAdjacentHTML("beforeend", productCard);
    }
  }