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

    console.log("parseBody: ")
    console.log(parseBody)
    try{
        const results = await docClient.query({
            TableName: todoItemsTable,
            KeyConditionExpression: 'todoId=:todoId',
            ExpressionAttributeValues: {
                ':todoId':todoId
            }
        }).promise()
        console.log('query-result: ')
        console.log(results)

        if (results.Count === 0) return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: "No todo item with such todoId",
            statusCode: 404
        }
    } catch (err) {
        console.log(`err on query results: ${err.message}`)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: "error on querying Todo items",
            statusCode: 500
        }
    } 

    try{
        //const { name, dueDate, done } = parseBody
        await docClient.update({
            TableName: todoItemsTable,
            Key: {"todoId":todoId},
            UpdateExpression: "set itemname=:itemname, dueDate=:dueDate, done=:done",
            ExpressionAttributeValues: {
                ":itemname":parseBody.itemname,
                ":dueDate":parseBody.dueDate,
                ":done":parseBody.done,
            }
        }).promise()
        console.log('Update successfully')
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body:'',
            statusCode: 200
        }
    }catch(err){
        console.log(`err on update results: ${err.message}`)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: "error on updating Todo items",
            statusCode: 500
        }
    }

    /*
    if (results.Count !==0 ){
        //const updatedTodoItem = { ...parseBody }
        const { name, dueDate, done } = parseBody
        await docClient.update({
            TableName: todoItemsTable,
            Key: {"todoId":todoId},
            UpdateExpression: "set name=:name, dueDate=:dueDate, done=:done",
            ExpressionAttributeValues: {
                ":name":name,
                ":dueDate":dueDate,
                ":done":done,
            }
        }).promise()

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*'
              },
            body: JSON.stringify({
                name, dueDate, done, todoId
            })
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
    */
}