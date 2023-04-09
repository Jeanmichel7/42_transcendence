let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im15bG9naW4iLCJzdWIiOiI1IiwiaWF0IjoxNjgxMDQ0MDM3LCJleHAiOjE2ODEyMTY4Mzd9.gNgfbgg74qd6-RG0e79z6CTY74y0eGmgPC6nA-nz-VY"

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
function parseJwt (token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
}

function getUser(){
  let userdisplay = document.getElementById("user");
  let result = parseJwt(token)
  userdisplay.innerHTML = result.username + ", id: " + result.sub
  return result.sub
}





// Room 1
function joinRoom1() {
  const socketEvent1 = io(`http://localhost:3000/messages`, {
    reconnectionDelayMax: 10000,
    auth: {
      token: token
    },
    query: {
      userId: 5
    },
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  //connect to room
  socketEvent1.emit("joinPrivateRoom", { user1Id: getUser(), user2Id: "2" });

  //display form
  let form1 = document.getElementById("Form1");
  form1.classList.remove("hidden1")

  socketEvent1.on('connect', () => {
    console.log("connected : ", socketEvent1.id)
  })

  socketEvent1.on("disconnect", () => {
    console.log('disconnected : ', socketEvent1.id); // undefined
  });

  socketEvent1.on('message', (message, id) => {
    console.log("message : ", message, id, socketEvent1)
    let messagesList1 = document.getElementById("messages1");
    messagesList1.innerHTML += `<li>${message.text} by ${message.ownerUser.login}</li>`;
  })
}

const messageInput1 = document.getElementById("messageInput1");
function sendMessage1() {
  axios.post('http://localhost:3000/messages/from/5/to/2', {
    text: messageInput1.value,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  // socketEvent1.emit('message', messageInput.value);
}


// Room 2
function joinRoom2() {
  const socketEvent2 = io(`http://localhost:3000/messages`, {
    reconnectionDelayMax: 10000,
    auth: {
      token: token
    },
    query: {
      userId: 5
    },
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true
    }
  });

  socketEvent2.emit("joinPrivateRoom", { user1Id: getUser(), user2Id: "4" });

  let form2 = document.getElementById("Form2");
  form2.classList.remove("hidden2")

  socketEvent2.on('connect', () => {
    console.log("connected : ", socketEvent2.id)
  })

  socketEvent2.on("disconnect", () => {
    console.log('disconnected : ', socketEvent2.id); // undefined
  });

  socketEvent2.on('message', (message, id) => {
    console.log("message : ", message, id, socketEvent2)
    let messagesList2 = document.getElementById("messages2");
    messagesList2.innerHTML += `<li>${message.text} by ${message.ownerUser.login}</li>`;
  })
}

const messageInput2 = document.getElementById("messageInput2");
function sendMessage2() {
  axios.post('http://localhost:3000/messages/from/5/to/4', {
    text: messageInput2.value,
  }, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  // socketEvent2.emit('message', messageInput.value);
}
