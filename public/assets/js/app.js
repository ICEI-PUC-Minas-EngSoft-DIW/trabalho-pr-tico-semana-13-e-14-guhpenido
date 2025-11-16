// ==================== CONFIGURAÇÕES DA API ====================
const API_BASE_URL = 'http://localhost:3001';
const API_ENDPOINTS = {
  lugares: `${API_BASE_URL}/lugares`
};

// ==================== VARIÁVEIS GLOBAIS ====================
let lugaresData = [];

// ==================== FUNÇÕES DA API ====================

// Função para buscar todos os lugares
async function fetchLugares() {
  try {
    const response = await fetch(API_ENDPOINTS.lugares);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    lugaresData = await response.json();
    return lugaresData;
  } catch (error) {
    console.error('Erro ao buscar lugares:', error);
    showAlert('Erro ao carregar lugares. Verifique se o servidor está rodando.', 'danger');
    return [];
  }
}

// Função para buscar um lugar por ID
async function fetchLugarById(id) {
  try {
    const response = await fetch(`${API_ENDPOINTS.lugares}/${id}`);
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar lugar por ID:', error);
    return null;
  }
}

// Função para criar um novo lugar
async function createLugar(lugar) {
  try {
    const response = await fetch(API_ENDPOINTS.lugares, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lugar)
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const novoLugar = await response.json();
    lugaresData.push(novoLugar);
    return novoLugar;
  } catch (error) {
    console.error('Erro ao criar lugar:', error);
    throw error;
  }
}

