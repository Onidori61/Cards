// Importa as funções necessárias do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-analytics.js";
import { getFirestore, collection, addDoc, deleteDoc, doc, onSnapshot, orderBy, query } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyAB0CmLsysvPe6XdaRTFDwAyIQDsQp_MhE",
    authDomain: "diarios-2a81a.firebaseapp.com",
    projectId: "diarios-2a81a",
    storageBucket: "diarios-2a81a.firebasestorage.app",
    messagingSenderId: "754248786539",
    appId: "1:754248786539:web:442c583938b1273dc7c72e",
    measurementId: "G-YZ31YKKG69"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

// Armazena a data do último encontro
let lastSeen = localStorage.getItem('lastSeen') ? new Date(localStorage.getItem('lastSeen')) : new Date();
let cardsData = [];

// Função para atualizar o contador
function updateCounter() {
    const now = new Date();
    const timeDiff = now - lastSeen;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById('counter').textContent = `${days} dias, ${hours} horas, ${minutes} minutos, ${seconds} segundos`;
}

// Função para resetar o contador
function resetCounter() {
    const currentDate = new Date();
    localStorage.setItem('lastSeen', currentDate);
    lastSeen = currentDate;
    updateCounter();
}

// Exibe os cards de diário
function displayCards() {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    cardsData.forEach((card) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <span class="close-card" onclick="deleteCard('${card.id}')">&times;</span>
            <h2>${card.title}</h2>
        `;
        cardDiv.onclick = () => openModal(card);
        container.appendChild(cardDiv);
    });
}

// Função para adicionar um novo card ao diário
async function addNewCard() {
    const title = prompt("Qual o título da sua entrada?");
    const content = prompt("Escreva o conteúdo do diário:");

    if (title && content) {
        const newCard = { title, content, createdAt: new Date() }; // Adiciona a data de criação
        const docRef = await addDoc(collection(db, "diaries"), newCard); // Adiciona ao Firestore
        newCard.id = docRef.id; // Armazena o ID do documento
        cardsData.push(newCard); // Adiciona o card ao array local
        displayCards(); // Atualiza a exibição dos cards
    }
}

// Função para abrir o modal
function openModal(card) {
    document.getElementById('modal-title').textContent = card.title;
    document.getElementById('modal-content').textContent = card.content;
    document.getElementById('modal').style.display = 'flex';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
}

// Função para deletar um card
async function deleteCard(id) {
    try {
        await deleteDoc(doc(db, "diaries", id)); // Deleta o card do Firestore
        // Atualiza a lista local de cards
        cardsData = cardsData.filter(card => card.id !== id); // Remove o card deletado do array local
        displayCards(); // Atualiza a exibição dos cards
    } catch (error) {
 console.error("Erro ao deletar o card: ", error); // Exibe o erro no console
}

// Torna as funções acessíveis globalmente
window.addNewCard = addNewCard;
window.resetCounter = resetCounter;
window.deleteCard = deleteCard;

// Inicializa as visualizações
setInterval(updateCounter, 1000); // Atualiza o contador a cada segundo

// Configura o listener do Firestore para atualizar os cards em tempo real
const q = query(collection(db, "diaries"), orderBy("createdAt", "desc"));
onSnapshot(q, (querySnapshot) => {
    cardsData = []; // Limpa os dados atuais
    querySnapshot.forEach((doc) => {
        const card = { id: doc.id, ...doc.data() }; // Adiciona o ID do documento
        cardsData.push(card); // Adiciona os dados do Firestore ao array
    });
    displayCards(); // Atualiza a exibição dos cards
});

// Chama a função para exibir os cards ao carregar a página
displayCards();