/* ============================================================
   红楼梦·互动助手 — Main Application Logic (app.js)
   Depends on: data.js (CHARACTERS, RELATIONSHIPS, FAMILIES)
               graph.js (window.GraphModule)
   ============================================================ */

(function () {
  'use strict';

  // ─── State ────────────────────────────────────────────────────────────────
  let currentTab      = 'graph';
  let graphInited     = false;
  let searchDebounce  = null;
  let activeFamily    = 'all';
  let activeCharId    = null;

  // ─── Utility: escape HTML entities to prevent XSS ─────────────────────────
  function esc(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // ─── Utility: get family color ─────────────────────────────────────────────
  function familyColor(familyId) {
    return (FAMILIES[familyId] && FAMILIES[familyId].color) || '#9e9e9e';
  }

  function familyName(familyId) {
    return (FAMILIES[familyId] && FAMILIES[familyId].name) || '其他';
  }

  // ─── Utility: find which family a character belongs to ────────────────────
  function getCharFamily(charId) {
    if (!charId) return 'other';
    const ch = CHARACTERS[charId];
    if (ch && ch.family) return ch.family;
    for (const [fid, fam] of Object.entries(FAMILIES)) {
      if (fam.members && fam.members.includes(charId)) return fid;
    }
    return 'other';
  }

  // ─── Utility: event icon by keyword ───────────────────────────────────────
  function eventIcon(text) {
    if (!text) return '📝';
    if (/死|亡|逝|殇|葬|哭|泪/.test(text)) return '💀';
    if (/打|争|吵|毒|害|迫|夺/.test(text)) return '⚔️';
    if (/爱|情|恋|婚|嫁|娶|玉|钗/.test(text)) return '🌸';
    if (/悲|哀|痛|伤|断|焚/.test(text)) return '💔';
    if (/诗|词|写|吟|联|赋|题/.test(text)) return '📝';
    if (/家|院|园|府|宅|管|理/.test(text)) return '🏠';
    if (/闹|撕|骂|砸|杖|责/.test(text)) return '⚡';
    return '📝';
  }

  // ─── 1. Tab Switching ─────────────────────────────────────────────────────
  function switchTab(tabId) {
    currentTab = tabId;

    // Update tab buttons
    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabId);
    });

    // Show/hide panels
    document.querySelectorAll('.tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panel === tabId);
    });

    // Initialize graph on first visit
    if (tabId === 'graph' && !graphInited) {
      initGraph();
    }
  }

  function initGraph() {
    if (graphInited) return;
    const container = document.getElementById('graph-container');
    if (!container) return;

    // Show spinner while graph loads
    container.innerHTML = '<div class="empty-state"><div class="spinner"></div><p>正在加载关系图谱…</p></div>';

    requestAnimationFrame(() => {
      if (window.GraphModule && typeof window.GraphModule.init === 'function') {
        container.innerHTML = '';
        window.GraphModule.init('graph-container');
        graphInited = true;
      } else {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">⚠️</div><p>图谱模块加载失败，请刷新页面</p></div>';
      }
    });
  }

  // ─── 2. Character Search & Filter ─────────────────────────────────────────
  function filterCharacters(searchTerm, familyId) {
    const term = (searchTerm || '').trim().toLowerCase();
    const fid  = familyId || activeFamily;

    const results = Object.values(CHARACTERS).filter(ch => {
      const matchFamily = fid === 'all' || ch.family === fid;
      if (!matchFamily) return false;
      if (!term) return true;
      return (
        ch.name.toLowerCase().includes(term) ||
        (ch.pinyin && ch.pinyin.toLowerCase().includes(term)) ||
        (ch.role  && ch.role.toLowerCase().includes(term))
      );
    });

    renderSidebarList(results);
    return results;
  }

  function renderSidebarList(characters) {
    const list = document.getElementById('char-list');
    if (!list) return;
    const countEl = document.getElementById('char-count');
    if (countEl) countEl.textContent = characters ? characters.length : 0;

    if (!characters || characters.length === 0) {
      list.innerHTML = `
        <div class="empty-state" style="padding:24px 0">
          <div class="empty-icon">🔍</div>
          <p>未找到相关人物</p>
        </div>`;
      return;
    }

    list.innerHTML = characters.map(ch => {
      const color  = familyColor(ch.family);
      const isActive = ch.id === activeCharId ? ' active' : '';
      return `
        <div class="char-list-item${isActive}" data-id="${esc(ch.id)}" role="button" tabindex="0"
             aria-label="${esc(ch.name)}">
          <div class="char-avatar-sm" style="background:${esc(color)};color:#fff">
            ${esc(ch.name.charAt(0))}
          </div>
          <div class="char-list-info">
            <div class="char-list-name">${esc(ch.name)}</div>
            <div class="char-list-role truncate">${esc(ch.role || '')}</div>
          </div>
        </div>`;
    }).join('');

    // Bind click handlers
    list.querySelectorAll('.char-list-item').forEach(item => {
      item.addEventListener('click',   () => showCharacterDetail(item.dataset.id));
      item.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showCharacterDetail(item.dataset.id); });
    });
  }

  // ─── 3. Character Detail Panel ────────────────────────────────────────────
  function showCharacterDetail(characterId) {
    const ch = CHARACTERS[characterId];
    if (!ch) {
      console.warn('[AppModule] Character not found:', characterId);
      return;
    }

    activeCharId = characterId;

    // Highlight active item in sidebar
    document.querySelectorAll('.char-list-item').forEach(el => {
      el.classList.toggle('active', el.dataset.id === characterId);
    });

    const panel = document.getElementById('detail-panel');
    const body  = panel && panel.querySelector('.panel-body');
    if (!panel || !body) return;

    const color = familyColor(ch.family);
    const fName = familyName(ch.family);

    // ── Avatar + header ──────────────────────────────────────────────────
    const headerHTML = `
      <div class="panel-char-header">
        <div class="char-avatar-lg" style="background:${esc(color)};color:#fff">
          ${esc(ch.name.charAt(0))}
        </div>
        <div>
          <div class="panel-char-name">${esc(ch.name)}</div>
          <div class="panel-char-alias">${esc(ch.pinyin || '')}</div>
          <div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap">
            <span class="badge badge-red">${esc(ch.role || '')}</span>
            <span class="badge" style="background:${hexToRgba(color, 0.18)};color:${esc(color)};border:1px solid ${esc(color)}40">
              ${esc(fName)}
            </span>
          </div>
        </div>
      </div>`;

    // ── Description ──────────────────────────────────────────────────────
    const descHTML = ch.description ? `
      <div class="panel-section">
        <div class="panel-section-title">人物简介</div>
        <p class="panel-desc">${esc(ch.description)}</p>
      </div>` : '';

    // ── Chapters ─────────────────────────────────────────────────────────
    const chaptersHTML = (ch.chapters && ch.chapters.length) ? `
      <div class="panel-section">
        <div class="panel-section-title">出场章节</div>
        <div style="display:flex;flex-wrap:wrap;gap:6px;margin-top:8px">
          ${ch.chapters.map(n => `<span class="chip">第${esc(String(n))}回</span>`).join('')}
        </div>
      </div>` : '';

    // ── Events timeline ──────────────────────────────────────────────────
    const eventsHTML = (ch.events && ch.events.length) ? `
      <div class="panel-section">
        <div class="panel-section-title">相关事件</div>
        <div class="timeline">
          ${ch.events.map(ev => `
            <div class="timeline-item">
              <span class="timeline-chapter">${eventIcon(ev)}</span>
              <span class="timeline-text">${esc(ev)}</span>
            </div>`).join('')}
        </div>
      </div>` : '';

    // ── Fate ─────────────────────────────────────────────────────────────
    const fateHTML = ch.fate ? `
      <div class="panel-section">
        <div class="panel-section-title">人物结局</div>
        <div class="fate-box">${esc(ch.fate)}</div>
      </div>` : '';

    // ── Related characters ────────────────────────────────────────────────
    const relatedHTML = (ch.relations && ch.relations.length) ? `
      <div class="panel-section">
        <div class="panel-section-title">关联人物</div>
        <div class="related-chars">
          ${ch.relations.map(rel => {
            const relCh = CHARACTERS[rel.id];
            const relColor = relCh ? familyColor(relCh.family) : '#9e9e9e';
            return `<span class="char-chip interactive" data-id="${esc(rel.id)}" role="button" tabindex="0"
                         title="${esc(rel.label)}" style="cursor:pointer">
                      <span class="char-chip-dot" style="background:${esc(relColor)}"></span>
                      ${esc(rel.name)}
                      <span style="font-size:0.7rem;opacity:0.7;margin-left:2px">${esc(rel.label)}</span>
                    </span>`;
          }).join('')}
        </div>
      </div>` : '';

    body.innerHTML = headerHTML + descHTML + chaptersHTML + eventsHTML + fateHTML + relatedHTML;

    // Bind related character chip clicks
    body.querySelectorAll('.char-chip[data-id]').forEach(chip => {
      chip.addEventListener('click',   () => showCharacterDetail(chip.dataset.id));
      chip.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showCharacterDetail(chip.dataset.id); });
    });

    // Open panel
    panel.classList.add('open');

    // Highlight graph node if graph is active
    if (currentTab === 'graph' && graphInited && window.GraphModule) {
      window.GraphModule.highlight(characterId);
    }
  }

  function closeDetailPanel() {
    const panel = document.getElementById('detail-panel');
    if (panel) panel.classList.remove('open');
    activeCharId = null;
    document.querySelectorAll('.char-list-item').forEach(el => el.classList.remove('active'));
    if (graphInited && window.GraphModule) window.GraphModule.reset();
  }

  // Helper: hex color → rgba string
  function hexToRgba(hex, alpha) {
    try {
      const h = hex.replace('#', '');
      const r = parseInt(h.substring(0, 2), 16);
      const g = parseInt(h.substring(2, 4), 16);
      const b = parseInt(h.substring(4, 6), 16);
      return `rgba(${r},${g},${b},${alpha})`;
    } catch (e) {
      return `rgba(158,158,158,${alpha})`;
    }
  }

  // ─── 4. Character List Grid ───────────────────────────────────────────────
  function renderCharacterGrid(characters) {
    const grid = document.getElementById('char-grid');
    if (!grid) return;

    const chars = characters || Object.values(CHARACTERS);
    if (chars.length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-icon">👤</div><p>暂无人物数据</p></div>';
      return;
    }

    grid.innerHTML = chars.map(ch => {
      const color = familyColor(ch.family);
      const fName = familyName(ch.family);
      const shortDesc = ch.description
        ? (ch.description.length > 40 ? ch.description.substring(0, 40) + '…' : ch.description)
        : '';
      return `
        <div class="char-card" data-id="${esc(ch.id)}" role="button" tabindex="0" aria-label="${esc(ch.name)}">
          <div class="char-avatar-md" style="background:${esc(color)};color:#fff">
            ${esc(ch.name.charAt(0))}
          </div>
          <div class="card-name">${esc(ch.name)}</div>
          <div style="font-size:0.75rem;opacity:0.65;margin-bottom:4px">${esc(ch.pinyin || '')}</div>
          <span class="badge badge-muted card-family-badge" style="color:${esc(color)}">${esc(fName)}</span>
          <div class="card-role truncate" style="margin-top:4px">${esc(ch.role || '')}</div>
          ${shortDesc ? `<div class="text-muted text-xs" style="margin-top:6px;line-height:1.5">${esc(shortDesc)}</div>` : ''}
        </div>`;
    }).join('');

    grid.querySelectorAll('.char-card').forEach(card => {
      card.addEventListener('click',   () => showCharacterDetail(card.dataset.id));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showCharacterDetail(card.dataset.id); });
    });
  }

  // ─── 5. Family Tree ───────────────────────────────────────────────────────
  // Ordered hierarchy for the two main Jia families
  const FAMILY_HIERARCHY = {
    jia_rong: [
      { tier: '长辈', ids: ['jia_mu'] },
      { tier: '正房', ids: ['jia_zheng', 'wang_furen', 'jia_she', 'xing_furen'] },
      { tier: '子孙', ids: ['jia_baoyu', 'yuanchun', 'tanchun', 'yingchun', 'jia_lian'] },
      { tier: '侍从', ids: ['xiren', 'qingwen', 'pinger', 'zijuan'] },
    ],
    jia_ning: [
      { tier: '当家', ids: ['jia_zhen', 'you_shi'] },
      { tier: '子孙', ids: ['jia_rong_son', 'xichun'] },
      { tier: '媳妇', ids: ['qin_keqing'] },
    ],
  };

  function renderFamilyTree() {
    const panel = document.getElementById('family-tree-panel');
    if (!panel) return;

    let html = '';

    for (const [fid, fam] of Object.entries(FAMILIES)) {
      const color    = fam.color;
      const members  = fam.members || [];
      if (members.length === 0) continue;

      html += `
        <div class="family-section">
          <div class="family-section-header" style="border-left:4px solid ${esc(color)};padding-left:12px">
            <div class="family-section-title" style="color:${esc(color)}">${esc(fam.name)}</div>
          </div>`;

      const tiers = FAMILY_HIERARCHY[fid];
      if (tiers) {
        // Hierarchical layout for main families
        for (const tier of tiers) {
          const tierChars = tier.ids.map(id => CHARACTERS[id]).filter(Boolean);
          if (tierChars.length === 0) continue;
          html += `
            <div style="margin:8px 0 4px 8px">
              <div class="text-xs text-muted" style="margin-bottom:6px;letter-spacing:1px">◆ ${esc(tier.tier)}</div>
              <div style="display:flex;flex-wrap:wrap;gap:8px;padding-left:12px">
                ${tierChars.map(ch => familyTreeNode(ch, color)).join('')}
              </div>
            </div>`;
        }
      } else {
        // Flat layout for other families
        const chars = members.map(id => CHARACTERS[id]).filter(Boolean);
        html += `
          <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:10px;padding-left:8px">
            ${chars.map(ch => familyTreeNode(ch, color)).join('')}
          </div>`;
      }

      html += '</div>';
    }

    panel.innerHTML = html;

    // Bind click handlers
    panel.querySelectorAll('.char-card[data-id]').forEach(card => {
      card.addEventListener('click',   () => showCharacterDetail(card.dataset.id));
      card.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') showCharacterDetail(card.dataset.id); });
    });
  }

  function familyTreeNode(ch, color) {
    return `
      <div class="char-card" data-id="${esc(ch.id)}" role="button" tabindex="0"
           style="min-width:100px;max-width:130px;text-align:center;padding:10px 8px">
        <div style="width:40px;height:40px;border-radius:50%;background:${esc(color)};
                    color:#fff;display:flex;align-items:center;justify-content:center;
                    font-size:1.1rem;margin:0 auto 6px;font-weight:700">
          ${esc(ch.name.charAt(0))}
        </div>
        <div class="card-name" style="font-size:0.9rem">${esc(ch.name)}</div>
        <div class="text-xs text-muted truncate" style="margin-top:2px">${esc(ch.role ? ch.role.split('，')[0] : '')}</div>
      </div>`;
  }

  // ─── 6. Reference Panel ───────────────────────────────────────────────────
  function renderReference() {
    const panel = document.getElementById('reference-panel');
    if (!panel) return;

    panel.innerHTML = buildPoems() + buildGarden() + buildChapterGuide() + buildTwelveBeauties();
  }

  function refSection(title, content) {
    return `
      <div class="ref-section">
        <div class="ref-section-title">${esc(title)}</div>
        ${content}
      </div>`;
  }

  function buildPoems() {
    const poems = [
      {
        title: '葬花吟',
        author: '林黛玉',
        lines: ['花谢花飞花满天，红消香断有谁怜？', '游丝软系飘春榭，落絮轻沾扑绣帘。', '闺中女儿惜春暮，愁绪满怀无释处。', '手把花锄出绣帘，忍踏落花来复去。'],
        source: '第二十七回·葬花吟'
      },
      {
        title: '题红楼梦·开篇绝句',
        author: '曹雪芹',
        lines: ['满纸荒唐言，一把辛酸泪。', '都云作者痴，谁解其中味？'],
        source: '第一回·开篇题诗'
      },
      {
        title: '好了歌',
        author: '跛足道人',
        lines: ['世人都晓神仙好，惟有功名忘不了！', '古今将相在何方？荒冢一堆草没了！', '世人都晓神仙好，只有金银忘不了！', '终朝只恨聚无多，及到多时眼闭了！'],
        source: '第一回'
      },
      {
        title: '金陵十二钗判词节录',
        author: '太虚幻境册子',
        lines: [
          '【黛玉·宝钗】玉带林中挂，金簪雪里埋。',
          '【元春】二十年来辨是非，榴花开处照宫闱。',
          '【探春】才自精明志自高，生于末世运偏消。',
          '【湘云】富贵又何为，襁褓之间父母违。',
          '【妙玉】欲洁何曾洁，云空未必空。',
          '【迎春】子系中山狼，得志便猖狂。',
          '【惜春】勘破三春景不长，缁衣顿改昔年妆。',
          '【熙凤】凡鸟偏从末世来，都知爱慕此生才。',
        ],
        source: '第五回·太虚幻境'
      },
    ];

    const html = poems.map(p => `
      <div class="poem-card">
        <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:8px">
          <strong style="font-size:1rem;color:var(--color-accent)">${esc(p.title)}</strong>
          <span class="poem-source">${esc(p.author)}</span>
        </div>
        <div style="line-height:2;font-size:0.9rem">
          ${p.lines.map(l => `<div>${esc(l)}</div>`).join('')}
        </div>
        <div class="poem-source" style="margin-top:8px;text-align:right">出处：${esc(p.source)}</div>
      </div>`).join('');

    return refSection('经典诗词', html);
  }

  function buildGarden() {
    const locations = [
      { name: '怡红院', resident: '贾宝玉', desc: '院中遍植芭蕉海棠，是宝玉居所，丫鬟成群，热闹非凡。' },
      { name: '潇湘馆', resident: '林黛玉', desc: '修竹千竿，清幽雅致，黛玉在此吟诗作赋，泪洒秋风。' },
      { name: '蘅芜苑', resident: '薛宝钗', desc: '藤蔓缠绕，奇花异草，宝钗于此端庄待人，素净朴实。' },
      { name: '稻香村', resident: '李纨',   desc: '农家田园风，朴素清淡，李纨守寡在此抚养贾兰。' },
      { name: '栊翠庵', resident: '妙玉',   desc: '院中梅花盛开，妙玉在此修行，以雪水烹茶待客。' },
      { name: '秋爽斋', resident: '贾探春', desc: '宽敞明亮，摆设大方，探春才情横溢在此治家理事。' },
      { name: '暖香坞', resident: '贾惜春', desc: '惜春居所，清冷孤僻，后削发为尼。' },
      { name: '缀锦楼', resident: '贾迎春', desc: '迎春性格懦弱，在此度过大观园中的平淡岁月。' },
    ];

    const html = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px;margin-top:8px">
      ${locations.map(loc => `
        <div class="lore-entry" style="border:1px solid var(--color-border);border-radius:8px;padding:12px">
          <div class="lore-term">${esc(loc.name)} <span class="text-muted text-xs">·${esc(loc.resident)}居所</span></div>
          <div class="lore-def">${esc(loc.desc)}</div>
        </div>`).join('')}
    </div>`;

    return refSection('大观园胜景', html);
  }

  function buildChapterGuide() {
    const chapters = [
      { num: '第1回',    title: '甄士隐梦幻识通灵',     desc: '甄士隐梦见通灵宝玉来历，女娲补天遗石下凡。故事开端。' },
      { num: '第3回',    title: '林黛玉进贾府',          desc: '黛玉进贾府初见宝玉，"这个妹妹我曾见过"。' },
      { num: '第5回',    title: '宝玉梦游太虚幻境',      desc: '宝玉游历仙境，阅读金陵十二钗判词，预示众人命运。' },
      { num: '第12回',   title: '王熙凤毒设相思局',      desc: '凤姐借刀杀人，害死贾瑞，展现其心狠手辣。' },
      { num: '第17-18回', title: '大观园建成·元春省亲',  desc: '贾妃元春归省，大观园揭幕，众人迁入园中。' },
      { num: '第27-28回', title: '葬花吟',               desc: '黛玉葬花，吟成千古名篇，宝黛情感升华。' },
      { num: '第33回',   title: '宝玉挨打',               desc: '贾政痛打宝玉，家族矛盾激化，各方人心惶惶。' },
      { num: '第74-75回', title: '抄检大观园',            desc: '王夫人命令抄检大观园，晴雯等多人被逐，大观园由盛转衰。' },
      { num: '第96-98回', title: '黛玉之死与宝玉成婚',   desc: '宝玉误娶宝钗，黛玉含恨而逝，泪尽而亡，令人唏嘘。' },
      { num: '第119-120回', title: '宝玉出家·全书终结',  desc: '宝玉中举后出家为僧，贾府彻底落败，红楼梦终。' },
    ];

    const html = `<div class="chapter-list">
      ${chapters.map(ch => `
        <div class="chapter-item">
          <span class="chapter-num">${esc(ch.num)}</span>
          <div style="flex:1">
            <div style="font-weight:600;color:var(--color-accent);margin-bottom:2px">${esc(ch.title)}</div>
            <div class="text-muted text-sm">${esc(ch.desc)}</div>
          </div>
        </div>`).join('')}
    </div>`;

    return refSection('主要章节导读', html);
  }

  function buildTwelveBeauties() {
    const beauties = [
      { name: '林黛玉',   pinyin: 'Lín Dàiyù',   judge: '玉带林中挂，金簪雪里埋。',         fate: '泪尽而亡' },
      { name: '薛宝钗',   pinyin: 'Xuē Bǎochāi', judge: '终身误，都道是金玉良缘。',          fate: '独守空房' },
      { name: '贾元春',   pinyin: 'Jiǎ Yuánchūn',judge: '二十年来辨是非，榴花开处照宫闱。', fate: '宫中薨逝' },
      { name: '贾探春',   pinyin: 'Jiǎ Tànchūn', judge: '才自精明志自高，生于末世运偏消。', fate: '远嫁海外' },
      { name: '史湘云',   pinyin: 'Shǐ Xiāngyún',judge: '富贵又何为，襁褓之间父母违。',     fate: '夫死孀居' },
      { name: '妙玉',     pinyin: 'Miàoyù',       judge: '欲洁何曾洁，云空未必空。',         fate: '流落风尘' },
      { name: '贾迎春',   pinyin: 'Jiǎ Yíngchūn',judge: '子系中山狼，得志便猖狂。',         fate: '被夫虐死' },
      { name: '贾惜春',   pinyin: 'Jiǎ Xīchūn',  judge: '勘破三春景不长，缁衣顿改昔年妆。',fate: '出家为尼' },
      { name: '王熙凤',   pinyin: 'Wáng Xīfèng', judge: '凡鸟偏从末世来，都知爱慕此生才。',fate: '获罪病死' },
      { name: '贾巧姐',   pinyin: 'Jiǎ Qiǎojiě', judge: '势败休云贵，家亡莫论亲。',         fate: '嫁农为妇' },
      { name: '李纨',     pinyin: 'Lǐ Wǎn',       judge: '桃李春风结子完，到头谁似一盆兰。', fate: '子贵母荣' },
      { name: '秦可卿',   pinyin: 'Qín Kěqīng',  judge: '情天情海幻情身，情既相逢必主淫。',fate: '病亡' },
    ];

    const html = `<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:12px;margin-top:8px">
      ${beauties.map((b, i) => {
        const ch = Object.values(CHARACTERS).find(c => c.name === b.name);
        const color = ch ? familyColor(ch.family) : '#9e9e9e';
        return `
          <div class="lore-entry" style="border:1px solid ${esc(color)}40;border-radius:8px;padding:12px;
                                         border-left:3px solid ${esc(color)}">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <div style="width:32px;height:32px;border-radius:50%;background:${esc(color)};
                          color:#fff;display:flex;align-items:center;justify-content:center;
                          font-weight:700;font-size:0.9rem;flex-shrink:0">
                ${esc(b.name.charAt(0))}
              </div>
              <div>
                <div class="lore-term" style="margin:0">${esc(b.name)}</div>
                <div class="text-xs text-muted">${esc(b.pinyin)}</div>
              </div>
              <span class="chip" style="margin-left:auto;font-size:0.7rem">正册</span>
            </div>
            <div style="font-style:italic;color:var(--color-accent);font-size:0.85rem;
                        margin-bottom:6px;line-height:1.6">
              「${esc(b.judge)}」
            </div>
            <div class="text-xs text-muted">结局：${esc(b.fate)}</div>
          </div>`;
      }).join('')}
    </div>`;

    return refSection('金陵十二钗', html);
  }

  // ─── 7. Initialization ────────────────────────────────────────────────────
  function init() {
    // Bind nav tab buttons
    document.querySelectorAll('.nav-tab').forEach(btn => {
      btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // Bind sidebar toggle (mobile)
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar       = document.getElementById('sidebar');
    const backdrop      = document.querySelector('.overlay-backdrop');

    if (sidebarToggle && sidebar) {
      sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        if (backdrop) backdrop.classList.toggle('active', sidebar.classList.contains('open'));
      });
    }
    if (backdrop) {
      backdrop.addEventListener('click', () => {
        if (sidebar) sidebar.classList.remove('open');
        backdrop.classList.remove('active');
      });
    }

    // Bind search input with debounce
    const searchInput = document.getElementById('char-search');
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        clearTimeout(searchDebounce);
        searchDebounce = setTimeout(() => {
          filterCharacters(searchInput.value, activeFamily);
        }, 300);
      });
    }

    // Bind close detail panel button
    const closeBtn = document.querySelector('#detail-panel .panel-close');
    if (closeBtn) closeBtn.addEventListener('click', closeDetailPanel);

    // Keyboard shortcut: Escape closes detail panel
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') closeDetailPanel();
    });

    // Graph-specific controls
    const btnReset  = document.getElementById('graph-reset');
    const btnZoomIn = document.getElementById('graph-zoom-in');
    const btnZoomOut= document.getElementById('graph-zoom-out');
    if (btnReset)   btnReset.addEventListener('click',   () => { if (graphInited && window.GraphModule) window.GraphModule.reset(); });
    if (btnZoomIn)  btnZoomIn.addEventListener('click',  () => zoomGraph(1.3));
    if (btnZoomOut) btnZoomOut.addEventListener('click', () => zoomGraph(1 / 1.3));

    // Render family filter buttons
    const filterContainer = document.getElementById('family-filter-buttons');
    if (filterContainer) {
      let html = '<button class="family-chip active" data-family="all" style="background:#555;border-color:#888">全部</button>';
      Object.entries(FAMILIES).forEach(([fid, fam]) => {
        html += `<button class="family-chip" data-family="${esc(fid)}"
          style="background:${esc(fam.color)}22;border-color:${esc(fam.color)};color:${esc(fam.color)}">${esc(fam.name)}</button>`;
      });
      filterContainer.innerHTML = html;
    }

    // Bind family filter buttons (after rendering them)
    document.querySelectorAll('.family-chip[data-family]').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.family-chip[data-family]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeFamily = btn.dataset.family;
        const searchInput = document.getElementById('char-search');
        const term = searchInput ? searchInput.value : '';
        filterCharacters(term, activeFamily);
        if (graphInited && window.GraphModule) {
          window.GraphModule.filter(activeFamily === 'all' ? null : activeFamily);
        }
      });
    });

    // Initial renders
    renderSidebarList(Object.values(CHARACTERS));
    renderCharacterGrid(Object.values(CHARACTERS));
    renderFamilyTree();
    renderReference();

    // Activate default tab (graph) and initialize it
    switchTab('graph');
  }

  function zoomGraph(factor) {
    // Delegate to graph module's internal zoom via D3 zoom if available
    const svg = document.querySelector('#graph-container svg');
    if (!svg) return;
    try {
      const d3 = window.d3;
      if (d3) {
        const zoom = d3.zoom().on('zoom', () => {});
        d3.select(svg).call(zoom.scaleBy, factor);
      }
    } catch (e) { /* zoom not critical */ }
  }

  // ─── 8. Expose globals ────────────────────────────────────────────────────
  window.showCharacterDetail = showCharacterDetail;
  window.AppModule = {
    switchTab,
    filterCharacters,
    showCharacterDetail,
  };

  // Bootstrap on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

}());
