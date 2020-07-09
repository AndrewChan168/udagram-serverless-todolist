import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

import { TodoItem } from '../models/TodoItem'
import { ItemDoc } from '../models/ItemDoc'
import { UpdateItem } from '../models/UpdateItem'
//import { createLogger } from '../utils/logger'

//const logger = createLogger(`Access logger`)


class ItemsAccess{
    constructor(
        private readonly docClient: DocumentClient,
        private readonly todoItemsTable:string,
        private readonly todoItemIndex:string,
    ){}

    async getAllTodoItems(userId:string): Promise<TodoItem[]>{
        //console.log(`getting all todo items of ${userId}`);
        const result = await this.docClient.query({
            TableName: this.todoItemsTable,
            IndexName: this.todoItemIndex,
            KeyConditionExpression: 'userId=:userId',
            ExpressionAttributeValues: {
                ':userId':userId
            }
        }).promise()

        const items = result.Items

        return items as TodoItem[]
    }

    async createTodoItem(newTodoItem:TodoItem):Promise<TodoItem>{
        //console.log(`creating new todo item of userId: ${newTodoItem.userId} with toDoId: ${newTodoItem.todoId}`)
        await this.docClient.put({
            TableName: this.todoItemsTable,
            Item: newTodoItem,
        }).promise()
        return newTodoItem;
    }

    async deleteTodoItem(todoId:string){
        //console.log(`deleting todoItem of ${todoId}`)
        await this.docClient.delete({
            TableName: this.todoItemsTable,
            Key: {"todoId":todoId}
        }).promise()
    }

    async checkTodoItemExist(todoId:string):Promise<boolean>{
        //console.log(`checking todoItem of ${todoId}`)
        const result = await this.docClient.get({
            TableName: this.todoItemsTable,
            Key: {
                todoId:todoId,
            }
        }).promise()

        return !!result.Item;
    }

    async updateTodoItem(updateItem:UpdateItem){
        //console.log(`updating todoItem of ${updateItem.todoId}`)
        await this.docClient.update({
            TableName: this.todoItemsTable,
            Key: {"todoId":updateItem.todoId},
            UpdateExpression: "set itemname=:itemname, dueDate=:dueDate, done=:done",
            ExpressionAttributeValues: {
                ":itemname":updateItem.itemname,
                ":dueDate":updateItem.dueDate,
                ":done":updateItem.done,
            },
            ReturnValues:"UPDATED_NEW"
        }).promise()
    }
}

export const itemsAccess:ItemsAccess = new ItemsAccess(
    new AWS.DynamoDB.DocumentClient(),
    process.env.TODO_ITEMS_TABLE,
    process.env.ITEM_ID_INDEX,
);


class DocsAccess{
    constructor(
        private readonly docClient: DocumentClient,
        private readonly s3: AWS.S3,
        private readonly itemDocTable:string,
        private readonly itemDocIndex:string,
    ){}

    async generateUploadUrl(docId:string):Promise<string>{
        //console.log(`generating upload url from s3 for itemDoc: ${docId} with doc`)
        return this.s3.getSignedUrl('putObject', {
            Bucket: process.env.DOCS_S3_BUCKET,
            Key: docId,
            Expires: parseInt(process.env.SIGNED_URL_EXPIRATION)
        })
    }

    async createDoc(itemDoc:ItemDoc){
        //console.log(`creating doc for toDoId ${itemDoc.todoId} with itemDocId ${itemDoc.docId}`)
        await this.docClient.put({
            TableName: this.itemDocTable,
            Item: itemDoc
        }).promise()
    }

    async getAllDocs(todoId:string):Promise<ItemDoc[]>{
        //console.log(`getting all Docs of todoId: ${todoId}`)
        const result = await this.docClient.query({
            TableName: this.itemDocTable,
            IndexName: this.itemDocIndex,
            KeyConditionExpression: 'todoId=:todoId',
            ExpressionAttributeValues: {
                ':todoId':todoId
            }
        }).promise()

        const items = result.Items

        return items as ItemDoc[]
    }
}

const XAWS = AWSXRay.captureAWS(AWS)
export const docsAccess:DocsAccess = new DocsAccess(
    new XAWS.DynamoDB.DocumentClient(),
    new AWS.S3({ signatureVersion: 'v4' }),
    process.env.ITEM_DOCS_TABLE,
    process.env.DOC_ID_INDEX,
)