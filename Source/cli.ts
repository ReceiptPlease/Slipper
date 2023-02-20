
const { clear , log } = console;

clear();

log(`Starting Slipper`);


import Arguments from './Arguments/mod.ts'
import Config from './Config/mod.ts'

import { basename , dirname , join } from 'Path'
import { Liquid } from 'Liquid'
import { walk } from 'FileSystem'

log('Config:',Config)



const engine = new Liquid({
    extname : '.liquid' ,
    root : [ ]
});


engine.registerFilter('image_url',image_url);
engine.registerFilter('image_tag',image_tag);


function image_url ( url : string, ... args : any [] ){
    return 'Product.jpeg'
}

function image_tag ( url : string ){
    return `<img src="${ url }" alt="Health potion">`
}


const context = {

    shop : {
        domain : 'Shop.com' ,
        email : 'Contact@Shop.com' ,
        name : 'Shopname'
    },

    shop_address : {

        address1 : '107 Enterprise Dr' ,
        address2 : null ,
        company : 'Potions Ink' ,
        city : 'Woodbine' ,
        province_code : 'IA' ,
        province : 'Pomorskie' ,
        zip : '8527' ,
        country_code : 'IT' ,
        country : 'Italy' ,
        summary : '107 Enterprise Dr, Pomorskie, Italy'
    },

    order : {
        order_number : 123 ,
        created_at : '' ,
        name : '#123' ,
        note : null
    },

    customer : {
        first_name : 'Owen' ,
        last_name : 'Carter' ,
        email : 'cornelius.potionmaker@gmail.com' ,
        name : 'Owen Carter'
    },

    shipping_address : {
        address1 : '96 Park Drive' ,
        address2 : 'Apt 1217' ,
        first_name : 'Owen' ,
        last_name : 'Carter' ,
        name : 'Owen Jay Carter' ,
        phone : '220-360-8280' ,
        company : 'McDrive Corp' ,
        city : 'Henderson' ,
        province_code : 'KY' ,
        province : 'Kentucky' ,
        zip : '42420' ,
        country_code : 'US' ,
        country : 'United States' ,
        summary : '96 Park Drive, Apt 1217, Kentucky, United States'
    },

    billing_address : {
        address1 : '150 Elgin Street' ,
        address2 : '8th floor' ,
        first_name : null ,
        last_name : null ,
        name : '' ,
        phone : null ,
        company : `Polina's Potions, LLC` ,
        city : 'Ottawa' ,
        province_code : 'ON' ,
        province : 'Ontario' ,
        zip : 'K2P 1L4' ,
        country_code : 'CA' ,
        country : 'Canada' ,
        summary : '150 Elgin Street, 8th floor, Ottawa, Ontario, Canada'
    },

    includes_all_line_items_in_order : false ,

    line_items_in_shipment : [{

        image : 'products/Product.png' ,
        title : 'A Big Book' ,
        variant_title : 'In Red' ,
        vendor : 'BigBooks' ,
        sku : 'F2132123' ,
        quantity : 2 ,
        shipping_quantity : 2 ,
        properties : {
            custom : 'test'
        }
    }]
}


const template_input =
    join(dirname(Arguments.config),Config.Input.Template);

const template_render =
    join(dirname(Arguments.config),Config.Render.Template);

const template_output =
    join(dirname(Arguments.config),Config.Output.Template);

const template = await Deno
    .readTextFile(template_input);

let liquid = template;



const snippets = new Map<string,string>;

if( Config.Input.Snippets ){

    const options = {
        includeFiles : true ,
        includeDirs : false ,
        exts : [ 'liquid' ]
    }

    const folder = join(dirname(Arguments.config),Config.Input.Snippets);

    const entries = walk(folder,options);

    for await ( const entry of entries )
        snippets.set(basename(entry.path),await Deno.readTextFile(entry.path));

}



console.log('Snippets',snippets);


liquid = liquid.replaceAll(/<!-- *Insert *(.+?) *-->/g,( _ : any , path : string ) => {

    const file = `${ path }.liquid`;

    if( snippets.has(file) )
        return snippets.get(file) ?? ''

    console.warn(`Couldn't find snippet '${ path }'`);

    return ''
})


if( Config.Input.Styles ){

    const options = {
        includeFiles : true ,
        includeDirs : false ,
        exts : [ 'css' , 'liquid' ]
    }

    const path_styles = join(dirname(Arguments.config),Config.Input.Styles);

    const entries = walk(path_styles,options);

    for await ( const entry of entries )
        liquid += await Deno.readTextFile(entry.path);

}


await Deno.writeTextFile(template_output,liquid);


let html = await engine
    .parseAndRender(template,undefined,{
        globals : context
    });

html += `

    <style type = 'text/css' >

        body {
            margin : 0 ;
            height : 100vh ;
            width : 100vw ;
        }

        ::-webkit-scrollbar {
            display : none ;
        }

        html {
            scrollbar-width : none ;
        }

        .wrapper {
            font-size : 15px ;
        }

        .wrapper > * {
            font-size : 8.5px ;
        }

    </style>

    <style type = 'text/css' media = print >

        @page {
            margin : 0 ;
            size : auto ;
        }

    </style>
`


const preview = `

    <html>
        <body oncontextmenu = 'return false' >

            <style>

                html {
                    background : #3c4a50 ;
                }

                body {

                    justify-content : center ;
                    align-items : center ;
                    display : grid ;
                }

                iframe {

                    background : white ;

                    aspect-ratio : 21 / 29.7 ;
                    height : min( 29.7cm , calc( 100vh - 2rem ) );
                }

            </style>

            <iframe id = page></iframe>

            <script defer>

                const preview = \`${ html }\`;

                const page = document
                    .getElementById('page');

                {

                    const { document } = page.contentWindow;

                    document.write(\`<html><body oncontextmenu="(window.print(),false)">\${ preview }</body></html>\`);
                    document.close();
                }

            </script>
        </body>
    </html>
`


await Deno.writeTextFile(template_render,preview);
