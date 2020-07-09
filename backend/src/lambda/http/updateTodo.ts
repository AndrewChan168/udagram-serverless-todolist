import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { updateTodoItem, checkTodoItemExist } from '../../businessLogic/Items'
import { createLogger } from '../../utils/logger'

const logger = createLogger(`updateTodo logger`)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    /*
    console.log(`handling updateTodo event`)
    console.log(event)
    */
    logger.info(`handling updateTodo event`)

    const todoId = event.pathParameters.todoId
    logger.info(`todoId from event: ${todoId}`)

    try{
        if(checkTodoItemExist(todoId)){
            const parseBody = JSON.parse(event.body)
            updateTodoItem(todoId, parseBody.itemname, parseBody.dueDate, parseBody.done)
            logger.info(`update todoItem successfully`)
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body:'Item updated',
                statusCode: 200
            }
        }else{
            logger.warn(`update todoItem does not exist`)
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: "No todo item with such todoId",
                statusCode: 404
            }
        }
    }catch(err){
        //console.log(`error on updateTodo event: ${err.message}`)
        logger.error(`error on updateTodo event: ${err.message}`)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: "error on updating Todo items",
            statusCode: 500
        }
    }
}