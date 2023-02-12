
import { z } from 'Zod'


export const Schema = z.object({
    config : z.string()
})


export type Type =
    z.infer<typeof Schema>
