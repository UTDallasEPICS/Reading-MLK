import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    event.context.OPTIONS.setHeader('Access-Control-Allow-Origin', '*')
    event.context.OPTIONS.setHeader('Access-Control-Allow-Methods', 'GET, POST')
    event.context.OPTIONS.setHeader('Access-Control-Allow-Headers', 'origin, content-type, accept, x-requested-with')
    event.context.OPTIONS.setHeader('Content-Type', 'application/json; charset=utf-8')

    //const name = getRouterParam(event, 'name')

    const postBody = await event.context.body;

    const { first_name , last_name} = await readBody(event);

    const postBodyDecoded: {
        //id: string;
        //zipcode: string;
        //yearly_income: number;
        //birth_date: string;
        //avg_num_book: number;
        //password: string;
        //phone_number: string;
        //gender: string;
        //marital_stat: string;
        first_name: string;
        last_name: string;
        //email: string;
        //social_media: string;
      } = JSON.parse(postBody);

    //const parentfirstname = event.context.params?.first_name;
    //const parentlastname = event.context.params?.last_name;


    

    //console.log(parentfirstname)
    //console.log(parentlastname)

    try {
        let data = await prisma.parentProfile.findFirst({
            where: {
                first_name: postBodyDecoded.first_name,
                last_name: postBodyDecoded.last_name
            }
        })
                
        

        //console.log(data)

        if (await data) {
            console.log( await data)
            return event.context.res
          
        }
        
         else {
            return {
                statusCode: 404,

                //mode: "cors",
                body: JSON.stringify({ error: 'Parent not found' })
            
            };
        }
    } catch (error) {
        console.error('Failed to search for parent:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' })
        };
    }
});


  
 /*

 
  };

  res.status(200).json(responseData);
};

*/
