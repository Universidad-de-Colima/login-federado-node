import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, type PassportSamlConfig, type Profile } from '@node-saml/passport-saml';

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy, 'saml') {
  private readonly certDir: string;

  constructor(config: ConfigService) {
    const certDir = config.get<string>('SAML_CERT_DIR', join(process.cwd(), 'cert'));
    const baseUrl = config.get<string>(
      'SAML_BASE_URL',
      'http://localhost:4006/prueba/api/v1/auth',
    );
    const options: PassportSamlConfig = {
      callbackUrl: `${baseUrl}/login/callback`,
      logoutCallbackUrl: `${baseUrl}/logout/callback`,
      entryPoint: config.get(
        'SAML_ENTRY_POINT',
        'https://wayf.ucol.mx/saml2/idp/SSOService.php',
      ),
      logoutUrl: config.get(
        'SAML_LOGOUT_URL',
        'https://wayf.ucol.mx/saml2/idp/SingleLogoutService.php',
      ),
      issuer: config.get('SAML_ISSUER', 'http://localhost/20166932'),
      decryptionPvk: readFileSync(join(certDir, 'key.pem'), 'utf8'),
      idpCert: readFileSync(join(certDir, 'idp.crt'), 'utf8'),
      // -1 deshabilita la validación de timestamps (desfase del IdP de UCOL).
      // En producción usar el desfase real en ms.
      acceptedClockSkewMs: -1,
    };
    // PassportStrategy agrega el callback de verificación (validate) como
    // último argumento; los tipos de passport-saml no lo contemplan.
    super(...([options] as unknown as [PassportSamlConfig, never]));
    this.certDir = certDir;
  }

  /** El perfil SAML se guarda tal cual en la sesión. */
  validate(profile: Profile) {
    return profile;
  }

  metadata() {
    return this.generateServiceProviderMetadata(
      readFileSync(join(this.certDir, 'cert.pem'), 'utf8'),
    );
  }
}
