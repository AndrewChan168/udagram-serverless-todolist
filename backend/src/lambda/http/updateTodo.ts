import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoItemsTable = process.env.TODO_ITEMS_TABLE

const logger = createLogger('UpdateTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Updating Todo-item', event)
    

    const todoId = event.pathParameters.todoId
    const parseBody = JSON.parse(event.body)

    logger.info('parseBody of updating Todo-item', parseBody)
    try{
        const results = await docClient.query({
            TableName: todoItemsTable,
            KeyConditionExpression: 'todoId=:todoId',
            ExpressionAttributeValues: {
                ':todoId':todoId
            }
        }).promise()
        if (results.Count === 0) {
            logger.warn('no query result', todoId)
            return {
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: "No todo item with such todoId",
                statusCode: 404
            }
        }
    } catch (err) {
        logger.error('error on query results', { error:err.message })
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
        logger.info('Update successfully', todoId)
        return {
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body:'',
            statusCode: 200
        }
    }catch(err){
        logger.error('err on update results', { error:err.message })
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