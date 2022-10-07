// Retrieve the order number
function getOrderNumber(){
    return new URL(location.href).searchParams.get("orderId");
  }

// Display the order number
function showOrderValidation(){
  document.querySelector("#orderId").innerHTML = getOrderNumber();
}

showOrderValidation();