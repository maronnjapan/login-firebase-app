import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { credential } from 'firebase-admin';
import { initializeApp } from 'firebase-admin/app';
import { Auth, getAuth } from 'firebase-admin/auth';

@Injectable()
export class FirebaseService {
    public readonly auth: Auth

    constructor(private readonly configService: ConfigService) {
        initializeApp({
            credential: credential.cert({
                clientEmail: this.configService.getOrThrow<string>('CLIENTE_MAIL'),
                privateKey: this.configService.getOrThrow<string>('PRIVATE_KEY'),
                projectId: this.configService.getOrThrow<string>('PROJECT_ID'),
            })
        })
        this.auth = getAuth()
    }
}
