# Login Federado Node

Se utiliza Node.js y el paquete `passport-saml`

Config
======
### Parametros
`callbackUrl`: URL a la que redigirá el IdP una vez autenticado (debe ser de tu servidor) Identity Provider -> Service Provider.
`entryPoint`:  URL del IdP que ofrece el servicio de autenticación (En este caso, la URL de SignOn de UCOL) Service Provider -> Identity Provider.
`issuer`: El Entity ID de tu proyecto.

This app requires 3 files to be placed in a folder named `cert` located in the project's root directory. These files include (1) the certificate  of the Identity Provider (IdP). In this case, IdP de UCOL is the IdP. As a Service Provider (SP), you need to generate your own (2) certificate and (3) private key. These files are named as follows:

- `cert.pem`: SP's certificate creados por ti (Ver seccion siguiente)
- `idp.pem`: IdP's certificate (El de la UDC está en https://wayf.ucol.mx/saml2/idp/metadata.php)
- `key.pem`: SP's private key creados por ti (Ver seccion siguiente)

Creando Private Key y Certificado
=====================================

Genera los archivos para el SP con el siguiente comando:
- `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -days 900`

Para el certificado del IdP, deberás copiar el de la UDC que está en los metadatos (https://wayf.ucol.mx/saml2/idp/metadata.php) en un archivo de nombre `idp.crt`

Registro de tu Service Provide 
================================

Contacta al Administrador del IdP para poder registrar tu Service Provider. Para esto, deberás proporcionarle los metadatos generados en `/Metadata`.

Usage
=====

```
npm install
node app.js
```

