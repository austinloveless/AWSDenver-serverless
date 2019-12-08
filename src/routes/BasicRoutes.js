const express = require("express");
const router = express.Router();
const dynamoDbLib = require("../lib/dynamodb.js");
const uuid = require("uuid");

router.get("/", (req, res) => {
  dynamoDbLib
    .call("scan", { TableName: process.env.TABLE_NAME })
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.send(error);
    });
});

router.get("/:id", (req, res) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: req.params.id
    }
  };
    dynamoDbLib.call("get", params)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.send(error);
    });
});

router.post("/", (req, res) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: uuid.v1(),
      name: req.body.name,
      createdAt: Date.now()
    }
  };
  dynamoDbLib.call("put", params)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.send(error);
    });
});

router.put("/:id", (req, res) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: req.params.id
    },
    UpdateExpression: "SET #name = :name",
    ExpressionAttributeNames: {
      "#name": "name"
    },
    ExpressionAttributeValues: {
      ":name": req.body.name || null
    },
    ReturnValues: "ALL_NEW"
  };
  dynamoDbLib.call("update", params)
    .then(response => {
      res.status(200).json(response);
    })
    .catch(error => {
      res.send(error);
    });
});

router.delete("/:id", (req, res) => {
  const params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: req.params.id,
    }
  };
    dynamoDbLib.call("delete", params)
    .then(response => {
      res.status(200).json(`deleted ${req.params.id}`);
    })
    .catch(error => {
      res.send(error);
    });
});

module.exports = router;
