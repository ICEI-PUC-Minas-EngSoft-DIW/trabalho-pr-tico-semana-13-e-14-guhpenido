
# Trabalho Prático 07 - Semanas 13 e 14

A partir dos dados cadastrados na etapa anterior, vamos trabalhar formas de apresentação que representem de forma clara e interativa as informações do seu projeto. Você poderá usar gráficos (barra, linha, pizza), mapas, calendários ou outras formas de visualização. Seu desafio é entregar uma página Web que organize, processe e exiba os dados de forma compreensível e esteticamente agradável.

Com base nos tipos de projetos escohidos, você deve propor **visualizações que estimulem a interpretação, agrupamento e exibição criativa dos dados**, trabalhando tanto a lógica quanto o design da aplicação.

Sugerimos o uso das seguintes ferramentas acessíveis: [FullCalendar](https://fullcalendar.io/), [Chart.js](https://www.chartjs.org/), [Mapbox](https://docs.mapbox.com/api/), para citar algumas.

## Informações do trabalho

- **Nome:** Gustavo Marcelo Penido Pereira
- **Matrícula:** 905518
- **Proposta de projeto escolhida:** Lugares e Experiências
- **Breve descrição sobre seu projeto:**

O projeto "BH Experiências" é um guia digital sobre Belo Horizonte que apresenta os principais lugares e experiências que a capital mineira oferece. A aplicação web foca na entidade principal "Lugares Turísticos" com suas respectivas atrações, categorias e informações detalhadas sobre cada local.

## Implementação da Funcionalidade

Nesta etapa foi implementada uma **página de visualização dinâmica** (`visualizacao.html`) que apresenta os dados dos lugares turísticos de Belo Horizonte de forma interativa e visualmente atraente.

### Tecnologias Utilizadas

- **Chart.js**: Para criação de gráficos dinâmicos
- **Mapbox**: Para mapa interativo com marcadores georreferenciados

### Funcionalidades Implementadas

#### 1. Estatísticas Dinâmicas
Cards informativos que exibem:
- Total de lugares cadastrados
- Quantidade de lugares em destaque
- Total de atrações disponíveis
- Número de categorias diferentes

#### 2. Gráfico de Pizza - Distribuição por Categoria
- Visualização da distribuição dos lugares por categoria (Compras, Natureza, Cultura)
- Cores dinâmicas baseadas no tipo de categoria
- Tooltips com percentuais e quantidades
- Dados obtidos em tempo real do JSON Server

#### 3. Mapa Interativo
- Mapa baseado no Mapbox com coordenadas reais dos lugares
- Marcadores coloridos por categoria
- Marcadores diferenciados para lugares em destaque (borda dourada)
- Popups informativos com:
  - Nome do lugar
  - Categoria e descrição
  - Número de atrações
  - Data de cadastro
  - Informações de contato
  - Link para página de detalhes
- Controles de navegação e tela cheia
- Centro do mapa calculado automaticamente baseado nos dados

**Prints da implementação:**

![Print Dados Chart.js](https://i.imgur.com/kvqQuAb.png)
![Print Visualização Mapbox](https://i.imgur.com/66OBMN9.png)
![Print Gráfico Chart.js](https://i.imgur.com/C9Bjxhv.png)
