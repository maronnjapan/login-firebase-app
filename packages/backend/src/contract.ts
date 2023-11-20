import { tsRestRoute } from '@monorepo-firebase/ts-router/dist';
import { nestControllerContract } from '@ts-rest/nest';

export const c = nestControllerContract(tsRestRoute);
