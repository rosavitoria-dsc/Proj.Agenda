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
    const ano = 2026;
    app.innerHTML = `<h2>${dia} de ${meses[mesIndex]}</h2><div class='grid-horas-scroll'></div>`;
    const grid = document.querySelector(".grid-horas-scroll");

    for (let h = 0; h <= 23; h++) {
        const chave = `${ano}-${mesIndex}-${dia}-${h}`;
        const compromisso = pegar(chave);
        const btn = document.createElement("div");
        btn.className = "linha-hora";
        
        const horaFormatada = h < 10 ? `0${h}:00` : `${h}:00`;
        btn.innerHTML = `<span>${horaFormatada}</span><div class="texto">${compromisso || ""}</div>`;

        btn.onclick = () => {
            const modal = document.createElement("div");
            modal.className = "modal-overlay";
            modal.innerHTML = `
                <div class="modal-box">
                    <div class="modal-header">
                        <span>Novo evento</span>
                        <button onclick="this.closest('.modal-overlay').remove()">✕</button>
                    </div>
                    <div class="modal-body">
                        <p>${dia} de ${meses[mesIndex]} de ${ano}</p>
                        <label>Título</label>
                        <input type="text" id="titulo-comp" placeholder="Adicionar título" value="${compromisso || ''}">
                        
                        <div class="horarios-flex">
                            <div>
                                <label>Início</label>
                                <input type="time" id="hora-inicio" value="${horaFormatada}">
                            </div>
                            <span>→</span>
                            <div>
                                <label>Fim</label>
                                <input type="time" id="hora-fim" value="${(h+1) < 10 ? '0'+(h+1) : (h+1)}:00">
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancelar" onclick="this.closest('.modal-overlay').remove()">Cancelar</button>
                        <button class="btn-salvar" id="salvar-modal">Salvar</button>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            modal.querySelector("#salvar-modal").onclick = () => {
                const texto = modal.querySelector("#titulo-comp").value;
                if (texto.trim() !== "") {
                    salvar(chave, texto);
                    modal.remove();
                    mostrarHoras(dia, mesIndex);
                }
            };
        };
        grid.appendChild(btn);
    }

    const voltar = document.createElement("button");
    voltar.innerText = "Voltar";
    voltar.className = "voltar";
    voltar.onclick = () => mostrarDias(mesIndex);
    app.appendChild(voltar);
}

// INICIO
mostrarMeses();