import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { deleteTodoItem } from '../../businessLogic/Items'
import { createLogger } from '../../utils/logger'

const logger = createLogger(`deleteTodo logger`)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    /*
    console.log(`Handling deleteTodo event`)
    console.log(event)
    */
    logger.info(`Handling deleteTodo event`)
    const todoId = event.pathParameters.todoId
    logger.info(`todoId: ${todoId}`)

    try{
        await deleteTodoItem(todoId)
        logger.info(`delete todoItem successfully`)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body:'',
            statusCode: 200
        }
    } catch(err){
        //console.log(`error on deleteTodos event: ${err.message}`)
        logger.error(`error on deleteTodos event: ${err.message}`)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: "error on deleting Todo items",
            statusCode: 500
        }
    }
}