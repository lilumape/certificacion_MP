const express = require("express");
const app = express();
const mercadopago = require("mercadopago");

//REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel/credentials

mercadopago.configure({
  access_token: 'APP_USR-2572771298846850-120119-a50dbddca35ac9b7e15118d47b111b5a-681067803',
   integrator_id: 'dev_24c65fb163bf11ea96500242ac130004'
});

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static("client"));

app.get("/", function (req, res) {
  res.status(200).sendFile("index.html");
}); 

app.post("/create_preference", (req, res) => {

	let preference = {
		items: [{
			id: "1234",
			title: req.body.title,
			description: req.body.description,
			unit_price: Number(req.body.price),
			quantity: 1,
			picture_url: req.body.urlImage
		}],
		back_urls: {
			"success": "https://enigmatic-basin-93479.herokuapp.com/success",
			"failure": "https://enigmatic-basin-93479.herokuapp.com/failure",
			"pending": "https://enigmatic-basin-93479.herokuapp.com/pending"
		},
		auto_return: 'approved',
		external_reference:"lilumape@hotmail.com",
		installments:6,
		notification_url: "https://enigmatic-basin-93479.herokuapp.com/webhook/",
		excluded_payment_methods: [
		  { item:"amex"
			}
		],
		excluded_payment_types: [
		   { item:"atm"
			}
		],
		payer:{
			name: "Lalo Landa",
			email: "test_user_83958037@testuser.com",
			
			phone:{
			area_code:"52",
			number:5549737300
			},
			
			address:{
				street_name:"Insurgentes Sur",
				street_number: 1602,
				zip_code: "03940"
			}
		}
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			console.log(response.body.id)
			
				mercadopago.preferences.get(response.body.id).then(function (response) {
			res.json({id: response.body.id, point: response.body.init_point})
		}).catch(function (error) {
			console.log("Error al get: "+error);
	
		});
		}).catch(function (error) {
			console.log("Error al crear la preferencia: "+error);
			res.json({error: error})
		});
		
	
		
		
		
});

app.get('/failure', function(request, response) {
	 response.json({response: "Failed"})
});

app.get('/success', function(request, response) {
	 response.json({payment_method_id:request.query.payment_type, 
				external_reference:request.query.external_reference,
				payment_id: request.query.payment_id
				})
});

app.get('/pending', function(request, response) {
	 response.json({response: "Pending"})
});

app.post('/webhook/', function(request, response) {
	 console.log(request.query)
});

var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("The server is now running on Port "+port);
});
