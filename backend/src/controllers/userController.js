const prisma = require("../config/db");
exports.getProfile = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return res.status(401).json({ error: "Invalid User. Login Required!!" });

    res.json({
      token: req.headers.authorization,
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
exports.createTodo = async (req, res) => {
  try {
    const {
      title,
      type,
      priority,
      selectedDate,
      selectedTime,
      createdById,
      courseId,
    } = req.body;
    console.log(
      title,
      type,
      priority,
      selectedDate,
      selectedTime,
      createdById,
      courseId
    );

    const todo = await prisma.todo.create({
      data: {
        title,
        type: type || "todo",
        priority,
        selectedDate,
        selectedTime,
        createdById,
        courseId: courseId || null,
      },
    });

    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create todo" });
  }
};
exports.getTodo = async (req, res) => {
  try {
    const { userId } = req.params;

    const todos = await prisma.todo.findMany({
      where: {
        createdById: parseInt(userId),
      },
      include: {
        createdBy: true,
        course: true,
      },
      orderBy: {
        selectedDate: "asc",
      },
    });

    res.status(200).json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch todos for this user" });
  }
};
