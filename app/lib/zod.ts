import { z } from "zod";

export const signInSchema = z.object({
    email: z
        .string({ error: "Email обов'язковий" })
        .min(1, { message: "Email не може бути порожнім" })
        .email({ message: "Некоректний формат email" }),

    password: z
        .string({ error: "Пароль обов'язковий" })
        .min(1, { message: "Пароль не може бути порожнім" })
        .min(8, { message: "Пароль має бути не менше 8 символів" })
        .max(32, { message: "Пароль має бути не більше 32 символів" }),
});

export type SignInFormData = z.infer<typeof signInSchema>;