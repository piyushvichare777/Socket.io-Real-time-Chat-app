const socket = io();

// Get DOM elements in respective JS variables
const form = document.getElementById('send-container')
const messageInput =document.getElementById('messageInp')
const messageconstainer = document.querySelector(".container")

// Function which will append event info to the container
const append =(message , position)=>{
  const messageElement = document.createElement('div')
  messageElement.innerText=message;
  messageElement.classList.add('message')
  messageElement.classList.add(position)
  messageconstainer.append(messageElement)
}

// Ask new user for his name and let the server know
let Name 
do{
Name =  prompt("enter your name");
}while(!Name)

// If a new user joined, receive the event from the server
socket.emit("new-user-joined", Name);

socket.on("user-joined",Name=>{
    append(`${Name} joined the chat`, "right")
});

// If server sends a message, receive it
socket.on("receive", data => {
  append(`${data.Name}:${data.message}`, "left");
});

// If the user leave the chat, append the info to the container
socket.on("left",  Name=> {
  append(`${Name} left the chat`,"left");
});

// If the form get submitted, send server the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`you: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = " ";
});
