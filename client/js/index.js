//Handle call to backend and generate preference.
document.getElementById("checkout-btn").addEventListener("click", function() {

  $('#checkout-btn').attr("disabled", true);
  
  var orderData = {
    quantity: document.getElementById("quantity").value,
    description: document.getElementById("product-description").innerHTML,
    price: document.getElementById("unit-price").innerHTML,
	title: document.getElementById("product-title").innerHTML,
	urlImage: "https://enigmatic-basin-93479.herokuapp.com/img/product.png"
  };
    
  fetch("/create_preference", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
    })
      .then(function(response) {
          return response.json();
      })
      .then(function(preference) {
		  console.log(preference)
          createCheckoutButton(preference.id, preference.point);
          $(".shopping-cart").fadeOut(500);
          setTimeout(() => {
              $(".container_payment").show(500).fadeIn();
          }, 500);
      })
      .catch(function() {
          alert("Unexpected error");
          $('#checkout-btn').attr("disabled", false);
      });
});

//Create preference when click on checkout button
function createCheckoutButton(preference, point) {
	
  var link = document.getElementById("init_point");
  link.setAttribute("href", point);
 /* var script = document.createElement("script");
  console.log(preference)
  // The source domain must be completed according to the site for which you are integrating.
  // For example: for Argentina ".com.ar" or for Brazil ".com.br".
  script.src = "https://www.mercadopago.com.co/integrations/v1/web-payment-checkout.js";
  script.type = "text/javascript";
  script.dataset.preferenceId = preference;
  document.getElementById("button-checkout").innerHTML = "";
  document.querySelector("#button-checkout").appendChild(script);*/
  // Agrega credenciales de SDK
  const mp = new MercadoPago('APP_USR-a98b17ae-47a6-4a35-b92d-01919002b97e', {
        locale: 'es-CO'
  });

  // Inicializa el checkout
  mp.checkout({
      preference: {
          id: preference
      },
	  // autoOpen: true
      /*render: {
            container: '.button-checkout', // Indica dónde se mostrará el botón de pago
            label: 'Pagar', // Cambia el texto del botón de pago (opcional)
      }*/
});
}

//Handle price update
function updatePrice() {
  let quantity = document.getElementById("quantity").value;
  let unitPrice = document.getElementById("unit-price").innerHTML;
  let amount = parseInt(unitPrice) * parseInt(quantity);

  document.getElementById("cart-total").innerHTML = "$ " + amount;
  document.getElementById("summary-price").innerHTML = "$ " + unitPrice;
  document.getElementById("summary-quantity").innerHTML = quantity;
  document.getElementById("summary-total").innerHTML = "$ " + amount;
}
document.getElementById("quantity").addEventListener("change", updatePrice);
updatePrice();  

//go back
document.getElementById("go-back").addEventListener("click", function() {
  $(".container_payment").fadeOut(500);
  setTimeout(() => {
      $(".shopping-cart").show(500).fadeIn();
  }, 500);
  $('#checkout-btn').attr("disabled", false);  
});