const { expressjwt: jwt } = require("express-jwt");
const jwksRsa = require("jwks-rsa");
require("dotenv").config();

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksUri: `${process.env.AUTH0_ISSUER}.well-known/jwks.json`
  }),
  audience: process.env.AUTH0_AUDIENCE,
  issuer: process.env.AUTH0_ISSUER,
  algorithms: ["RS256"],
  credentialsRequired: true,
});

const attachUser = (req, res, next) => {
  if (req.auth) {
    req.user = { auth0_id: req.auth.sub };
  }
  next();
};

module.exports = { checkJwt, attachUser }; // 📌 Asegurar exportación como objeto con claves separadas
