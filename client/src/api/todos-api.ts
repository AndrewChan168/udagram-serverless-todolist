import { apiEndpoint } from '../config'
import { Todo } from '../types/Todo';
import { ItemDoc } from '../types/ItemDoc';
import { CreateTodoRequest } from '../types/CreateTodoRequest';
import Axios from 'axios'
import { UpdateTodoRequest } from '../types/UpdateTodoRequest';

export async function getTodos(idToken: string): Promise<Todo[]> {
  console.log('Fetching todos')

  const response = await Axios.get(`${apiEndpoint}/todos`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Todos:', response.data)
  //return response.data.items
  return response.data.todoItems
}
/** newly added function */
export async function getDocs(idToken: string, todoIdToken: string): Promise<ItemDoc[]>{
  console.log(`Fetching todoItemDocs`)

  const response = await Axios.get(`${apiEndpoint}/todoDocs/${todoIdToken}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log(`itemDocs:`, response.data)
  return response.data.itemDocs
}

export async function createTodo(
  idToken: string,
  newTodo: CreateTodoRequest
): Promise<Todo> {
  console.log(`newTodo: ${JSON.stringify(newTodo)}`)
  try{}catch(err){console.log(`error in createTodo(): ${err.message}`)}
  const response = await Axios.post(`${apiEndpoint}/todos`,  JSON.stringify(newTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`,
    }
  })
  console.log(`response: ${response}`)
  return response.data.newTodoItem
}

