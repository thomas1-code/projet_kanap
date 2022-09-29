// 
function getProductId(){
    return new URL(location.href).searchParams.get("orderId");
  }

// 
function showOrderValidation(){
  document.querySelector("#orderId").innerHTML = getProductId();
}

showOrderValidation();