const prisma = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sendVerificationEmail = require("../utils/profileVerification");

const JWT_SECRET = process.env.JWT_SECRET || "secret";
const SALT_ROUNDS = 10;

exports.register = async (req, res) => {
  try {
    const { email, password, name, avatar } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(409).json({ error: "Email already used" });

    const hashed = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await prisma.user.create({
      data: { email, password: hashed, name, avatar },
    });
    console.log(req.body);

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    // await sendVerificationEmail(user);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    if (!email || !password)
      return res.status(400).json({ error: "Missing fields" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
exports.verifyEmail = async (req, res) => {
  try {
    const payload = jwt.verify(req.params.token, process.env.JWT_SECRET);
    // await prisma.user.update({
    //   where: { id: payload.id },
    //   data: { isVerified: true },
    // });
    res.send(`
  <html>
    <head>
      <title>Email Verified</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          padding: 50px;
          background: #f4f7fc;
        }
        .card {
          background: #fff;
          padding: 40px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
          display: inline-block;
        }
        h1 {
          color: #4CAF50;
        }
        p {
          margin-top: 10px;
          color: #555;
        }
        a {
          display: inline-block;
          margin-top: 20px;
          padding: 10px 20px;
          background: #4CAF50;
          color: #fff;
          text-decoration: none;
          border-radius: 5px;
        }
        a:hover {
          background: #45a049;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>✅ Email Verified Successfully!</h1>
        <p>Your account is now active. You can log in to EduFocus.</p>
     
      </div>
    </body>
  </html>
`);
  } catch (err) {
    res.status(400).send("Invalid or expired token.");
  }
};
