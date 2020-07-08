import * as uuid from 'uuid'
//import { getUserIdFromEvent } from '../../auth/utils'

import { TodoItem } from '../models/TodoItem'
import { UpdateItem } from '../models/UpdateItem'
import { itemsAccess } from '../dataLayer/Access'

export async function createTodoItem(userId:string, itemname:string, dueDate:string):Promise<TodoItem>{
    const todoId:string = uuid.v4() as string;
    const createdAt = new Date().toISOString();
    const done = false
    const newTodoItem:TodoItem = { 
        todoId,
        itemname,
        userId,
        createdAt,
        dueDate,
        done
    }

    return await itemsAccess.createTodoItem(newTodoItem);
}

export async function deleteTodoItem(todoId:string){
    await itemsAccess.deleteTodoItem(todoId);
}

export async function getTodos(userId:string):Promise<TodoItem[]>{
    return await itemsAccess.getAllTodoItems(userId);
}

export async function checkTodoItemExist(todoId:string):Promise<boolean>{
    return await itemsAccess.checkTodoItemExist(todoId);
}

export async function updateTodoItem(todoId:string, itemname:string, dueDate:string, done:boolean){
    const updateItem:UpdateItem = {
        todoId,
        itemname,
        dueDate,
        done
    }

    await itemsAccess.updateTodoItem(updateItem)
}