// Função para atualizar um lugar
async function updateLugar(id, lugar) {
  try {
    const response = await fetch(`${API_ENDPOINTS.lugares}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(lugar)
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    const lugarAtualizado = await response.json();
    const index = lugaresData.findIndex(l => l.id == id);
    if (index !== -1) {
      lugaresData[index] = lugarAtualizado;
    }
    return lugarAtualizado;
  } catch (error) {
    console.error('Erro ao atualizar lugar:', error);
    throw error;
  }
}

// Função para deletar um lugar
async function deleteLugar(id) {
  try {
    const response = await fetch(`${API_ENDPOINTS.lugares}/${id}`, {
      method: 'DELETE'
    });
    
    if (!response.ok) {
      throw new Error(`Erro HTTP: ${response.status}`);
    }
    
    lugaresData = lugaresData.filter(l => l.id != id);
    return true;
  } catch (error) {
    console.error('Erro ao deletar lugar:', error);
    throw error;
  }
}

// ==================== FUNÇÕES AUXILIARES ====================

function formatarData(dataString) {
  const data = new Date(dataString);
  return data.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

function showAlert(message, type = 'info') {
  const alertContainer = document.getElementById('alert-container');
  if (alertContainer) {
    const alertHtml = `
      <div class="alert alert-${type} alert-dismissible fade show" role="alert">
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    alertContainer.innerHTML = alertHtml;
    
    // Auto-remover o alerta após 5 segundos
    setTimeout(() => {
      const alert = alertContainer.querySelector('.alert');
      if (alert) {
        const bsAlert = new bootstrap.Alert(alert);
        bsAlert.close();
      }
    }, 5000);
  }
}

function generateId() {
  return Date.now();
}

// ==================== CÓDIGO PRINCIPAL ====================

document.addEventListener("DOMContentLoaded", function () {
  const currentPage = window.location.pathname.split("/").pop();

  // PÁGINA INDEX.HTML - Página Principal
  if (currentPage === "index.html" || currentPage === "") {
    initIndexPage();
  } else if (currentPage === "detalhes.html") {
    initDetalhesPage();
  } else if (currentPage === "cadastro_lugares.html") {
    initCadastroPage();
  }
});

// ==================== FUNÇÕES DA PÁGINA INDEX.HTML ====================

async function initIndexPage() {
  await fetchLugares();
  carregarSliderDestaques();
  carregarTodosLugares();
}

function carregarSliderDestaques() {
  const carouselInner = document.getElementById("carousel-destaques");

  if (!carouselInner) return;

  const lugaresDestaque = lugaresData.filter(lugar => lugar.destaque === true);

  carouselInner.innerHTML = "";

  lugaresDestaque.forEach((lugar, index) => {
    const activeClass = index === 0 ? "active" : "";

    const carouselItem = `
      <div class="carousel-item ${activeClass}">
        <img src="${lugar.imagem_principal}" class="d-block w-100 carousel-image" alt="${lugar.nome}">
        <div class="carousel-caption d-md-block">
          <div class="carousel-content">
            <span class="badge bg-warning text-dark mb-2">⭐ EM DESTAQUE</span>
            <h2 class="display-4 fw-bold mb-3">${lugar.nome}</h2>
            <p class="lead mb-4">${lugar.descricao}</p>
            <div class="d-flex gap-3 justify-content-center">
              <a href="detalhes.html?id=${lugar.id}" class="btn btn-primary btn-lg px-4">
                Ver Detalhes
              </a>
              <span class="badge bg-secondary align-self-center px-3 py-2">
                ${lugar.categoria}
              </span>
            </div>
          </div>
        </div>
      </div>
    `;

    carouselInner.innerHTML += carouselItem;
  });
}

function carregarTodosLugares() {
  const lugaresContainer = document.getElementById("lugares-cards");

  if (!lugaresContainer) return;

  lugaresContainer.innerHTML = "";

  lugaresData.forEach((lugar) => {
    const cardHTML = `
      <div class="col-lg-4 col-md-6 col-sm-12">
        <div class="card h-100 shadow-sm lugar-card">
          <a href="detalhes.html?id=${lugar.id}" class="text-decoration-none">
            <img src="${lugar.imagem_principal}" class="card-img-top lugar-card-img" alt="${lugar.nome}">
          </a>
          <div class="card-body d-flex flex-column">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-primary">${lugar.categoria}</span>
              ${lugar.destaque ? '<span class="badge bg-warning text-dark">⭐ Destaque</span>' : ""}
            </div>
            <h3 class="card-title h5 fw-bold mb-2">
              <a href="detalhes.html?id=${lugar.id}" class="text-decoration-none text-dark">
                ${lugar.nome}
              </a>
            </h3>
            <p class="card-text text-muted flex-grow-1">${lugar.descricao}</p>
            <div class="mt-3">
              <a href="detalhes.html?id=${lugar.id}" class="btn btn-outline-primary w-100">
                Explorar →
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    lugaresContainer.innerHTML += cardHTML;
  });
}

// ==================== FUNÇÕES DA PÁGINA DETALHES.HTML ====================

async function initDetalhesPage() {
  const urlParams = new URLSearchParams(window.location.search);
  const lugarId = parseInt(urlParams.get("id"));

  const lugar = await fetchLugarById(lugarId);
  
  const detalhesContainer = document.getElementById("detalhes-lugar");
  const atracoesContainer = document.getElementById("atracoes-lugar");

  if (!lugar) {
    if (detalhesContainer) {
      detalhesContainer.innerHTML = `
        <div class="alert alert-warning text-center" role="alert">
          <h4>Lugar não encontrado</h4>
          <p>O lugar que você procura não existe.</p>
          <a href="index.html" class="btn btn-primary mt-3">← Voltar para Início</a>
        </div>
      `;
    }
    return;
  }

  // Atualizar título da página
  document.title = `${lugar.nome} - BH Experiências`;

  // Montar seção de detalhes gerais
  if (detalhesContainer) {
    detalhesContainer.innerHTML = `
      <div class="row g-4">
        <!-- Coluna da imagem e informações principais -->
        <div class="col-lg-7">
          <div class="card shadow-sm border-0">
            <img src="${lugar.imagem_principal}" class="card-img-top" alt="${lugar.nome}" style="height: 450px; object-fit: cover;">
            <div class="card-body">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <span class="badge bg-primary fs-6">${lugar.categoria}</span>
                ${lugar.destaque ? '<span class="badge bg-warning text-dark fs-6">⭐ Em Destaque</span>' : ""}
              </div>
              <h1 class="display-5 fw-bold mb-3">${lugar.nome}</h1>
              <p class="lead text-muted mb-4">${lugar.descricao}</p>
              
              <div class="sobre-lugar bg-light p-4 rounded">
                <h2 class="h4 fw-bold mb-3">📖 Sobre este lugar</h2>
                <p class="text-justify lh-lg">${lugar.conteudo}</p>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Coluna de informações práticas -->
        <div class="col-lg-5">
          <div class="card shadow-sm border-0 sticky-top" style="top: 100px;">
            <div class="card-header bg-dark text-white">
              <h2 class="h5 mb-0">ℹ️ Informações Práticas</h2>
            </div>
            <div class="card-body">
              <div class="info-item mb-4">
                <h3 class="h6 fw-bold text-primary mb-2">📍 Endereço</h3>
                <p class="mb-0">${lugar.endereco}</p>
              </div>
              
              <div class="info-item mb-4">
                <h3 class="h6 fw-bold text-primary mb-2">🕐 Horário de Funcionamento</h3>
                <p class="mb-0">${lugar.horarios}</p>
              </div>
              
              <div class="info-item mb-4">
                <h3 class="h6 fw-bold text-primary mb-2">📞 Contato</h3>
                <p class="mb-0">${lugar.telefone}</p>
              </div>
              
              <div class="info-item mb-4">
                <h3 class="h6 fw-bold text-primary mb-2">📅 Última Atualização</h3>
                <p class="mb-0">${formatarData(lugar.data)}</p>
              </div>
              
              <div class="info-item mb-4">
                <h3 class="h6 fw-bold text-primary mb-2">🏷️ Categoria</h3>
                <span class="badge bg-primary fs-6">${lugar.categoria}</span>
              </div>
              
              <hr class="my-4">
              
              <div class="d-grid gap-2">
                <a href="index.html" class="btn btn-outline-primary">
                  ← Voltar para Início
                </a>
                <button class="btn btn-primary" onclick="window.print()">
                  🖨️ Imprimir Informações
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // Montar seção de atrações vinculadas
  if (atracoesContainer && lugar.atracoes && lugar.atracoes.length > 0) {
    let atracoesHTML = '<div class="row g-4">';

    lugar.atracoes.forEach((atracao) => {
      atracoesHTML += `
        <div class="col-lg-3 col-md-6 col-sm-12">
          <div class="card h-100 shadow-sm atracao-card">
            <img src="${atracao.imagem}" class="card-img-top" alt="${atracao.nome}" style="height: 200px; object-fit: cover;">
            <div class="card-body">
              <h3 class="card-title h6 fw-bold">${atracao.nome}</h3>
              <p class="card-text small text-muted">${atracao.descricao}</p>
            </div>
          </div>
        </div>
      `;
    });

    atracoesHTML += "</div>";
    atracoesContainer.innerHTML = atracoesHTML;
  }
}

// ==================== FUNÇÕES DA PÁGINA CADASTRO ====================

async function initCadastroPage() {
  await fetchLugares();
  initFormularioCadastro();
  carregarListaLugares();
  
  // Contador de caracteres da descrição
  const descricaoField = document.getElementById('descricao');
  const descCountElement = document.getElementById('desc-count');
  
  if (descricaoField && descCountElement) {
    descricaoField.addEventListener('input', function() {
      descCountElement.textContent = this.value.length;
    });
  }
}

function initFormularioCadastro() {
  const form = document.getElementById('form-cadastro-lugar');
  
  if (form) {
    form.addEventListener('submit', async function(e) {
      e.preventDefault();
      
      if (!this.checkValidity()) {
        e.stopPropagation();
        this.classList.add('was-validated');
        return;
      }

      const formData = new FormData(this);
      const lugar = {
        nome: formData.get('nome'),
        descricao: formData.get('descricao'),
        conteudo: formData.get('conteudo'),
        categoria: formData.get('categoria'),
        endereco: formData.get('endereco'),
        horarios: formData.get('horarios'),
        telefone: formData.get('telefone'),
        destaque: formData.get('destaque') === 'true',
        data: new Date().toISOString().split('T')[0],
        imagem_principal: formData.get('imagem_principal'),
        atracoes: []
      };

      try {
        const novoLugar = await createLugar(lugar);
        showAlert('Lugar cadastrado com sucesso!', 'success');
        this.reset();
        this.classList.remove('was-validated');
        document.getElementById('desc-count').textContent = '0';
        carregarListaLugares();
      } catch (error) {
        showAlert('Erro ao cadastrar lugar. Verifique os dados e tente novamente.', 'danger');
      }
    });
  }

  // Formulário de edição
  const btnSalvarEdicao = document.getElementById('btn-salvar-edicao');
  if (btnSalvarEdicao) {
    btnSalvarEdicao.addEventListener('click', salvarEdicao);
  }
}

async function carregarListaLugares() {
  const container = document.getElementById('lugares-lista');
  
  if (!container) return;
  
  container.innerHTML = '';
  
  if (lugaresData.length === 0) {
    container.innerHTML = `
      <div class="col-12">
        <div class="alert alert-info text-center">
          <i class="bi bi-info-circle me-2"></i>
          Nenhum lugar cadastrado ainda.
        </div>
      </div>
    `;
    return;
  }

  lugaresData.forEach(lugar => {
    const lugarCard = `
      <div class="col-md-6 col-lg-4">
        <div class="card h-100 shadow-sm">
          <img src="${lugar.imagem_principal}" class="card-img-top" alt="${lugar.nome}" style="height: 200px; object-fit: cover;">
          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-2">
              <span class="badge bg-primary">${lugar.categoria}</span>
              ${lugar.destaque ? '<span class="badge bg-warning text-dark">⭐</span>' : ''}
            </div>
            <h5 class="card-title">${lugar.nome}</h5>
            <p class="card-text small text-muted">${lugar.descricao.substring(0, 100)}...</p>
          </div>
          <div class="card-footer bg-transparent">
            <div class="d-flex gap-2">
              <a href="detalhes.html?id=${lugar.id}" class="btn btn-outline-primary btn-sm flex-fill">
                <i class="bi bi-eye me-1"></i> Ver
              </a>
              <button class="btn btn-outline-warning btn-sm flex-fill" onclick="editarLugar('${lugar.id}')">
                <i class="bi bi-pencil me-1"></i> Editar
              </button>
              <button class="btn btn-outline-danger btn-sm flex-fill" onclick="confirmarExclusao('${lugar.id}')">
                <i class="bi bi-trash me-1"></i> Excluir
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    
    container.innerHTML += lugarCard;
  });
}

async function editarLugar(id) {
  const lugar = lugaresData.find(l => l.id == id);
  
  if (!lugar) return;
  
  // Preencher o formulário de edição
  document.getElementById('edit-id').value = lugar.id;
  document.getElementById('edit-nome').value = lugar.nome;
  document.getElementById('edit-descricao').value = lugar.descricao;
  document.getElementById('edit-conteudo').value = lugar.conteudo;
  document.getElementById('edit-categoria').value = lugar.categoria;
  document.getElementById('edit-destaque').value = lugar.destaque.toString();
  document.getElementById('edit-endereco').value = lugar.endereco;
  document.getElementById('edit-horarios').value = lugar.horarios;
  document.getElementById('edit-telefone').value = lugar.telefone;
  document.getElementById('edit-imagem-principal').value = lugar.imagem_principal;
  
  // Mostrar o modal
  const modal = new bootstrap.Modal(document.getElementById('modalEdicao'));
  modal.show();
}

async function salvarEdicao() {
  const form = document.getElementById('form-edicao-lugar');
  
  if (!form.checkValidity()) {
    form.classList.add('was-validated');
    return;
  }
  
  const id = document.getElementById('edit-id').value;
  const lugarAtual = lugaresData.find(l => l.id == id);
  
  const lugarAtualizado = {
    ...lugarAtual,
    nome: document.getElementById('edit-nome').value,
    descricao: document.getElementById('edit-descricao').value,
    conteudo: document.getElementById('edit-conteudo').value,
    categoria: document.getElementById('edit-categoria').value,
    destaque: document.getElementById('edit-destaque').value === 'true',
    endereco: document.getElementById('edit-endereco').value,
    horarios: document.getElementById('edit-horarios').value,
    telefone: document.getElementById('edit-telefone').value,
    imagem_principal: document.getElementById('edit-imagem-principal').value
  };
  
  try {
    await updateLugar(id, lugarAtualizado);
    showAlert('Lugar atualizado com sucesso!', 'success');
    
    //fechar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalEdicao'));
    modal.hide();
    
    //recarregar lista
    carregarListaLugares();
  } catch (error) {
    showAlert('Erro ao atualizar lugar.', 'danger');
  }
}

async function confirmarExclusao(id) {
  const lugar = lugaresData.find(l => l.id == id);
  
  if (!lugar) return;
  
  if (confirm(`Tem certeza que deseja excluir "${lugar.nome}"?`)) {
    try {
      await deleteLugar(id);
      showAlert('Lugar excluído com sucesso!', 'success');
      carregarListaLugares();
    } catch (error) {
      showAlert('Erro ao excluir lugar.', 'danger');
    }
  }
}
