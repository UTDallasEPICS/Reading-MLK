export default defineEventHandler(async event => {
    // get the body of the request
    const body = await readBody(event)
    // this is the database client
    // this example still needs to account for parent profile creation etc
    const result = await event.context.client.user.create({
        ...body
    })
}) 