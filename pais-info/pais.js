let timeout = null
let todosOsPaises = [] // Armazena os dados da API
const resultado = document.getElementById('resultado')
const inputBusca = document.getElementById('busca')
const selectContinente = document.getElementById('continente')

// Carrega todos os países ao iniciar
window.addEventListener('DOMContentLoaded', async () => {
  try {
    const res = await fetch(
      'https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,languages,currencies',
    )
    todosOsPaises = await res.json()
    renderizarPaises(todosOsPaises)
  } catch (error) {
    resultado.innerHTML = `<p style="color:red">Erro ao carregar países.</p>`
  }
})

// Busca automática com debounce
inputBusca.addEventListener('input', () => {
  clearTimeout(timeout)
  timeout = setTimeout(filtrarPaises, 500)
})

// Filtro por continente
selectContinente.addEventListener('change', filtrarPaises)

// Função principal que filtra por nome e região
function filtrarPaises() {
  const nome = inputBusca.value.trim().toLowerCase()
  const regiao = selectContinente.value

  const filtrados = todosOsPaises.filter((pais) => {
    const nomeValido = pais.name.common.toLowerCase().includes(nome)
    const regiaoValida = regiao ? pais.region === regiao : true
    return nomeValido && regiaoValida
  })

  renderizarPaises(filtrados)
}

// Exibe os países no DOM como cards em grid
function renderizarPaises(lista) {
  if (lista.length === 0) {
    resultado.innerHTML = `<p>Nenhum país encontrado.</p>`
    return
  }

  resultado.innerHTML = lista
    .map((pais) => {
      return `
        <div class="pais-card">
          <h2>${pais.name.common}</h2>
          <img src="${pais.flags.svg}" alt="Bandeira de ${pais.name.common}">
          <p><strong>Capital:</strong> ${
            pais.capital?.[0] || 'Indisponível'
          }</p>
          <p><strong>População:</strong> ${pais.population.toLocaleString()}</p>
          <p><strong>Região:</strong> ${pais.region}</p>
          <p><strong>Idiomas:</strong> ${Object.values(
            pais.languages || {},
          ).join(', ')}</p>
          <p><strong>Moeda:</strong> ${Object.values(pais.currencies || {})
            .map((c) => `${c.name} (${c.symbol})`)
            .join(', ')}</p>
        </div>
      `
    })
    .join('')
}

const botaoTema = document.getElementById('toggle-tema')
const iconeTema = document.getElementById('icone-tema')

// Aplica tema salvo ao carregar
window.addEventListener('DOMContentLoaded', () => {
  const temaSalvo = localStorage.getItem('tema') || 'claro'
  if (temaSalvo === 'escuro') {
    document.body.classList.add('dark')
    iconeTema.src = '../svg/sun.svg'
  }
})

// Alterna tema ao clicar no botão
botaoTema.addEventListener('click', () => {
  document.body.classList.toggle('dark')

  const temaAtual = document.body.classList.contains('dark')
    ? 'escuro'
    : 'claro'
  localStorage.setItem('tema', temaAtual)
  iconeTema.src = temaAtual === 'escuro' ? '../svg/sun.svg' : '../svg/moon.svg'
})
