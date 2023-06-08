const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const next = require('next');
const cors = require('cors');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const path = require('path');
const bodyParser = require('body-parser');
const { upload } = require('./utilsServer/helpers/filehelper');
const { singleFileUpload, multipleFileUpload,
  getallSingleFiles, getallMultipleFiles } = require('./api/upload');

const connectDb = require('./utilsServer/connectDb');
const {
  addUser,
  removeUser,
  findConnectedUser,
} = require('./utilsServer/roomActions');
const {
  loadMessages,
  sendMsg,
  setMsgToUnread,
  deleteMsg,
} = require('./utilsServer/messageActions');
const { likeOrUnlikePost, commentPost } = require('./utilsServer/postActions');

require('dotenv').config();
connectDb();
app.use(express.json());
const PORT = process.env.PORT || 3000;

const corsOptions = {
  origin: '*',
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

app.use(cors()); // Use this after the variable declaration

// Socket Io
io.on('connection', (socket) => {
  socket.on('join', async ({ userId }) => {
    const users = await addUser(userId, socket.id);
    console.log(users);
    setInterval(() => {
      socket.emit('connectedUsers', {
        users: users.filter((user) => user.userId !== userId),
      });
    }, 1000);
  });
  socket.on('likePost', async ({ postId, userId, like }) => {
    const { success, name, profilePicUrl, username, postByUserId, error } =
      await likeOrUnlikePost(postId, userId, like);
    if (success) {
      socket.emit('postLiked');
      if (postByUserId !== userId) {
        const receiverSocket = findConnectedUser(postByUserId);
        if (receiverSocket && like) {
          // WHEN YOU WANT TO SEND DATA TO ONE PARTICULAR CLIENT
          io.to(receiverSocket.socketId).emit('newNotificationReceived', {
            name,
            profilePicUrl,
            username,
            postId,
          });
        }
      }
    }
  });
  socket.on('commentPost', async ({ postId, userId, text }) => {
    console.log('on commentPost');
    const {
      success,
      commentId,
      name,
      profilePicUrl,
      username,
      postByUserId,
      error,
    } = await commentPost(postId, userId, text);
    if (success) {
      console.log('success Bro');
      socket.emit('newCommentPosted', { commentId });
      if (postByUserId !== userId) {
        const receiverSocket = findConnectedUser(postByUserId);
        if (receiverSocket && text) {
          // WHEN YOU WANT TO SEND DATA TO ONE PARTICULAR CLIENT
          console.log('Sending data to Socket');
          io.to(receiverSocket.socketId).emit('newNotifCommentReceived', {
            name,
            profilePicUrl,
            username,
            postId,
            text,
          });
        }
      }
    }
  });
  socket.on('loadMessages', async ({ userId, messagesWith }) => {
    const { chat, error } = await loadMessages(userId, messagesWith);
    !error
      ? socket.emit('messagesLoaded', { chat })
      : socket.emit('noChatFound');
  });
  socket.on('sendNewMsg', async ({ userId, msgSendToUserId, msg }) => {
    const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
    const receiverSocket = findConnectedUser(msgSendToUserId);
    if (receiverSocket) {
      // WHEN YOU WANT TO SEND MESSAGE TO A PARTICULAR SOCKET
      io.to(receiverSocket.socketId).emit('newMsgReceived', { newMsg });
    }
    //
    else {
      await setMsgToUnread(msgSendToUserId);
    }
    !error && socket.emit('msgSent', { newMsg });
  });
  socket.on('deleteMsg', async ({ userId, messagesWith, messageId }) => {
    const { success } = await deleteMsg(userId, messagesWith, messageId);
    if (success) socket.emit('msgDeleted');
  });
  socket.on(
    'sendMsgFromNotification',
    async ({ userId, msgSendToUserId, msg }) => {
      const { newMsg, error } = await sendMsg(userId, msgSendToUserId, msg);
      const receiverSocket = findConnectedUser(msgSendToUserId);
      if (receiverSocket) {
        // WHEN YOU WANT TO SEND MESSAGE TO A PARTICULAR SOCKET
        io.to(receiverSocket.socketId).emit('newMsgReceived', { newMsg });
      }
      //
      else {
        await setMsgToUnread(msgSendToUserId);
      }
      !error && socket.emit('msgSentFromNotification');
    }
  );
  socket.on('disconnect', () => removeUser(socket.id));
});

// Multer
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/1', express.static(path.join(__dirname, 'uploads/1')));

// Router
nextApp.prepare().then(() => {
  app.use('/api/signup', require('./api/signup'));
  app.use('/api/auth', require('./api/auth'));
  app.use('/api/search', require('./api/search'));
  app.use('/api/posts', require('./api/posts'));
  app.use('/api/profile', require('./api/profile'));
  app.use('/api/notifications', require('./api/notifications'));
  app.use('/api/chats', require('./api/chats'));
  app.use('/api/reset', require('./api/reset'));
  app.use('/api/test', require('./api/test'));

  app.use('/api/singleFile', upload.single('file'), singleFileUpload);
  app.use('/api/multipleFiles', upload.array('files'), multipleFileUpload);
  app.use('/api/getSingleFiles', getallSingleFiles);
  app.use('/api/getMultipleFiles', getallMultipleFiles);

  app.all('*', (req, res) => handle(req, res));

  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log('Express server running');
  });
});
