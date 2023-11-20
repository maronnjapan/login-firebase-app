import { z } from "zod";

export const UserInfo = z.object({
    email: z.string(),
    name: z.string()
})