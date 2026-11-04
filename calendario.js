/*
 * CALENDÁRIO DE CONTAS A PAGAR
 * Complemento para o index.html do repositório controle-financeiro.
 *
 * Instalação: copie este arquivo para a raiz do repositório com o nome
 * calendario.js. Depois, no index.html, localize a linha:
 *
 *   import { firebaseConfig } from "./firebase-config.js";
 *
 * e acrescente imediatamente abaixo:
 *
 *   import { iniciarCalendario } from "./calendario.js";
 *
 * Em seguida, localize dentro da função render() a linha:
 *
 *   if(typeof Chart !== 'undefined') updateCharts(mk);
 *
 * e acrescente imediatamente antes dela:
 *
 *   iniciarCalendario({ data, current, brl, escapeHtml });
 *
 * Esse complemento apenas lê os lançamentos já carregados pelo aplicativo.
 * Não altera a configuração do Firebase, nem escreve ou exclui dados.
 */

let diaSelecionado = null;
let mesSelecionado = null;
let ultimoContexto = null;

function criarInterface() {
  if (document.getElementById('calendarioContas')) return;

  const style = document.createElement('style');
  style.textContent = `
    .calendario-contas{background:#fff;border:1px solid var(--line);border-radius:14px;box-shadow:0 3px 10px #2135470a;margin-bottom:18px;overflow:hidden}
    .calendario-cabecalho{padding:20px 24px;border-bottom:3px solid var(--green)}
    .calendario-cabecalho h2{margin:0 0 6px;font-size:19px}
    .calendario-cabecalho p{margin:0;color:var(--muted);font-size:14px;line-height:1.5}
    .calendario-conteudo{padding:18px 24px 24px}
    .calendario-semana,.calendario-grade{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));gap:6px}
    .calendario-semana{margin-bottom:6px;text-align:center;color:var(--muted);font-size:13px;font-weight:700}
    .calendario-dia,.calendario-vazio{min-width:0;min-height:88px;border-radius:8px}
    .calendario-dia{display:flex;flex-direction:column;align-items:flex-start;gap:6px;background:#f7f9fa;border:1px solid var(--line);padding:8px;text-align:left;color:var(--text);font-weight:400}
    .calendario-dia:hover,.calendario-dia:focus-visible{border-color:var(--green);outline:2px solid #28665333;outline-offset:1px}
    .calendario-dia.selecionado{border:2px solid var(--green);background:#edf7f2}
    .calendario-dia.hoje .calendario-numero{color:var(--green2);text-decoration:underline}
    .calendario-numero{font-size:14px;font-weight:800}
    .calendario-valor{font-size:13px;font-weight:700;color:var(--red);overflow-wrap:anywhere}
    .calendario-qtd{font-size:11px;color:var(--muted)}
    .calendario-detalhes{margin-top:18px;border-top:1px solid var(--line);padding-top:15px}
    .calendario-detalhes h3{font-size:16px;margin:0 0 10px}
    .calendario-detalhes p{color:var(--muted);font-size:14px;margin:0;line-height:1.5}
    .calendario-lista{list-style:none;padding:0;margin:0}
    .calendario-lista li{display:flex;justify-content:space-between;gap:12px;padding:10px 0;border-bottom:1px solid #e5e9eb}
    .calendario-lista li:last-child{border-bottom:0}
    .calendario-lista strong{overflow-wrap:anywhere}
    .calendario-lista .calendario-item-valor{white-space:nowrap;color:var(--red);font-weight:700}
    #mainApp #calendarioContas .calendario-receita{color:#267653}
    #mainApp #calendarioContas .calendario-pago{color:#426b7e}
    #mainApp #calendarioContas .calendario-pendente{color:#904b41}
    @media(max-width:520px){
      .calendario-cabecalho{padding:16px}.calendario-conteudo{padding:12px}
      .calendario-semana,.calendario-grade{gap:3px}.calendario-semana{font-size:11px}
      .calendario-dia,.calendario-vazio{min-height:68px}.calendario-dia{padding:4px;gap:4px}
      .calendario-numero{font-size:12px}.calendario-valor{font-size:10px;line-height:1.15}
      .calendario-qtd{font-size:9px}
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement('section');
  section.id = 'calendarioContas';
  section.className = 'calendario-contas';
  section.setAttribute('aria-labelledby', 'calendarioTitulo');
  section.innerHTML = `
    <div class="calendario-cabecalho">
      <h2 id="calendarioTitulo">Calendário de lançamentos</h2>
      <p>Receitas, despesas pendentes e contas pagas aparecem separadamente. Toque em um dia para ver os detalhes.</p>
    </div>
    <div class="calendario-conteudo">
      <div class="calendario-semana" aria-hidden="true"><span>Dom</span><span>Seg</span><span>Ter</span><span>Qua</span><span>Qui</span><span>Sex</span><span>Sáb</span></div>
      <div id="calendarioGrade" class="calendario-grade"></div>
      <div id="calendarioDetalhes" class="calendario-detalhes" aria-live="polite"><p>Selecione um dia para ver os lançamentos.</p></div>
    </div>`;
  const analytics = document.querySelector('#mainApp .analytics');
  if (!analytics) throw new Error('Não foi possível localizar a área de gráficos para inserir o calendário.');
  analytics.before(section);

  section.addEventListener('click', event => {
    const button = event.target.closest('button[data-dia]');
    if (!button || !section.contains(button) || !ultimoContexto) return;
    diaSelecionado = button.dataset.dia;
    desenhar(ultimoContexto);
    const selected = document.querySelector('#calendarioGrade button.selecionado');
    if (selected) selected.focus({ preventScroll: true });
  });
}

function desenhar(contexto) {
  const { data, current, brl, escapeHtml } = contexto;
  const ano = current.getFullYear();
  const mes = current.getMonth();
  const prefixo = `${ano}-${String(mes + 1).padStart(2, '0')}`;
  if (mesSelecionado !== prefixo) {
    mesSelecionado = prefixo;
    diaSelecionado = null;
  }

  // Cada lançamento aparece uma única vez: receita, despesa paga ou pendente.
  const itens = data.filter(item => typeof item.date === 'string' &&
    item.date.slice(0, 7) === prefixo);
  const porDia = new Map();
  for (const item of itens) {
    const lista = porDia.get(item.date) || [];
    lista.push(item);
    porDia.set(item.date, lista);
  }
  const totalizar = lista => lista.reduce((total, item) =>
    total + Math.round((Number(item.value) || 0) * 100), 0);
  const separar = lista => ({
    receitas: lista.filter(item => item.type === 'Receita'),
    pagas: lista.filter(item => item.type !== 'Receita' && item.status === 'PAGO'),
    pendentes: lista.filter(item => item.type !== 'Receita' && item.status !== 'PAGO')
  });

  const primeiroDia = new Date(ano, mes, 1).getDay();
  const quantidadeDias = new Date(ano, mes + 1, 0).getDate();
  const hoje = new Date();
  const hojeTexto = `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
  const html = Array.from({ length: primeiroDia }, () => '<div class="calendario-vazio" aria-hidden="true"></div>');
  for (let dia = 1; dia <= quantidadeDias; dia++) {
    const chave = `${prefixo}-${String(dia).padStart(2, '0')}`;
    const lista = porDia.get(chave) || [];
    const grupos = separar(lista);
    const resumo = [
      grupos.receitas.length ? `${grupos.receitas.length} receita(s), ${brl(totalizar(grupos.receitas)/100)}` : '',
      grupos.pendentes.length ? `${grupos.pendentes.length} despesa(s) pendente(s), ${brl(totalizar(grupos.pendentes)/100)}` : '',
      grupos.pagas.length ? `${grupos.pagas.length} conta(s) paga(s), ${brl(totalizar(grupos.pagas)/100)}` : ''
    ].filter(Boolean).join('; ') || 'nenhum lançamento';
    const valores = [
      grupos.receitas.length ? `<span class="calendario-valor calendario-receita">+ ${escapeHtml(brl(totalizar(grupos.receitas)/100))}</span>` : '',
      grupos.pendentes.length ? `<span class="calendario-valor calendario-pendente">− ${escapeHtml(brl(totalizar(grupos.pendentes)/100))}</span>` : '',
      grupos.pagas.length ? `<span class="calendario-valor calendario-pago">Pago: ${escapeHtml(brl(totalizar(grupos.pagas)/100))}</span>` : ''
    ].join('');
    // O marcador de quantidade só existe para pendentes: os alertas de
    // vencimento não devem ser exibidos para receitas ou contas pagas.
    const qtd = grupos.pendentes.length ? `<span class="calendario-qtd">${grupos.pendentes.length} pendente(s)</span>` : '';
    html.push(`<button type="button" class="calendario-dia${chave === diaSelecionado ? ' selecionado' : ''}${chave === hojeTexto ? ' hoje' : ''}" data-dia="${chave}" aria-pressed="${chave === diaSelecionado}" aria-label="Dia ${dia}: ${escapeHtml(resumo)}"><span class="calendario-numero">${dia}</span>${valores}${qtd}</button>`);
  }
  document.getElementById('calendarioGrade').innerHTML = html.join('');

  const detalhes = document.getElementById('calendarioDetalhes');
  if (!diaSelecionado) {
    detalhes.innerHTML = '<p>Selecione um dia para ver os lançamentos.</p>';
    return;
  }
  const lista = porDia.get(diaSelecionado) || [];
  const dataFormatada = `${diaSelecionado.slice(8, 10)}/${diaSelecionado.slice(5, 7)}/${diaSelecionado.slice(0, 4)}`;
  if (!lista.length) {
    detalhes.innerHTML = `<h3>Lançamentos de ${dataFormatada}</h3><p>Nenhum lançamento neste dia.</p>`;
    return;
  }
  const grupos = separar(lista);
  const resumo = [
    grupos.receitas.length ? `Receitas: ${escapeHtml(brl(totalizar(grupos.receitas)/100))}` : '',
    grupos.pendentes.length ? `Pendentes: ${escapeHtml(brl(totalizar(grupos.pendentes)/100))}` : '',
    grupos.pagas.length ? `Pagas: ${escapeHtml(brl(totalizar(grupos.pagas)/100))}` : ''
  ].filter(Boolean).join(' · ');
  detalhes.innerHTML = `<h3>Lançamentos de ${dataFormatada}</h3><p>${resumo}</p><ul class="calendario-lista">${lista.map(item => {
    const receita = item.type === 'Receita';
    const situacao = receita ? 'Receita' : item.status === 'PAGO' ? 'Pago' : 'Não pago';
    const classe = receita ? 'calendario-receita' : item.status === 'PAGO' ? 'calendario-pago' : 'calendario-pendente';
    return `<li><span><strong>${escapeHtml(item.desc)}</strong><br><small>${escapeHtml(item.type)} · ${situacao}</small></span><span class="calendario-item-valor ${classe}">${receita ? '+ ' : '− '}${escapeHtml(brl(Number(item.value) || 0))}</span></li>`;
  }).join('')}</ul>`;
}

export function iniciarCalendario(contexto) {
  ultimoContexto = contexto;
  criarInterface();
  desenhar(contexto);
}
