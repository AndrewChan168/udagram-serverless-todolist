import 'source-map-support/register'
import * as AWS  from 'aws-sdk'
//import * as middy from 'middy'
//import { cors } from 'middy/middlewares'
import * as uuid from 'uuid'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
//import { createLogger } from '../../utils/logger'
import { getUserIdFromEvent } from '../../auth/utils'

const docClient = new AWS.DynamoDB.DocumentClient()
const todoItemsTable = process.env.TODO_ITEMS_TABLE

//const logger = createLogger('CreateTodo');

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
//export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    //logger.info('Creating Todo-item', event)
    console.log(`Creating Todo-item: `)
    console.log(event)

    const todoId = uuid.v4()
    const userId = getUserIdFromEvent(event)
    const createdAt = new Date().toISOString()
    const parseBody = JSON.parse(event.body)

    const newTodoItem = {
        userId,
        todoId, 
        done: false,
        createdAt,
        ...parseBody
    }

    //logger.info('The newTodoItem', newTodoItem)
    console.log(`The newTodoItem`)
    console.log(newTodoItem)

    try{
        await docClient.put({
            TableName: todoItemsTable,
            Item: newTodoItem,
        }).promise()
    } catch(err) {
        console.log(`error on inserting new todo item: ${err.message}`)

        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: ""
        }
    }

    return {
        statusCode: 201,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ newTodoItem })
    }
}//)
/*
handler.use(
    cors({
      credentials: true
    })
);
*/