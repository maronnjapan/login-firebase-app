import { tsRestRoute } from '@monorepo-firebase/ts-router';
import { initQueryClient } from '@ts-rest/react-query';

export const tsRestClient = initQueryClient(tsRestRoute, {
    baseUrl: window.location.origin,
    baseHeaders: {},
});