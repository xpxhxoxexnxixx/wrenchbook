import json, math
INK="#1B1F24"; METAL="#8A8F98"; BG="#F9F9F5"; TEAL="#0E494D"; STEEL="#B5B9C0"; BAR="#1F4FD6"; COB="#0E5371"; YEL="#F2B600"; GOLD="#936700"; BRASS="#C89B3C"; DARK="#4A4F58"; PALE="#E6E8EB"; WHITE="#FFFFFF"
F='font-family="Plus Jakarta Sans, system-ui, sans-serif"'
W=600
texts=[]  # for the overlap checker: (x0,y0,x1,y1,label)
def reset(): texts.clear()
def _w(t,size): return len(t)*size*0.58
def T(x,y,t,size=11,w=600,anchor="start",fill=INK):
    tw=_w(t,size)
    x0 = x if anchor=="start" else (x-tw if anchor=="end" else x-tw/2)
    texts.append((x0,y-size*0.9,x0+tw,y+size*0.25,t))
    return f'<text x="{x}" y="{y}" text-anchor="{anchor}" fill="{fill}" font-size="{size}" font-weight="{w}" {F}>{t}</text>'
def LBL(x,y,lines,anchor="start",color=INK,size=10,gap=12):
    """stacked label: first line bold, rest regular teal"""
    out=""
    for i,l in enumerate(lines):
        out+=T(x,y+i*gap,l,size if i==0 else size-1, 700 if i==0 else 400, anchor, color if i==0 else TEAL)
    return out
def L(d,color=TEAL): return f'<path d="{d}" fill="none" stroke="{color}" stroke-width="1.5" stroke-dasharray="3 3"></path>'
def R(x,y,w,h,fill,rx=0,stroke=INK,sw=2): return f'<rect x="{x}" y="{y}" width="{w}" height="{h}" rx="{rx}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"></rect>'
def C(cx,cy,r,fill,stroke=INK,sw=2): return f'<circle cx="{cx}" cy="{cy}" r="{r}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}"></circle>'
def P(d,stroke=INK,sw=2,fill="none",extra=""): return f'<path d="{d}" fill="{fill}" stroke="{stroke}" stroke-width="{sw}" stroke-linecap="round" stroke-linejoin="round" {extra}></path>'
def svg(h,label,body,cap=None):
    cap_html = T(W/2,h-12,cap,10,700,"middle",TEAL) if cap else ""
    return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {h}" role="img" aria-label="{label}"><rect width="{W}" height="{h}" fill="{BG}"></rect>{body}{cap_html}</svg>'
def check(name,h):
    issues=[]
    for (x0,y0,x1,y1,t) in texts:
        if x0<6 or x1>W-6 or y0<2 or y1>h-2: issues.append(f"EDGE {name}: '{t}' ({x0:.0f},{x1:.0f})")
    for i in range(len(texts)):
        for j in range(i+1,len(texts)):
            a=texts[i]; b=texts[j]
            if a[0]<b[2]-2 and b[0]<a[2]-2 and a[1]<b[3]-2 and b[1]<a[3]-2: issues.append(f"OVERLAP {name}: '{a[4]}' × '{b[4]}'")
    return issues
