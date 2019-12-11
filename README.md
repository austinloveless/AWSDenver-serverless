AWS Denver Serverless Meetup
==============================================

Prerequisite
-----------
- Create an [AWS Account](https://aws.amazon.com/
)
- Create a [GitHub Account](https://github.com/)
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

# What does this project create? 

You are creating two APIs. One with Lambda and one without. 

Resources: 
---

- 1 DynamoDB table
- 2 AWS Lambda functions "AWSDenverFunction" and "APIAuthorizer"
- 2 API Gateway APIs "AWSLambdalessAPI" and "AWSLambdafullAPI"
- 2 Systems Manager Parameter store parameters. "DENVER_TABLE_NAME" and "DENVER_AUTHORIZER_TOKEN". 

# Tutorial

After install all the pre reqs and cloning the repo you can do the following to get the project up and running. 

First 
----

In the AWS console we need to create an IAM user. 

![Picture of clicking into IAM](link-to-image)

Go to the IAM Dashboard and select "Users". Then select "Add User". 

Give your user a name and select "Programmatic Access"

![Picture of Add user screen filled out](link-to-image)

Hit "Next: Permissions" and then select "Attach existing policies directly". From there add "AdministratorAccess".

Then hit "Next: Tags" to add any tags if you'd like. Lastly hit "Next: Review" and "Create User". 

![Picture of successfully created user](link-to-image)

After creating a user copy the access key and in a terminal run the command `aws configure` this will link your machine up with your AWS account. After running the command you will be prompted to input your "AWS Access Key ID:" then copy the one in the IAM Console. And repeat this for the "AWS Secret Access Key:". Set your region to "us-east-1" and hit enter. 

![Picture of Terminal filled out. ](link-to-image)

Second
-----
After you have your IAM user credentials inputed and have ran the `aws configure` command we can create some environment variables. 

We need to set two environment variables to keep our information secure and for template reusability.

So we are using AWS Systems Manager Parameter Store to store our private information. 

The first one creates a parameter called "DENVER_TABLE_NAME" to secure the name of the table and make these template reusable. 

`aws ssm put-parameter --name "DENVER_TABLE_NAME" --value "YOUR_TABLE_NAME" --type String`

The second parameter is called "DENVER_AUTHORIZER_TOKEN" which we will create in order to secure the value of our API authorizer. 

`aws ssm put-parameter --name "DENVER_AUTHORIZER_TOKEN" --value "allow" --type String`


![Picture of Terminal of inputting both parameters](link-to-image)


Third
------

Now that we have our environment varibles and user set up we can create the actual project. 

We need to go back into the [AWS Console](https://aws.amazon.com/) and search for a service called "CodeStar" 

![Picture of Searching for CodeStar](link-to-image)

From the CodeStar console click "Create a new project". Then select "Express.js AWS Lambda" its on the far right" 

![Picture of Selecting express.js](link-to-image)

Give the project a name and selected "GitHub" as your repository of choice. Connect your project to github and select "Next" and "Create Project". *Be sure you select GitHub*

![Picture of project details](link-to-image)

Your project will take a few minutes to be created and will create you a repo and a full CI/CD pipeline. 

![Picture of CodeStar after creation](link-to-image)

Fourth
------

Now that you have created a template project in CodeStar we need to update the template to have the same code as this repo. 
Instead of copy and pasting over and possible creating errors we should do some Git magic. 

So go to the repo link that is provides in CodeStar. When you successful create the project you should see on the left hand side a link that says "Code". That will bring you directly to the repo. 

Once in the repo run a `git clone < YOUR REPO >` in your terminal to get the project on your machine. 

First clone the repo `git clone https://github.com/austinloveless/AWSDenver-serverless.git`

After you’ve cloned the repo created from CodeStar and my repo cd into the directory of the CodeStar repo and run `git remote -v`. Take note of the url e.g. `<your repo address> (fetch)`.

Next `cd` into the AWSDenver-serverless directory and run `git remote rm origin` to remove the origin. Then run `git remote add origin <your repo address>`. 

Verify you have changed the origin with `git remote -v`.

Finally run `git push --set-upstream origin master --force` to push the code up to CodeStar and you should have an updated repo like this repo.

Force pushing to master is very dangerous, and could even get you in trouble at work if your company has a policy disallowing it.  Use this technique with great care.  You should only need to force push once during this lab.

![Picture of commands](link-to-image)

If you go back to CodeStar you should see it updating your project in the "Continuous deployment" section. 

![Picture of CodeStar with build](link-to-image)

You're project will fail the deployment though because we need to do a couple more steps. We need to update some code in the repo and update permissions of an IAM user. 

First what we can do is update the AccountID in the repo. Unfortunately CloudFormation doesn't support adding AccountIds or Regions in Swagger definitions. So we have to hard code it. If you go into the "Swagger" folder you'll see two files. This is where we have defined our APIs. Go in both files and search for `<YOUR ACCOUNT ID>`. We need to replace all of those with your Account ID. So we'll have to go back into the console grab the account ID and paste it in. 

![Picture of Swagger](link-to-image)


If you go to the console and go to the top right of the console you should see a your username. Click that and a drop down will open up. Click "My Account" your 12-digit account ID is listed under Account Settings. Copy that and paste that into your code.

![Picture of AccountID](link-to-image)


Finally
----

Now we are almost finished we have one more step and then we can deploy our code successfully. 

We need to add 3 roles to our Cloudformation role in CodeStar. We have to do this because we updates some settings in CodeDeploy, IAM, and Systems Manager. 

So go into the AWS console and search for CodeStar again. On the far left hand side in the same navigation you used earlier to get to your code click "Project" at the very bottom. 

From there you will be able to "Project Resources" if you scroll down towards the bottom of that you will see "AWS IAM". Look for the role with the extension "CloudFormation" e.g. `arn:aws:iam::<AccountID>:role/CodeStarWorker-awsdenver-serve-CloudFormation`.

![Picture of iam role dashboard](link-to-image)

Click into that role and it will bring you to the IAM page. From there you should see a blue button called "Attach policies" click that and in the search bar look for "AWSCodeDeployFullAccess", "IAMFullAccess", and "AmazonSSMFullAccess" select it and at the bottom hit "Attach Policy".

![Picture of attached polices](link-to-image)

Adding full access to these services is more permissive than you should allow, but for simplicity of this project we are adding full access. If you want to be more granular you can adjust polices as needed.

Now if you back to your code you can push all your changes up to github. Once you've done that you can go back to the CodeStar console and watch it build the resources. After its completed successfully you should have two APIs one with Lambda and one without. 

Using your newly created APIs
------
 
 Now that you have successfully created the project you should test the api. In CodeStar look on the right hand side for "Continuous deployment" and down at the bottom look for a link to "CloudFormation" clicking that will redirect you to the CloudFormation stack. From there you can hit "Outputs" and you should see links to your API from there. 


Testing the API
 ----

 The lambaless API does not have any security on it so you can hit that without any issues. 

 The LambdaFull API has an Authorizer attached to it. In order to be authenicated you have to hit the api and add `?auth=allow` at the end of the endpoint in order to authorize your self. You can look in the code at the `src/authorizer/authorizer.js` file to see more about it. 

 Since this project creates you an empty DynamoDB table you won't have any data. So when you hit the endpoint it will probably be an empty response. 


Running the project locally
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

What Should I Do Before Running My Project in Production?
------------------

AWS recommends you review the security best practices recommended by the framework
author of your selected sample application before running it in production. You
should also regularly review and apply any available patches or associated security
advisories for dependencies used within your application.

Best Practices: https://docs.aws.amazon.com/codestar/latest/userguide/best-practices.html?icmpid=docs_acs_rm_sec
