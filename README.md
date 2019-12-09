AWS Denver Serverless Meetup
==============================================

Prerequisite
-----------
- Create an [AWS Account](https://aws.amazon.com/
)
- Install Docker Desktop [Mac](https://docs.docker.com/docker-for-mac/install/) or [Windows](https://docs.docker.com/docker-for-windows/install/)

- Install [AWS CLI](https://aws.amazon.com/cli/) 

- Install [AWS SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)

- Install [Node.js](https://nodejs.org/en/download/)


What's Here
-----------

This project includes:

* README.md - this file

* buildspec.yml - this file is used by AWS CodeBuild to package your service for deployment to AWS Lambda

* src/app.js - this file contains the sample Node.js code for the web service

* index.js - this file contains the AWS Lambda handler code

* template.yml - this file contains the AWS Serverless Application Model (AWS SAM) used
  by AWS CloudFormation to deploy your service to AWS Lambda and Amazon API
  Gateway.

* routes.yaml - this file is used to define routes for API Gateway through Swagger with AWS Lambda

* lambdalessRoutes.yaml - this file is used to define routes for API Gateway through swagger directly to DynamoDB

* tests/ - this directory contains unit tests for your application
* template-configuration.json - this file contains the project ARN with placeholders used for tagging resources with the project ID

What Do I Do Next?
------------------

After you have cloned the repo `git clone https://github.com/austinloveless/AWSDenver-serverless.git`

And after you have installed the Prerequisites.

You can run: 

    1. npm install

    2. npm start

This will start the application. You can go to `http://localhost:3000` in your browser. 

Start playing around with the code in `src/app.js` or `src/routes/BasicRoutes.js` to get a feel for how things work. 

Commands
--------

To start the application run: `npm start`

To validate changes made to `template.yml` are correct run the command `npm run validate`

# Pre Deployment

Adding Environment Variables
----- 

We have to add environment variables before we can deploy our project

`aws ssm put-parameter --name "DENVER_TABLE_NAME" --value "YOUR_TABLE_NAME" --type String`

`aws ssm put-parameter --name "DENVER_AUTHORIZER_TOKEN" --value "allow" --type String`


### If you have downloaded this project from github and want to deploy the project run: 

`aws cloudformation package --template template.yml --s3-bucket < YOUR S3 BUCKET > --output-template template-export.yml`


What Should I Do Before Running My Project in Production?
------------------

AWS recommends you review the security best practices recommended by the framework
author of your selected sample application before running it in production. You
should also regularly review and apply any available patches or associated security
advisories for dependencies used within your application.

Best Practices: https://docs.aws.amazon.com/codestar/latest/userguide/best-practices.html?icmpid=docs_acs_rm_sec
