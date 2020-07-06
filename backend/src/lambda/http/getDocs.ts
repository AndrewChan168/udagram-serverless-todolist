import 'source-map-support'
import * as AWS from 'aws-sdk'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const docClient = new AWS.DynamoDB.DocumentClient()
const itemDocTable = process.env.ITEM_DOCS_TABLE
const itemDocIndex = process.env.DOC_ID_INDEX

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    console.log('Getting Item-Docs')
    console.log(event)

    //const parseBody = JSON.parse(event.body)
    //const docId = parseBody.docId
    const todoId = event.pathParameters.todoId
    console.log(`TodoId: ${todoId}`)

    try{
        const result = await docClient.query({
            TableName: itemDocTable,
            IndexName: itemDocIndex,
            KeyConditionExpression: 'todoId=:todoId',
            ExpressionAttributeValues: {
                ':todoId':todoId
            }
        }).promise()

        const itemDocs = result.Items

        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                itemDocs
            })
        }
    } catch(err){
        console.log(`err on querying doc : ${err.message}`)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: ""
        }
    }
}