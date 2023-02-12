
import { Schema } from './Schema.ts'
import { parse } from 'Toml'
import { fail } from './Errors.ts'

import Arguments from '../Arguments/mod.ts'


const { config } = Arguments;


const toml = await Deno
    .readTextFile(config);


const data = parse(toml);


const schema = Schema
    .safeParse(data);


if( ! schema.success ){
    fail(schema.error);
    Deno.exit(1);
}


export default schema.data

