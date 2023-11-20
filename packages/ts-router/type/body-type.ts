import { z } from "zod"

export const Login = z.object({
    idToken: z.string(),
});