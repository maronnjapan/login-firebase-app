import { initContract } from '@ts-rest/core';
import { z } from 'zod';
import { Login } from './type/body-type';
import { UserInfo } from './type/response-type';


const c = initContract();


export const tsRestRoute = c.router({
    // hello: {
    //     method: 'GET',
    //     path: '/api',
    //     responses: {
    //         200: z.object({
    //             name: z.string()
    //         })
    //     }
    // },
    login: {
        method: 'POST',
        path: '/api/login',
        responses: {
            201: z.undefined()
        },
        body: Login,
        contentType: 'application/json'

    },
    logout: {
        method: 'POST',
        path: '/api/logout',
        responses: {
            201: z.null()
        },
        body: null,
    },
    getUserInfo: {
        method: 'GET',
        path: '/api/users/me',
        responses: {
            200: UserInfo
        },
    },
    deleteUser: {
        method: 'DELETE',
        path: '/api/users/me',
        responses: {
            204: null
        },
        body: null
    }
});


