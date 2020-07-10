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
  //await Axios.put(uploadUrl, file)
  await Axios.put(uploadUrl, {body:file})
}

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