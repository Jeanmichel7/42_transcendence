let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEiLCJsb2dpbiI6ImpyYXNzZXI4NDMiLCJyb2xlIjoidXNlciIsImlhdCI6MTY4MTU2OTM1MywiZXhwIjoxNjgxNzQyMTUzfQ.IrtZ290PvAJiQe9hK9pq0K71ZmqNswGWwCjr45GlaLI"

// const socketEvent1 = io('http://localhost:3000/messages', {
// 	reconnectionDelayMax: 10000,
// 	// auth: {
// 	// 	token: token
// 	// },
// 	query: {
// 		userId: "5"
// 	}
// });

// ne pas utiliser 
function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function getUser() {
  let userdisplay = document.getElementById("user");
  let result = parseJwt(token)
  userdisplay.innerHTML = result.login + ", id: " + result.id
  return result.id
}





/* *************** ROOM 1 *************** */


function joinRoom1(userIdDest) {
  const socketEvent1 = io(`http://localhost:3000/messagerie`, {
    reconnectionDelayMax: 10000,
    auth: {
      token: token
    },
    query: {
      userId: getUser()
    },
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  //connect to room
  socketEvent1.emit("joinPrivateRoom", { user1Id: getUser(), user2Id: userIdDest });

  //display form
  let form1 = document.getElementById("Form1");
  form1.classList.remove("hidden1")

  socketEvent1.on('connect', () => {
    console.log("connected : ", socketEvent1.id)
  })

  socketEvent1.on("disconnect", () => {
    console.log('disconnected : ', socketEvent1.id);
  });

  socketEvent1.on('message', (message, id) => {
    console.log("message : ", message, id, socketEvent1)
    let messagesList1 = document.getElementById("messages1");
    messagesList1.innerHTML += `<li>${message.text} by ${message.ownerUser.login}</li>`;
  })
}

const messageInput1 = document.getElementById("messageInput1");
function sendMessage1() {
  axios.post('http://localhost:3000/messages/users/' + userIdDest + '/send', {
    text: messageInput1.value,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  // socketEvent1.emit('message', messageInput.value);
}


/* *************** ROOM 2 *************** */
function joinRoom2(userIdDest) {
  const socketEvent2 = io(`http://localhost:3000/messagerie`, {
    reconnectionDelayMax: 10000,
    auth: {
      token: token
    },
    query: {
      userId: getUser()
    },
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  socketEvent2.emit("joinPrivateRoom", { user1Id: getUser(), user2Id: userIdDest });

  let form2 = document.getElementById("Form2");
  form2.classList.remove("hidden2")

  socketEvent2.on('connect', () => {
    console.log("connected : ", socketEvent2.id)
  })

  socketEvent2.on("disconnect", () => {
    console.log('disconnected : ', socketEvent2.id);
  });

  socketEvent2.on('message', (message, id) => {
    console.log("message : ", message, id, socketEvent2)
    let messagesList2 = document.getElementById("messages2");
    messagesList2.innerHTML += `<li>${message.text} by ${message.ownerUser.login}</li>`;
  })
}

const messageInput2 = document.getElementById("messageInput2");
function sendMessage2(userIdDest) {
  axios.post('http://localhost:3000/messages/users/' + userIdDest + '/send', {
    text: messageInput2.value,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  // socketEvent2.emit('message', messageInput.value);
}



/* *************** CHAT *************** */


async function createChatRoom() {
  const res = await axios.get("http://localhost:3000/chat/room/add", {
    headers: {
      Authorization: `Bearer ${token}`
    }}, {
      // password: "secret password"
    }
  )
  console.log("res : ", res)
  if(res)
    console.log("new room created, roomId : ", res.data.id)
}


/* ***************** ROOMS  ************* */
function joinChatRoom(roomId) {
  let form = document.getElementById(`formChat${roomId}`);
  form.classList.remove(`hidden-room-${roomId}`)

  const chatSocket = io(`http://localhost:3000/chat`, {
    reconnectionDelayMax: 10000,
    auth: {
      token: token
    },
    query: {
      userId: getUser()
    },
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });
  

  chatSocket.on('connect', () => {
    console.log("connected : ", chatSocket.id)
  })

  chatSocket.on("disconnect", () => {
    console.log('disconnected : ', chatSocket.id);
  });

  chatSocket.emit("joinRoom", {
    roomId: roomId,
    userId: getUser(),
  });

  chatSocket.on('chat-message', (message, id) => {
    console.log("message : ", message);
    let displayMessage = document.getElementById(`messagesRoom${message.room.id}`);
    displayMessage.innerHTML += `<li>${message.text} by ${message.user.login}</li>`;
  })
}


function sendChatMessage(roomId) {
  let messageChatInput = document.getElementById(`messageRoomInput${roomId}`);
  
  axios.post("http://localhost:3000/chat/room/" + roomId + "/message/add", {
    text: messageChatInput.value,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
}




// function leaveRoom(roomId) {
//   chatSocket.emit("leaveRoom", {
//     roomId: roomId,
//     userId: getUser(),
//   });
// }
