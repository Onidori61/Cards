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
let lastSeen = new Date();
let cardsData = [];

// Função para atualizar o contador
function updateCounter() {
    const now = new Date();
    const timeDiff = now - lastSeen;
    const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

    document.getElementById('dias').textContent = `${days} dias`;
    document.getElementById('horas').textContent = `${hours} horas`;
    document.getElementById('minutos').textContent = `${minutes} minutos`;
    document.getElementById('segundos').textContent = `${seconds} segundos`;
}

// Exibe os cards de diário
function displayCards() {
    const container = document.querySelector('.carousel-inner');
    container.innerHTML = ''; // Limpa o container antes de adicionar novos cards
    cardsData.forEach((card) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
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
    
    // Adiciona a URL da imagem, se houver
    const imageUrl = document.getElementById('modal-image').src; // Obtém a URL da imagem

    if (title && content) {
        const newCard = { title, content, imageUrl, createdAt: new Date() }; // Inclui a URL da imagem
        const existingCard = cardsData.find(card => card.title === title && card.content === content);
        if (!existingCard) {
            const docRef = await addDoc(collection(db, "diaries"), newCard);
            newCard.id = docRef.id; // Armazena o ID do documento
            cardsData.push(newCard);
            displayCards(); // Atualiza a exibição dos cards
        } else {
            alert("Este card já existe!");
        }
    }
}

// Função para abrir o modal
function openModal (card) {
    document.getElementById('modal-title').textContent = card.title;
    document.getElementById('modal-content').textContent = card.content;
    document.getElementById('modal-delete-button').style.display = 'block'; // Exibe o botão de deletar
    document.getElementById('modal-delete-button').onclick = () => deleteCard(card.id); // Define a ação do botão de deletar
    document.getElementById('modal').style.display = 'flex';
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('modal').style.display = 'none';
    document.getElementById('modal-delete-button').style.display = 'none'; // Oculta o botão de deletar ao fechar o modal
}

// Função para deletar um card
async function deleteCard(id) {
    try {
        await deleteDoc(doc(db, "diaries", id)); // Deleta o card do Firestore
        cardsData = cardsData.filter(card => card.id !== id); // Remove o card deletado do array local
        displayCards(); // Atualiza a exibição dos cards
        closeModal(); // Fecha o modal após a exclusão
    } catch (error) {
        console.error("Erro ao deletar o card: ", error); // Exibe o erro no console
    }
}

function openImageModal(imageUrl) {
    const modalImage = document.getElementById('modal-image');
    modalImage.src = imageUrl; // Define a imagem do modal
    document.getElementById('image-modal').style.display = 'flex'; // Exibe o modal
}

function closeImageModal() {
    document.getElementById('image-modal').style.display = 'none'; // Fecha o modal
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

function displayCards() {
    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    cardsData.forEach((card) => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('card');
        cardDiv.innerHTML = `
            <h2>${card.title}</h2>
            <img src="${card.imageUrl}" alt="${card.title}" onclick="openImageModal('${card.imageUrl}')"> <!-- Adiciona o evento onclick -->
            <p>${card.content}</p>
        `;
        cardDiv.onclick = () => openModal(card);
        container.appendChild(cardDiv);
    });
}

// Função para lidar com o upload da imagem
function handleImageUpload(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            const imagePreview = document.getElementById('image-preview');
            const modalImage = document.getElementById('modal-image');
            modalImage.src = e.target.result; // Define a imagem da pré-visualização
            imagePreview.style.display = 'block'; // Exibe a pré-visualização
        };
        reader.readAsDataURL(file); // Lê o arquivo como URL de dados
    }
}

let currentIndex = 0;

function moveCarousel(direction) {
    const inner = document.querySelector('.carousel-inner');
    const totalCards = cardsData.length;

    currentIndex += direction;

    // Impede que o índice saia do intervalo
    if (currentIndex < 0) {
        currentIndex = totalCards - 1; // Volta para o último card
    } else if (currentIndex >= totalCards) {
        currentIndex = 0; // Volta para o primeiro card
    }

    // Move o carrossel
    const offset = -currentIndex * 250; // 250 é a largura do card
    inner.style.transform = `translateX(${offset}px)`;
}