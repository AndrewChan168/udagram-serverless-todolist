import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { updateTodoItem, checkTodoItemExist } from '../../businessLogic/Items'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(`handling updateTodo event`)
    console.log(event)

    const todoId = event.pathParameters.todoId

    try{
        if(checkTodoItemExist(todoId)){
            const parseBody = JSON.parse(event.body)
            updateTodoItem(todoId, parseBody.itemname, parseBody.dueDate, parseBody.done)
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body:'Item updated',
                statusCode: 200
            }
        }else{
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: "No todo item with such todoId",
                statusCode: 404
            }
        }
    }catch(err){
        console.log(`error on updateTodo event: ${err.message}`)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: "error on updating Todo items",
            statusCode: 500
        }
    }
}