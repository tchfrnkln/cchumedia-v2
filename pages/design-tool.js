/* ================================================================
   PRINTHUB — pages/design-tool.js
   Full canvas design editor powered by Fabric.js
   ================================================================ */
Pages.DesignTool = (state) => {
  const productId = state.route.params?.productId;
  const product = productId ? PRODUCTS.find(p => p.id === productId) : null;

  return `
  <div style="background:var(--bg-elevated);border-bottom:1px solid var(--border);padding:10px 0">
    <div style="display:flex;align-items:center;justify-content:space-between;padding:0 16px;flex-wrap:wrap;gap:10px">
      <div style="display:flex;align-items:center;gap:12px">
        <button class="btn btn-ghost btn-sm" onclick="if(confirm('Exit design tool?'))Store.navigate('shop')">← Back</button>
        <div style="font-family:var(--font-display);font-weight:900;font-size:1rem">🎨 PrintHub Design Studio</div>
        ${product ? `<span class="badge badge-brand">${product.icon} ${product.name}</span>` : ''}
      </div>
      <div style="display:flex;gap:7px">
        <button class="btn btn-ghost btn-sm" onclick="dtUndo()">↩ Undo</button>
        <button class="btn btn-ghost btn-sm" onclick="dtRedo()">↪ Redo</button>
        <button class="btn btn-ghost btn-sm" onclick="dtSave()">💾 Save</button>
        <button class="btn btn-outline btn-sm" onclick="dtExportPNG()">⬇ PNG</button>
        <button class="btn btn-primary btn-sm" onclick="dtSendToPrint()">🖨 Send to Print</button>
      </div>
    </div>
  </div>

  <!-- PRODUCT SELECTOR -->
  <div style="background:var(--bg-muted);border-bottom:1px solid var(--border);padding:8px 14px;overflow-x:auto;white-space:nowrap">
    <span style="font-size:.72rem;font-weight:800;text-transform:uppercase;color:var(--text-muted);margin-right:10px;font-family:var(--font-display)">Product:</span>
    ${[
      ['Business Card','💼','90×54mm','bc',85,54],
      ['A5 Flyer','📄','148×210mm','a5',148,210],
      ['A4 Flyer','📋','210×297mm','a4',210,297],
      ['Roll-up Banner','🏷️','85×200cm','rollup',85,200],
      ['T-Shirt','👕','Custom','tshirt',300,350],
      ['Mug','☕','Standard','mug',280,95],
      ['Sticker','🏷️','Custom','sticker',100,100],
      ['Letterhead','📋','A4','lhead',210,297],
    ].map(([name,ic,dim,id,w,h])=>`
    <button class="btn btn-ghost btn-sm ${(productId && product?.cat===id)||(!productId&&id==='bc')?'active':''}"
      style="margin-right:5px;flex-shrink:0" 
      onclick="dtSetProduct('${name}',${w*3},${h*3},'${ic}')">
      ${ic} ${name} <span style="font-size:.66rem;opacity:.6">${dim}</span>
    </button>`).join('')}
  </div>

  <div class="design-tool-wrap">
    <!-- LEFT: TOOLS -->
    <div class="dt-left">
      <div class="dt-panel-title">Elements</div>
      <div class="dt-tool-btn" onclick="dtAddText()"><span class="di">T</span>Add Text</div>
      <div class="dt-tool-btn" onclick="dtUploadImage()"><span class="di">🖼</span>Upload Image</div>
      <div class="dt-tool-btn" onclick="dtAddShape('rect')"><span class="di">⬜</span>Rectangle</div>
      <div class="dt-tool-btn" onclick="dtAddShape('circle')"><span class="di">⭕</span>Circle</div>
      <div class="dt-tool-btn" onclick="dtAddShape('triangle')"><span class="di">🔺</span>Triangle</div>
      <div class="dt-tool-btn" onclick="dtAddShape('line')"><span class="di">—</span>Line</div>
      <div class="dt-panel-title" style="margin-top:8px">Background</div>
      <div class="dt-tool-btn" onclick="dtSetBg('white')"><span class="di">⬜</span>White</div>
      <div class="dt-tool-btn" onclick="dtSetBg('#D42B2B')"><span class="di" style="color:#D42B2B">■</span>Brand Red</div>
      <div class="dt-tool-btn" onclick="dtSetBg('#0C0C18')"><span class="di" style="color:#888">■</span>Dark</div>
      <div class="dt-tool-btn" onclick="document.getElementById('bg-color-pick').click()"><span class="di">🎨</span>Custom Color
        <input type="color" id="bg-color-pick" style="position:absolute;opacity:0;width:0;height:0" onchange="dtSetBg(this.value)">
      </div>
      <div class="dt-tool-btn" onclick="dtAddBgImage()"><span class="di">🖼</span>BG Image</div>

      <div class="dt-panel-title" style="margin-top:8px">Templates</div>
      <div class="template-grid">
        ${[
          ['bg:#D42B2B','⬜','Red Clean'],
          ['bg:linear-gradient(135deg,#0c0c18,#180606)','🌙','Dark Luxury'],
          ['bg:#fff','📝','White Minimal'],
          ['bg:linear-gradient(135deg,#7B7EC8,#5a5da0)','💜','Purple Pro'],
          ['bg:linear-gradient(135deg,#059669,#047857)','💚','Green Fresh'],
          ['bg:linear-gradient(135deg,#d97706,#b45309)','🟠','Gold Classic'],
        ].map(([bg,em,name],i)=>`
        <div class="template-item" onclick="dtLoadTemplate(${i})" title="${name}">
          <div style="width:100%;height:100%;background:${bg};border-radius:var(--r-sm);display:flex;align-items:center;justify-content:center;font-size:1.3rem">${em}</div>
        </div>`).join('')}
      </div>
      <input type="file" id="dt-img-input" style="display:none" accept="image/*" onchange="dtLoadImage(this)">
      <input type="file" id="dt-bg-img-input" style="display:none" accept="image/*" onchange="dtLoadBgImage(this)">
    </div>

    <!-- MAIN CANVAS -->
    <div class="dt-main">
      <!-- TOOLBAR -->
      <div class="dt-toolbar">
        <select id="dt-font" class="dt-font-select" style="width:140px" onchange="dtApplyFont(this.value)">
          <option>Montserrat</option><option>Arial</option><option>Georgia</option>
          <option>Times New Roman</option><option>Courier New</option><option>Verdana</option>
          <option>Impact</option><option>Trebuchet MS</option>
        </select>
        <select id="dt-size" class="dt-font-select" style="width:70px" onchange="dtApplySize(this.value)">
          ${[8,10,12,14,16,18,20,24,28,32,36,42,48,60,72,96].map(s=>`<option ${s===24?'selected':''}>${s}</option>`).join('')}
        </select>
        <button class="btn btn-ghost btn-sm" style="font-weight:900" onclick="dtBold()">B</button>
        <button class="btn btn-ghost btn-sm" style="font-style:italic" onclick="dtItalic()">I</button>
        <button class="btn btn-ghost btn-sm" style="text-decoration:underline" onclick="dtUnderline()">U</button>
        <div class="dt-color-row">
          <label style="font-size:.72rem;color:var(--text-muted)">Color</label>
          <input type="color" id="dt-text-color" class="dt-color-swatch" value="#0C0C12" onchange="dtApplyColor(this.value)">
        </div>
        <div class="dt-color-row">
          <label style="font-size:.72rem;color:var(--text-muted)">Fill</label>
          <input type="color" id="dt-fill-color" class="dt-color-swatch" value="#D42B2B" onchange="dtApplyFill(this.value)">
        </div>
        <div style="flex:1"></div>
        <div style="display:flex;gap:4px;align-items:center">
          <button class="btn btn-ghost btn-sm" onclick="dtAlignLeft()">⬅</button>
          <button class="btn btn-ghost btn-sm" onclick="dtAlignCenter()">↔</button>
          <button class="btn btn-ghost btn-sm" onclick="dtAlignRight()">➡</button>
          <button class="btn btn-ghost btn-sm" onclick="dtBringForward()">↑</button>
          <button class="btn btn-ghost btn-sm" onclick="dtSendBackward()">↓</button>
          <button class="btn btn-ghost btn-sm" onclick="dtDeleteSelected()" style="color:#dc2626">🗑</button>
        </div>
      </div>
      <!-- CANVAS AREA -->
      <div class="dt-canvas-wrap" id="dt-canvas-wrap">
        <canvas id="design-canvas"></canvas>
        <div class="canvas-zoom-controls">
          <button class="zoom-btn" onclick="dtZoom(-0.1)">−</button>
          <span id="zoom-label" style="font-size:.72rem;color:var(--text-muted);min-width:36px;text-align:center">100%</span>
          <button class="zoom-btn" onclick="dtZoom(0.1)">+</button>
          <button class="zoom-btn" onclick="dtFit()" title="Fit to screen">⤢</button>
        </div>
      </div>
    </div>

    <!-- RIGHT: PROPERTIES -->
    <div class="dt-right">
      <div class="dt-panel-title">Canvas Size</div>
      <div class="dt-prop">
        <label>Width (mm)</label>
        <input class="dt-input" id="dt-w" type="number" value="90">
      </div>
      <div class="dt-prop">
        <label>Height (mm)</label>
        <input class="dt-input" id="dt-h" type="number" value="54">
      </div>
      <button class="btn btn-ghost btn-sm btn-full" style="margin-bottom:12px" onclick="dtResizeCanvas()">Apply Size</button>

      <div class="dt-panel-title">Selected Object</div>
      <div id="dt-props-panel" style="font-size:.8rem;color:var(--text-muted);padding:8px 14px">Select an object to edit its properties</div>

      <div class="dt-panel-title" style="margin-top:10px">Guides</div>
      <div style="padding:0 14px">
        <label style="display:flex;align-items:center;gap:7px;font-size:.8rem;cursor:pointer;margin-bottom:7px">
          <input type="checkbox" id="dt-bleed" checked onchange="dtToggleBleed(this.checked)" style="accent-color:var(--brand)">
          Show bleed guides (3mm)
        </label>
        <label style="display:flex;align-items:center;gap:7px;font-size:.8rem;cursor:pointer">
          <input type="checkbox" id="dt-grid" onchange="dtToggleGrid(this.checked)" style="accent-color:var(--brand)">
          Show grid
        </label>
      </div>

      <div class="dt-panel-title" style="margin-top:10px">Export & Print</div>
      <div style="padding:0 14px 14px;display:flex;flex-direction:column;gap:7px">
        <button class="btn btn-ghost btn-sm" onclick="dtExportPNG()">⬇ Download PNG</button>
        <button class="btn btn-ghost btn-sm" onclick="dtExportJPEG()">⬇ Download JPEG</button>
        <button class="btn btn-ghost btn-sm" onclick="dtSave()">💾 Save Design</button>
        <button class="btn btn-primary btn-sm" onclick="dtSendToPrint()">🖨 Send to Print</button>
      </div>
    </div>
  </div>`;
};

