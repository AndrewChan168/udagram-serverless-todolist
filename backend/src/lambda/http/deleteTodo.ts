import 'source-map-support'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoItemsTable = process.env.TODO_ITEMS_TABLE

const logger = createLogger('DeleteTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    logger.info("Deleting Todo-item", event)

    const todoId = event.pathParameters.todoId

    try {
        await docClient.delete({
            TableName: todoItemsTable,
            Key: {"todoId":todoId}
        }).promise()
        logger.info('Delete successfully', todoId)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body:'',
            statusCode: 200
        }
    } catch(err) {
        logger.error('Fail to delete Todo-item', { error:err.message })
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: "error on deleting Todo items",
            statusCode: 500
        }
    }
}