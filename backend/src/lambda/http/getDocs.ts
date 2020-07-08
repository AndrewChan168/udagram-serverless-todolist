import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getAllDocs } from '../../businessLogic/Docs'

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    console.log(`Handling getDocs event`)
    console.log(event)

    const todoId = event.pathParameters.todoId
    console.log(`TodoId: ${todoId}`)

    try{
        const itemDocs = await getAllDocs(todoId)
        return {
            statusCode: 200,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({
                itemDocs
            })
        }
    }catch(err){
        console.log(`err on getDocs event : ${err.message}`)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: ""
        }
    }
}