import { decode } from 'jsonwebtoken'
import { JwtPayload } from './JwtPayload'

import { APIGatewayProxyEvent } from "aws-lambda"


/**
 * Parse a JWT token and return user ID
 * @param jwtToken 
 * @return user ID from JWT token
 */
export function parseUserId(jwtToken: string):string {
    const decodeJwt = decode(jwtToken) as JwtPayload
    return decodeJwt.sub
}

export function getUserIdFromEvent(event:APIGatewayProxyEvent):string{
    const authorization = event.headers.Authorization
    const split = authorization.split(' ')
    const jwtToken = split[1]
    return parseUserId(jwtToken)
}