import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import * as uuid from 'uuid'

const docClient = new AWS.DynamoDB.DocumentClient()
const s3 = new AWS.S3({ signatureVersion: 'v4' })

const todo_items_table = process.env.TODO_ITEMS_TABLE
const item_docs_table = process.env.ITEM_DOCS_TABLE
const bucketName = process.env.DOCS_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log("Processing event: ")
    console.log(event)

    const todoId = event.pathParameters.todoId
    const isItemValid = taskExist(todoId)

    if(!isItemValid){
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                error: 'Todo-item does not exist'
            })
        }
    }

    const docId = uuid.v4()
    
    /* to be arrange function to proceed below codes */
    const newItem = await createDoc(todoId, docId, event)
    const uploadUrl = generateUploadUrl(docId)
    console.log(`upload-URL: ${uploadUrl}`)

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            newItem,
            uploadUrl
        })
    }
}

async function taskExist(itemId: string) {
    const result = await docClient.get({
        TableName: todo_items_table,
        Key: {
            todoId:itemId,
        }
    }).promise();
    
    console.log(`get task result: `, result)
    return !!result.Item
}

async function createDoc(todoId: string, docId: string, event:APIGatewayProxyEvent){
    const timestamp = new Date().toISOString()
    const newDoc = JSON.parse(event.body)

    const newItem = {
        todoId,
        timestamp,
        docId,
        ...newDoc,
        docUrl: `https://${bucketName}.s3.amazonaws.com/${docId}`
    }

    try{
        await docClient.put({
            TableName: item_docs_table,
            Item: newItem
        }).promise()
    }catch(err){
        console.log(`error on saving doc in S3 bucket: ${e.message}`)
    }

    return newItem
}

function generateUploadUrl(docId: string) {
    return s3.getSignedUrl('putObject', {
        Bucket: bucketName,
        Key: docId,
        Expires: parseInt(urlExpiration)
    })
}