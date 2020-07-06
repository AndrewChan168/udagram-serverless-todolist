import 'source-map-support'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
//import { createLogger } from '../../utils/logger'
import { getUserIdFromEvent } from '../../auth/utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoItemsTable = process.env.TODO_ITEMS_TABLE
const todoItemIndex = process.env.ITEM_ID_INDEX

//const logger = createLogger('GetTodos');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    //logger.info('Getting Todo-items', event)
    console.log('Getting Todo-items')
    console.log(event)

    /*const result = await docClient.scan({
        TableName: todoItemsTable
    }).promise()*/

    /** newly add code */
    const userId = getUserIdFromEvent(event)
    //logger.info('userId got from token', userId)

    console.log('userId got from token')
    console.log(userId)

    try{
        const result = await docClient.query({
            TableName: todoItemsTable,
            IndexName: todoItemIndex,
            KeyConditionExpression: 'userId=:userId',
            ExpressionAttributeValues: {
                ':userId':userId
            }
        }).promise()

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
    }catch(err){
        console.log(`error on querying todos: ${err.message}`)
        
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body:''
        }
    }
    
}
