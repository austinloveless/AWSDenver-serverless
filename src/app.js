const express = require("express");
const app = express();
const BasicRoutes = require("./routes/BasicRoutes");
const bodyParser = require("body-parser");
const cors = require("cors");
const awsServerlessExpressMiddleware = require("aws-serverless-express/middleware");
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs");
const swaggerDocument = YAML.load("./swagger/routes.yaml");

app.use(cors());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(awsServerlessExpressMiddleware.eventContext());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/api", BasicRoutes);

app.get("/*", (req, res) => {
  res.status(500).send({ Error: "Invalid URL, Please try different URL" });
});

module.exports = app;
