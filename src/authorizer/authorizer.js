exports.handler = async function(event) {
  const token = event.queryStringParameters.auth.toLowerCase();
  const methodArn = event.methodArn;

  switch (token) {
    case process.env.AUTHORIZER_TOKEN:
      return generateAuthResponse("user", "Allow", methodArn);
    case "deny":
      return generateAuthResponse("user", "Deny", methodArn);
    default:
      return Promise.reject("Error: Invalid token"); // Returns 500 Internal Server Error
  }
};

function generateAuthResponse(principalId, effect, methodArn) {
  const context = {
    stringKey: "stringval",
    numberKey: 123,
    booleanKey: true
  };
  const policyDocument = generatePolicyDocument(effect, methodArn);

  return {
    principalId,
    context,
    policyDocument
  };
}

function generatePolicyDocument(effect, methodArn) {
  if (!effect || !methodArn) return null;

  const policyDocument = {
    Version: "2012-10-17",
    Statement: [
      {
        Action: "*",
        Effect: effect,
        Resource: "*"
      }
    ]
  };

  return policyDocument;
}
