import copy, re, os, shutil
from lxml import etree
NS = {
 'w':'http://schemas.openxmlformats.org/wordprocessingml/2006/main',
 'r':'http://schemas.openxmlformats.org/officeDocument/2006/relationships',
 'wp':'http://schemas.openxmlformats.org/drawingml/2006/wordprocessingDrawing',
 'a':'http://schemas.openxmlformats.org/drawingml/2006/main',
 'pic':'http://schemas.openxmlformats.org/drawingml/2006/picture',
 'w14':'http://schemas.microsoft.com/office/word/2010/wordml',
}
W='{%s}'%NS['w']; R='{%s}'%NS['r']; WP='{%s}'%NS['wp']; A='{%s}'%NS['a']; W14='{%s}'%NS['w14']
XMLSPACE='{http://www.w3.org/XML/1998/namespace}space'

def ptext(e): return ''.join(t.text or '' for t in e.iter(W+'t'))

def text_nodes(p):
    # w:t nodes in document order (including those inside hyperlinks), skipping field instr
    return [t for t in p.iter(W+'t')]

def splice(p, s, e, new):
    """Replace characters [s,e) of paragraph text by `new`, preserving run formatting of the first touched node."""
    nodes = text_nodes(p); pos = 0; first = True
    for t in nodes:
        txt = t.text or ''; a, b = pos, pos + len(txt); pos = b
        if b <= s or a >= e and not (first and a == s == e):
            continue
        ls, le = max(s, a) - a, min(e, b) - a
        if first:
            t.text = txt[:ls] + new + txt[le:]; first = False
        else:
            t.text = txt[:ls] + txt[le:]
        t.set(XMLSPACE, 'preserve')
    return not first

def replace(el, old, new, count=0):
    """Run-aware literal replace in every paragraph under el. Returns #replacements."""
    n = 0
    paras = [el] if el.tag == W+'p' else list(el.iter(W+'p'))
    for p in paras:
        while True:
            full = ptext(p); i = full.find(old)
            if i < 0: break
            splice(p, i, i + len(old), new); n += 1
            if count and n >= count: return n
            if old in new: break
    return n

def rsub(p, pattern, fn):
    full = ptext(p); ms = list(re.finditer(pattern, full))
    for m in reversed(ms):
        rep = fn(m)
        if rep != m.group(0): splice(p, m.start(), m.end(), rep)
    return len(ms)

def strip_ids(e):
    for x in e.iter():
        for k in list(x.attrib):
            if k.startswith(W14) : del x.attrib[k]
    for bm in list(e.iter(W+'bookmarkStart')) + list(e.iter(W+'bookmarkEnd')):
        bm.getparent().remove(bm)
    for lr in list(e.iter(W+'lastRenderedPageBreak')): lr.getparent().remove(lr)
    return e

def set_text(p, text):
    """Keep first run's formatting, drop other runs, set text."""
    runs = [r for r in p.iter(W+'r') if r.find(W+'t') is not None]
    if not runs:
        r = etree.SubElement(p, W+'r'); t = etree.SubElement(r, W+'t')
    else:
        r = runs[0]
        for x in runs[1:]: x.getparent().remove(x)
        for t in r.findall(W+'t')[1:]: r.remove(t)
        t = r.find(W+'t')
    t.text = text; t.set(XMLSPACE, 'preserve')
    return p

def clone(tpl, text=None):
    e = strip_ids(copy.deepcopy(tpl))
    if text is not None and e.tag == W+'p': set_text(e, text)
    return e

def after(ref, *news):
    for n in news:
        ref.addnext(n); ref = n
    return ref

def cell_set(tc, text):
    ps = tc.findall(W+'p')
    for p in ps[1:]: tc.remove(p)
    set_text(ps[0], text)

def row_cells(tr): return tr.findall(W+'tc')

def row_set(tr, values):
    for tc, v in zip(row_cells(tr), values):
        if v is not None: cell_set(tc, v)
