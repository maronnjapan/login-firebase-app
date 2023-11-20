import { Controller, Delete, Get, Req, Res, UnauthorizedException } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { Request, Response } from 'express';
import { getAuth } from 'firebase-admin/auth';
import { c } from 'src/contract';
import { Cookies } from 'src/decorator/Cookie';
import { FirebaseService } from 'src/firebase/firebase.service';


@Controller()
export class UsersController {
    constructor(private firebaseService: FirebaseService) { }

    @TsRestHandler(c.getUserInfo)
    async getLoginUserInfo(@Cookies('sessionToken') session: string) {
        return tsRestHandler(c.getUserInfo, async () => {
            if (!session) {
                throw new UnauthorizedException('invalid_session');
            }
            try {

                const decodeClaims = await this.firebaseService.auth.verifySessionCookie(session, true);
                return {
                    status: 200,
                    body: { name: decodeClaims.name, email: decodeClaims.email },
                }
            } catch (e) {
                console.log(e)
                throw new UnauthorizedException('invalid_session')
            }
        })

    }

    @Delete(c.deleteUser.path)
    @TsRestHandler(c.deleteUser)
    async deleteUser(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
        return tsRestHandler(c.deleteUser, async () => {
            const tokenCookie: string = req.cookies?.sessionToken ?? '';
            const decodeClaims = await this.firebaseService.auth.verifySessionCookie(tokenCookie, true)
            await this.firebaseService.auth.deleteUser(decodeClaims.uid)
            res.clearCookie('sessionToken')
            return {
                body: null,
                status: 201
            }
        })
    }
}
