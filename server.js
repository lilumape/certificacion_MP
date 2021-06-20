const express = require("express");
const app = express();
const mercadopago = require("mercadopago");

//REPLACE WITH YOUR ACCESS TOKEN AVAILABLE IN: https://developers.mercadopago.com/panel/credentials
mercadopago.configurations.setAccessToken("APP_USR-7196843313941943-061921-bf6e8b7041f4452a6a4566018427e672-778307235"); 

mercadopago.configure({
  access_token: 'APP_USR-7196843313941943-061921-bf6e8b7041f4452a6a4566018427e672-778307235'
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
			title: req.body.description,
			unit_price: Number(req.body.price),
			quantity: Number(req.body.quantity),
			auto_return:"https://enigmatic-basin-93479.herokuapp.com/",
			external_reference:"12334"
		}],
		back_urls: {
			"success": "https://enigmatic-basin-93479.herokuapp.com/webhook",
			"failure": "https://enigmatic-basin-93479.herokuapp.com/webhook",
			"pending": "https://enigmatic-basin-93479.herokuapp.com/webhook"
		},
		auto_return: 'approved',
	};

	mercadopago.preferences.create(preference)
		.then(function (response) {
			res.json({id :response.body.id})
			global.id = response.body.id;
			console.log(response.body.id)
		}).catch(function (error) {
			console.log(error);
		});
});

app.get('/webhook', function(request, response) {
	 response.json(request.query)
});


var port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("The server is now running on Port "+port);
});
