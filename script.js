const API_KEY = "sk-78617d2b5065455283ef844b450b008b";
const API_URL = "https://api.deepseek.com/chat/completions";
const chatInput = document.querySelector(".chat-input");
const sendButton = document.querySelector(".send-button");
const content = document.querySelector(".content");

const messages = [
    { role: "system", content: "You are a helpful lecturer assistant for Church Teachers College students. Do not use markdown formatting in your responses — no asterisks, no bold, no italics, no bullet points with symbols. Write in plain text only, using full sentences and numbered lists (1. 2. 3.) if a list is needed. Make lesson plans with the CXC curriculum in mind." }
];

function addMessage(text, type) {
    const section = document.createElement("section");
    section.className = type === "user" ? "question-section" : "answer-section";
    section.textContent = text;
    content.appendChild(section);
    content.scrollTop = content.scrollHeight;
    return section;
}

async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;
    addMessage(text, "user");
    messages.push({ role: "user", content: text });
    chatInput.value = "";
    const loadingEl = addMessage("Thinking...", "bot");
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: "deepseek-chat",
                messages: messages
            })
        });
        const data = await response.json();
        const reply = data.choices?.[0]?.message?.content || "Sorry, something went wrong.";
        loadingEl.textContent = reply;
        messages.push({ role: "assistant", content: reply });
    } catch (err) {
        loadingEl.textContent = "Error: could not reach the API.";
        console.error(err);
    }
}

sendButton.addEventListener("click", sendMessage);
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") sendMessage();
});
