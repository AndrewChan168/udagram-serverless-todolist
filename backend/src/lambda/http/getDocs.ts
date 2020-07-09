import 'source-map-support'
import { APIGatewayProxyHandler, APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

import { getAllDocs } from '../../businessLogic/Docs'
import { createLogger } from '../../utils/logger'

const logger = createLogger(`getDocs logger`)

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent):Promise<APIGatewayProxyResult> => {
    /*
    console.log(`Handling getDocs event`)
    console.log(event)
    */
    logger.info(`Handling getDocs event`)    

    const todoId = event.pathParameters.todoId
    logger.info(`TodoId: ${todoId}`)

    try{
        const itemDocs = await getAllDocs(todoId)
        logger.info(`get itemDocs successfully`)
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
        //console.log(`err on getDocs event : ${err.message}`)
        logger.error(`err on getDocs event : ${err.message}`)
        return {
            statusCode: 500,
            headers:{
                'Access-Control-Allow-Origin': '*'
            },
            body: ""
        }
    }
}