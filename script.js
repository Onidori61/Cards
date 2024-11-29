/* Pode me ajudar? Não sei programar 
 e queria criar um site para minha namorada,
 uma surpresa. Bom, a ideia é criarmos cards (diários) 
 para registrar e refletir sobre os momentos vividos juntos,
  ao mesmo tempo que oferece uma maneira prática de ver
 o tempo que passou desde o último encontro
 Aliás, o código fica em repositórios do github e fica online pelo vercel*/

/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(135deg, #2a2a2a, #1f1f1f); /* Gradiente escuro de cinza */
  color: #ddd; /* Cor de texto suave para contraste */
  margin: 0;
  padding: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.container {
  width: 95%;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #333; /* Fundo escuro para o container */
  border-radius: 15px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
  padding: 20px;
  position: relative;
}

header {
  text-align: center;
  margin-bottom: 40px;
}

h1 {
  font-size: 40px;
  color: #9b4d96; /* Roxo escuro para o título */
  text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
  font-family: 'Georgia', serif;
}

.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

/* Cards quadrados */
.card {
  width: 250px; /* Largura fixa */
  height: 250px; /* Altura fixa para tornar o card quadrado */
  background-color: #444; /* Cor de fundo escura para os cards */
  border-radius: 10px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.6);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  overflow: hidden;
  text-align: center;
}

.card:hover {
  transform: scale(1.05);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.8);
}

.card h2 {
  font-size: 18px;
  color: #9b4d96; /* Roxo escuro para o título dos cards */
  font-weight: bold;
  margin-top: 10px;
}

/* Botão de adicionar card */
.btn.add-card {
  width: 50px; /* Largura igual aos cards */
  height: 50px; /* Altura igual aos cards */
  background-color: rgba(155, 77, 150, 0.3); /* Cor roxa transparente */
  border: 2px dashed #9b4d96; /* Borda pontilhada para se assemelhar a um card */
  color: #9b4d96;
  font-size: 2rem;
  position: fixed;
  bottom: 30px;
  right: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 10px; /* Bordas arredondadas como o card */
}

.btn.add-card:hover {
  background-color: rgba(155, 77, 150, 0.5); /* Aumenta a opacidade no hover */
}

/* Botão de resetar contador */
.btn.reset-counter {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #9b4d96; /* Cor do botão */
  border: none;
  color: #fff;
  font-size: 1rem;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
}

.btn.reset-counter:hover {
  background-color: #7a3b7c; /* Cor do botão ao passar o mouse */
}

/* Contador */
.counter-section {
  margin-top: 30px;
  text-align: center;
}

.counter {
  font-size: 1.8rem;
  margin-bottom: 10px;
}

.time {
  font-size: 2rem;
  font-weight: bold;
  color: #fff; /* Cor do texto do contador */
}

/* Modal */
.modal {
  display: none; /* Oculto por padrão */
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.8); /* Fundo escuro com opacidade */
}

.modal-content {
  background-color: #444;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 80%;
  max-width: 600px;
  border-radius: 10px;
  color: #ddd; /* Cor do texto no modal */
}

.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: #fff;
  text-decoration: none;
  cursor: pointer;
}

.close-card {
  position: absolute;
  top: 10px;
  right: 10px;
  color: #9b4d96; /* Cor do "X" */
  font-size: 20px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-card:hover {
  color: #fff; /* Muda a cor ao passar o mouse */
}

.time-together {
  display: flex;
  justify-content: center;
  gap: 20px; /* Espaçamento entre as caixas */
  margin: 25px 0; /* Margem acima e abaixo */
  flex-wrap: wrap; /* Permite que as caixas se movam para a linha seguinte se o espaço for insuficiente */
}

.time-box {
  padding: 15px; /* Espaçamento interno */
  border-radius: 10px; /* Bordas arredondadas */
  text-align: center; /* Centraliza o texto */
  flex: 1; /* Faz com que as caixas ocupem espaço igual */
  min-width: 100px; /* Largura mínima para as caixas */
  background-color: #444; /* Cor de fundo das caixas */
  color: #fff; /* Cor do texto */
  transition: transform 0.2s; /* Transição suave ao passar o mouse */
}

.time-box:hover {
  transform: scale(1.05); /* Aumenta o tamanho da caixa ao passar o mouse */
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.3); /* Sombra ao passar o mouse */
}
