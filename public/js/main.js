const { username } = Qs.parse(location.search, {
  ignoreQueryPrefix: true
});

const chatForm = document.querySelector("#chat-form");
const chatMessages = document.querySelector(".chat-messages");
const ul = document.querySelector("#users");

const socket = io();

socket.emit("joinRoom", username);

socket.on("roomUsers", ({users}) => {
  outputUsers(users);
});

socket.on("message", msg => {

  outputMessage(msg);

  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  socket.emit("chatMessage", msg);

  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function outputMessage(message){
 const div = document.createElement("div");

 div.classList.add("message");
 div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
  <p class="text">${message.text}</p>`;
 document.querySelector(".chat-messages").appendChild(div);

}

function logOut(){
  document.location.href="/";
}

function outputUsers(users) {
  if(users){

    ul.innerHTML = `
      ${users.map(user => `<li data-content=${user.username[0]}>${user.username}</li>`).join("")}
      `;
  }
}
