import { Injectable } from '@nestjs/common';
import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'fs';
import { generateKeyPairSync } from 'crypto';
import { dirname } from 'path';

@Injectable()
export class CryptoService {
  private readonly publicKeyPath = 'dist/src/modules/crypto/public_key.pem';
  private readonly privateKeyPath = 'dist/src/modules/crypto/private_key.pem';

  constructor() {
    this.initKeys();
  }

  private initKeys() {
    const publicKeyDir = dirname(this.publicKeyPath);
    const privateKeyDir = dirname(this.privateKeyPath);

    if (!existsSync(publicKeyDir)){
      mkdirSync(publicKeyDir, { recursive: true });
    }

    if (!existsSync(privateKeyDir)){
      mkdirSync(privateKeyDir, { recursive: true });
    }

    if (!existsSync(this.publicKeyPath) || !existsSync(this.privateKeyPath)) {
      console.error('Creating keys...');
      const { publicKey, privateKey } = generateKeyPairSync('rsa', {
        modulusLength: 2048,
      });

      writeFileSync(
        this.publicKeyPath,
        publicKey.export({ type: 'spki', format: 'pem' }),
      );
      writeFileSync(
        this.privateKeyPath,
        privateKey.export({ type: 'pkcs8', format: 'pem' }),
      );
    }
  }

  getPublicKey(): Buffer {
    return readFileSync(this.publicKeyPath);
  }

  getPrivateKey(): Buffer {
    return readFileSync(this.privateKeyPath);
  }
}

