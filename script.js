const app = document.getElementById("app");

const meses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// LOCAL STORAGE
function salvar(chave, valor) {
  localStorage.setItem(chave, valor);
}

function pegar(chave) {
  return localStorage.getItem(chave);
}

// PAGINA 1 - MESES
function mostrarMeses() {
  app.innerHTML = "<h2>Escolha um mês de 2026</h2><div class='grid'></div>";
  const grid = document.querySelector(".grid");

  meses.forEach((mes, i) => {
    const btn = document.createElement("button");
    btn.innerText = mes;
    btn.onclick = () => mostrarDias(i);
    grid.appendChild(btn);
  });
}

// PAGINA 2 - DIAS
function mostrarDias(mesIndex) {
  const ano = 2026;
  const totalDias = new Date(ano, mesIndex + 1, 0).getDate();
  
  const primeiroDiaDaSemana = new Date(ano, mesIndex, 1).getDay();

  app.innerHTML = `<h2>${meses[mesIndex]} ${ano}</h2><div class='grid-dias'></div>`;
  const grid = document.querySelector(".grid-dias");

  for (let i = 0; i < primeiroDiaDaSemana; i++) {
    const divVazia = document.createElement("div");
    divVazia.className = "vazio";
    grid.appendChild(divVazia);
  }

  for (let d = 1; d <= totalDias; d++) {
    const data = new Date(ano, mesIndex, d);
    const diaSemanaNome = diasSemana[data.getDay()];

    const btn = document.createElement("button");
    btn.innerHTML = `<span class='semana'>${diaSemanaNome}</span><strong>${d}</strong>`;
    
    btn.onclick = () => mostrarHoras(d, mesIndex);
    grid.appendChild(btn);
  }

  const voltar = document.createElement("button");
  voltar.innerText = "Voltar";
  voltar.className = "voltar";
  voltar.onclick = mostrarMeses;
  app.appendChild(voltar);
}

//Compromisso
function renderizarConteudoBotao(hora, compromisso) {
  const horaFormatada = hora < 10 ? `0${hora}:00` : `${hora}:00`;
  
  if (compromisso) {
    return `
      <strong>${horaFormatada}</strong>
      <div class="texto-compromisso">${compromisso}</div>
    `;
  }
  
  return horaFormatada;
}

// PAGINA 3 - HORAS + AGENDAMENTO 
function mostrarHoras(dia, mesIndex) {
  app.innerHTML = `<h2>${dia} de ${meses[mesIndex]}</h2><div class='grid-horas'></div>`;
  const grid = document.querySelector(".grid-horas");

  for (let h = 0; h <= 23; h++) {
    const chave = `2026-${mesIndex}-${dia}-${h}`;
    const compromisso = pegar(chave);
    const btn = document.createElement("button");

    btn.innerHTML = renderizarConteudoBotao(h, compromisso);

    if (compromisso) {
      btn.classList.add("agendado");
    }

    btn.onclick = () => {
      const horaFormatada = h < 10 ? `0${h}:00` : `${h}:00`;
      const texto = prompt(`Compromisso para as ${horaFormatada}:`, compromisso || "");
      
      if (texto !== null) {
        texto ? salvar(chave, texto) : localStorage.removeItem(chave);
        mostrarHoras(dia, mesIndex);
      }
    };

    grid.appendChild(btn);
  }

  const btnVoltar = document.createElement("button");
  btnVoltar.innerText = "Voltar";
  btnVoltar.className = "voltar";
  btnVoltar.onclick = () => mostrarDias(mesIndex);
  app.appendChild(btnVoltar);
}

// INICIO
mostrarMeses();