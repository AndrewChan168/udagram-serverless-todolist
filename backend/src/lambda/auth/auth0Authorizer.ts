import { CustomAuthorizerEvent, CustomAuthorizerResult, CustomAuthorizerHandler } from 'aws-lambda'
import 'source-map-support/register'
import axios from 'axios'
import { verify } from 'jsonwebtoken'

import { JwtPayload } from '../../auth/JwtPayload'
import { createLogger } from '../../utils/logger'

/**
 * A URL that can be used to download a certifcate that can be used to verify JWT token signature
 * The URL you need to go to an Auth0 page -> show Advanced Settings -> Endpoints -> JSON Web Key Set
 */
const jwtsUrl = 'https://dev-ckdxh0zt.us.auth0.com/.well-known/jwks.json'
const logger = createLogger('RS256Auth');

export const handler:CustomAuthorizerHandler = async(event:CustomAuthorizerEvent):Promise<CustomAuthorizerResult>=>{
    logger.info('Authorizing a user', event.authorizationToken)
    try {
      const decodedToken = await verifyToken(event.authorizationToken)
      logger.info('User was authorized with the decoded token', decodedToken)
      return {
        principalId: decodedToken.sub,
        policyDocument: {
            Version: '2012-10-17',
            Statement:[
                {
                    Action: 'execute-api:Invoke',
                    Effect: 'Allow',
                    Resource: '*'
                }
            ]
        }
    }
    } catch (err) {
      logger.error('User was not authorized', { error:err.message })
      return {
          principalId: 'user',
          policyDocument: {
              Version: '2012-10-17',
              Statement:[
                  {
                      Action: 'execute-api:Invoke',
                      Effect: 'Deny',
                      Resource: '*'
                  }
              ]
          }
      }
    }
}

function getToken(authHeader: string): string {
    if (!authHeader) throw new Error('No authentication header')
  
    if (!authHeader.toLowerCase().startsWith('bearer '))
      throw new Error('Invalid authentication header')
  
    const split = authHeader.split(' ')
    const token = split[1]
  
    return token
  }

async function verifyToken(authHeader: string): Promise<JwtPayload>{
    const token = getToken(authHeader);
    //const jwt: Jwt = decode(token, { complete:true }) as Jwt;
    const jwksResponse = await axios.get(jwtsUrl);
    const jwks = jwksResponse.data;

    const signingkey =  cert2PEM(jwks.keys[0].x5c[0])
    
    return verify(token, signingkey, { algorithms: ['RS256'] })
}

function cert2PEM(cert) {
  return `-----BEGIN CERTIFICATE-----\n${cert}\n-----END CERTIFICATE-----\n`
}

