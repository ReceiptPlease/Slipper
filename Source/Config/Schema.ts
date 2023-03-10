
import { z } from 'Zod'


export const Schema = z.object({

    Input : z.object({
        Template : z.string() ,
        Snippets : z
            .string()
            .optional(),
        Styles : z
            .string()
            .optional()
    }),

    Render : z.object({
        Template : z.string()
    }),

    Output : z.object({
        Template : z.string()
    })
})


export type Type =
    z.infer<typeof Schema>
