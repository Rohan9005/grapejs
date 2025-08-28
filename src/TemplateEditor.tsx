// TemplateEditor.tsx
import { useEffect, useRef, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import presetWebpage from 'grapesjs-preset-webpage';
import Handlebars from 'handlebars';

/**
 * Props
 */
type TemplateEditorProps = {
  initialHbs?: string;          // load an existing .hbs
  sampleData?: any;             // for preview/rendering
  variables?: string[];         // optional list for future use
  onExport?: (hbs: string) => void;
  dataSources?: Record<string, any>; // keys rendered as cards in modal
};

export default function TemplateEditor({
  initialHbs = '<div>{{title}}</div>',
  sampleData = { title: 'Hello' },
  variables = ['title'],
  onExport,
  dataSources = {},
}: TemplateEditorProps) {
  const editorRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [editorReady, setEditorReady] = useState(false);

  // --- Handlebars <-> HTML adapter ---
  const PLACE_TAG = 'span';
  const HBS_ATTR = 'data-hbs';

  // turn {{#each x}} / {{#if x}} and inline tokens into HTML placeholders
  const hbsToHtml = (hbs: string) =>
    hbs
      // block helpers first
      .replace(/{{#each\s+([^}]+)}}/g, `<${PLACE_TAG} ${HBS_ATTR}="{{#each $1}}" class="hbs-block-open">{{#each $1}}</${PLACE_TAG}>`)
      .replace(/{{#if\s+([^}]+)}}/g, `<${PLACE_TAG} ${HBS_ATTR}="{{#if $1}}" class="hbs-block-open">{{#if $1}}</${PLACE_TAG}>`)
      .replace(/{{\/(each|if)}}/g, `<${PLACE_TAG} ${HBS_ATTR}="{{/$1}}" class="hbs-block-close">{{/$1}}</${PLACE_TAG}>`)
      // inline
      .replace(/{{[^}]+}}/g, (m) => `<${PLACE_TAG} ${HBS_ATTR}="${m}" class="hbs-token">${m}</${PLACE_TAG}>`);

  // turn <span data-hbs="…"> back into raw {{…}}
  const htmlToHbs = (html: string) => {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    tmp.querySelectorAll<HTMLElement>(`${PLACE_TAG}[${HBS_ATTR}]`).forEach((el) => {
      const raw = el.getAttribute(HBS_ATTR) || '';
      // If range metadata exists on #each openers, emit a helper expression instead of a comment
      const isEachOpen = raw.startsWith('{{#each');
      const src = el.getAttribute('data-source') || '';
      const from = el.getAttribute('data-range-from');
      const to = el.getAttribute('data-range-to');

      if (isEachOpen && src && (from || to)) {
        // export as slice helper if user entered a range
        const f = from ? Number(from) : 0;
        const t = to ? Number(to) : undefined;
        const sliceExpr = t !== undefined ? `{{#each (slice ${src} ${f} ${t})}}` : `{{#each (slice ${src} ${f})}}`;
        el.replaceWith(document.createTextNode(sliceExpr));
        return;
      }

      el.replaceWith(document.createTextNode(raw));
    });
    return tmp.innerHTML;
  };

  // --- Utils for modal (type/preview/path) ---
  const typeOf = (v: any): 'null'|'array'|'object'|'string'|'number'|'boolean'|'undefined' => {
    if (v === null) return 'null';
    if (Array.isArray(v)) return 'array';
    const t = typeof v;
    if (t === 'object') return 'object';
    if (t === 'string' || t === 'number' || t === 'boolean' || t === 'undefined') return t as any;
    return 'object';
  };

  const previewStr = (v: any): string => {
    const t = typeOf(v);
    if (t === 'string') return v as string;
    if (t === 'number' || t === 'boolean') return String(v);
    if (t === 'undefined') return 'undefined';
    if (t === 'null') return 'null';
    try {
      const s = JSON.stringify(v);
      return s.length > 80 ? s.slice(0, 77) + '…' : s;
    } catch {
      return String(v);
    }
  };

  const escapeHtml = (s: string) =>
    (s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const compilePathPreview = (path: string, ctx: any) => {
    try {
      const tpl = Handlebars.compile(`{{${path}}}`);
      return tpl(ctx);
    } catch {
      return '';
    }
  };

  // Build card grid for a node (object/array)
  const renderCards = (node: any, basePath: string): string => {
    const entries: { label: string; path: string; value: any; kind: string }[] = [];
    if (typeOf(node) === 'object') {
      Object.keys(node).forEach((k) => {
        const val = node[k];
        const p = basePath ? `${basePath}.${k}` : k;
        entries.push({ label: k, path: p, value: val, kind: typeOf(val) });
      });
    } else if (typeOf(node) === 'array') {
      const arr: any[] = node;
      const max = Math.min(arr.length, 50); // cap
      for (let i = 0; i < max; i++) {
        const val = arr[i];
        const p = basePath ? `${basePath}.${i}` : String(i);
        entries.push({ label: `[${i}]`, path: p, value: val, kind: typeOf(val) });
      }
    }

    if (!entries.length) {
      return `<div style="padding:8px;color:#666">(no fields)</div>`;
    }

    return `
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:10px;margin-top:8px">
        ${entries
          .map((e) => {
            const badge = e.kind === 'object' ? 'Object' : e.kind === 'array' ? 'Array' : 'Value';
            return `
              <div class="gjs-card" data-path="${escapeHtml(e.path)}" data-kind="${e.kind}" style="border:1px solid #e5e7eb;border-radius:10px;padding:10px;cursor:pointer;background:#fff">
                <div style="font-weight:600;margin-bottom:6px;word-break:break-all">${escapeHtml(e.label)}
                  <span style="float:right;font-size:12px;color:#2563eb">${badge}</span>
                </div>
                <div style="font-size:12px;color:#374151;word-break:break-word;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${escapeHtml(previewStr(e.value))}</div>
              </div>`;
          })
          .join('')}
      </div>
    `;
  };

  const getValueFromPath = (obj: any, path: string) => {
    try {
      return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj);
    } catch {
      return undefined;
    }
  };

  // Modal (Explorer) common scaffolding
  const openExplorerModal = (opts: {
    editor: any;
    root: any;
    startPath?: string;
    mode: 'variable' | 'each' | 'if';
    onConfirm: (chosenPath: string, context: { preview: string; selectedKind: string; range?: { from?: number; to?: number } }) => void;
  }) => {
    const { editor, root, startPath = '', mode, onConfirm } = opts;

    if (!root || (typeof root !== 'object' && !Array.isArray(root))) {
      alert('No data sources available to map. Pass `dataSources` prop to TemplateEditor.');
      return;
    }

    let currentPath = startPath;
    let currentNode = currentPath ? getValueFromPath(root, currentPath) : root;
    let selectedPath: string | null = null;
    let selectedKind = '';

    const header = `
      <div style="display:flex;align-items:center;justify-content:space-between;gap:8px">
        <div style="font-weight:600">${mode === 'variable' ? 'Bind Variable' : mode === 'each' ? 'Bind Each (collection)' : 'Bind If (condition)'}
        </div>
        <div id="gjs-breadcrumb" style="font-size:12px;color:#6b7280;word-break:break-all"></div>
      </div>`;

    const footer = `
      <div style="display:flex;align-items:center;justify-content:space-between;margin-top:12px;gap:8px">
        <div id="gjs-preview" style="font-size:12px;color:#111827"></div>
        <div style="display:flex;gap:8px">
          ${mode === 'each' ? `<input id="gjs-from" type="number" placeholder="from" style="width:90px;padding:6px;border:1px solid #e5e7eb;border-radius:8px" />
                              <input id="gjs-to" type="number" placeholder="to" style="width:90px;padding:6px;border:1px solid #e5e7eb;border-radius:8px" />` : ''}
          <button id="gjs-modal-cancel" style="padding:6px 12px;border-radius:8px;border:1px solid #d1d5db;background:#fff">Cancel</button>
          <button id="gjs-modal-ok" style="padding:6px 12px;border-radius:8px;border:0;background:#0b74de;color:#fff">OK</button>
        </div>
      </div>`;

    const containerHtml = `
      <div style="font-family:system-ui,sans-serif;padding:12px;min-width:720px;max-width:900px">
        ${header}
        <div id="gjs-explorer" style="margin-top:10px"></div>
        ${footer}
      </div>`;

    editor.Modal.setTitle('Select data').setContent(containerHtml).open();

    const rerender = () => {
      const explorer = document.getElementById('gjs-explorer');
      const breadcrumb = document.getElementById('gjs-breadcrumb');
      if (!explorer || !breadcrumb) return;

      // Breadcrumb UI
      const parts = currentPath ? currentPath.split('.') : [];
      let acc: string[] = [];
      const crumb = ['<span data-jump="" style="cursor:pointer;color:#0b74de">root</span>']
        .concat(
          parts.map((p, i) => {
            acc.push(p);
            return `<span style="margin:0 6px;color:#9ca3af">/</span><span data-jump="${escapeHtml(acc.join('.'))}" style="cursor:pointer;color:#0b74de">${escapeHtml(p)}</span>`;
          })
        )
        .join('');
      breadcrumb.innerHTML = crumb;

      explorer.innerHTML = renderCards(currentNode, currentPath);

      // click to drill or select
      explorer.querySelectorAll<HTMLElement>('.gjs-card').forEach((card) => {
        card.addEventListener('click', () => {
          const path = card.getAttribute('data-path')!;
          const kind = card.getAttribute('data-kind')!;
          const val = getValueFromPath(root, path);

          if (kind === 'object' || kind === 'array') {
            currentPath = path;
            currentNode = val;
            selectedPath = null;
            selectedKind = '';
            updatePreview();
            rerender();
          } else {
            selectedPath = path;
            selectedKind = kind;
            updatePreview();
            // Soft highlight
            explorer.querySelectorAll<HTMLElement>('.gjs-card').forEach((el) => (el.style.outline = ''));
            card.style.outline = '2px solid #0b74de';
          }
        });
      });

      // breadcrumb jump
      breadcrumb.querySelectorAll<HTMLElement>('[data-jump]').forEach((el) => {
        el.addEventListener('click', () => {
          const jump = el.getAttribute('data-jump') || '';
          currentPath = jump;
          currentNode = jump ? getValueFromPath(root, jump) : root;
          selectedPath = null;
          selectedKind = '';
          updatePreview();
          rerender();
        });
      });

      updatePreview();
    };

    const updatePreview = () => {
      const pv = document.getElementById('gjs-preview');
      if (!pv) return;

      if (!selectedPath) {
        pv.innerHTML = `<span style="color:#6b7280">Select a value to preview…</span>`;
        return;
      }

      // Mode-aware preview text
      const compiled = compilePathPreview(selectedPath, sampleData);
      if (mode === 'variable') {
        pv.innerHTML = `Bind to <b>{{${escapeHtml(selectedPath)}}}</b> → Preview: <i>${escapeHtml(String(compiled))}</i>`;
      } else if (mode === 'if') {
        const truthy = Boolean(getValueFromPath(sampleData, selectedPath));
        pv.innerHTML = `Condition <b>{{${escapeHtml(selectedPath)}}}</b> → <b>${truthy ? 'truthy' : 'falsy'}</b>`;
      } else if (mode === 'each') {
        const node = getValueFromPath(sampleData, selectedPath);
        const len = Array.isArray(node) ? node.length : 0;
        pv.innerHTML = `Collection <b>{{${escapeHtml(selectedPath)}}}</b> → <i>${len} items</i>`;
      }
    };

    // Wire buttons
    setTimeout(() => {
      rerender();

      const btnCancel = document.getElementById('gjs-modal-cancel');
      const btnOk = document.getElementById('gjs-modal-ok');

      btnCancel?.addEventListener('click', () => editor.closeModal());
      btnOk?.addEventListener('click', () => {
        if (!selectedPath) {
          alert('Please select a value');
          return;
        }

        const preview = compilePathPreview(selectedPath, sampleData);
        const range: { from?: number; to?: number } = {};
        if (mode === 'each') {
          const fromEl = document.getElementById('gjs-from') as HTMLInputElement | null;
          const toEl = document.getElementById('gjs-to') as HTMLInputElement | null;
          if (fromEl?.value) range.from = Number(fromEl.value);
          if (toEl?.value) range.to = Number(toEl.value);
        }

        onConfirm(selectedPath, { preview, selectedKind, range: Object.keys(range).length ? range : undefined });
        editor.closeModal();
      });
    }, 50);
  };

  useEffect(() => {
    if (!containerRef.current) return;

    const editor = grapesjs.init({
      container: containerRef.current,
      fromElement: false,
      height: '100%',
      storageManager: false, // you control save/load
      plugins: [presetWebpage],
      canvas: { styles: [], scripts: [] },
    });

    editorRef.current = editor;
    setEditorReady(true);

    // Load initial HBS
    const initialHtml = hbsToHtml(initialHbs);
    editor.setComponents(initialHtml);

    // Component type for our token placeholder (locks accidental edits)
    editor.DomComponents.addType('hbs-token', {
      isComponent: (el: HTMLElement) => el.tagName === PLACE_TAG.toUpperCase() && el.hasAttribute(HBS_ATTR),
      model: {
        defaults: {
          tagName: PLACE_TAG,
          droppable: false,
          draggable: true,
          copyable: true,
          traits: [
            { label: 'Handlebars', name: HBS_ATTR, type: 'text', changeProp: true },
          ],
          attributes: { class: 'hbs-token' },
        },
      },
    });

    // Interpret our placeholders as the above type
    editor.Parser.getConfig().compTypes?.unshift({
      id: 'hbs-token',
      isComponent: (el: HTMLElement) =>
        el.tagName === PLACE_TAG.toUpperCase() && el.hasAttribute(HBS_ATTR),
      model: { type: 'hbs-token' },
    });

    // --- Blocks: Variable / If / Each ---
    editor.BlockManager.add('hbs-var', {
      label: 'Variable',
      category: 'Logic',
      content: `<${PLACE_TAG} ${HBS_ATTR}="{{}}" class="hbs-token">{{}}</${PLACE_TAG}>`,
    });

    editor.BlockManager.add('hbs-if', {
      label: '{{#if}}',
      category: 'Logic',
      content:
        `<${PLACE_TAG} ${HBS_ATTR}="{{#if condition}}" class="hbs-block-open">{{#if condition}}</${PLACE_TAG}>` +
        '<div>Conditional content</div>' +
        `<${PLACE_TAG} ${HBS_ATTR}="{{/if}}" class="hbs-block-close">{{/if}}</${PLACE_TAG}>`,
    });

    editor.BlockManager.add('hbs-each', {
      label: '{{#each}}',
      category: 'Logic',
      content:
        `<${PLACE_TAG} ${HBS_ATTR}="{{#each items}}" class="hbs-block-open">{{#each items}}</${PLACE_TAG}>` +
        '<div>Item content here</div>' +
        `<${PLACE_TAG} ${HBS_ATTR}="{{/each}}" class="hbs-block-close">{{/each}}</${PLACE_TAG}>`,
    });

    // Utility to set hbs attribute and visible inner text on the component element
    const setTokenBinding = (component: any, path: string, previewValue: any) => {
      const hbsExpr = `{{${path}}}`;
      component.addAttributes({ [HBS_ATTR]: hbsExpr, 'data-hbs-processed': '1', 'data-source': path.split('.')[0] });
      const el = component.getEl?.();
      if (el) {
        el.setAttribute(HBS_ATTR, hbsExpr);
        el.innerText = (previewValue !== undefined && previewValue !== null) ? String(previewValue) : hbsExpr;
      }
    };

    const setBlockBinding = (component: any, kind: 'if' | 'each', path: string, extra?: { range?: { from?: number; to?: number } }) => {
      if (kind === 'if') {
        const newRaw = `{{#if ${path}}}`;
        component.addAttributes({ [HBS_ATTR]: newRaw, 'data-hbs-processed': '1', 'data-source': path.split('.')[0] });
        const el = component.getEl?.();
        if (el) {
          el.setAttribute(HBS_ATTR, newRaw);
          el.innerText = newRaw;
        }
      } else {
        // each
        const newRaw = `{{#each ${path}}}`;
        const attrs: Record<string, any> = { [HBS_ATTR]: newRaw, 'data-hbs-processed': '1', 'data-source': path };
        if (extra?.range?.from !== undefined) attrs['data-range-from'] = String(extra.range.from);
        if (extra?.range?.to !== undefined) attrs['data-range-to'] = String(extra.range.to);
        component.addAttributes(attrs);
        const el = component.getEl?.();
        if (el) {
          el.setAttribute(HBS_ATTR, newRaw);
          if (attrs['data-range-from']) el.setAttribute('data-range-from', attrs['data-range-from']);
          if (attrs['data-range-to']) el.setAttribute('data-range-to', attrs['data-range-to']);
          el.innerText = newRaw;
        }
        // mark closing token as processed
        try {
          const parent = component.parent?.();
          parent?.components?.().each?.((child: any) => {
            const a = child.getAttributes?.();
            if (a && typeof a[HBS_ATTR] === 'string' && (a[HBS_ATTR] as string).startsWith('{{/each')) {
              child.addAttributes({ 'data-hbs-processed': '1' });
            }
          });
        } catch {}
      }
    };

    const openVariableModal = (component: any) => {
      openExplorerModal({
        editor,
        root: dataSources,
        mode: 'variable',
        onConfirm: (path, ctx) => {
          setTokenBinding(component, path, ctx.preview);
        },
      });
    };

    const openIfModal = (component: any) => {
      openExplorerModal({
        editor,
        root: dataSources,
        mode: 'if',
        onConfirm: (path) => setBlockBinding(component, 'if', path),
      });
    };

    const openEachModal = (component: any) => {
      openExplorerModal({
        editor,
        root: dataSources,
        mode: 'each',
        onConfirm: (path, ctx) => {
          // ensure selected path points to an array in sampleData (best effort)
          const node = getValueFromPath(sampleData, path);
          if (!Array.isArray(node)) {
            alert('Selected path is not an array in sampleData. Please choose a collection.');
            return;
          }
          setBlockBinding(component, 'each', path, { range: ctx.range });
        },
      });
    };

    // Listen for components being added to the canvas
    editor.on('component:add', (component: any) => {
      try {
        const walk = (comp: any) => {
          const attrs = comp.getAttributes?.();
          const raw = attrs?.[HBS_ATTR] as string | undefined;
          if (raw) {
            if (raw === '{{}}') return openVariableModal(comp);
            if (raw.startsWith('{{#if')) return openIfModal(comp);
            if (raw.startsWith('{{#each')) return openEachModal(comp);
          }
          // children
          const children = comp.components?.();
          children?.forEach?.((c: any) => walk(c));
        };
        walk(component);
      } catch (err) {
        console.error(err);
      }
    });

    // Double click to remap any token
    editor.on('component:dblclick', (component: any) => {
      try {
        const attrs = component.getAttributes?.();
        const raw = attrs?.[HBS_ATTR] as string | undefined;
        if (!raw) return;
        if (raw.startsWith('{{#if')) return openIfModal(component);
        if (raw.startsWith('{{#each')) return openEachModal(component);
        return openVariableModal(component);
      } catch {}
    });

    return () => editor.destroy();
  }, []);

  const exportHbs = () => {
    const html = editorRef.current?.getHtml() || '';
    const css = editorRef.current?.getCss() || '';
    const merged = css ? `<style>${css}</style>${html}` : html;
    const hbs = htmlToHbs(merged);
    onExport?.(hbs);
  };

  const preview = () => {
    const html = editorRef.current?.getHtml() || '';
    const css = editorRef.current?.getCss() || '';
    const hbs = htmlToHbs(css ? `<style>${css}</style>${html}` : html);
    try {
      // Register a simple slice helper used on export when ranges are set
      Handlebars.registerHelper('slice', function (arr: any[], from: number, to?: number) {
        if (!Array.isArray(arr)) return [];
        if (typeof to === 'number') return arr.slice(from, to + 1);
        return arr.slice(from);
      });

      const tpl = Handlebars.compile(hbs);
      const compiled = tpl(sampleData);
      const w = window.open('', '_blank');
      if (w) w.document.write(compiled);
    } catch (e) {
      alert('Preview error: ' + (e as Error).message);
    }
  };

  return (
    <div style={{ width: '100%', height: '80vh' }}>
      <div className="flex gap-2" style={{ marginBottom: 8 }}>
        <button onClick={exportHbs} className="px-3 py-1 rounded bg-gray-200">Export .hbs</button>
        <button onClick={preview} className="px-3 py-1 rounded bg-gray-200">Preview</button>
      </div>
      <div ref={containerRef} className="border rounded" />
      {!editorReady && <div>Loading editor…</div>}
    </div>
  );
}
