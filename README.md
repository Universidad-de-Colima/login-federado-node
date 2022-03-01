# Demo login federado con node

Este es un demo del login de la federación hecho con entorno JS

[passport](https://github.com/node-saml/passport-saml) es un middleware de autenticación para Node.js, se puede colocar en
cualquier aplicación web basada en Express, admite la autenticación mediante un
nombre de usuario y contraseña, facebook, twitter, entre otros.

**Dependencias requeridas:**

```powershell
npm i passport

npm i passport-saml

npm i express

npm i cookie-parser

npm i express-session

npm i cors
```

Se realiza la instanciación de las dependencias:

``` javascript
const fs = require('fs');

const express = require("express");

const cookieParser = require('cookie-parser');

const session = require('express-session');

const passport = require('passport');

const saml = require('passport-saml');

const cors = require('cors');
```

**Configuración de nuestro middleware con nuestra configuración del proveedor de
identidad**:

*callbackUrl*: Es la URL absoluta del proveedor de servicios (su aplicación) que
consumirá la respuesta SAML una vez que se realice la autenticación del
proveedor de identidad.


*issuer*: cadena proporcionada al proveedor de identidad para identificar de forma
única al proveedor de servicios (entityID)

*privateCert*: certificado de proveedor de servicios

*decryptionPvk*: clave privada para intentar descifrar cualquier aserción cifrada
que se reciba

Tanto el decryptionPvk como el privateCert se obtiene con el siguiente comando

```powershell
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -days 900
```

*entryPoint*: Es la URL proporcionada por el proveedor de identidad que se utiliza
para redirigir a los usuarios en la página de inicio de sesión si no están
autenticados. se obtiene en la parte del SingleSignOnService
![Image text](https://github.com/Universidad-de-Colima/login-federado-node/blob/main/images/09c851be-3cb3-4322-bacc-bf4f369fc164.jpg)

*cert*: Es el certificado proporcionado por el proveedor de identidad, para poder
establecer la confianza entre el proveedor de identidad y el proveedor de
servicios.

![Image text](https://github.com/Universidad-de-Colima/login-federado-node/blob/main/images/e5982edc-5355-4952-8caa-21c70eb1f194.jpg)

este certificado y el entryPointy se obtiene en el siguiente enlace:

<https://wayf.ucol.mx/saml2/idp/metadata.php?output=xhtml>

Ejemplo:
``` javascript
passport.serializeUser((user, done) => done(null, user));

passport.deserializeUser((user, done) => done(null, user));

const samlStrategy = new saml.Strategy({

callbackUrl: "http://localhost:4006/login/callback",

entryPoint: "https://wayf.ucol.mx/saml2/idp/SSOService.php",

issuer: "http://localhost/20166932",

decryptionPvk: fs.readFileSync(__dirname + '/cert/key.pem', 'utf8'),

privateCert: fs.readFileSync(__dirname + '/cert/cert.pem', 'utf8'),

cert: fs.readFileSync(__dirname + '/cert/idp.crt', 'utf8')

}, (profile, done) => done(null, profile));

passport.use(samlStrategy);
```

El módulo `fs` nos permite acceder e interactuar con el sistema de archivos.

La función `fs.readFileSync()` nos permite leer el contenido de un archivo de
manera síncrona

**configuración e iniciación de este middleware en nuestra aplicación**

``` javascript
const app = express();

//Configuración del servidor express

const app = express();

passport.use(samlStrategy);
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(cors());
```

se le indica la configuración del servidor de archivos estáticos mediante la
instrucción `app.use()`

si el usuario está autenticado se le da permiso de pasar, de lo contrario tendrá
que realizar el proceso de autenticación

``` javascript
const ensureAuthenticated=(req, res, next) => {

if (req.isAuthenticated())

return next();

else

return res.redirect('/login');

}
```

configuramos 2 rutas get: Una de las rutas será el punto de entrada de SSO a la
aplicación, cuando se llame passport auténtica y verificará la confianza entre
el SP y el IdP:

Si la sesión está activa devuelve una respuesta SAML

Si la sesión no está activa, se redirige al inicio de sesión del IdP

``` javascript
app.get('/',ensureAuthenticated, (req, res) => res.send('Authenticated'));

app.get('/login', passport.authenticate('saml', { failureRedirect:'/login/fail', failureFlash: true }), (req, res) => res.redirect('/'));
```

Esta es la URL de la devolución de la llamada. Una vez que el IdP haya validado
las credenciales, se llamará con el cuerpo de solicitud de base64 SAML

``` javascript
app.post('/login/callback', passport.authenticate('saml', { 
  failureRedirect: '/login/fail',
  failureFlash: true
}), (req,res) => res.send(req.user););
```

## Deslogueo de la aplicación:

Creamos la ruta que nos permitirá cerrar la secion de nuestra aplicación y de
nuestro IdP

``` javascript
app.get('/logout', (req, res)=> {
       
    if (!req.user) res.redirect('/');
    
    samlStrategy.logout(req, (err, request) =>{
      return res.redirect(request)
    });
  });

```

realizamos el proceso de cierre de sesión de la aplicación con nuestro passport

``` javascript
app.post('/logout/callback', (req, res) =>{
    req.logout();
    res.redirect('/');
  });
```

**levantamos nuestro servidor:**
``` javascript
const server = app.listen(4006, () => console.log('Listening on port %d',
server.address().port));

```
ejecutamos el comando: `node app.js`

**OJO: esta aplicación sólo funcionará con la configuración que ya está
establecida, si se cambian los parámetros no funcionará de manera correcta.**

**NO MOVER EL PUERTO DE ESCUCHA NI LOS CERTIFICADOS**

![Image text](https://github.com/Universidad-de-Colima/login-federado-node/blob/main/images/967bf838-3d6c-466c-bf32-ac7f6ecfa396.jpg)

![Image text](https://github.com/Universidad-de-Colima/login-federado-node/blob/main/images/4cd851c5-0b17-4bd4-90e3-e8c9f54df003.jpg)

![Image text](https://github.com/Universidad-de-Colima/login-federado-node/blob/main/images/792a6cca-aece-496e-946b-19ce75ad53a0.jpg)

Para poner una aplicación en producción, será necesario que se ponga en contacto a sistemas@ucol.mx para que le indiquen el procedimiento requerido.

Más información
Federación de Identidades de la Universidad de Colima

Federación UCOL - Página oficial
<https://portal.ucol.mx/federacion-identidades/>