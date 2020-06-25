import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoItemsTable = process.env.TODO_ITEMS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event:")
    console.log(event)

    const todoId = event.pathParameters.todoId
    const parseBody = JSON.parse(event.body)

    const results = await docClient.query({
        TableName: todoItemsTable,
        KeyConditionExpression: 'todoId=:todoId',
        ExpressionAttributeValues: {
            ':todoId':todoId
        }
    }).promise()

    if (results.Count !==0 ){
        const updatedTodoItem = {
            ...results[0],
            ...parseBody
        }

        await docClient.update({
            TableName: todoItemsTable,
            Key: {"todoId":todoId},
            UpdateExpression: "set todoId"
        }).promise()

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
              },
            body: JSON.stringify(updatedTodoItem)
        }
    } else {
        return {
            statusCode: 404,
            headers: {
              'Access-Control-Allow-Origin': '*'
            },
            body: 'Todo-Item is not found'
        }
    }
}