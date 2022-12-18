const should = require('should');

const {
    ChatController,
    UserController,
    MessageController,
} = require('../controllers');

// User CRUD TESTS directly from UserController
describe('[User model]', function() {

  const controller = new UserController();

  const data = {name: 'Igor', age: 23, password: 'helloworld', email: 'helloworld@mail.ru'};

  before(async function () {
  
    await controller.deleteUsers();
    //await user.registerUser(data);  
  });
  
  describe('checkCollection', function() {
    it('collection is empty', async function() {
      const len = await controller.model.count();
      (len).should.equal(0);
    })
  })

  describe('register', function() {
    
    it('registration successfull', async function () {
      await controller.registerUser(data);

      (await controller.model.count()).should.equal(1);
      
      const objects = await controller.model.getAll();
      Array.isArray(objects).should.ok();
      objects.should.have.length(1);

      const user = objects[0];
      user.should.have.property('name', data.name);
      user.should.have.property('email', data.email);
      user.password.should.not.be.equal(data.password);
    });

  });

  describe('login', function() {
    it('login successfull', async function() {
      const userData = await controller.loginUser(data.email, data.password);
      userData.should.have.property('name', data.name);
      userData.should.have.property('id');

      const {online} = await controller.model.get(userData.id);
      online.should.be.ok();
    })
  })

  describe('logout', function() {
    it('logout successfull', async function() {
      const {_id} = await controller.model.get({email: data.email});
      const result = await controller.logoutUser(_id);

      result.should.be.ok();

      const {online} = await controller.model.get(_id);
      online.should.be.not.ok();
    })
  })

  describe('delete', function() {
    it('delete successfull', async function() {

      const {_id} = await controller.model.get({email: data.email});
      const deleted = await controller.deleteUser(_id);
      deleted.should.be.exactly(1);
    })
  })
})

// Chat CRUD TESTS directly from ChatController
describe('[Chat model]', function() {
  
  const controller = new ChatController();
  
  // controller and fields for creator
  const creator = {name: 'John', age: 22, email: 'hello@mail.com', password: 'helloworld'};
  const userController = new UserController();
  let secondUserId; // for deletion from chat

  // controller for messages
  const msgController = new MessageController();
  
  const chatData = {name: 'first chat tested'};

  before(async function() {
    // delete all chats
    await controller.model.deleteAll();
    (await controller.model.getAll()).should.have.lengthOf(0);
    
    // create user as a chat creator
    await userController.registerUser(creator)
    const userId = await userController.model.getId({email: creator.email});
    userId.should.be.ok();    
    
    // add necessary fields for chat instance
    chatData.creatorId = userId;
    chatData.uniqueId = controller.model.encodeValue(chatData.name);
  })

  describe('add', function() {
    it('create chat successfull', async function() {
      await controller.addChat(chatData);
      const chat = await controller.model.get({uniqueId: chatData.uniqueId});
      //console.log(chat);process.exit()
      chat.should.be.instanceof(Object);
      chat.should.have.properties({
        ...chatData,
        // auto adding creator to users
        users: [chatData.creatorId]
      });
    })

    it('add message successfull', async function() {
      const chatId = await controller.model.getId({uniqueId: chatData.uniqueId});
      chatId.should.be.ok();

      const msgId = await msgController.addMessage(
        {
          body: 'my first message',
          creatorId: await userController.model.getId({email: creator.email}),
          chatId,
        }
      )

      msgId.should.be.ok();

      await controller.addMessage(chatId, msgId);
      const result = await controller.getChatData(chatId);
      result.messages.should.have.lengthOf(1);
    })

    it('add user successfull', async function() {
      const chatId = await controller.model.getId({uniqueId: chatData.uniqueId});
      should(chatId).be.not.null();

      const userId = await userController.registerUser({
        name: 'John',
        age: 22,
        email: 'geeks@gmail.com',
        password: 'myshortpassword',
        chats: [chatId]
      });

      should(userId).be.not.null();

      await controller.addUser(chatId, userId);
      const result = await controller.getChatData(chatId);
      result.users.should.have.lengthOf(2);

      secondUserId = userId;
    })
  })

  describe('delete', function() {
    it('delete message successfull', async function() {
      let chat = await controller.model.get({uniqueId: chatData.uniqueId});
      should(chat).be.not.null();

      chat.messages.should.have.lengthOf(1);

      await controller.deleteMessage(chat._id, chat.messages[0]);
      
      chat = await controller.getChatData(chat._id);
      should(chat).be.not.null();
      chat.messages.should.have.lengthOf(0);
    })

    it('delete users successfull', async function() {
      let chat = await controller.model.get({uniqueId: chatData.uniqueId});
      should(chat).be.not.null();

      chat.users.should.have.lengthOf(2); //including creator

      await controller.deleteUser(chat._id, secondUserId);
      
      chat = await controller.getChatData(chat._id);
      should(chat).be.not.null();

      // chat only has creator in users
      chat.users.should.have.lengthOf(1);

      await controller.deleteUser(chat._id, chatData.creatorId);
      chat = await controller.getChatData(chat._id);

      // chat has nobody in users
      chat.users.should.have.lengthOf(0);
    })

    it('delete chat successfull', async function() {
      let count = await controller.model.count();
      count.should.be.exactly(1);

      const id = await controller.model.getId({uniqueId: chatData.uniqueId});
      await controller.deleteChat(id);

      count = await controller.model.count();
      count.should.be.exactly(0);
    })
  })

})

// Message CRUD TESTS directly from MessageController
describe('[Message model]', function() {

  const controller = new MessageController();
  const userController = new UserController();
  const chatController = new ChatController();

  const chat = {name: 'Chat for test messages'};
  const creator = {name: 'John', age: 22, email: 'hello@mail.com', password: 'helloworld'};
  
  const messageData = {body: 'first message from helloworld'};
  const messageIds = [];

  before(async function() {
    await controller.model.deleteAll();
    await userController.model.deleteAll();
    await chatController.model.deleteAll()
  })

  it('create successfull', async function() {
    const userId = await userController.registerUser(creator);
    should(userId).be.not.null();

    chat.creatorId = userId;
    chat.uniqueId = controller.model.encodeValue(chat.name);
    const chatId = await chatController.addChat(chat);
    should(chatId).be.not.null();

    messageData.creatorId = userId;
    messageData.chatId = chatId;
    let id = await controller.addMessage(messageData);
    (await controller.model.count()).should.be.exactly(1);

    messageIds.push(id);

    messageData.body = 'Another message posted to chat';
    id = await controller.addMessage(messageData);
    (await controller.model.count()).should.be.exactly(2);

    messageIds.push(id);
  });

  it('edit successfull', async function() {

    messageIds.should.have.lengthOf(2);

    for(let id of messageIds) {
      let message = await controller.getMessageData(id);
      should(message).be.not.null();

      const prevMessage = message.body;
      
      await controller.editMessage(
        id,
        message.creatorId,
        'My new message body' + Math.random()
      );

      message = await controller.getMessageData(id);
      message.body.should.not.equal(prevMessage);
    }
  })

  it('delete successfull', async function() {
    (await controller.model.count()).should.be.exactly(2);

    for(let id of messageIds) {
      const {creatorId} = await controller.getMessageData(id);
      await controller.deleteMessage(id, creatorId);
    }

    (await controller.model.count()).should.be.exactly(0);
  })
  
})