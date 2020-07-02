import 'source-map-support'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoItemsTable = process.env.TODO_ITEMS_TABLE

const logger = createLogger('GetTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    logger.info('Getting Todo-items', event)
    
    const result = await docClient.scan({
        TableName: todoItemsTable
    }).promise()

    const todoItems = result.Items
    logger.info('Query successfully')

    return {
        statusCode: 200,
        headers:{
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            todoItems
        })
    }
}
