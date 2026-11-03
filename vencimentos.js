/* Complemento para Meu Controle Financeiro.
 * 1. Salve como vencimentos.js na raiz do repositório.
 * 2. Em index.html, junto dos outros imports, acrescente:
 *      import { iniciarVencimentos } from "./vencimentos.js";
 * 3. Logo abaixo dessa linha, acrescente:
 *      iniciarVencimentos();
 * Não altera nem grava dados no Firebase.
 */
export function iniciarVencimentos() {
  if (document.getElementById('estilo-vencimentos')) return;
  const estilo = document.createElement('style');
  estilo.id = 'estilo-vencimentos';
  estilo.textContent = `
    .aviso-vencimento{display:inline-block;margin-top:4px;padding:2px 6px;border-radius:5px;font-size:11px;font-weight:700;line-height:1.3;white-space:normal}
    .aviso-vencida{background:#fce8e6;color:#a52219}
    .aviso-hoje{background:#fff0d1;color:#805000}
    .aviso-proxima{background:#fff7df;color:#715600}
    .calendario-dia.aviso-dia-vencida{box-shadow:inset 0 0 0 1px #c8655b}
    .calendario-dia.aviso-dia-hoje{box-shadow:inset 0 0 0 1px #c78b16}
    .calendario-dia.aviso-dia-proxima{box-shadow:inset 0 0 0 1px #d6b45b}
    .calendario-dia .aviso-vencimento{font-size:10px;margin-top:0;padding:1px 3px}
    @media(max-width:520px){.calendario-dia .aviso-vencimento{font-size:9px;line-height:1.1}}
  `;
  document.head.appendChild(estilo);
  const pad = n => String(n).padStart(2, '0');
  const localISO = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  function avaliar(iso) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(iso || '')) return null;
    const partes = iso.split('-').map(Number);
    const d = new Date(partes[0], partes[1] - 1, partes[2]);
    if (localISO(d) !== iso) return null;
    const agora = new Date();
    const hoje = Date.UTC(agora.getFullYear(), agora.getMonth(), agora.getDate());
    const vencimento = Date.UTC(partes[0], partes[1] - 1, partes[2]);
    const dias = Math.round((vencimento - hoje) / 86400000);
    if (dias < 0) return { tipo: 'vencida', texto: 'Vencida' };
    if (dias === 0) return { tipo: 'hoje', texto: 'Vence hoje' };
    if (dias === 1) return { tipo: 'proxima', texto: 'Vence amanhã' };
    if (dias <= 3) return { tipo: 'proxima', texto: `Vence em ${dias} dias` };
    return null;
  }
  function rotulo(situacao) {
    const span = document.createElement('span');
    span.className = `aviso-vencimento aviso-${situacao.tipo}`;
    span.textContent = situacao.texto;
    return span;
  }
  function atualizar() {
    document.querySelectorAll('#rows tr').forEach(linha => {
      const celulas = linha.querySelectorAll('td');
      if (celulas.length < 5) return;
      const select = celulas[4].querySelector('select.status-select');
      if (!select || select.value === 'PAGO') return;
      const texto = celulas[3].textContent.trim();
      const partes = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(texto);
      if (!partes) return;
      const situacao = avaliar(`${partes[3]}-${partes[2]}-${partes[1]}`);
      if (!situacao) return;
      const br = document.createElement('br');
      br.className = 'aviso-quebra';
      celulas[3].append(br, rotulo(situacao));
    });
    document.querySelectorAll('#calendarioGrade button[data-dia]').forEach(botao => {
      if (!botao.querySelector('.calendario-qtd')) return;
      const situacao = avaliar(botao.dataset.dia);
      if (!situacao) return;
      botao.classList.add(`aviso-dia-${situacao.tipo}`);
      botao.appendChild(rotulo(situacao));
      const label = botao.getAttribute('aria-label') || '';
      botao.setAttribute('aria-label', `${label}. ${situacao.texto}`);
    });
  }
  function limpar() {
    document.querySelectorAll('.aviso-vencimento, .aviso-quebra').forEach(el => el.remove());
    document.querySelectorAll('#calendarioGrade button[data-dia]').forEach(el => {
      el.classList.remove('aviso-dia-vencida', 'aviso-dia-hoje', 'aviso-dia-proxima');
      const label = el.getAttribute('aria-label') || '';
      el.setAttribute('aria-label', label.replace(/\. (Vencida|Vence hoje|Vence amanhã|Vence em \d+ dias)$/, ''));
    });
  }
  // Cada render recria as linhas ou os dias. Limpar antes evita duplicações
  // quando apenas uma das duas áreas é atualizada.
  const observador = new MutationObserver(() => { limpar(); atualizar(); });
  const linhas = document.getElementById('rows');
  if (linhas) observador.observe(linhas, { childList: true });
  const main = document.getElementById('mainApp');
  function observarCalendario() {
    const grade = document.getElementById('calendarioGrade');
    if (grade && !grade.dataset.avisoObservado) {
      grade.dataset.avisoObservado = 'sim';
      observador.observe(grade, { childList: true });
      limpar(); atualizar();
    }
  }
  if (main) new MutationObserver(observarCalendario).observe(main, { childList: true, subtree: true });
  observarCalendario();
  atualizar();
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') { limpar(); atualizar(); }
  });
}
