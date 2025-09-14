import { z } from "zod";

export const textInputValidationSchema = z.object({
    title: z
        .string()
        .min(5, "O título deve ter pelo menos 5 caracteres")
        .max(100, "O título não pode ter mais de 100 caracteres")
        .regex(
            /^[a-zA-Z0-9\s\-_.,!?]+$/,
            "O título contém caracteres inválidos"
        ),

    description: z
        .string()
        .min(20, "A descrição deve ter pelo menos 20 caracteres")
        .max(1000, "A descrição não pode ter mais de 1000 caracteres"),

    location: z
        .string()
        .min(5, "A localização deve ter pelo menos 5 caracteres")
        .max(200, "A localização não pode ter mais de 200 caracteres")
        .optional(),

    email: z
        .string()
        .email("Email inválido")
        .min(5, "Email deve ter pelo menos 5 caracteres")
        .max(100, "Email não pode ter mais de 100 caracteres"),

    phone: z
        .string()
        .regex(
            /^\(\d{2}\)\s\d{4,5}-\d{4}$/,
            "Formato de telefone inválido. Use: (11) 99999-9999"
        )
        .optional(),

    name: z
        .string()
        .min(2, "Nome deve ter pelo menos 2 caracteres")
        .max(50, "Nome não pode ter mais de 50 caracteres")
        .regex(/^[a-zA-ZÀ-ÿ\s]+$/, "Nome deve conter apenas letras e espaços"),

    password: z
        .string()
        .min(8, "Senha deve ter pelo menos 8 caracteres")
        .max(50, "Senha não pode ter mais de 50 caracteres")
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "Senha deve conter: minúscula, maiúscula, número e símbolo"
        ),
});

export type TextInputValidationData = z.infer<typeof textInputValidationSchema>;

// Schemas individuais para uso específico
export const titleSchema = textInputValidationSchema.pick({ title: true });
export const descriptionSchema = textInputValidationSchema.pick({
    description: true,
});
export const emailSchema = textInputValidationSchema.pick({ email: true });
export const phoneSchema = textInputValidationSchema.pick({ phone: true });
export const nameSchema = textInputValidationSchema.pick({ name: true });
export const passwordSchema = textInputValidationSchema.pick({
    password: true,
});