// ── FABRIC.JS DESIGN ENGINE ─────────────────────────────────
let _dtCanvas = null;
let _dtHistory = [];
let _dtHistoryIndex = -1;
let _dtZoom = 1;
let _dtBleed = true;

window.pageInits = window.pageInits || {};
window.pageInits['design-tool'] = (state) => {
  // Load Fabric.js dynamically
  if (!window.fabric) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fabric.js/5.3.1/fabric.min.js';
    script.onload = () => { dtInitCanvas(state); };
    document.head.appendChild(script);
  } else {
    dtInitCanvas(state);
  }
};

function dtInitCanvas(state) {
  const canvasEl = document.getElementById('design-canvas');
  if (!canvasEl || !window.fabric) return;
  if (_dtCanvas) { _dtCanvas.dispose(); }
  _dtCanvas = new fabric.Canvas('design-canvas', {
    width: 540, height: 324,
    backgroundColor: '#ffffff',
    selection: true,
    preserveObjectStacking: true,
  });
  _dtCanvas.on('mouse:up', dtSaveHistory);
  _dtCanvas.on('object:modified', dtSaveHistory);
  _dtCanvas.on('selection:created', dtUpdatePropsPanel);
  _dtCanvas.on('selection:updated', dtUpdatePropsPanel);
  _dtCanvas.on('selection:cleared', () => {
    const p = document.getElementById('dt-props-panel');
    if (p) p.innerHTML = '<span style="color:var(--text-muted)">Select an object to edit</span>';
  });
  // Bleed guides
  if (_dtBleed) dtDrawBleedGuides();
  dtSaveHistory();
  dtFit();
  // Load saved design
  const saved = DB.getVal('design_current');
  if (saved) {
    try {
      _dtCanvas.loadFromJSON(JSON.parse(saved), () => { _dtCanvas.renderAll(); });
    } catch(e) {}
  }
}

