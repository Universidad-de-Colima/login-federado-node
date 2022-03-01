const fs = require('fs');
const express = require("express");
const session = require('express-session');
const passport = require('passport');
const saml = require('passport-saml');
const cors = require('cors');

const app = express();

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

const samlStrategy = new saml.Strategy({
  callbackUrl: "http://localhost:4006/login/callback",
  entryPoint: "https://wayf.ucol.mx/saml2/idp/SSOService.php",
  logoutUrl: 'https://wayf.ucol.mx/saml2/idp/SingleLogoutService.php',
  logoutCallbackUrl: 'http://localhost:4006/logout/callback',
  issuer: "http://localhost/20166932",
  decryptionPvk: fs.readFileSync(__dirname + '/cert/key.pem', 'utf8'),
  cert: fs.readFileSync(__dirname + '/cert/idp.crt', 'utf8')
}, (profile, done)=>{ const user= Object.assign({},profile); return done(null, profile)} );

app.use(session({
  secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
  saveUninitialized: true,
  resave: true
  
}));

passport.use(samlStrategy);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

app.get('/', (req, res) => res.redirect('/login'));

app.get('/login', passport.authenticate('saml', { failureRedirect: '/login/fail', failureFlash: true}), (req, res) => res.redirect('/'));

app.post('/login/callback', passport.authenticate('saml', { 
  failureRedirect: '/login/fail',
  failureFlash: true
}), (req,res) => {
  // const uCorreo = req.user?.uCorreo;
  // const uNombre = req.user?.uNombre;
  // const uDependencia = req.user?.uDependencia;
  // const uCuenta = req.user?.uCuenta;
  // const uTrabajador = req.user?.uTrabajador;
  // const uTipo = req.user?.uTipo;
  // const cn = req.user?.cn;
  // const sn = req.user?.sn;
  // const displayName = req.user?.displayName;
  // const givenName = req.user?.givenName;
  res.send(req.user);
}
  );

  app.get('/logout', (req, res)=> {
       
    if (!req.user) res.redirect('/');
    
    samlStrategy.logout(req, (err, request) =>{
      return res.redirect(request)
    });
   });

   app.post('/logout/callback', (req, res) =>{
    req.logout();
    res.redirect('/');
  });

app.get('/login/fail', (req, res) => res.status(401).send('Login failed'));

app.get('/Metadata', (req, res) => {
    res.type('application/xml');
    res.status(200).send(samlStrategy.generateServiceProviderMetadata(fs.readFileSync(__dirname + '/cert/cert.pem', 'utf8')));
  }
);

//general error handler
app.use((err, req, res, next) => {
  console.log("Fatal error: " + JSON.stringify(err));
  next(err);
});

const server = app.listen(4006, () => console.log('Listening on port %d', server.address().port));