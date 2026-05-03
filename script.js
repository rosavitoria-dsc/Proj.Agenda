const app = document.getElementById("app");

const meses = [
  "Janeiro","Fevereiro","Março","Abril","Maio","Junho",
  "Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"
];

// LOCAL STORAGE
function salvar(chave, valor) {
  localStorage.setItem(chave, valor);
}

function pegar(chave) {
  return localStorage.getItem(chave);
}

// PAGINA 1 - MESES
function mostrarMeses() {
  app.innerHTML = "<h2>Escolha um mês</h2><div class='grid'></div>";
  const grid = document.querySelector(".grid");

  meses.forEach((mes, i) => {
    const btn = document.createElement("button");
    btn.innerText = mes;
    btn.onclick = () => mostrarDias(i);
    grid.appendChild(btn);
  });
}

// PAGINA 2 - DIAS
function mostrarDias(mes) {
  const ano = new Date().getFullYear();
  const totalDias = new Date(ano, mes + 1, 0).getDate();

  app.innerHTML = `<h2>${meses[mes]}</h2><div class='grid'></div>`;
  const grid = document.querySelector(".grid");

  for (let d = 1; d <= totalDias; d++) {
    const btn = document.createElement("button");
    btn.innerText = d;
    btn.onclick = () => mostrarHoras(d, mes);
    grid.appendChild(btn);
  }

  const voltar = document.createElement("button");
  voltar.innerText = "Voltar";
  voltar.className = "voltar";
  voltar.onclick = mostrarMeses;
  app.appendChild(voltar);
}

// PAGINA 3 - HORAS + AGENDAMENTO
function mostrarHoras(dia, mes) {
  app.innerHTML = `<h2>${dia} de ${meses[mes]}</h2><div class='grid'></div>`;
  const grid = document.querySelector(".grid");

  for (let h = 8; h <= 18; h++) {
    const chave = `${mes}-${dia}-${h}`;
    const compromisso = pegar(chave);

    const btn = document.createElement("button");
    btn.innerText = `${h}:00`;

    if (compromisso) {
      btn.classList.add("agendado");
      btn.title = compromisso;
    }

    btn.onclick = () => {
      const texto = prompt("Digite seu compromisso:");
      if (texto) {
        salvar(chave, texto);
        mostrarHoras(dia, mes);
      }
    };

    grid.appendChild(btn);
  }

  const voltar = document.createElement("button");
  voltar.innerText = "Voltar";
  voltar.className = "voltar";
  voltar.onclick = () => mostrarDias(mes);
  app.appendChild(voltar);
}

// INICIO
mostrarMeses();