function dtAddText() {
  if (!_dtCanvas) return;
  const text = new fabric.IText('Click to edit text', {
    left: _dtCanvas.width/2 - 100, top: _dtCanvas.height/2 - 15,
    fontFamily: 'Montserrat', fontSize: 24, fill: '#0C0C12', fontWeight: 'bold',
  });
  _dtCanvas.add(text); _dtCanvas.setActiveObject(text); _dtCanvas.renderAll();
  text.enterEditing(); dtSaveHistory();
}

function dtAddShape(type) {
  if (!_dtCanvas) return;
  let shape;
  const cx = _dtCanvas.width/2, cy = _dtCanvas.height/2;
  if (type === 'rect') shape = new fabric.Rect({ left:cx-50, top:cy-30, width:100, height:60, fill:'#D42B2B', rx:4, ry:4 });
  else if (type === 'circle') shape = new fabric.Circle({ left:cx-40, top:cy-40, radius:40, fill:'#7B7EC8' });
  else if (type === 'triangle') shape = new fabric.Triangle({ left:cx-40, top:cy-40, width:80, height:80, fill:'#059669' });
  else if (type === 'line') shape = new fabric.Line([cx-60,cy,cx+60,cy], { stroke:'#0C0C12', strokeWidth:3 });
  if (shape) { _dtCanvas.add(shape); _dtCanvas.setActiveObject(shape); _dtCanvas.renderAll(); dtSaveHistory(); }
}

