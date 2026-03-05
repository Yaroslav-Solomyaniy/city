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

export const registerAdminSchema = z.object({
    token: z.string().min(1, 'Недійсне запрошення'),

    name: z
        .string()
        .trim()
        .min(1, "Ім'я не може бути порожнім")
        .max(100, "Ім'я занадто довге")
        .optional()
        .or(z.literal('')),

    password: z
        .string()
        .min(8, 'Пароль має бути не менше 8 символів')
        .max(32, 'Пароль має бути не більше 32 символів'),
})