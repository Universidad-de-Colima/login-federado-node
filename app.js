const fs = require('fs');
const express = require("express");
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const saml = require('passport-saml');
const cors = require('cors');

const app = express();

passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

const samlStrategy = new saml.Strategy({
  // URL that goes from the Identity Provider -> Service Provider
  callbackUrl: "http://localhost:4006/login/callback",
  // URL that goes from the Service Provider -> Identity Provider
  entryPoint: "https://wayf.ucol.mx/saml2/idp/SSOService.php",
  //URL de Logout de la UDC
  logoutUrl: 'https://wayf.ucol.mx/saml2/idp/SingleLogoutService.php',
  logoutCallbackUrl: 'http://localhost:4006/logout/callback',
  // Usually specified as `/shibboleth` from site root
  issuer: "http://localhost/20166932",
  // Service Provider private key
  decryptionPvk: fs.readFileSync(__dirname + '/cert/key.pem', 'utf8'),
  // Service Provider Certificate
  privateCert: fs.readFileSync(__dirname + '/cert/key.pem', 'utf8'),
  // Identity Provider's public key
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
app.use(cookieParser());
app.use(cors());


// const ensureAuthenticated=(req, res, next) => {
//   if (req.isAuthenticated())
//     return next();
//   else
//     return res.redirect('/login');
// }

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
    
    console.log(req.user)
   
    // IdPでのSSOログアウトを実施
    samlStrategy.logout(req, (err, request) =>{
      console.log(err)
     if (!err) {
       
      return res.redirect(request);
     }
    });
   });

   app.get('/logout/callback', (req, res) =>{
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