export async function patchTodo(
  idToken: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/todos/${todoId}`, JSON.stringify(updatedTodo), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteTodo(
  idToken: string,
  todoId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/todos/${todoId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  todoId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/todos/${todoId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
  //await Axios.put(uploadUrl, {body:file})
  /*const config = {
    method:'put',
    url:uploadUrl,
    headers:{
      'Content-Type': 'image/jpeg'
    },
    data:{body:file},
  }
  try{
    const response = await Axios(config)
    console.log(JSON.stringify(response.data))
  }catch(err){
    console.error(`error on Axios(config) in uploadFile(): ${err.message}`)
  }*/
}

/**
 * const Axios = require('Axios')
 * const fs = require('fs')
 * 
 * const file = fs.readFileSync('C:\\Users\\andrcha3\\Downloads\\test_image_1.jpg')
 * 
 * const uploadUrl = 'https://andrcha3-udagram-serverless-docs-dev.s3.amazonaws.com/289e1486-5e4b-441c-9241-f0edc41f165f?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=ASIAVGJ2EZIC7FQX4GHO%2F20200712%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20200712T064226Z&X-Amz-Expires=300&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEK%2F%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLWVhc3QtMSJHMEUCIENiq3VhswxMraMhIAx6coEMCVZJzW5qjlJEd58EJEfrAiEA1H1Wv7uzr9EHPbEai88%2B0%2F27rRpzpJmITmQS5ORQNioq8AEIWBAAGgwzNTcxNDExMDUxNTciDH%2Fcgrp%2B1iPxS%2FqpRirNASGEdLfjC7JVysF3ntpV%2FZLCb5Gg98L1%2FfLRzKU%2BmRGBJBuYOmRAwsazwYZ77zg%2BgYw53rMi3JPh5gfjisLPCQrQ5DDrpKEj%2Br2mL5m5PACCUFpiKZTq%2BlKF0wX024rlt%2FogIxMPlihBrN78OJxOM%2F3c%2B4D%2FBrFfvB72SaXa%2FQI727UYvTB3LTS6o6FQ%2FTM%2BDpZJVf%2Fr8ZhiQ6nSs22WMHe0GNRGPRVAfvfMeYv%2BOm7JZqoSxEJ201oKS8aP7oQOzjIuAPzoBV%2BNhB%2Bn4K4w0eGq%2BAU64AFfHSs5b9htWHg15xU9IBi6U4yrmlipv6%2B5hRJDY%2F2norOPPrcWPbgOymC8XD8WOg83xQdE23uelSlNzUJfA5yywUJ5P8K8XLnGwFv%2B4BuED6arU5wkUvS%2BdKSchtfTwK9gIOatSnDqzdTe3nwnqo8dT8HEVjHTWXjsRhjQPuXyum4B3U11iYWuSPQeUAxdwGvPhENuQX4I9BqHoKRWKNq0R74O8MXiqXFs5rZKE0Rydk5R3K73BTh4rUmuvfZwRXbFzhuFqlAc8ioMSHACWxOwDQX022QQEIDM%2FFdHQueFeA%3D%3D&X-Amz-Signature=9381b474a122ce988eccb1c0cb20e5a1fd72225c02f0207d055d6589b1e2de84&X-Amz-SignedHeaders=host'
 * 
 * Axios.put(uploadUrl, file).then(res=>console.log(res)).catch(err=>console.log(err.message))
 */

/**
 * const Axios = require('Axios')
 * const url = 'https://bjvovgrbra.execute-api.us-east-1.amazonaws.com/dev/todos'
 * const idToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNoN2Q5Q0ZUWEJzSmcwLXN4Qkk1eSJ9.eyJpc3MiOiJodHRwczovL2Rldi1ja2R4aDB6dC51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDk0OTE3MzQ5NzI2OTU5NjQzNzkiLCJhdWQiOiI2bThYdDdRME9VZFNTdmQxSVlGbGtYTldYaDFKM3JyciIsImlhdCI6MTU5MzkyOTY1MSwiZXhwIjoxNTkzOTY1NjUxLCJhdF9oYXNoIjoiMF9qYVc0UXprWWZXVmRTVmhqY0x0dyIsIm5vbmNlIjoiQlMxLVVsRVByclVTTGw1OXZ6NnMwRE1kdHFzWWlrajcifQ.lXrK0ro0CNtAOb06T2iJI8ZDKAP8KNUc3Ye4ZlCTO1cu0TE0qBqML-mENMcPltKN-AmZJzK6S_jUPdmW0CJ58HpYllJsWuupUps5-W7MpoytfMw_KGdoGiQoAKPMODK53vduhxOP80rP1MXKnlbu_kaKBYVi1y7OT4xAKGfDN1i8PHnztOowbz65kKiNqod7epqgKNK_wSPZHtUoECvYdXhwWXudVrx3LRU0R5MvvEbT-K3bIa3jVTHGTswl_DZZkDeeG_V7D2zreJtky1aa400gIFYtHVPY7nje4G-RCllQXE35RVp6Hoh3dCvUbaW6G-Mlvv1yGi63y9iywdgCsA'
 * 
 * const body = { "userId" : "andrcha3", "itemname" : "cook dinner", "dueDate" : "2020-07-30"}
 * 
 * const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` }
 * 
 * Axios.post(url, body, { headers }).then(res=>console.log(res.data)).catch(err=>console.log(err.message))
 */

 /**
  * const Axios = require('Axios')
  * const url = 'https://jk9ty9z25b.execute-api.us-east-1.amazonaws.com/dev/todoDocs/5944fd2e-d305-4d4e-831b-ea2b0937814b'
  * 
  * const idToken = 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IjNoN2Q5Q0ZUWEJzSmcwLXN4Qkk1eSJ9.eyJpc3MiOiJodHRwczovL2Rldi1ja2R4aDB6dC51cy5hdXRoMC5jb20vIiwic3ViIjoiZ29vZ2xlLW9hdXRoMnwxMDk0OTE3MzQ5NzI2OTU5NjQzNzkiLCJhdWQiOiI2bThYdDdRME9VZFNTdmQxSVlGbGtYTldYaDFKM3JyciIsImlhdCI6MTU5NDMwMzA4NSwiZXhwIjoxNTk0MzM5MDg1LCJhdF9oYXNoIjoiNTdxMy12aFhDWjdEaDVrZnh0ei1QdyIsIm5vbmNlIjoiS1l-dHBxNm9GZ05BN3RRSjFTd0hGR053aGJSWkFqSy4ifQ.gU8oDYpIRB3b5Bt1RQz1RK34fRa2NC4_a2fTTcmNxYaRmfoqaF7kfr8BoI_OblKHN4xg7ofkALuYHBsuRaFFUtGPv3vRLPoYu9npP5qEUIm14qQCKecMDF9S2R99GTFWTzd3mvkySW5EV4-x6EAGUVYUExJ0iEYYenmZ7xa3mV9SyKu7HKlmnQVCv7FZzBPFSUB2wI5lFnopD2m0O8_V2RnRlBJy-Cicu05w49-5HoDqGwEquG1HS8-s9iVzLp2cFuxmGPeThYjgieAcd9rYsMU4tmPo3oae68L6lS2KPM9H4KfZex2GaFarYC2BMVP_zXVjrBpqKZ17kUnzhEDChg'
  * 
  * const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${idToken}` }
  * 
  * Axios.get(url, { headers }).then(res=>console.log(res.data)).catch(err=>console.log(err.message))
  */