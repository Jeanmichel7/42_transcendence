import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { generateKeyPairSync } from 'crypto';

@Injectable()
export class CryptoService {
  private readonly publicKeyPath = './src/modules/crypto/public_key.pem';
  private readonly privateKeyPath = 'src/modules/crypto/private_key.pem';

  constructor() {
    this.initKeys();
  }

  private initKeys() {
    if (!existsSync(this.publicKeyPath) || !existsSync(this.privateKeyPath)) {
      console.error("create keys")
      let { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
      });

      writeFileSync(this.publicKeyPath, publicKey.export({ type: 'spki', format: 'pem' }));
      writeFileSync(this.privateKeyPath, privateKey.export({ type: 'pkcs8', format: 'pem' }));

      publicKey = null;
      privateKey = null;
    }
  }

  getPublicKey(): Buffer {
    return readFileSync(this.publicKeyPath);
  }

  getPrivateKey(): Buffer {
    return readFileSync(this.privateKeyPath);
  }
}

