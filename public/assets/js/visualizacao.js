// ==================== CONFIGURAÇÕES E VARIÁVEIS GLOBAIS ====================
const API_URL = 'http://localhost:3000/lugares';
let lugaresData = [];

// ==================== FUNÇÕES DE CARREGAMENTO DE DADOS ====================
async function carregarDados() {
    try {
        const response = await fetch(API_URL);
        lugaresData = await response.json();
        
        // Atualizar estatísticas
        atualizarEstatisticas();
        
        // Criar gráfico
        criarGraficoCategorias();
        
        // Inicializar mapa
        inicializarMapa();
        
        console.log('Dados carregados com sucesso:', lugaresData);
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
        mostrarErroCarregamento();
    }
}

function mostrarErroCarregamento() {
    const container = document.getElementById('statsContainer');
    container.innerHTML = `
        <div class="col-12">
            <div class="alert alert-warning" role="alert">
                <i class="bi bi-exclamation-triangle me-2"></i>
                <strong>Atenção:</strong> Não foi possível carregar os dados. 
                Certifique-se de que o JSON Server está executando com o comando: <code>npm start</code>
            </div>
        </div>
    `;
}

// ==================== ESTATÍSTICAS GERAIS ====================
function atualizarEstatisticas() {
    const totalLugares = lugaresData.length;
    const lugaresDestaque = lugaresData.filter(lugar => lugar.destaque).length;
    const totalAtracoes = lugaresData.reduce((total, lugar) => total + (lugar.atracoes?.length || 0), 0);
    const categorias = [...new Set(lugaresData.map(lugar => lugar.categoria))].length;
    
    const statsHtml = `
        <div class="col-md-3 col-sm-6">
            <div class="stats-card text-center">
                <div class="stats-number">${totalLugares}</div>
                <div class="h5">Total de Lugares</div>
                <small><i class="bi bi-geo-alt me-1"></i>Locais cadastrados</small>
            </div>
        </div>
        <div class="col-md-3 col-sm-6">
            <div class="stats-card text-center">
                <div class="stats-number">${lugaresDestaque}</div>
                <div class="h5">Em Destaque</div>
                <small><i class="bi bi-star me-1"></i>Locais destacados</small>
            </div>
        </div>
        <div class="col-md-3 col-sm-6">
            <div class="stats-card text-center">
                <div class="stats-number">${totalAtracoes}</div>
                <div class="h5">Total Atrações</div>
                <small><i class="bi bi-camera me-1"></i>Atrações disponíveis</small>
            </div>
        </div>
        <div class="col-md-3 col-sm-6">
            <div class="stats-card text-center">
                <div class="stats-number">${categorias}</div>
                <div class="h5">Categorias</div>
                <small><i class="bi bi-tags me-1"></i>Tipos diferentes</small>
            </div>
        </div>
    `;
    
    document.getElementById('statsContainer').innerHTML = statsHtml;
}

// ==================== GRÁFICOS COM CHART.JS ====================

