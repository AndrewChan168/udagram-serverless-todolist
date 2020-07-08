import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserIdFromEvent } from '../../auth/utils'
import { getTodos } from '../../businessLogic/Items'
import { TodoItem } from '../../models/TodoItem'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    console.log(`Handling getTodo event`)
    console.log(event)

    const userId = getUserIdFromEvent(event)
    console.log(`userId got from token: ${userId}`)

    try{
        const todoItems:TodoItem[] = await getTodos(userId)
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                todoItems
            })
        }
    }catch(err){
        console.log(`error on getTodos event: ${err.message}`)
        
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:''
        }
    }
}