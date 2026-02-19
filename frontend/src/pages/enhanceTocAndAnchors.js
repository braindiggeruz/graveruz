// Minimal post-processing for TOC and anchors in blog post HTML
// No dependencies, works with react-snap/prerender

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\u0400-\u04FF]+/g, '-') // keep cyrillic, replace non-word
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-')
    .substring(0, 64);
}

export default function enhanceTocAndAnchors(html) {
  if (!html) return html;
  const parser = new window.DOMParser();
  const doc = parser.parseFromString(html, 'text/html');
  const usedIds = new Set();

  // 1. Add id to all h2/h3
  Array.from(doc.body.querySelectorAll('h2, h3')).forEach((el) => {
    if (!el.id) {
      let base = slugify(el.textContent || '');
      let id = base;
      let n = 2;
      while (usedIds.has(id) || !id) {
        id = base + '-' + n;
        n++;
      }
      el.id = id;
      usedIds.add(id);
    } else {
      usedIds.add(el.id);
    }
  });

  // 2. Find TOC block (Оглавление)
  let tocP = Array.from(doc.body.querySelectorAll('p')).find(p => /Оглавление[:：]?/i.test(p.textContent));
  if (tocP) {
    // Extract TOC items (split by <br> or \n)
    let raw = tocP.innerHTML.replace(/<strong>Оглавление[:：]?<\/strong>/i, '').trim();
    let items = raw.split(/<br\s*\/?>|\n/).map(s => s.trim()).filter(Boolean);
    // Find headings
    let allHeadings = Array.from(doc.body.querySelectorAll('h2, h3'));
    // Find headings after TOC block
    let headingsAfterToc = [];
    if (tocP) {
      let tocIndex = -1;
      let nodes = Array.from(doc.body.childNodes);
      for (let i = 0; i < nodes.length; i++) {
        if (nodes[i] === tocP) { tocIndex = i; break; }
      }
      if (tocIndex >= 0) {
        for (let i = tocIndex + 1; i < nodes.length; i++) {
          if (nodes[i].nodeType === 1 && (nodes[i].tagName === 'H2' || nodes[i].tagName === 'H3')) {
            headingsAfterToc.push(nodes[i]);
          }
        }
      }
    }
    let tocUl = doc.createElement('ul');
    tocUl.className = 'toc';
    let headingPtr = 0;
    items.forEach((item, idx) => {
      let li = doc.createElement('li');
      // Fuzzy match (normalize spaces/case)
      const normalize = s => (s||'').toLowerCase().replace(/\s+/g, ' ').trim();
      let found = allHeadings.find(h => {
        const hText = normalize(h.textContent);
        const iText = normalize(item);
        return hText.startsWith(iText) || iText.startsWith(hText);
      });
      // Fallback: sequentially assign to headingsAfterToc
      if (!found && headingsAfterToc.length > 0 && headingPtr < headingsAfterToc.length) {
        found = headingsAfterToc[headingPtr++];
      }
      if (found && found.id) {
        let a = doc.createElement('a');
        a.href = '#' + found.id;
        a.textContent = item;
        li.appendChild(a);
      } else {
        li.textContent = item;
      }
      tocUl.appendChild(li);
    });
    // Replace TOC block
    let strong = doc.createElement('p');
    strong.innerHTML = '<strong>Оглавление:</strong>';
    tocP.replaceWith(strong, tocUl);
  }

  return doc.body.innerHTML;
}
