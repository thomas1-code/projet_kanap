// Send a request using the api fecth to retrieve product information
function requestFetch(){
    fetch("http://localhost:3000/api/products/")
      .then(res => res.json())
      .then(data =>{
        creationOfElements(data);
      })
      .catch(err =>{
        console.log(err);
        document.getElementById("items").innerText = "Désolé, une erreur vient de survenir. Nous traitons le problème.";
      })
    }
    
  requestFetch();
  
  /**
   * Dynamic creation of elements in the index.html page
   * @param { Array.<Object> } resultsApi 
   */
  function creationOfElements(resultsApi){
    for (let result of resultsApi){
      const elementsCard = `
      <a href="./product.html?id=${result._id}">
        <article>
          <img src="${result.imageUrl}" alt="${result.altTxt}">
          <h3 class="productName">${result.name}</h3>
          <p class="productDescription">${result.description}</p>
        </article>
      </a>`;
      document.querySelector("#items").insertAdjacentHTML("beforeend", elementsCard);
    }
  }