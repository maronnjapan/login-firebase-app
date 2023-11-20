import { BadRequestException, Controller, Req, Res } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { Request, Response } from 'express';
import { c } from 'src/contract';
import { FirebaseService } from 'src/firebase/firebase.service';


@Controller()
export class AuthController {
    constructor(private firebaseService: FirebaseService) { }

    @TsRestHandler(c.login)
    async login(@Res({ passthrough: true }) response: Response) {
        return tsRestHandler(c.login, async ({ body }) => {
            const expiresIn = 5 * 60 * 1000;
            try {
                const sessionToken = await this.firebaseService.auth.createSessionCookie(body.idToken, { expiresIn });
                const options = {
                    maxAge: expiresIn,
                    httpOnly: true,
                    secure: false
                }

                response.cookie('sessionToken', sessionToken, options);
                return {
                    status: 201,
                    body: undefined,
                }
            } catch (e) {
                throw new BadRequestException('invalid_id_token')
            }
        })
    }

    @TsRestHandler(c.logout)
    async logout(@Res({ passthrough: true }) response: Response, @Req() req: Request) {
        return tsRestHandler(c.logout, async () => {
            const tokenCookie: string = req.cookies?.sessionToken ?? '';
            const decodeClaims = await this.firebaseService.auth.verifySessionCookie(tokenCookie, true)
            await this.firebaseService.auth.revokeRefreshTokens(decodeClaims.uid);
            response.clearCookie('sessionToken')
            return {
                body: null,
                status: 201
            }
        })
    }
}