function dtSetBg(color) {
  if (!_dtCanvas) return;
  _dtCanvas.setBackgroundColor(color, () => { _dtCanvas.renderAll(); dtSaveHistory(); });
}

function dtAddBgImage() { document.getElementById('dt-bg-img-input')?.click(); }
function dtUploadImage() { document.getElementById('dt-img-input')?.click(); }

function dtLoadImage(input) {
  if (!_dtCanvas || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    fabric.Image.fromURL(e.target.result, img => {
      const scale = Math.min((_dtCanvas.width * 0.5) / img.width, (_dtCanvas.height * 0.5) / img.height);
      img.set({ left: _dtCanvas.width/4, top: _dtCanvas.height/4, scaleX: scale, scaleY: scale });
      _dtCanvas.add(img); _dtCanvas.setActiveObject(img); _dtCanvas.renderAll(); dtSaveHistory();
    });
  };
  reader.readAsDataURL(input.files[0]);
}

function dtLoadBgImage(input) {
  if (!_dtCanvas || !input.files[0]) return;
  const reader = new FileReader();
  reader.onload = e => {
    fabric.Image.fromURL(e.target.result, img => {
      _dtCanvas.setBackgroundImage(img, _dtCanvas.renderAll.bind(_dtCanvas), {
        scaleX: _dtCanvas.width / img.width, scaleY: _dtCanvas.height / img.height,
      });
      dtSaveHistory();
    });
  };
  reader.readAsDataURL(input.files[0]);
}

