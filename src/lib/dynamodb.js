const AWS = require("aws-sdk");

const call = (action, params) => {
  const dynamoDb = new AWS.DynamoDB.DocumentClient();

  return dynamoDb[action](params).promise();
};

module.exports = { call };
