//Websocekt variables
const url = "ws://localhost:9876/device-socket"
const mywsServer = new WebSocket(url)

//DOM Elements
const myMessages = document.getElementById("messages")
const myInput = document.getElementById("message")
const sendBtn = document.getElementById("send")

sendBtn.disabled = true
sendBtn.addEventListener("click", sendMsg, false)

//Sending message from client
function sendMsg() {
    const text = myInput.value
    msgGeneration(text, "Client")
    setInterval(() => {
      mywsServer.send(text)
    }, 3000);
}

//Creating DOM element to show received messages on browser page
function msgGeneration(msg, from) {
    const newMessage = document.createElement("h5")
    newMessage.innerText = `${from} says: ${msg}`
    myMessages.appendChild(newMessage)
}

//enabling send message when connection is open
mywsServer.onopen = function() {
    sendBtn.disabled = false
}

//handling message event
mywsServer.onmessage = function(event) {
    const { data } = event
    msgGeneration(data, "Server")
}