function dtLoadTemplate(idx) {
  if (!_dtCanvas) return;
  const templates = [
    { bg:'#D42B2B', items:[{type:'text',text:'YOUR COMPANY',x:0.5,y:0.3,color:'#fff',size:28,weight:'900'},{type:'text',text:'www.printhub.ng',x:0.5,y:0.65,color:'rgba(255,255,255,.7)',size:14}] },
    { bg:'#0c0c18', items:[{type:'text',text:'PREMIUM BRAND',x:0.5,y:0.35,color:'#D42B2B',size:26,weight:'900'},{type:'text',text:'QUALITY · TRUST · EXCELLENCE',x:0.5,y:0.62,color:'rgba(255,255,255,.5)',size:11}] },
    { bg:'#fff', items:[{type:'text',text:'Your Name',x:0.5,y:0.3,color:'#0C0C12',size:24,weight:'900'},{type:'text',text:'CEO & Founder',x:0.5,y:0.55,color:'#888',size:13}] },
    { bg:'#7B7EC8', items:[{type:'text',text:'PROFESSIONAL',x:0.5,y:0.35,color:'#fff',size:22,weight:'900'},{type:'text',text:'SERVICES',x:0.5,y:0.6,color:'rgba(255,255,255,.8)',size:16}] },
    { bg:'#059669', items:[{type:'text',text:'FRESH BRAND',x:0.5,y:0.35,color:'#fff',size:24,weight:'900'},{type:'text',text:'Modern & Clean',x:0.5,y:0.62,color:'rgba(255,255,255,.75)',size:13}] },
    { bg:'#d97706', items:[{type:'text',text:'GOLD STANDARD',x:0.5,y:0.35,color:'#fff',size:22,weight:'900'},{type:'text',text:'Classic Elegance',x:0.5,y:0.62,color:'rgba(255,255,255,.8)',size:13}] },
  ];
  const t = templates[idx]; if (!t) return;
  _dtCanvas.clear();
  _dtCanvas.setBackgroundColor(t.bg, _dtCanvas.renderAll.bind(_dtCanvas));
  t.items.forEach(item => {
    if (item.type === 'text') {
      const txt = new fabric.Text(item.text, {
        left: _dtCanvas.width * item.x, top: _dtCanvas.height * item.y,
        fontFamily: 'Montserrat', fontSize: item.size, fill: item.color,
        fontWeight: item.weight || 'normal', originX: 'center', originY: 'center',
        textAlign: 'center',
      });
      _dtCanvas.add(txt);
    }
  });
  _dtCanvas.renderAll(); dtSaveHistory();
}

function dtApplyFont(f) { const o = _dtCanvas?.getActiveObject(); if (o && o.fontFamily !== undefined) { o.set('fontFamily', f); _dtCanvas.renderAll(); } }
function dtApplySize(s) { const o = _dtCanvas?.getActiveObject(); if (o && o.fontSize !== undefined) { o.set('fontSize', parseInt(s)); _dtCanvas.renderAll(); } }
function dtApplyColor(c) { const o = _dtCanvas?.getActiveObject(); if (o) { if (o.fill !== undefined && o.text !== undefined) o.set('fill', c); else if (o.stroke !== undefined) o.set('stroke', c); _dtCanvas.renderAll(); } }
function dtApplyFill(c) { const o = _dtCanvas?.getActiveObject(); if (o && o.fill !== undefined && o.text === undefined) { o.set('fill', c); _dtCanvas.renderAll(); } }
function dtBold() { const o = _dtCanvas?.getActiveObject(); if (o) { o.set('fontWeight', o.fontWeight === 'bold' ? 'normal' : 'bold'); _dtCanvas.renderAll(); } }
function dtItalic() { const o = _dtCanvas?.getActiveObject(); if (o) { o.set('fontStyle', o.fontStyle === 'italic' ? 'normal' : 'italic'); _dtCanvas.renderAll(); } }
function dtUnderline() { const o = _dtCanvas?.getActiveObject(); if (o) { o.set('underline', !o.underline); _dtCanvas.renderAll(); } }
function dtDeleteSelected() { const o = _dtCanvas?.getActiveObjects(); if (o?.length) { o.forEach(obj => _dtCanvas.remove(obj)); _dtCanvas.discardActiveObject(); _dtCanvas.renderAll(); dtSaveHistory(); } }
function dtAlignLeft() { const o = _dtCanvas?.getActiveObject(); if (o) { o.set('left', 0); _dtCanvas.renderAll(); } }
function dtAlignCenter() { const o = _dtCanvas?.getActiveObject(); if (o) { o.set('left', (_dtCanvas.width - o.getScaledWidth()) / 2); _dtCanvas.renderAll(); } }
function dtAlignRight() { const o = _dtCanvas?.getActiveObject(); if (o) { o.set('left', _dtCanvas.width - o.getScaledWidth()); _dtCanvas.renderAll(); } }
function dtBringForward() { const o = _dtCanvas?.getActiveObject(); if (o) { _dtCanvas.bringForward(o); _dtCanvas.renderAll(); } }
function dtSendBackward() { const o = _dtCanvas?.getActiveObject(); if (o) { _dtCanvas.sendBackwards(o); _dtCanvas.renderAll(); } }

