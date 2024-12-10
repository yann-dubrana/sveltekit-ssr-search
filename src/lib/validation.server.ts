import { z } from 'zod';


const BaseTodoSchema = z.object({
    // Titre avec validation
    title: z.string({
        invalid_type_error: "Le titre doit être une chaîne de caractères"
    }).min(1, { message: "Le titre ne peut pas être vide" })
        .max(100, { message: "Le titre ne peut pas dépasser 100 caractères" }),

    // Description optionnelle
    description: z.string({
        invalid_type_error: "La description doit être une chaîne de caractères"
    }).max(500, { message: "La description ne peut pas dépasser 500 caractères" })
        .optional(),

    // Statut de complétion
    completed: z.boolean({
        invalid_type_error: "Le statut de complétion doit être un booléen"
    }).optional().default(false),

    // Priorité avec enum
    priority: z.enum(["low", "medium", "high"], {
        errorMap: () => ({ message: "La priorité doit être 'low', 'medium' ou 'high'" })
    }).optional().default("medium"),

    // Date d'échéance optionnelle
    dueDate: z.coerce.date({
        invalid_type_error: "La date d'échéance doit être une date valide"
    }).nullable()
});

export const TodoCreateSchema = BaseTodoSchema;

export const TodoUpdateSchema = BaseTodoSchema.extend({
    id: z.number({
        required_error: "L'ID du todo est obligatoire",
        invalid_type_error: "L'ID doit être un nombre"
    })
}).partial().required({ id: true });


export const TodoDeleteSchema = z.object({
    id: z.number({
        required_error: "L'ID du todo est obligatoire pour la suppression",
        invalid_type_error: "L'ID doit être un nombre valide"
    })
});
