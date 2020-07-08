import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserIdFromEvent } from '../../auth/utils'
import { createTodoItem } from '../../businessLogic/Items'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(`Handling createTodo event`)
    console.log(event)

    const userId = getUserIdFromEvent(event)
    const parseBody = JSON.parse(event.body)

    try{
        const newTodoItem = await createTodoItem(userId, parseBody.itemname, parseBody.dueDate)
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ newTodoItem })
        }
    }catch(err){
        console.log(`error on createTodos event: ${err.message}`)
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ""
        }
    }
}