function dtZoom(delta) {
  _dtZoom = Math.max(0.25, Math.min(3, _dtZoom + delta));
  if (_dtCanvas) { _dtCanvas.setZoom(_dtZoom); _dtCanvas.setWidth(_dtCanvas.getWidth()); }
  const lbl = document.getElementById('zoom-label');
  if (lbl) lbl.textContent = Math.round(_dtZoom * 100) + '%';
}
function dtFit() {
  const wrap = document.getElementById('dt-canvas-wrap');
  if (!wrap || !_dtCanvas) return;
  const cw = wrap.clientWidth - 40, ch = wrap.clientHeight - 40;
  const scaleX = cw / _dtCanvas.width, scaleY = ch / _dtCanvas.height;
  _dtZoom = Math.min(scaleX, scaleY, 1);
  _dtCanvas.setZoom(_dtZoom);
  const lbl = document.getElementById('zoom-label');
  if (lbl) lbl.textContent = Math.round(_dtZoom * 100) + '%';
}

function dtResizeCanvas() {
  if (!_dtCanvas) return;
  const w = parseInt(document.getElementById('dt-w')?.value) * 6;
  const h = parseInt(document.getElementById('dt-h')?.value) * 6;
  if (!w || !h) return;
  _dtCanvas.setWidth(w); _dtCanvas.setHeight(h); _dtCanvas.renderAll();
  dtFit();
}

function dtSetProduct(name, w, h, icon) {
  if (!_dtCanvas) { UI.toast('Canvas not ready', 'error'); return; }
  _dtCanvas.setWidth(Math.min(w, 900)); _dtCanvas.setHeight(Math.min(h, 600));
  _dtCanvas.renderAll(); dtFit();
  UI.toast(`📐 Canvas set for ${name}`, 'info');
}

function dtDrawBleedGuides() {
  if (!_dtCanvas) return;
  const bleed = 9; // ~3mm at 3px/mm
  const w = _dtCanvas.width, h = _dtCanvas.height;
  const rect = new fabric.Rect({
    left: bleed, top: bleed, width: w - bleed*2, height: h - bleed*2,
    fill: 'transparent', stroke: 'rgba(212,43,43,.5)', strokeWidth: 1,
    strokeDashArray: [5,5], selectable: false, evented: false, name: '_bleed',
  });
  _dtCanvas.add(rect);
}

function dtToggleBleed(show) {
  if (!_dtCanvas) return;
  _dtCanvas.getObjects().filter(o => o.name === '_bleed').forEach(o => o.set('visible', show));
  _dtCanvas.renderAll();
}

function dtToggleGrid(show) {
  if (!_dtCanvas) return;
  _dtCanvas.getObjects().filter(o => o.name === '_grid').forEach(o => _dtCanvas.remove(o));
  if (show) {
    const gridSize = 30, w = _dtCanvas.width, h = _dtCanvas.height;
    for (let x = gridSize; x < w; x += gridSize) {
      _dtCanvas.add(new fabric.Line([x,0,x,h], { stroke:'rgba(123,126,200,.2)', strokeWidth:1, selectable:false, evented:false, name:'_grid' }));
    }
    for (let y = gridSize; y < h; y += gridSize) {
      _dtCanvas.add(new fabric.Line([0,y,w,y], { stroke:'rgba(123,126,200,.2)', strokeWidth:1, selectable:false, evented:false, name:'_grid' }));
    }
  }
  _dtCanvas.renderAll();
}

function dtSaveHistory() {
  if (!_dtCanvas) return;
  const json = JSON.stringify(_dtCanvas.toJSON());
  _dtHistory = _dtHistory.slice(0, _dtHistoryIndex + 1);
  _dtHistory.push(json);
  _dtHistoryIndex = _dtHistory.length - 1;
}

function dtUndo() {
  if (!_dtCanvas || _dtHistoryIndex <= 0) return;
  _dtHistoryIndex--;
  _dtCanvas.loadFromJSON(JSON.parse(_dtHistory[_dtHistoryIndex]), () => { _dtCanvas.renderAll(); });
}

