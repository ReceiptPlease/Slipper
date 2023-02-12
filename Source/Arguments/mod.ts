
import { Schema } from './Schema.ts'
import { parse } from 'Flags'
import { fail } from './Errors.ts'


const { args } = Deno;


const parameters =
    parse(args);

const data = Schema
    .safeParse(parameters);

if( ! data.success ){
    fail(data.error);
    Deno.exit(1);
}

export default data.data
