import * as uuid from 'uuid'

import { docsAccess } from '../dataLayer/Access'
import { ItemDoc } from '../models/ItemDoc'
import { updateAttachmentUrl } from './Items'

export async function generateUploadUrl(docId:string):Promise<string>{
    return await docsAccess.generateUploadUrl(docId)
}

export async function createDoc(todoId:string):Promise<ItemDoc>{
    //await docsAccess.createDoc(todoId)
    const docId = uuid.v4()
    const timestamp = new Date().toISOString()

    const newDoc:ItemDoc = {
        todoId,
        docId,
        timestamp,
        docUrl: `https://${process.env.DOCS_S3_BUCKET}.s3.amazonaws.com/${docId}`
    }

    await docsAccess.createDoc(newDoc)

    await updateAttachmentUrl(todoId, `https://${process.env.DOCS_S3_BUCKET}.s3.amazonaws.com/${docId}`)

    return newDoc
}

export async function getAllDocs(todoId:string):Promise<ItemDoc[]>{
    return await docsAccess.getAllDocs(todoId);
}