function dtRedo() {
  if (!_dtCanvas || _dtHistoryIndex >= _dtHistory.length - 1) return;
  _dtHistoryIndex++;
  _dtCanvas.loadFromJSON(JSON.parse(_dtHistory[_dtHistoryIndex]), () => { _dtCanvas.renderAll(); });
}

function dtSave() {
  if (!_dtCanvas) return;
  DB.setVal('design_current', JSON.stringify(_dtCanvas.toJSON()));
  UI.toast('💾 Design saved!', 'success');
}

function dtExportPNG() {
  if (!_dtCanvas) return;
  const zoom = _dtCanvas.getZoom(); _dtCanvas.setZoom(1);
  const url = _dtCanvas.toDataURL({ format:'png', multiplier: 2 });
  _dtCanvas.setZoom(zoom);
  const a = document.createElement('a'); a.href = url; a.download = 'printhub-design.png'; a.click();
  UI.toast('⬇ PNG downloaded!', 'success');
}

function dtExportJPEG() {
  if (!_dtCanvas) return;
  const zoom = _dtCanvas.getZoom(); _dtCanvas.setZoom(1);
  const url = _dtCanvas.toDataURL({ format:'jpeg', quality:0.9, multiplier: 2 });
  _dtCanvas.setZoom(zoom);
  const a = document.createElement('a'); a.href = url; a.download = 'printhub-design.jpg'; a.click();
}

function dtSendToPrint() {
  if (!_dtCanvas) return;
  dtSave();
  const state = Store.getState();
  const productId = state.route.params?.productId;
  if (productId) {
    const product = PRODUCTS.find(p => p.id === productId);
    if (product) {
      Cart.addItem(product, { size:'A4', material:'Glossy', finishing:'None', turnaround:'Standard (5–7 days)' }, 100, 'design_current');
      UI.toggleCart(); UI.render();
      UI.toast('🖨 Design added to cart!', 'success');
      return;
    }
  }
  Store.navigate('checkout');
}

function dtUpdatePropsPanel(e) {
  const p = document.getElementById('dt-props-panel'); if (!p) return;
  const obj = e?.selected?.[0] || _dtCanvas?.getActiveObject();
  if (!obj) return;
  p.innerHTML = `
  <div class="dt-prop"><label>Type</label><div style="font-weight:700">${obj.type}</div></div>
  <div class="dt-prop"><label>X Position</label><input class="dt-input" type="number" value="${Math.round(obj.left)}" onchange="if(_dtCanvas.getActiveObject()){_dtCanvas.getActiveObject().set('left',parseInt(this.value));_dtCanvas.renderAll()}"></div>
  <div class="dt-prop"><label>Y Position</label><input class="dt-input" type="number" value="${Math.round(obj.top)}" onchange="if(_dtCanvas.getActiveObject()){_dtCanvas.getActiveObject().set('top',parseInt(this.value));_dtCanvas.renderAll()}"></div>
  <div class="dt-prop"><label>Opacity</label><input class="dt-input" type="range" min="0" max="1" step="0.05" value="${obj.opacity||1}" oninput="if(_dtCanvas.getActiveObject()){_dtCanvas.getActiveObject().set('opacity',parseFloat(this.value));_dtCanvas.renderAll()}"></div>
  ${obj.angle !== undefined ? `<div class="dt-prop"><label>Rotation</label><input class="dt-input" type="number" value="${Math.round(obj.angle||0)}" onchange="if(_dtCanvas.getActiveObject()){_dtCanvas.getActiveObject().set('angle',parseInt(this.value));_dtCanvas.renderAll()}"></div>` : ''}
  <div style="display:flex;gap:6px;margin-top:8px">
    <button class="btn btn-danger btn-sm" style="flex:1" onclick="dtDeleteSelected()">🗑 Delete</button>
    <button class="btn btn-ghost btn-sm" style="flex:1" onclick="if(_dtCanvas){var o=_dtCanvas.getActiveObject();if(o){var c=fabric.util.object.clone(o);c.set({left:o.left+14,top:o.top+14});_dtCanvas.add(c);_dtCanvas.renderAll();}}">⧉ Duplicate</button>
  </div>`;
}
