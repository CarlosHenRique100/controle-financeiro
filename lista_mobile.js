/*
  Lista adaptada para celular — Meu Controle Financeiro.
  Instalação:
  1) Adicione lista_mobile.js à raiz do repositório.
  2) No index.html, ao lado dos demais imports, adicione:
     import { iniciarListaMobile } from "./lista_mobile.js";
     iniciarListaMobile();
  Este complemento reutiliza a tabela e os botões existentes.
  Não lê credenciais nem grava dados no Firebase por conta própria.
*/
export function iniciarListaMobile() {
  if (document.getElementById('estilos-lista-mobile')) return;
  const corpo = document.getElementById('rows');
  if (!corpo) return;

  const style = document.createElement('style');
  style.id = 'estilos-lista-mobile';
  style.textContent = `
    .mobile-detalhes-btn { display:none; }
    @media (max-width: 700px) {
      #mainApp .panel { overflow:visible; }
      #mainApp .panel-head h2 { white-space:normal; flex-wrap:wrap; }
      #mainApp .table-wrap { overflow:visible; padding:12px; }
      #mainApp .table-wrap table,
      #mainApp .table-wrap tbody { display:block; width:100%; min-width:0; }
      #mainApp .table-wrap thead { display:none; }
      #mainApp #rows tr { display:grid; grid-template-columns:minmax(0,1fr) auto; gap:8px 12px;
        margin:0 0 10px; padding:14px; border:1px solid var(--line); border-radius:10px;
        background:#fff; min-width:0; }
      #mainApp #rows tr:last-child { margin-bottom:0; }
      #mainApp #rows tr td { display:block; padding:0; border:0; min-width:0;
        overflow-wrap:anywhere; }
      #mainApp #rows tr td:nth-child(1) { grid-column:1; grid-row:1; font-size:15px; }
      #mainApp #rows tr td:nth-child(3) { grid-column:2; grid-row:1; text-align:right;
        font-weight:700; white-space:nowrap; }
      #mainApp #rows tr td:nth-child(4) { grid-column:1; grid-row:2; font-size:13px; color:var(--muted); }
      #mainApp #rows tr td:nth-child(5) { grid-column:2; grid-row:2; text-align:right; font-size:13px; }
      #mainApp #rows tr td:nth-child(2),
      #mainApp #rows tr td:nth-child(6),
      #mainApp #rows tr td:nth-child(7) { display:none; grid-column:1 / -1; text-align:left; }
      #mainApp #rows tr.detalhes-abertos td:nth-child(2),
      #mainApp #rows tr.detalhes-abertos td:nth-child(6),
      #mainApp #rows tr.detalhes-abertos td:nth-child(7) { display:block; }
      #mainApp #rows tr td:nth-child(2)::before,
      #mainApp #rows tr td:nth-child(6)::before {
        display:block; margin-bottom:4px; font-size:12px; color:var(--muted); font-weight:700;
      }
      #mainApp #rows tr td:nth-child(2)::before { content:'Tipo'; }
      #mainApp #rows tr td:nth-child(6)::before { content:'Observações'; }
      #mainApp #rows tr td:nth-child(6):empty::after { content:'Nenhuma'; color:var(--muted); }
      #mainApp #rows tr td:nth-child(7) { padding-top:6px; border-top:1px solid var(--line); }
      #mainApp #rows tr td:nth-child(7) .actions { gap:8px; }
      #mainApp #rows tr td:nth-child(7) .icon-btn { min-width:44px; min-height:44px; }
      #mainApp #rows tr .value-edit { width:112px; max-width:100%; padding:5px 2px; }
      #mainApp #rows tr .status-select { max-width:100%; padding:7px 24px 7px 8px; font-size:12px; }
      #mainApp #rows tr .mobile-detalhes-btn { display:block; margin-top:6px; padding:7px 0;
        color:var(--green); background:transparent; text-align:left; font-size:13px; }
      #mainApp #rows tr .mobile-detalhes-btn:focus-visible { outline:2px solid var(--green); outline-offset:2px; }
      #mainApp #rows tr td.empty { grid-column:1 / -1; grid-row:auto; padding:14px; text-align:center; }
    }
  `;
  document.head.appendChild(style);

  function preparar() {
    for (const linha of corpo.rows) {
      if (linha.cells.length !== 7) continue; // mensagem de lista vazia
      const primeira = linha.cells[0];
      if (primeira.querySelector('.mobile-detalhes-btn')) continue;
      const botao = document.createElement('button');
      botao.type = 'button';
      botao.className = 'mobile-detalhes-btn';
      botao.textContent = 'Ver detalhes ▾';
      botao.setAttribute('aria-expanded', 'false');
      const descricao = primeira.querySelector('b')?.textContent || 'lançamento';
      botao.setAttribute('aria-label', `Ver detalhes de ${descricao}`);
      primeira.appendChild(botao);
    }
  }

  corpo.addEventListener('click', event => {
    const botao = event.target.closest('.mobile-detalhes-btn');
    if (!botao || !corpo.contains(botao)) return;
    const linha = botao.closest('tr');
    const aberto = linha.classList.toggle('detalhes-abertos');
    botao.setAttribute('aria-expanded', String(aberto));
    botao.textContent = aberto ? 'Ocultar detalhes ▴' : 'Ver detalhes ▾';
    const descricao = linha.cells[0].querySelector('b')?.textContent || 'lançamento';
    botao.setAttribute('aria-label', `${aberto ? 'Ocultar' : 'Ver'} detalhes de ${descricao}`);
  });

  // O aplicativo recria as linhas ao sincronizar ou mudar filtros/mês.
  new MutationObserver(preparar).observe(corpo, { childList:true });
  preparar();
}
