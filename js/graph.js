/* ============================================================
   红楼梦·人物关系图谱 — Force-Directed Relationship Graph
   D3.js v7  |  Reads globals: CHARACTERS, RELATIONSHIPS, FAMILIES
   Calls:    window.showCharacterDetail(id)
   Exposes:  window.GraphModule = { init, highlight, reset, filter, centerOn }
   ============================================================ */

(function () {
  'use strict';

  // ─── Constants ────────────────────────────────────────────────────────────

  const MAJOR_CHARS = new Set(['jia_baoyu', 'lin_daiyu', 'xue_baochai', 'wang_xifeng', 'jia_mu']);

  const LINK_STYLES = {
    love:     { stroke: '#e91e63', strokeWidth: 2.5, strokeDasharray: '8,4' },
    marriage: { stroke: '#d4af37', strokeWidth: 2.5, strokeDasharray: null  },
    family:   { stroke: '#90caf9', strokeWidth: 1.5, strokeDasharray: null  },
    servant:  { stroke: '#80cbc4', strokeWidth: 1.2, strokeDasharray: '4,4' },
    rival:    { stroke: '#ff5722', strokeWidth: 1.8, strokeDasharray: '6,3' },
    friend:   { stroke: '#81c784', strokeWidth: 1.5, strokeDasharray: '5,3' },
    scandal:  { stroke: '#ce93d8', strokeWidth: 1.8, strokeDasharray: '3,3' },
  };

  const LINK_LABELS = {
    love:     '爱情',
    marriage: '婚姻',
    family:   '家族',
    servant:  '主仆',
    rival:    '对立',
    friend:   '友情',
    scandal:  '丑闻',
  };

  const LINK_DISTANCE = {
    love: 80, family: 100, marriage: 80, rival: 120,
    servant: 120, friend: 130, scandal: 90,
  };

  const NODE_RADIUS_MAJOR = 22;
  const NODE_RADIUS_MINOR = 14;
  const DIM_OPACITY       = 0.12;
  const FULL_OPACITY      = 1;

  // ─── Module state ─────────────────────────────────────────────────────────

  let svg, gRoot, simulation;
  let linkSel, nodeSel;
  let zoomBehavior;
  let width = 0, height = 0;
  let nodes = [], links = [];
  let currentFamily = null;

  // Adjacency map: id → Set of neighbour ids
  const adjacency = new Map();

  // ─── Colour helpers ───────────────────────────────────────────────────────

  function familyColor(familyId) {
    return (FAMILIES[familyId] && FAMILIES[familyId].color) || '#9e9e9e';
  }

  function nodeColor(d) {
    return familyColor(d.family);
  }

  function nodeRadius(d) {
    return MAJOR_CHARS.has(d.id) ? NODE_RADIUS_MAJOR : NODE_RADIUS_MINOR;
  }

  // ─── Build nodes & links from globals ─────────────────────────────────────

  function buildData() {
    nodes = Object.values(CHARACTERS).map(c => ({
      id:     c.id,
      name:   c.name,
      family: c.family,
    }));

    links = RELATIONSHIPS.map(r => ({
      source: r.source,
      target: r.target,
      type:   r.type,
      label:  r.label,
    }));

    // Build adjacency for highlight logic (after simulation resolves source/target to objects)
    adjacency.clear();
    RELATIONSHIPS.forEach(r => {
      if (!adjacency.has(r.source)) adjacency.set(r.source, new Set());
      if (!adjacency.has(r.target)) adjacency.set(r.target, new Set());
      adjacency.get(r.source).add(r.target);
      adjacency.get(r.target).add(r.source);
    });
  }

  // ─── SVG defs (markers, gradient, filter) ─────────────────────────────────

  function buildDefs(defs) {
    // Arrowhead markers per relationship type
    Object.entries(LINK_STYLES).forEach(([type, style]) => {
      defs.append('marker')
        .attr('id',          `arrow-${type}`)
        .attr('viewBox',     '0 -5 10 10')
        .attr('refX',        28)
        .attr('refY',        0)
        .attr('markerWidth', 6)
        .attr('markerHeight', 6)
        .attr('orient',      'auto')
        .append('path')
          .attr('d',    'M0,-5L10,0L0,5')
          .attr('fill', style.stroke)
          .attr('opacity', 0.8);
    });

    // Radial background gradient
    const bgGrad = defs.append('radialGradient')
      .attr('id', 'graph-bg-gradient')
      .attr('cx', '50%').attr('cy', '50%')
      .attr('r',  '70%');
    bgGrad.append('stop').attr('offset', '0%')
      .attr('stop-color', '#1a1a2e').attr('stop-opacity', 1);
    bgGrad.append('stop').attr('offset', '100%')
      .attr('stop-color', '#0a0a0f').attr('stop-opacity', 1);

    // Subtle grid pattern
    const pattern = defs.append('pattern')
      .attr('id',          'graph-grid')
      .attr('width',       40)
      .attr('height',      40)
      .attr('patternUnits', 'userSpaceOnUse');
    pattern.append('path')
      .attr('d', 'M 40 0 L 0 0 0 40')
      .attr('fill', 'none')
      .attr('stroke', 'rgba(212,175,55,0.04)')
      .attr('stroke-width', 0.5);

    // Glow filter for nodes
    const glowFilter = defs.append('filter')
      .attr('id',     'node-glow')
      .attr('x',      '-50%').attr('y',      '-50%')
      .attr('width',  '200%').attr('height', '200%');
    glowFilter.append('feGaussianBlur')
      .attr('stdDeviation', 4)
      .attr('result', 'blur');
    const glowMerge = glowFilter.append('feMerge');
    glowMerge.append('feMergeNode').attr('in', 'blur');
    glowMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    // Strong glow for major characters
    const majorGlow = defs.append('filter')
      .attr('id',     'major-glow')
      .attr('x',      '-80%').attr('y',      '-80%')
      .attr('width',  '260%').attr('height', '260%');
    majorGlow.append('feGaussianBlur')
      .attr('stdDeviation', 7)
      .attr('result', 'blur');
    const majorMerge = majorGlow.append('feMerge');
    majorMerge.append('feMergeNode').attr('in', 'blur');
    majorMerge.append('feMergeNode').attr('in', 'SourceGraphic');
  }

  // ─── Draw links ───────────────────────────────────────────────────────────

  function drawLinks(g) {
    linkSel = g.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .join('line')
        .attr('class',             d => `link link-${d.type}`)
        .attr('stroke',            d => LINK_STYLES[d.type]?.stroke || '#888')
        .attr('stroke-width',      d => LINK_STYLES[d.type]?.strokeWidth || 1)
        .attr('stroke-dasharray',  d => LINK_STYLES[d.type]?.strokeDasharray || null)
        .attr('stroke-linecap',    'round')
        .attr('opacity',           0.75)
        .attr('marker-end',        d => `url(#arrow-${d.type})`);
  }

  // ─── Draw nodes ───────────────────────────────────────────────────────────

  function drawNodes(g) {
    const nodeG = g.append('g')
      .attr('class', 'nodes')
      .selectAll('g')
      .data(nodes)
      .join('g')
        .attr('class', d => `node node-${d.id}`)
        .attr('cursor', 'pointer')
        .call(buildDragBehavior())
        .on('click',     onNodeClick)
        .on('mouseenter', onNodeMouseEnter)
        .on('mouseleave', onNodeMouseLeave);

    // Outer glow halo (family colour)
    nodeG.append('circle')
      .attr('class', 'node-halo')
      .attr('r',    d => nodeRadius(d) + 8)
      .attr('fill', d => nodeColor(d))
      .attr('opacity', 0.18)
      .attr('filter', 'url(#node-glow)');

    // Main circle
    nodeG.append('circle')
      .attr('class', 'node-circle')
      .attr('r',           d => nodeRadius(d))
      .attr('fill',        d => nodeColor(d))
      .attr('fill-opacity', 0.22)
      .attr('stroke',      d => nodeColor(d))
      .attr('stroke-width', d => MAJOR_CHARS.has(d.id) ? 2.5 : 1.5)
      .attr('filter',      d => MAJOR_CHARS.has(d.id) ? 'url(#major-glow)' : 'url(#node-glow)');

    // Character initial (first Chinese character of name)
    nodeG.append('text')
      .attr('class', 'node-initial')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size',   d => MAJOR_CHARS.has(d.id) ? '14px' : '11px')
      .attr('font-weight', 700)
      .attr('fill',        d => nodeColor(d))
      .attr('filter',      'url(#node-glow)')
      .text(d => d.name.charAt(0));

    // Name label below circle
    nodeG.append('text')
      .attr('class', 'node-label')
      .attr('text-anchor',     'middle')
      .attr('dominant-baseline', 'hanging')
      .attr('dy',           d => nodeRadius(d) + 5)
      .attr('font-size',    d => MAJOR_CHARS.has(d.id) ? '12px' : '10px')
      .attr('font-weight',  d => MAJOR_CHARS.has(d.id) ? 700 : 400)
      .attr('fill',         '#e8d5b7')
      .attr('stroke',       '#0a0a0f')
      .attr('stroke-width', 3)
      .attr('paint-order',  'stroke')
      .text(d => d.name);

    nodeSel = nodeG;
  }

  // ─── Drag behavior ────────────────────────────────────────────────────────

  function buildDragBehavior() {
    return d3.drag()
      .on('start', (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on('drag', (event, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on('end', (event, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });
  }

  // ─── Simulation tick ──────────────────────────────────────────────────────

  function onTick() {
    linkSel
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    nodeSel.attr('transform', d => `translate(${d.x},${d.y})`);
  }

  // ─── Node interaction ─────────────────────────────────────────────────────

  function onNodeClick(event, d) {
    event.stopPropagation();
    if (typeof window.showCharacterDetail === 'function') {
      window.showCharacterDetail(d.id);
    }
    highlightNode(d.id);
  }

  function onNodeMouseEnter(event, d) {
    highlightNode(d.id);
  }

  function onNodeMouseLeave() {
    // Only reset if no family filter is active
    if (!currentFamily) resetHighlight();
  }

  // ─── Highlight helpers ────────────────────────────────────────────────────

  function highlightNode(id) {
    if (!nodeSel || !linkSel) return;

    const neighbors = adjacency.get(id) || new Set();

    linkSel.attr('opacity', d => {
      const srcId = typeof d.source === 'object' ? d.source.id : d.source;
      const tgtId = typeof d.target === 'object' ? d.target.id : d.target;
      return (srcId === id || tgtId === id) ? 0.95 : DIM_OPACITY;
    });

    nodeSel.attr('opacity', d =>
      (d.id === id || neighbors.has(d.id)) ? FULL_OPACITY : DIM_OPACITY
    );
  }

  function resetHighlight() {
    if (!nodeSel || !linkSel) return;

    if (currentFamily) {
      filterByFamily(currentFamily);
      return;
    }

    linkSel.attr('opacity', 0.75);
    nodeSel.attr('opacity', FULL_OPACITY);
  }

  function filterByFamily(familyId) {
    currentFamily = familyId || null;

    if (!nodeSel || !linkSel) return;

    if (!currentFamily) {
      resetHighlight();
      return;
    }

    const members = new Set((FAMILIES[familyId] && FAMILIES[familyId].members) || []);

    nodeSel.attr('opacity', d => members.has(d.id) ? FULL_OPACITY : DIM_OPACITY);

    linkSel.attr('opacity', d => {
      const srcId = typeof d.source === 'object' ? d.source.id : d.source;
      const tgtId = typeof d.target === 'object' ? d.target.id : d.target;
      return (members.has(srcId) && members.has(tgtId)) ? 0.9 : DIM_OPACITY;
    });
  }

  // ─── Center on node ───────────────────────────────────────────────────────

  function centerOnNode(id) {
    if (!svg || !zoomBehavior) return;

    const node = nodes.find(n => n.id === id);
    if (!node || node.x === undefined) return;

    const scale    = 1.6;
    const tx       = width  / 2 - scale * node.x;
    const ty       = height / 2 - scale * node.y;

    svg.transition().duration(750)
      .call(
        zoomBehavior.transform,
        d3.zoomIdentity.translate(tx, ty).scale(scale)
      );
  }

  // ─── Legend ───────────────────────────────────────────────────────────────

  function buildLegend() {
    let legendEl = document.getElementById('graph-legend');
    if (!legendEl) {
      legendEl = document.createElement('div');
      legendEl.id = 'graph-legend';
      const container = document.getElementById('graph-container') || document.body;
      container.appendChild(legendEl);
    }
    legendEl.innerHTML = '';

    // Relationship types section
    const relSection = document.createElement('div');
    relSection.className = 'legend-section';

    const relTitle = document.createElement('div');
    relTitle.className = 'legend-title';
    relTitle.textContent = '关系类型';
    relSection.appendChild(relTitle);

    Object.entries(LINK_STYLES).forEach(([type, style]) => {
      const item = document.createElement('div');
      item.className = 'legend-item';

      const lineSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      lineSvg.setAttribute('width',  '32');
      lineSvg.setAttribute('height', '14');
      lineSvg.style.verticalAlign = 'middle';
      lineSvg.style.flexShrink = '0';

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', '2');  line.setAttribute('y1', '7');
      line.setAttribute('x2', '30'); line.setAttribute('y2', '7');
      line.setAttribute('stroke', style.stroke);
      line.setAttribute('stroke-width', Math.min(style.strokeWidth, 2));
      if (style.strokeDasharray) line.setAttribute('stroke-dasharray', style.strokeDasharray);
      line.setAttribute('stroke-linecap', 'round');
      lineSvg.appendChild(line);

      const label = document.createElement('span');
      label.textContent = LINK_LABELS[type];
      label.style.color = style.stroke;

      item.appendChild(lineSvg);
      item.appendChild(label);
      relSection.appendChild(item);
    });

    // Family groups section
    const famSection = document.createElement('div');
    famSection.className = 'legend-section';

    const famTitle = document.createElement('div');
    famTitle.className = 'legend-title';
    famTitle.textContent = '家族';
    famSection.appendChild(famTitle);

    Object.entries(FAMILIES).forEach(([famId, fam]) => {
      const item = document.createElement('div');
      item.className = 'legend-item legend-family';
      item.dataset.family = famId;
      item.style.cursor = 'pointer';

      const dot = document.createElement('span');
      dot.className = 'legend-dot';
      dot.style.cssText = [
        `background:${fam.color}`,
        'display:inline-block',
        'width:12px',
        'height:12px',
        'border-radius:50%',
        'flex-shrink:0',
        'box-shadow:0 0 6px ' + fam.color + '80',
      ].join(';');

      const label = document.createElement('span');
      label.textContent = fam.name;

      item.appendChild(dot);
      item.appendChild(label);

      item.addEventListener('click', () => {
        const active = item.classList.toggle('active');
        // Deactivate others
        famSection.querySelectorAll('.legend-family').forEach(el => {
          if (el !== item) el.classList.remove('active');
        });
        filterByFamily(active ? famId : null);
      });

      famSection.appendChild(item);
    });

    legendEl.appendChild(relSection);
    legendEl.appendChild(famSection);
  }

  // ─── Resize handler ───────────────────────────────────────────────────────

  function onResize() {
    const container = svg?.node()?.parentElement;
    if (!container) return;

    width  = container.clientWidth  || 800;
    height = container.clientHeight || 600;

    svg.attr('width', width).attr('height', height);

    // Update background rect size
    svg.select('.bg-rect').attr('width', width).attr('height', height);
    svg.select('.grid-rect').attr('width', width).attr('height', height);

    if (simulation) {
      simulation.force('center', d3.forceCenter(width / 2, height / 2));
      simulation.alpha(0.3).restart();
    }
  }

  // ─── init ─────────────────────────────────────────────────────────────────

  function initGraph(containerId) {
    const container = document.getElementById(containerId);
    if (!container) {
      console.error(`[GraphModule] Container #${containerId} not found`);
      return;
    }

    width  = container.clientWidth  || 800;
    height = container.clientHeight || 600;

    // Remove any previous SVG
    d3.select(container).select('svg').remove();

    // ── SVG ──
    svg = d3.select(container)
      .append('svg')
        .attr('width',  width)
        .attr('height', height)
        .style('display', 'block');

    // Background gradient fill
    svg.append('rect')
      .attr('class', 'bg-rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#graph-bg-gradient)');

    // Subtle grid overlay
    svg.append('rect')
      .attr('class', 'grid-rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#graph-grid)')
      .attr('pointer-events', 'none');

    // ── Defs ──
    const defs = svg.append('defs');
    buildDefs(defs);

    // ── Zoom ──
    zoomBehavior = d3.zoom()
      .scaleExtent([0.2, 4])
      .on('zoom', event => gRoot.attr('transform', event.transform));

    svg.call(zoomBehavior);

    // Click on background resets highlights
    svg.on('click', () => {
      currentFamily = null;
      resetHighlight();
    });

    // ── Zoomable group ──
    gRoot = svg.append('g').attr('class', 'graph-root');

    // ── Data ──
    buildData();

    // ── Force simulation ──
    simulation = d3.forceSimulation(nodes)
      .force('link',
        d3.forceLink(links)
          .id(d => d.id)
          .distance(d => LINK_DISTANCE[d.type] || 100)
      )
      .force('charge',  d3.forceManyBody().strength(-300))
      .force('center',  d3.forceCenter(width / 2, height / 2))
      .force('collide', d3.forceCollide(40))
      .on('tick', onTick);

    // ── Draw ──
    drawLinks(gRoot);
    drawNodes(gRoot);

    // ── Legend ──
    buildLegend();

    // ── Resize ──
    window.addEventListener('resize', onResize);

    // Slight initial zoom-to-fit after simulation settles
    simulation.on('end', () => {
      const padding = 60;
      const xs = nodes.map(n => n.x);
      const ys = nodes.map(n => n.y);
      const minX = Math.min(...xs) - padding;
      const maxX = Math.max(...xs) + padding;
      const minY = Math.min(...ys) - padding;
      const maxY = Math.max(...ys) + padding;
      const scaleX = width  / (maxX - minX);
      const scaleY = height / (maxY - minY);
      const scale  = Math.min(scaleX, scaleY, 1);
      const tx = (width  - scale * (minX + maxX)) / 2;
      const ty = (height - scale * (minY + maxY)) / 2;
      svg.transition().duration(1000)
        .call(
          zoomBehavior.transform,
          d3.zoomIdentity.translate(tx, ty).scale(scale)
        );
    });
  }

  // ─── Public API ───────────────────────────────────────────────────────────

  window.GraphModule = {
    init:      initGraph,
    highlight: highlightNode,
    reset:     resetHighlight,
    filter:    filterByFamily,
    centerOn:  centerOnNode,
  };

}());
