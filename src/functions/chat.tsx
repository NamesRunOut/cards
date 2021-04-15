import {Message} from "../types/Message";

const updateScroll = () => {
    let element = document.getElementById("chatLog")
    if (element !== null) element.scrollTop = element.scrollHeight;
}

export function displayMessage(message: Message) {
    let msg = document.createElement("p")
    msg.innerHTML = message.date + " " + message.author + ": " + message.sauce

    let element = document.getElementById("chatLog")
    if (element !== null) element.appendChild(msg);
    updateScroll();
}

export function displayCustom(message: Node) {
    let element = document.getElementById("chatLog")
    if (element !== null) element.appendChild(message);
    updateScroll();
}