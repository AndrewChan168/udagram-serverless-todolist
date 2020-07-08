import 'source-map-support/register'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { generateUploadUrl, createDoc } from '../../businessLogic/Docs'
import { checkTodoItemExist } from '../../businessLogic/Items'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    console.log(`handling generateUploadUrl event`)
    console.log(event)

    const todoId = event.pathParameters.todoId
    console.log(`TodoId: ${todoId}`)
    
    try{
        if(checkTodoItemExist(todoId)){
            const newItem = await createDoc(todoId)
            console.log(`The generated newItem:`)
            console.log(newItem)
            const uploadUrl = await generateUploadUrl(newItem.docId)
            console.log(`The generated uploadUrl:`)
            console.log(uploadUrl)
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
        }else{
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
    }catch(err){
        console.log(`error on generateUploadUrl event:${err.message}`)
    }
}