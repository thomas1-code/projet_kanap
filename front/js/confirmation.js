// Retrieve the order number
function getProductId(){
    return new URL(location.href).searchParams.get("orderId");
  }

// Display the order number
function showOrderValidation(){
  document.querySelector("#orderId").innerHTML = getProductId();
}

showOrderValidation();