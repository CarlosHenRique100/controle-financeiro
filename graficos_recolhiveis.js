/* Gráficos recolhíveis — Meu Controle Financeiro.
 * Salve este arquivo na raiz do repositório como graficos_recolhiveis.js.
 * Junto dos demais imports em index.html, acrescente:
 *   import { iniciarGraficosRecolhiveis } from "./graficos_recolhiveis.js";
 *   iniciarGraficosRecolhiveis();
 * Não lê nem altera os dados do Firebase.
 */
export function iniciarGraficosRecolhiveis() {
  const painel = document.querySelector('#mainApp .analytics');
  if (!painel || document.getElementById('alternarGraficos')) return;

  const estilo = document.createElement('style');
  estilo.textContent = '#areaGraficos[hidden]{display:none !important}';
  document.head.appendChild(estilo);

  const botao = document.createElement('button');
  botao.type = 'button';
  botao.id = 'alternarGraficos';
  botao.className = 'btn-light';
  botao.setAttribute('aria-expanded', 'false');
  botao.setAttribute('aria-controls', 'areaGraficos');
  botao.style.marginBottom = '18px';
  botao.textContent = 'Mostrar gráficos';

  painel.id = 'areaGraficos';
  painel.hidden = true;
  painel.before(botao);

  botao.addEventListener('click', () => {
    const mostrar = painel.hidden;
    painel.hidden = !mostrar;
    botao.textContent = mostrar ? 'Ocultar gráficos' : 'Mostrar gráficos';
    botao.setAttribute('aria-expanded', String(mostrar));
    if (mostrar) requestAnimationFrame(() => {
      if (painel.hidden || typeof window.Chart === 'undefined') return;
      for (const canvas of painel.querySelectorAll('canvas')) {
        const grafico = window.Chart.getChart(canvas);
        if (grafico) grafico.resize();
      }
    });
  });
}
