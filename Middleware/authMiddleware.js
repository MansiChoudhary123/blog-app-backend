const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"]; // Token will be sent in the Authorization header

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied, no token provided" });
  }

  try {
    // Verify the token using your secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the user info to the request object
    req.user = decoded;
    next(); // Proceed to the next middleware or route handler
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: "Invalid token" });
  }
};

module.exports = authenticateUser;
