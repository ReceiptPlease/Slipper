
import { ZodError } from 'Zod'
import { cyan , red } from 'Colors'


export function fail ( zod : ZodError ){

    for ( const error of zod.errors ){

        const { message , path } = error;

        if( message === 'Required' )
            console.error(red(`Argument '${ cyan('' + path) }' is missing`));
    }
}
