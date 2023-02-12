
import { ZodError } from 'Zod'


export function fail ( zod : ZodError ){
    throw zod
}
