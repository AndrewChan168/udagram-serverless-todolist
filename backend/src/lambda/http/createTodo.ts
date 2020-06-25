import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoItemsTable = process.env.TODO_ITEMS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log('Processing event: ')
    console.log(event)

    const todoId = uuid.v4()
    const createdAt = new Date().toISOString()
    const parseBody = JSON.parse(event.body)

    const newTodoItem = {
        todoId, 
        done: false,
        createdAt,
        ...parseBody
    }

    await docClient.put({
        TableName: todoItemsTable,
        Item: newTodoItem,
    }).promise()

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ newTodoItem })
    }
}