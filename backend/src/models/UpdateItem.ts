export interface UpdateItem{
    todoId: string,
    itemname?: string,
    dueDate?: string,
    done?: boolean,
    attachmentUrl?:string
}