// Gráfico de Pizza - Distribuição por Categoria
function criarGraficoCategorias() {
    const ctx = document.getElementById('categoryChart').getContext('2d');
    
    const categoriaCount = {};
    lugaresData.forEach(lugar => {
        const categoria = lugar.categoria || 'Sem categoria';
        categoriaCount[categoria] = (categoriaCount[categoria] || 0) + 1;
    });
    
    // Gerar cores dinâmicas baseadas nas categorias
    const categorias = Object.keys(categoriaCount);
    const cores = categorias.map(categoria => getCorCategoria(categoria));
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: categorias,
            datasets: [{
                data: Object.values(categoriaCount),
                backgroundColor: cores,
                borderWidth: 3,
                borderColor: '#fff',
                hoverBorderWidth: 4,
                hoverBorderColor: '#333'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        usePointStyle: true,
                        font: {
                            size: 14
                        }
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((context.parsed / total) * 100).toFixed(1);
                            return `${context.label}: ${context.parsed} lugares (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// ==================== MAPA COM MAPBOX ====================
function inicializarMapa() {
    // Token público do Mapbox
    mapboxgl.accessToken = 'pk.eyJ1IjoiZ3VzcGVuaWRvIiwiYSI6ImNtM2hicmJzbTBlY2kyam9pZTE4d3JpbTQifQ.urgsdDo_TtTTrAB8hLvoew';

    // Calcular centro do mapa baseado nos dados
    const centroMapa = calcularCentroMapa();

    const map = new mapboxgl.Map({
        container: 'map',
        style: 'mapbox://styles/mapbox/streets-v11',
        center: centroMapa,
        zoom: 11
    });

    map.on('load', function() {
        // Adicionar marcadores para cada lugar
        lugaresData.forEach((lugar, index) => {
            // Usar coordenadas do JSON
            const coordenadas = [lugar.coordenadas.longitude, lugar.coordenadas.latitude];
            
            // Criar elemento personalizado para o marcador
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.width = lugar.destaque ? '30px' : '25px';
            el.style.height = lugar.destaque ? '30px' : '25px';
            el.style.borderRadius = '50%';
            el.style.cursor = 'pointer';
            el.style.border = lugar.destaque ? '3px solid #FFD700' : '2px solid #fff';
            el.style.backgroundColor = getCorCategoria(lugar.categoria);
            el.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            
            // Adicionar ícone baseado na categoria
            el.innerHTML = `<i class="bi ${getIconeCategoria(lugar.categoria)}" style="
                color: white; 
                font-size: ${lugar.destaque ? '16px' : '14px'}; 
                display: flex; 
                align-items: center; 
                justify-content: center; 
                height: 100%; 
                text-shadow: 0 1px 2px rgba(0,0,0,0.5);
            "></i>`;

            // Criar popup com dados dinâmicos
            const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div style="max-width: 280px;">
                    <h6 style="margin-bottom: 10px; color: #333; font-weight: bold;">
                        ${lugar.destaque ? '⭐ ' : ''}${lugar.nome}
                    </h6>
                    <p style="margin-bottom: 8px; font-size: 14px;">
                        <strong>📍 Categoria:</strong> ${lugar.categoria}
                    </p>
                    <p style="margin-bottom: 8px; font-size: 13px; color: #666;">
                        ${lugar.descricao}
                    </p>
                    <p style="margin-bottom: 8px; font-size: 12px;">
                        <strong>🎯 Atrações:</strong> ${lugar.atracoes?.length || 0}
                    </p>
                    <p style="margin-bottom: 8px; font-size: 12px;">
                        <strong>📅 Cadastrado:</strong> ${formatarData(lugar.data)}
                    </p>
                    <p style="margin-bottom: 8px; font-size: 12px;">
                        <strong>📞 Telefone:</strong> ${lugar.telefone || 'Não informado'}
                    </p>
                    <a href="detalhes.html?id=${lugar.id}" target="_blank" 
                       style="color: #007bff; text-decoration: none; font-size: 12px; font-weight: bold;">
                        Ver detalhes completos →
                    </a>
                </div>
            `);

            // Adicionar marcador ao mapa
            new mapboxgl.Marker(el)
                .setLngLat(coordenadas)
                .setPopup(popup)
                .addTo(map);
        });

        // Adicionar controles de navegação
        map.addControl(new mapboxgl.NavigationControl());
        
        // Adicionar controle de tela cheia
        map.addControl(new mapboxgl.FullscreenControl());
    });
}

// Função para calcular o centro do mapa baseado nos dados
function calcularCentroMapa() {
    if (lugaresData.length === 0) {
        return [-43.9378, -19.9167]; // Coordenadas padrão de BH
    }
    
    let somaLat = 0;
    let somaLng = 0;
    let count = 0;
    
    lugaresData.forEach(lugar => {
        if (lugar.coordenadas) {
            somaLat += lugar.coordenadas.latitude;
            somaLng += lugar.coordenadas.longitude;
            count++;
        }
    });
    
    return count > 0 ? [somaLng / count, somaLat / count] : [-43.9378, -19.9167];
}

// Função para obter ícone baseado na categoria
function getIconeCategoria(categoria) {
    const icones = {
        'Compras': 'bi-basket',
        'Natureza': 'bi-tree',
        'Cultura': 'bi-bank2',
        'default': 'bi-geo-alt'
    };
    return icones[categoria] || icones.default;
}

// Função para obter cor baseada na categoria (dinâmica)
function getCorCategoria(categoria) {
    const cores = {
        'Compras': '#FF6384',
        'Natureza': '#4BC0C0',
        'Cultura': '#36A2EB',
        'default': '#9966FF'
    };
    return cores[categoria] || cores.default;
}

// Função para formatar data
function formatarData(dataString) {
    if (!dataString) return 'Não informado';
    
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// ==================== INICIALIZAÇÃO ====================
document.addEventListener('DOMContentLoaded', function() {
    carregarDados();
});

// ==================== UTILITÁRIOS ====================
window.addEventListener('resize', function() {
    // Redimensionar gráficos quando a janela muda de tamanho
    Chart.helpers.each(Chart.instances, function(instance) {
        instance.resize();
    });
});