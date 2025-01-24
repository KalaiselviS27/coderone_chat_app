const chatForm = document.getElementById("chat-form");
const chatMessages = document.getElementById("chat-messages");
const userList = document.getElementById("users");

// Example of WebSocket connection (use your own backend WebSocket URL)
const socket = new WebSocket("ws://localhost:3000");

socket.onmessage = (event) => {
  const message = JSON.parse(event.data);
  displayMessage(message);
};

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const msg = e.target.elements.msg.value;

  // Send the message to the server
  socket.send(JSON.stringify({ text: msg, username: "You" }));

  // Clear the input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

function displayMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p><strong>${message.username}:</strong> ${message.text}</p>`;
  chatMessages.appendChild(div);

  // Scroll to the bottom
  chatMessages.scrollTop = chatMessages.scrollHeight;
}
