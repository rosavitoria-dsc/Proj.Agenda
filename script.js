const app = document.getElementById("app");

const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

// LOCAL STORAGE
function salvar(chave, valor) {

  const eventos = pegar(chave);

  eventos.push(valor);

  localStorage.setItem(
    chave,
    JSON.stringify(eventos)
  );
}

function pegar(chave) {

  const dados = localStorage.getItem(chave);

  if (!dados) return [];

  try {

    const convertido = JSON.parse(dados);

    return Array.isArray(convertido)
      ? convertido
      : [convertido];

  } catch {

    return [dados];
  }
}

// PAGINA 1 - MESES
function mostrarMeses() {

  app.innerHTML = `
    <h2>Escolha um mês de 2026</h2>
    <div class='grid'></div>
  `;

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

  const totalDias = new Date(
    ano,
    mesIndex + 1,
    0
  ).getDate();

  const primeiroDiaDaSemana = new Date(
    ano,
    mesIndex,
    1
  ).getDay();

  app.innerHTML = `
    <h2>${meses[mesIndex]} ${ano}</h2>
    <div class='grid-dias'></div>
  `;

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

    btn.innerHTML = `
      <span class='semana'>${diaSemanaNome}</span>
      <strong>${d}</strong>
    `;

    btn.onclick = () => mostrarHoras(d, mesIndex);

    grid.appendChild(btn);
  }

  const voltar = document.createElement("button");

  voltar.innerText = "Voltar";

  voltar.className = "voltar";

  voltar.onclick = mostrarMeses;

  app.appendChild(voltar);
}

// COMPROMISSO
function renderizarConteudoBotao(hora, compromissos) {

  const horaFormatada = hora < 10
    ? `0${hora}:00`
    : `${hora}:00`;

  if (compromissos.length > 0) {

    return `
      <strong>${horaFormatada}</strong>

      <div class="texto-compromisso">

        ${compromissos.map(comp => `
            <div>${comp}</div>
          `).join("")
      }

      </div>
    `;
  }

  return horaFormatada;
}

// ==========================
// PAGINA 3 - HORAS
// ==========================
function mostrarHoras(dia, mesIndex) {

  const ano = 2026;

  app.innerHTML = `
    <h2>${dia} de ${meses[mesIndex]}</h2>
    <div class='grid-horas-scroll'></div>
  `;

  const grid = document.querySelector(".grid-horas-scroll");

  for (let h = 0; h <= 23; h++) {

    const chave = `${ano}-${mesIndex}-${dia}-${h}`;

    const compromissos = pegar(chave);

    const btn = criarLinhaHora(
      h,
      chave,
      compromissos,
      dia,
      mesIndex
    );

    grid.appendChild(btn);
  }

  criarBotaoVoltar(mesIndex);
}

// ==========================
// CRIAR LINHA DE HORA
// ==========================
function criarLinhaHora(
  hora,
  chave,
  compromissos,
  dia,
  mesIndex
) {

  const btn = document.createElement("div");

  btn.className = "linha-hora";

  const horaFormatada = hora < 10
    ? `0${hora}:00`
    : `${hora}:00`;

  btn.innerHTML = `
    <div class="hora-label">
      ${horaFormatada}
    </div>

    <div class="texto">

      ${compromissos.map((comp, index) => `
          <div class="evento-item">

            <span class="evento-texto">
              ${comp}
            </span>

            <div class="evento-acoes">

              <button 
                class="editar-btn"
                data-index="${index}"
              >
                ✏️
              </button>

              <button 
                class="remover-btn"
                data-index="${index}"
              >
                🗑️
              </button>

            </div>

          </div>
        `).join("")
    }

    </div>
  `;

  configurarEditarEvento(
    btn,
    compromissos,
    chave,
    dia,
    mesIndex
  );

  configurarRemoverEvento(
    btn,
    compromissos,
    chave,
    dia,
    mesIndex
  );

  configurarAdicionarEvento(
    btn,
    chave,
    dia,
    mesIndex,
    horaFormatada,
    hora
  );

  return btn;
}

