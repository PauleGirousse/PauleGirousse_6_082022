const jwt = require("jsonwebtoken");

// Fonction d'authentification à partir du token pour autoriser l'accès aux différentes routes
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(
      token,
      `${process.env.RANDOM_TOKEN_SECRET}`
    );
    const userId = decodedToken.userId;
    req.auth = {
      userId,
    };
    next();
  } catch (error) {
    res.status(401).json({ error });
  }
};
