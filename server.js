var express     =   require("express");
var app         =   express();
var bodyParser  =   require("body-parser");
var router      =   express.Router();

var Uber = require('node-uber');

var uber = new Uber({
  client_id: 'V7tiJWOdbhDzTBcs3KO1T6iNHBgXH-vN',
  client_secret: 'zG3f_CGOaxZQT2QUQLSaS6m5cPpfsu8DDgpUXeaB',
  server_token: 'MJmghWzWtYIfXC6dxxpxvhpwFvFJNiogpSTXAR56',
  redirect_uri: 'http://localhost:3000',
  name: 'A2BAPP',
  language: 'pt_BR',
  sandbox: true
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({"extended" : false}));

router.get("/",function(req,res){
    res.json({"error" : false,"message" : "Hello World"});
});

app.get('/api/login', function(request, response) {
  var url = uber.getAuthorizeUrl(['history','profile', 'request', 'places']);
  response.redirect(url);
});

app.get('/api/callback', function(request, response) {
   uber.authorizationAsync({authorization_code: request.query.code})
   .spread(function(access_token, refresh_token, authorizedScopes, tokenExpiration) {
     // store the user id and associated access_token, refresh_token, scopes and token expiration date
     console.log('New access_token retrieved: ' + access_token);
     console.log('... token allows access to scopes: ' + authorizedScopes);
     console.log('... token is valid until: ' + tokenExpiration);
     console.log('... after token expiration, re-authorize using refresh_token: ' + refresh_token);

     // redirect the user back to your actual app
     response.redirect('/web/index.html');
   })
   .error(function(err) {
     console.error(err);
   });
});

app.get('/api/products', function(request, response) {
  // extract the query from the request URL
  var query = url.parse(request.url, true).query;

  // if no query params sent, respond with Bad Request
  if (!query || !query.lat || !query.lng) {
    response.sendStatus(400);
  } else {
    uber.products.getAllForLocationAsync(query.lat, query.lng)
    .then(function(res) {
        response.json(res);
    })
    .error(function(err) {
      console.error(err);
      response.sendStatus(500);
    });
  }
});

app.use('/',router);

app.listen(3000);
console.log("Listening to PORT 3000");
