/* Instalação: salve como tema.js na raiz do repositório e acrescente
   <script src="./tema.js" defer></script> antes de </body> no index.html.
   Usa apenas preferências locais deste navegador; não altera dados do Firebase. */
(() => {
  const chave = 'controle-financeiro-tema';
  const raiz = document.documentElement;
  let tema = 'claro';
  try { if (localStorage.getItem(chave) === 'escuro') tema = 'escuro'; } catch (_) {}

  const css = `
html[data-tema="escuro"]{color-scheme:dark;--bg:#101a17;--line:#3a5048;--text:#e6f1ec;--muted:#b0c3ba;--green:#8bd5ae;--green2:#96e3b8;--red:#ffaca0;--redbg:#54332f;--blue:#2a4450;--purple:#493b50;--yellow:#524832}
html[data-tema="escuro"] body{background:var(--bg);color:var(--text)}
html[data-tema="escuro"] :is(.auth-panel,.dialog,#mainApp .top,#mainApp .card,#mainApp .panel,#mainApp .chart-card,#mainApp #calendarioContas){background:#1d2b26;color:var(--text);border-color:var(--line);box-shadow:none}
html[data-tema="escuro"] :is(#mainApp .top .brand,#mainApp .chart-title,#mainApp .panel-head h2,.dialog h2,.dialog .field label){color:#d9ece2}
html[data-tema="escuro"] #mainApp .card .income{color:#91ddb0}
html[data-tema="escuro"] #mainApp .card .expense{color:#ffaaa0}
html[data-tema="escuro"] #mainApp .card .balance{color:#a3cee8}
html[data-tema="escuro"] :is(#mainApp .btn-primary,.modal .btn-primary,.auth-panel .btn-primary){background:#286653;color:#fff}
html[data-tema="escuro"] :is(#mainApp .btn-primary:hover,.modal .btn-primary:hover,.auth-panel .btn-primary:hover){background:#347d59}
html[data-tema="escuro"] :is(#mainApp .btn-light,.modal .btn-light,.auth-panel .btn-light,#mainApp .btn-danger){background:#293c34;color:#e6f1ec;border-color:#577267}
html[data-tema="escuro"] :is(#mainApp .btn-light:hover,.modal .btn-light:hover,.auth-panel .btn-light:hover){background:#354d41}
html[data-tema="escuro"] #mainApp .month{background:#286653;color:#fff}
html[data-tema="escuro"] :is(#mainApp .filter input,#mainApp .filter select,.dialog .field input,.dialog .field select,.auth-panel input){background:#14211b;color:#e6f1ec;border-color:#587067}
html[data-tema="escuro"] :is(#mainApp .filter input,.dialog .field input,.auth-panel input)::placeholder{color:#a6bbb0}
html[data-tema="escuro"] :is(#mainApp .panel-head,#mainApp #calendarioContas .calendario-cabecalho){border-color:var(--line)}
html[data-tema="escuro"] #mainApp .table-wrap th{background:#294139;color:#dbeee4;border-color:var(--line)}
html[data-tema="escuro"] #mainApp .table-wrap td{border-color:#364c43}
html[data-tema="escuro"] #mainApp .table-wrap tbody tr{background:#1d2b26}
html[data-tema="escuro"] #mainApp .table-wrap tbody tr:nth-child(even){background:#24362e}
html[data-tema="escuro"] #mainApp .table-wrap tbody tr:hover{background:#30473b}
html[data-tema="escuro"] #mainApp .table-wrap .value-edit{color:var(--text)}
html[data-tema="escuro"] #mainApp .table-wrap .value-edit:is(:hover,:focus){background:#14211b;border-color:#6a927d}
html[data-tema="escuro"] #mainApp .table-wrap .icon-btn{background:#344b40;color:#e5f4eb}
html[data-tema="escuro"] #mainApp .table-wrap .icon-btn:hover{background:#405e4e}
html[data-tema="escuro"] #mainApp .table-wrap .status-paid{background:#244a35;color:#c8f0d3}
html[data-tema="escuro"] #mainApp .table-wrap .status-unpaid{background:#573a36;color:#ffe0da}
html[data-tema="escuro"] #mainApp .table-wrap .receita{background:#324b31;color:#dcf0c9}
html[data-tema="escuro"] #mainApp .table-wrap .despesa{background:#314957;color:#d8ebf5}
html[data-tema="escuro"] #mainApp .table-wrap .lazer{background:#4b3e53;color:#f0def9}
html[data-tema="escuro"] #mainApp .table-wrap .cartao{background:#514832;color:#ffedbe}
html[data-tema="escuro"] #mainApp .table-wrap .recorrente{background:#514832;color:#ffedbe}
html[data-tema="escuro"] #mainApp .aviso-vencida{background:#583632;color:#ffdad4}
html[data-tema="escuro"] #mainApp .aviso-hoje{background:#5c4825;color:#ffe4a3}
html[data-tema="escuro"] #mainApp .aviso-proxima{background:#524a2c;color:#f9eab7}
html[data-tema="escuro"] #mainApp #calendarioContas .calendario-semana{color:var(--muted)}
html[data-tema="escuro"] #mainApp #calendarioContas .calendario-dia{background:#25372e;border-color:#415d4f;color:var(--text)}
html[data-tema="escuro"] #mainApp #calendarioContas .calendario-dia:hover{background:#334c3d;border-color:#90caab}
html[data-tema="escuro"] #mainApp #calendarioContas .calendario-dia.selecionado{background:#31543f;border-color:#9bd6b4}
html[data-tema="escuro"] #mainApp #calendarioContas .calendario-dia.hoje{background:#2f4a3a;border-color:#a1d8b6}
html[data-tema="escuro"] #mainApp #calendarioContas .calendario-dia.hoje.selecionado{background:#31543f;border-color:#b2e7c6}
html[data-tema="escuro"] #mainApp #calendarioContas .calendario-dia.hoje .calendario-numero{background:#b3e6c6;color:#143426}

html[data-tema="escuro"] #mainApp #calendarioContas :is(.calendario-valor,.calendario-item-valor,.calendario-marcadores span).calendario-receita{color:#a7e7be}
html[data-tema="escuro"] #mainApp #calendarioContas :is(.calendario-valor,.calendario-item-valor,.calendario-marcadores span).calendario-pago{color:#a6d1e6}
html[data-tema="escuro"] #mainApp #calendarioContas :is(.calendario-valor,.calendario-item-valor,.calendario-marcadores span).calendario-pendente{color:#ffb2a6}
html[data-tema="escuro"] #mainApp .cards{background:#1d2b26;border-color:var(--line)}
html[data-tema="escuro"] #mainApp .card{border-color:var(--line)}
html[data-tema="escuro"] #mainApp .card .saldo-negativo{color:#ffaaa0}
html[data-tema="escuro"] #mainApp .conta-menu summary,html[data-tema="escuro"] #mainApp .conta-opcoes{background:#293c34;color:#e6f1ec;border-color:#577267}
html[data-tema="escuro"] .simulador-resultado{background:#294a39;color:#def4e5}
html[data-tema="escuro"] .simulador-resultado.alerta{background:#573a36;color:#ffe0da}
html[data-tema="escuro"] #mainApp .table-wrap .valor-formatado.valor-receita{color:#a7e7be}
html[data-tema="escuro"] #mainApp .table-wrap .valor-formatado.valor-despesa{color:#ffb2a6}
html[data-tema="escuro"] #mainApp .table-wrap .valor-formatado:focus{color:#e6f1ec}

html[data-tema="escuro"] #mainApp #calendarioContas .calendario-lista .calendario-item-valor.calendario-receita{color:#a7e7be}
html[data-tema="escuro"] #mainApp #calendarioContas .calendario-lista .calendario-item-valor.calendario-pago{color:#a6d1e6}
html[data-tema="escuro"] #mainApp #calendarioContas .calendario-lista .calendario-item-valor.calendario-pendente{color:#ffb2a6}
html[data-tema="escuro"] #mainApp #calendarioContas .calendario-lista li{border-color:var(--line)}
html[data-tema="escuro"] #mainApp .sync.error{color:#ffb2a6}
html[data-tema="escuro"] :is(button,input,select):focus-visible{outline-color:#a9e5bf}
@media(max-width:700px){html[data-tema="escuro"] #mainApp #rows tr{background:#23352c;border-color:#415d4f;box-shadow:none}html[data-tema="escuro"] #mainApp #rows tr:hover{background:#30473b}html[data-tema="escuro"] #mainApp #rows tr .mobile-detalhes-btn{background:transparent;color:#a8e4bf}}
`;
  const estilo = document.createElement('style');
  estilo.id = 'estilo-tema-escuro';
  estilo.textContent = css;
  document.head.appendChild(estilo);

  function aplicar() {
    raiz.dataset.tema = tema;
    document.querySelectorAll('[data-botao-tema]').forEach(botao => {
      botao.textContent = tema === 'escuro' ? 'Tema claro' : 'Tema escuro';
      botao.setAttribute('aria-pressed', String(tema === 'escuro'));
    });
    if (window.Chart && window.Chart.defaults) {
      window.Chart.defaults.color = tema === 'escuro' ? '#c4d7cb' : '#666';
      window.Chart.defaults.borderColor = tema === 'escuro' ? '#41564b' : 'rgba(0, 0, 0, 0.1)';
      document.querySelectorAll('.analytics canvas').forEach(canvas => {
        const grafico = window.Chart.getChart(canvas);
        if (grafico) grafico.update('none');
      });
    }
  }
  function instalarBotao() {
    const barra = document.querySelector('#mainApp .account-bar');
    if (!barra || barra.querySelector('[data-botao-tema]')) return;
    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'btn-light';
    botao.setAttribute('data-botao-tema', '');
    botao.setAttribute('aria-label', 'Alternar entre tema claro e escuro');
    botao.addEventListener('click', () => {
      tema = tema === 'claro' ? 'escuro' : 'claro';
      try { localStorage.setItem(chave, tema); } catch (_) {}
      aplicar();
    });
    barra.appendChild(botao);
    aplicar();
  }
  raiz.dataset.tema = tema;
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', instalarBotao, {once:true});
  else instalarBotao();
})();
