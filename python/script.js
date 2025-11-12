import { app} from './firebase-config.js';
import { db, auth } from './firebase-config.js';
import { doc, setDoc, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const chatMessages = document.getElementById('chat-messages');
const chatInput = document.getElementById('chat-input');
const sendButton = document.getElementById('send-button');
const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const modalClose = document.getElementById('modal-close');
const loadingIndicator = document.getElementById('loading-indicator');

const GEMINI_API_KEY = "AIzaSyAgRaGA_a-k00s7HVmLcZ2ktt5ESGlZ1p4";
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

let savedIngredients = '';
const userId = localStorage.getItem('userId');

function showModal(message) {
  modalMessage.textContent = message;
  modal.classList.remove('hidden');
}
modalClose.onclick = () => modal.classList.add('hidden');

function appendMessage(sender, text, isMarkdown = false) {
  const div = document.createElement('div');
  div.className = `flex mb-4 ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
  const msg = document.createElement('div');
  msg.className = `max-w-[80%] px-4 py-3 rounded-xl shadow-md ${sender === 'user' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800'}`;
  msg.innerHTML = isMarkdown ? text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') : text;
  div.appendChild(msg);
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

async function generateResponse(prompt) {
  const payload = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    systemInstruction: {
      parts: [{
        text: `You are an AI Recipe Bot that suggests recipes based on ingredients: "${savedIngredients}".`
      }]
    }
  };
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn’t generate a response.";
}

async function sendMessage() {
  const text = chatInput.value.trim();
  if (!text) return;
  chatInput.value = '';
  appendMessage('user', text);
  loadingIndicator.classList.remove('hidden');

  if (text.toLowerCase().includes('my ingredients are')) {
    const ingredients = text.replace(/my ingredients are/i, '').trim();
    savedIngredients = ingredients;
    const docRef = doc(db, 'users', userId);
    await setDoc(docRef, { ingredients });
    appendMessage('bot', `Got it! I'll use these ingredients: ${ingredients}`);
    loadingIndicator.classList.add('hidden');
    return;
  }

  const reply = await generateResponse(text);
  appendMessage('bot', reply, true);
  loadingIndicator.classList.add('hidden');
}

sendButton.addEventListener('click', sendMessage);
chatInput.addEventListener('keypress', e => { if (e.key === 'Enter') sendMessage(); });

// Listen for saved ingredients
onSnapshot(doc(db, 'users', userId), (docSnap) => {
  if (docSnap.exists()) savedIngredients = docSnap.data().ingredients;
});
