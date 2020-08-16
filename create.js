import * as uuid from "uuid";
import handler from "./libs/handler-lib";
import dynamoDb from "./libs/dynamodb-lib";

var today = new Date();
var dd = String(today.getDate()).padStart(2, '0');
var mm = String(today.getMonth() + 1).padStart(2, '0');
var yyyy = today.getFullYear();

today = dd + '/' + mm + '/' + yyyy;

export const main = handler(async (event, context) => {
    const data = JSON.parse(event.body);
    const params = {
        TableName: process.env.tableName,
        // 'Item' contains the attributes of the item to be created
        // - 'userId': user identities are federated through the
        //             Cognito Identity Pool, we will use the identity id
        //             as the user id of the authenticated user
        // - 'noteId': a unique uuid
        // - 'content': parsed from request body
        // - 'attachment': parsed from request body
        // - 'createdAt': current Unix timestamp
        Item: {
            clientId: event.requestContext.identity.cognitoIdentityId,
            vendaId: uuid.v1(),
            criadoem: today,
            cliente: data.cliente,
            produto: data.produto,
            quantidade: data.quantidade,
            endereco: data.endereco
        }
    };

    await dynamoDb.put(params);

    return params.Item;
});