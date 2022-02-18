# Login Federado Node

Se utiliza Node.js y el paquete `passport-saml`

Config
======

This app requires 3 files to be placed in a folder named `cert` located in the project's root directory. These files include (1) the certificate  of the Identity Provider (IdP). In this case, RIT's Shibboleth Server is the IdP. As a Service Provider (SP), you need to generate your own (2) certificate and (3) private key. These files are named as follows:

- `cert.pem`: SP's certificate creados por ti (Ver seccion siguiente)
- `idp.pem`: IdP's certificate (El de la UDC está en https://wayf.ucol.mx/saml2/idp/metadata.php)
- `key.pem`: SP's private key creados por ti (Ver seccion siguiente)

Creando Private Key y Certificado
=====================================

Genera los archivos para el SP con el siguiente comando:
- `openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -nodes -days 900`

Para el certificado del IdP, deberás copiar el de la UDC que está en los metadatos (https://wayf.ucol.mx/saml2/idp/metadata.php) en un archivo de nombre `idp.crt`

Registering the Service Provider
================================

Contact ITS to register your Service Provider. During this step, the IdP Administrator downloads the metadata from the `/Metadata` endpoint and loads it into the IdP.

Usage
=====

```
npm install
node app.js
```

