// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'jk9ty9z25b'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {
  // TODO: Create an Auth0 application and copy values from it into this map
  domain: 'dev-ckdxh0zt.us.auth0.com',            // Auth0 domain
  clientId: '6m8Xt7Q0OUdSSvd1IYFlkXNWXh1J3rrr',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
