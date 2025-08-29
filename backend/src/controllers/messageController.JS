const prisma = require("../config/db");

exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  const senderId = req.user.id;

  if (!content || !chatId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  try {
    let message = await prisma.message.create({
      data: {
        content,
        senderId,
        chatModelId: chatId,
      },
      include: {
        sender: { select: { id: true, name: true, avatar: true, email: true } },
        chatModel: {
          include: {
            users: {
              include: {
                user: {
                  select: { id: true, name: true, email: true, avatar: true },
                },
              },
            },
          },
        },
      },
    });

    await prisma.chatModel.update({
      where: { id: chatId },
      data: {
        messages: {
          connect: { id: message.id },
        },
      },
    });

    res.status(201).json(message);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.allMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    const messages = await prisma.message.findMany({
      where: { chatModelId: parseInt(chatId) },
      include: {
        sender: {
          select: { id: true, name: true, email: true, avatar: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });
    res.status(200).json(messages);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// model Message {
//   id          Int        @id @default(autoincrement())
//   content     String
//   sender      User       @relation(fields: [senderId], references: [id])
//   senderId    Int
//   chatModel   ChatModel? @relation(fields: [chatModelId], references: [id])
//   chatModelId Int?
//   createdAt   DateTime   @default(now())
//   updatedAt   DateTime   @updatedAt
//   Course      Course?    @relation(fields: [courseId], references: [id])
//   courseId    Int?
// }
