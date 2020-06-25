import 'source-map-support'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoItemsTable = process.env.TODO_ITEMS_TABLE

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    console.log("Processing event:")
    console.log(event)
    
    const result = await docClient.scan({
        TableName: todoItemsTable
    }).promise()

    console.log('result-json: ')
    console.log(result)

    const todoItems = result.Items

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
