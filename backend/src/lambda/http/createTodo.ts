import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getUserIdFromEvent } from '../../auth/utils'
import { createTodoItem } from '../../businessLogic/Items'
import { createLogger } from '../../utils/logger'

const logger = createLogger(`createTodo logger`)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    /*
    console.log(`Handling createTodo event`)
    console.log(event)
    */ 
    logger.info(`Handling createTodo event`);

    const userId = getUserIdFromEvent(event)
    logger.info(`userId: ${userId}`);
    const parseBody = JSON.parse(event.body)
    logger.info(`parseBody: ${parseBody}`);

    try{
        const newTodoItem = await createTodoItem(userId, parseBody.itemname, parseBody.dueDate)
        logger.info(`createTodoItem successfully with todoId: ${newTodoItem.todoId}`);
        return {
            statusCode: 201,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ newTodoItem })
        }
    }catch(err){
        //console.log(`error on createTodos event: ${err.message}`)
        logger.error(`Error on creating todoItem: ${err.message}`);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ""
        }
    }
}