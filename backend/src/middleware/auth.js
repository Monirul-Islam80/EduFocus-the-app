const jwt = require("jsonwebtoken");
const prisma = require("../config/db");
const JWT_SECRET = process.env.JWT_SECRET || "secret";

module.exports = async function (req, res, next) {
  const auth = req.headers.authorization;

  if (!auth?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = auth.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET);

    if (!payload?.id) {
      return res.status(401).json({ error: "Invalid token payload", payload });
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });
    console.log(user);

    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err.message);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