// ==========================
// EDITAR EVENTO
// ==========================
function configurarEditarEvento(
  btn,
  compromissos,
  chave,
  dia,
  mesIndex
) {

  btn.querySelectorAll(".editar-btn")
    .forEach(botao => {

      botao.onclick = (e) => {

        e.stopPropagation();

        const index = botao.dataset.index;

        const novoTexto = prompt(
          "Editar evento:",
          compromissos[index]
        );

        if (
          novoTexto !== null &&
          novoTexto.trim() !== ""
        ) {

          compromissos[index] = novoTexto;

          localStorage.setItem(
            chave,
            JSON.stringify(compromissos)
          );

          mostrarHoras(dia, mesIndex);
        }
      };
    });
}

// ==========================
// REMOVER EVENTO
// ==========================
function configurarRemoverEvento(
  btn,
  compromissos,
  chave,
  dia,
  mesIndex
) {

  btn.querySelectorAll(".remover-btn")
    .forEach(botao => {

      botao.onclick = (e) => {

        e.stopPropagation();

        const index = botao.dataset.index;

        compromissos.splice(index, 1);

        localStorage.setItem(
          chave,
          JSON.stringify(compromissos)
        );

        mostrarHoras(dia, mesIndex);
      };
    });
}

// ==========================
// ADICIONAR EVENTO
// ==========================
function configurarAdicionarEvento(
  btn,
  chave,
  dia,
  mesIndex,
  horaFormatada,
  hora
) {

  btn.onclick = () => {

    const modal = criarModalEvento(
      dia,
      mesIndex,
      horaFormatada,
      hora
    );

    document.body.appendChild(modal);

    configurarSalvarModal(
      modal,
      chave,
      dia,
      mesIndex
    );
  };
}

// ==========================
// CRIAR MODAL
// ==========================
function criarModalEvento(
  dia,
  mesIndex,
  horaFormatada,
  hora
) {

  const modal = document.createElement("div");

  modal.className = "modal-overlay";

  modal.innerHTML = `
    <div class="modal-box">

      <div class="modal-header">

        <span>Novo evento</span>

        <button onclick="this.closest('.modal-overlay').remove()">
          ✕
        </button>

      </div>

      <div class="modal-body">

        <p>
          ${dia} de ${meses[mesIndex]} de 2026
        </p>

        <label>Título</label>

        <input
          type="text"
          id="titulo-comp"
          placeholder="Adicionar título"
        >

        <div class="horarios-flex">

          <div>

            <label>Início</label>

            <input
              type="time"
              id="hora-inicio"
              value="${horaFormatada}"
            >

          </div>

          <span>→</span>

          <div>

            <label>Fim</label>

            <input
              type="time"
              id="hora-fim"
              value="${(hora + 1) < 10 ? '0' + (hora + 1) : (hora + 1)}:00"
            >

          </div>

        </div>

      </div>

      <div class="modal-footer">

        <button
          class="btn-cancelar"
          onclick="this.closest('.modal-overlay').remove()"
        >
          Cancelar
        </button>

        <button class="btn-salvar" id="salvar-modal">
          Salvar
        </button>

      </div>

    </div>
  `;

  return modal;
}

// ==========================
// SALVAR MODAL
// ==========================
function configurarSalvarModal(
  modal,
  chave,
  dia,
  mesIndex
) {

  modal.querySelector("#salvar-modal")
    .onclick = () => {

      const texto = modal
        .querySelector("#titulo-comp")
        .value;

      if (texto.trim() !== "") {

        salvar(chave, texto);

        modal.remove();

        mostrarHoras(dia, mesIndex);
      }
    };
}

// ==========================
// BOTAO VOLTAR
// ==========================
function criarBotaoVoltar(mesIndex) {

  const voltar = document.createElement("button");

  voltar.innerText = "Voltar";

  voltar.className = "voltar";

  voltar.onclick = () => mostrarDias(mesIndex);

  app.appendChild(voltar);
}
// INICIO
mostrarMeses();