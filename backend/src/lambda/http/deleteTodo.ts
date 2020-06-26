import 'source-map-support'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoItemsTable = process.env.TODO_ITEMS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    console.log("Processing event:")
    console.log(event)

    const todoId = event.pathParameters.todoId

    try {
        await docClient.delete({
            TableName: todoItemsTable,
            Key: {"todoId":todoId}
        }).promise()
        console.log('Delete successfully')
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body:'',
            statusCode: 200
        }
    } catch(err) {
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: "error on deleting Todo items",
            statusCode: 500
        }
    }
}