import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { deleteTodoItem } from '../../businessLogic/Items'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    console.log(`Handling deleteTodo event`)
    console.log(event)
    const todoId = event.pathParameters.todoId

    try{
        await deleteTodoItem(todoId)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body:'',
            statusCode: 200
        }
    } catch(err){
        console.log(`error on deleteTodos event: ${err.message}`)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: "error on deleting Todo items",
            statusCode: 500
        }
    }
}