/*
// var jwks
// axios.get(jwtsUrl).then((res)=>jwks=res.data)
// const cert = jwks.keys[0].x5c[0]
// cert.match(`/.{1,64}/g`)
{      
  keys: [
    {    
      alg: 'RS256',
      kty: 'RSA',
      use: 'sig',
      n: 'vs_BTSTvbbmdZxbmWkkwSfe8K1kJIelr_3Zdgus634zyA7NnmgFjTQQ2cL7z72BxbaTgHNzRpmd_HEGPHKHFE2KgJyqkdJUSpcgpv5ZhZozH5I_ARfv_215zK5dIvl93NlUj-690Ec2HNxOK0jsr2un4TThODspff4sSceJKEphynnoatRyAhXrtz01xtZE5f1Cugp_zuxFFhenuJKlX4M2-JJet_BmAuplTGJ8hzZ64zyhUi7lEbPrAgT1-ESBCTt9eDEc5FFD7wpurdoShajgE4rgTbyHuHpYnD4M6s6CZ-LFfmKd7xdwWe4oHDxHJuw3TLe2mPYYFK8nB44ILzw',
      e: 'AQAB',
      kid: '3h7d9CFTXBsJg0-sxBI5y',
      x5t: '7zbfhoPangMze0MsSOgZa9AbG6I',
      x5c: ['MIIDDTCCAfWgAwIBAgIJEdalNZAZ4b3KMA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNVBAMTGWRldi1ja2R4aDB6dC51cy5hdXRoMC5jb20wHhcNMjAwNjIxMDgzMTM0WhcNMzQwMjI4MDgzMTM0WjAkMSIwIAYDVQQDExlkZXYtY2tkeGgwenQudXMuYXV0aDAuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAvs/BTSTvbbmdZxbmWkkwSfe8K1kJIelr/3Zdgus634zyA7NnmgFjTQQ2cL7z72BxbaTgHNzRpmd/HEGPHKHFE2KgJyqkdJUSpcgpv5ZhZozH5I/ARfv/215zK5dIvl93NlUj+690Ec2HNxOK0jsr2un4TThODspff4sSceJKEphynnoatRyAhXrtz01xtZE5f1Cugp/zuxFFhenuJKlX4M2+JJet/BmAuplTGJ8hzZ64zyhUi7lEbPrAgT1+ESBCTt9eDEc5FFD7wpurdoShajgE4rgTbyHuHpYnD4M6s6CZ+LFfmKd7xdwWe4oHDxHJuw3TLe2mPYYFK8nB44ILzwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQj+r+kopHQYEImr4+/sB+xz8796TAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAAuDiFdxxrDOxDwg0769e0pvh2PeeoRgdCgLZ/fvPBGmLsGrB0ZUfOd2IpfDXqnXbYwo6V3oU/4Z1VAQH7W5Dto2hkReTJXSepqM237jmJjTVJjJFSLeqITX85Wg9Ndj5jnQHNRdFIT4K8Mu1qZFiI3TwD9qc0Uy5L6xwfsf/i4N+790LhVm0YJ8M4m127HnsNx5YEHoP4XOCkNHDdzH9MdeMam1lw4kExKQEhr7LuWDQrzKDu32OOOH2E078cfQpqrZyTmmTsy+y3iZArxRT17IDSOD7DhyhgUswhNEjYd4s8WiN/0wDn8pXiYKxjc1Ntbd9h51+SsHYydGiOwaI/w=']
    },
    {
      alg: 'RS256',
      kty: 'RSA',
      use: 'sig',
      n: 'p-9bAyxxkXxjgamMmN8EsOURtsNDNnviLx5uMXcH2wv_s-DkBEKDitRc0GVtwk6T0HDKZstS6DGJldR2BB3Cn1CBs2Z8-hEVSlXOrp9iR_z2aAzQQ79JX7ilV9sjNYy64qe7fdgC_Mg6ElxQ2JzceWeHP-O2Md2jbqZxC55ezi0g5KeCc4MAeBoD2gzfNf9ECprEEvr8oKNQTZNxhME4q8602V9aVayjuwLrjngINvJknrE3j9LqzYXAXWKGUO82p6P_lCDMEmaq4ARYnf7aJXttgGrzXOz-WPk32o0QffGuaBbbwmYX2uWps-avsrh5bSWs411c4zzSSlzW6strvQ',
      e: 'AQAB',
      kid: 'SW9vdriS2gmApVYbt-sfA',
      x5t: 'Jjc8gTTx1ZjgDrR4f6fXADsGYaE',
      x5c: [MIIDDTCCAfWgAwIBAgIJKwV3aYtZzkb1MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNVBAMTGWRldi1ja2R4aDB6dC51cy5hdXRoMC5jb20wHhcNMjAwNjIxMDgzMTM0WhcNMzQwMjI4MDgzMTM0WjAkMSIwIAYDVQQDExlkZXYtY2tkeGgwenQudXMuYXV0aDAuY29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAp+9bAyxxkXxjgamMmN8EsOURtsNDNnviLx5uMXcH2wv/s+DkBEKDitRc0GVtwk6T0HDKZstS6DGJldR2BB3Cn1CBs2Z8+hEVSlXOrp9iR/z2aAzQQ79JX7ilV9sjNYy64qe7fdgC/Mg6ElxQ2JzceWeHP+O2Md2jbqZxC55ezi0g5KeCc4MAeBoD2gzfNf9ECprEEvr8oKNQTZNxhME4q8602V9aVayjuwLrjngINvJknrE3j9LqzYXAXWKGUO82p6P/lCDMEmaq4ARYnf7aJXttgGrzXOz+WPk32o0QffGuaBbbwmYX2uWps+avsrh5bSWs411c4zzSSlzW6strvQIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBRA41BUPgMdfOkzqas3VRJMD1EKADAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAAgGgTZ06l8I9HTN8XxLL59E+DguG1IpQ0maXPBIFKD9WEgVBqbjakD2w23VuxGDEB8XRkNhyO02D7WcSZ8Zu+ZRIAYwLD+CcWBbXrsHNK1ct55VFSA1GXoIAMJIHy1WOZUB4X7aPA/8UouBTdVotrR/EpHF8DqesXW9uGh2o/ZfF/bA9nb4F97E+aHG7k6mK6bHebXMufIPUsOEWsm/3o+RRVVR2a+wkkL/vtzJqlyeCwcA4QbfCVr7pi5R213HvFidA4NMDf6F60kH8O7Nj/SkDtW7qVZn6B60nOVY3WVma6My6yZ3/joc2rQnPaBlnqNnHyCbnaSQtm4H56VtLLc=]
    }
  ]
}
*/