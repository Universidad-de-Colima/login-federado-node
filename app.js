var http = require('http');
var fs = require('fs');
var express = require("express");
var dotenv = require('dotenv');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var saml = require('passport-saml');

dotenv.load();

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

var samlStrategy = new saml.Strategy({
  // URL that goes from the Identity Provider -> Service Provider
  callbackUrl: "http://localhost:4006/login/callback",
  // URL that goes from the Service Provider -> Identity Provider
  entryPoint: "https://wayf.ucol.mx/saml2/idp/SSOService.php",
  // Usually specified as `/shibboleth` from site root
  issuer: "http://localhost/20166932",
  // Service Provider private key
  decryptionPvk: fs.readFileSync(__dirname + '/cert/key.pem', 'utf8'),
  // Service Provider Certificate
  privateCert: fs.readFileSync(__dirname + '/cert/key.pem', 'utf8'),
  // Identity Provider's public key
  cert: fs.readFileSync(__dirname + '/cert/idp.crt', 'utf8')
}, function(profile, done) {
  return done(null, profile); 
});

passport.use(samlStrategy);

var app = express();

app.use(cookieParser());
app.use(bodyParser());
app.use(passport.initialize());
app.use(passport.session());

function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated())
    return next();
  else
    return res.redirect('/login');
}

app.get('/',
  ensureAuthenticated, 
  function(req, res) {
    res.send('Authenticated');
  }
);
6
app.get('/login',
passport.authenticate('saml', { failureRedirect: '/login/fail' }),
function (req, res) {
  res.redirect('/');
}
);

app.post('/login/callback',
  function (req, res,next) {
    next();
  },
    passport.authenticate('saml', { 
      failureRedirect: '/login/fail',
      session:false 
    }),
    (req,res) => {
      const uCorreo = req.user?.uCorreo;
      const uNombre = req.user?.uNombre;
      const uDependencia = req.user?.uDependencia;
      const uCuenta = req.user?.uCuenta;
      const uTrabajador = req.user?.uTrabajador;
      const uTipo = req.user?.uTipo;
      const cn = req.user?.cn;
      const sn = req.user?.sn;
      const displayName = req.user?.displayName;
      const givenName = req.user?.givenName;


      res.send({uCorreo, uNombre, uDependencia, uCuenta, uTrabajador, uTipo, cn, sn, displayName, givenName});
    }
  );


app.get('/login/fail', 
  function(req, res) {
    res.status(401).send('Login failed');
  }
);

app.get('/Metadata', 
  function(req, res) {
    res.type('application/xml');
    res.status(200).send(samlStrategy.generateServiceProviderMetadata(fs.readFileSync(__dirname + '/cert/cert.pem', 'utf8')));
  }
);

//general error handler
app.use(function(err, req, res, next) {
  console.log("Fatal error: " + JSON.stringify(err));
  next(err);
});

var server = app.listen(4006, function () {
  console.log('Listening on port %d', server.address().port)
});

