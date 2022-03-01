# Demo login federado con node

Este es un demo del login de la federación hecho con entorno JS

passport es un middleware de autenticación para Node.js, se puede colocar en
cualquier aplicación web basada en Express, admite la autenticación mediante un
nombre de usuario y contraseña, facebook, twitter, entre otros.

**Dependencias requeridas:**

*npm i passport*

*npm i passport-saml*

*npm i express*

*npm i cookie-parser*

*npm i express-session*

*npm i cors*

Se realiza la instanciación de las dependencias:

```
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

callbackUrl: Es la URL absoluta del proveedor de servicios (su aplicación) que
consumirá la respuesta SAML una vez que se realice la autenticación del
proveedor de identidad.

entryPoint: Es la URL proporcionada por el proveedor de identidad que se utiliza
para redirigir a los usuarios en la página de inicio de sesión si no están
autenticados.

se obtiene en la parte del
SingleSignOnService![](media/3876a45d2c5b91084146ba767b8aee7a.png)

issuer: cadena proporcionada al proveedor de identidad para identificar de forma
única al proveedor de servicios (entityID

decryptionPvk: clave privada para intentar descifrar cualquier aserción cifrada
que se reciba

privateCert: certificado de proveedor de servicios

Tanto el decryptionPvk como el privateCert se obtiene con el siguiente comando

*openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -days
900*

cert: Es el certificado proporcionado por el proveedor de identidad, para poder
establecer la confianza entre el proveedor de identidad y el proveedor de
servicios.

este certificado se obtiene en el siguiente enlace:

<https://wayf.ucol.mx/saml2/idp/metadata.php?output=xhtml>

![](media/d21547ec8dd7de5969480afdf8121b9b.png)

Ejemplo:

passport.serializeUser((user, done) =\> done(null, user));

passport.deserializeUser((user, done) =\> done(null, user));

const samlStrategy *=* *new* saml.Strategy({

callbackUrl: "http://localhost:4006/login/callback",

entryPoint: "https://wayf.ucol.mx/saml2/idp/SSOService.php",

issuer: "http://localhost/20166932",

decryptionPvk: fs.readFileSync(__dirname *+* '/cert/key.pem', 'utf8'),

privateCert: fs.readFileSync(__dirname *+* '/cert/cert.pem', 'utf8'),

cert: fs.readFileSync(__dirname *+* '/cert/idp.crt', 'utf8')

}, (profile, done) =\> done(null, profile));

passport.use(samlStrategy);

El módulo fs nos permite acceder e interactuar con el sistema de archivos.

La función fs.readFileSync() nos permite leer el contenido de un archivo de
manera síncrona

**configuración e iniciación de este middleware en nuestra aplicación**

**const app = express();**

Configuración del servidor express

const app *=* express();

app.use(cookieParser());

app.use(express.urlencoded({extended:true}));

app.use(express.json());

app.use(passport.initialize());

app.use(session({

secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",

saveUninitialized:true,

cookie: { maxAge:1000 *\** 60 *\** 60 *\** 24 },

resave: false }))

secret:Es una cadena para firmar cookies, es opcional, y si no se especifica no
analizará las cookies firmadas.

se le indica la configuración del servidor de archivos estáticos mediante la
instrucción app.use()

si el usuario está autenticado se le da permiso de pasar, de lo contrario tendrá
que realizar el proceso de autenticación

const ensureAuthenticated*=*(req, res, next) =\> {

*if* (req.isAuthenticated())

*return* next();

*else*

*return* res.redirect('/login');

}

configuramos 2 rutas get: Una de las rutas será el punto de entrada de SSO a la
aplicación, cuando se llame passport auténtica y verificará la confianza entre
el SP y el IdP:

Si la sesión está activa devuelve una respuesta SAML

Si la sesión no está activa, se redirige al inicio de sesión del IdP

app.get('/',ensureAuthenticated, (req, res) =\> res.send('Authenticated'));

app.get('/login', passport.authenticate('saml', { failureRedirect:
'/login/fail', failureFlash: true }), (req, res) =\> res.redirect('/'));

Esta es la URL de la devolución de la llamada. Una vez que el IdP haya validado
las credenciales, se llamará con el cuerpo de solicitud de base64 SAML

app.post('/login/callback', (req, res,next)=\> {

next();

},

passport.authenticate('saml', {

failureRedirect: '/login/fail',

session:false

}), (req,res) =\> {

const uCorreo *=* req.user?.uCorreo;

const uNombre *=* req.user?.uNombre;

const uDependencia *=* req.user?.uDependencia;

const uCuenta *=* req.user?.uCuenta;

const uTrabajador *=* req.user?.uTrabajador;

const uTipo *=* req.user?.uTipo;

const cn *=* req.user?.cn;

const sn *=* req.user?.sn;

const displayName *=* req.user?.displayName;

const givenName *=* req.user?.givenName;

res.send({uCorreo, uNombre, uDependencia, uCuenta, uTrabajador, uTipo, cn, sn,
displayName, givenName});

}

);

**Deslogueo de la aplicación:**

Creamos la ruta que nos permitirá cerrar la secion de nuestra aplicación y de
nuestro IdP

app.get('/logout', (req, res)=\> {

*if* (*!*req.user) res.redirect('/');

samlStrategy.logout(req, (err, request) =\>{

*return* res.redirect(request)

});

});

:

realizamos el proceso de cierre de sesión de la aplicación con nuestro passport

app.post('/logout/callback', (req, res) =\>{

req.logout();

res.redirect('/');

});

**levantamos nuestro servidor:**

const server *=* app.listen(4006, () =\> console.log('Listening on port %d',
server.address().port));

node app.js

**OJO: esta aplicación sólo funcionará con la configuración que ya está
establecida, si se cambian los parámetros no funcionará de manera correcta.**

**NO MOVER EL PUERTO DE ESCUCHA NI LOS CERTIFICADOS**

Ejemplos:![](media/49898199b8e32762b0e32116ba90d3fb.png)

![](media/e02d141b6f7cf1df22a54d7cdb133112.png)

![](media/2153c27e2f2541676f4000f0ae218ef7.png)
