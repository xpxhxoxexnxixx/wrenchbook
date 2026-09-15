import json
from drawkit import *
OUT={}
def bolt_v(d,x,y0,y1,w=6,name="bolt",head_down=True):
    d.rect(x-w/2,y0,w,y1-y0,fill=GOLD2,stroke=INK,sw=1.5,rx=1,name=name)
    if head_down: d.rect(x-w*1.6,y1,w*3.2,8,fill=GOLD,stroke=INK,sw=1.5,rx=1,name=name+"-head")
    else: d.rect(x-w*1.6,y0-8,w*3.2,8,fill=GOLD,stroke=INK,sw=1.5,rx=1,name=name+"-head")
def bolt_h(d,y,x0,x1,w=6,name="bolt"):
    d.rect(x0,y-w/2,x1-x0,w,fill=GOLD2,stroke=INK,sw=1.5,rx=1,name=name)
    d.rect(x0-8,y-w*1.6,8,w*3.2,fill=GOLD,stroke=INK,sw=1.5,rx=1,name=name+"-head")

# 1. Dogbone hero -----------------------------------------------------------
d=Draw(600,280,"Side view from under a Mk5: the cast dogbone arm runs from the bottom of the transmission case forward into the front subframe; one M14 bolt passes up through the big voided bushing at the subframe, two M10 bolts fasten the small end and its front bracket into the transmission case")
d.rect(40,70,190,130,fill=G3,stroke=INK,sw=2,rx=8,name="trans"); d.text(135,125,"transmission",size=11,weight=700,fill=WHITE,on="trans"); d.text(135,139,"underside of the case",size=9,weight=400,fill=WHITE,on="trans")
d.rect(430,120,140,80,fill=G2,stroke=INK,sw=2,rx=6,name="subframe"); d.text(542,192,"subframe",size=9,weight=700,fill=WHITE,on="subframe")
d.rect(215,142,270,26,fill=G1,stroke=INK,sw=2,rx=6,name="arm"); d.text(350,159,"dogbone / pendulum arm",size=9,weight=700,fill=INK,on="arm")
# big bushing in the subframe end
d.circle(480,155,26,fill=G2,stroke=INK,sw=2,name="bush-big"); d.circle(480,155,16,fill=WHITE,stroke=INK,sw=1.5,name="bush-void"); d.circle(480,155,7,fill=INK,stroke=INK,sw=1,name="sleeve")
bolt_v(d,480,110,204,w=7,name="m14")
# small end bushing and front bracket, both into the transmission case
d.circle(240,155,11,fill=G2,stroke=INK,sw=1.5,name="bush-small")
bolt_v(d,240,100,198,w=5,name="m10a")
d.rect(200,160,30,14,fill=G3,stroke=INK,sw=1.5,rx=2,name="bracket")
bolt_v(d,214,96,190,w=5,name="m10b")
d.label(480,42,["M14 · 21 mm head","100 Nm + 90° · through the voided bushing"]); d.leader(480,74,480,100)
d.label(227,42,["2× M10 · 16 mm head","40 Nm + 90° · into the transmission case"],anchor="middle"); d.leader(227,62,227,68)
d.text(300,236,"one bolt at the subframe, two at the transmission · nothing needs supporting while it's out",size=9,weight=400,fill=TEAL)
d.arrow(400,262,470,262,stroke=INK,sw=2,name="front-arrow"); d.text(392,266,"FRONT",size=9,weight=700,fill=INK,anchor="end")
OUT['dogbone-hero']=d

# 2. Dogbone insert cross-section ------------------------------------------------
d=Draw(600,250,"Cross-section of the dogbone's subframe bushing: a rubber ring around a steel sleeve with two voids; on the right the same bushing with an insert filling the front void so the arm cannot swing forward")
for cx,title,filled in ((150,"factory bushing",False),(450,"with insert",True)):
    d.circle(cx,125,68,fill=G2,stroke=INK,sw=2,name=f"rubber{cx}")
    d.ellipse(cx-36,125,16,30,fill=BG,stroke=INK,sw=1.5,name=f"rear-void{cx}")
    if filled: d.ellipse(cx+36,125,16,30,fill=G3,stroke=INK,sw=1.5,name=f"insert{cx}")
    else: d.ellipse(cx+36,125,16,30,fill=BG,stroke=INK,sw=1.5,name=f"front-void{cx}")
    d.circle(cx,125,13,fill=INK,stroke=INK,sw=1,name=f"sleeve{cx}")
    d.text(cx,34,title,size=11,weight=700,fill=TEAL2)
d.text(114,222,"rear void",size=9,weight=400,fill=TEAL); d.leader(114,214,114,158)
d.text(190,222,"front void",size=9,weight=400,fill=TEAL); d.leader(190,214,190,158)
d.text(486,222,"insert fills the front void",size=9,weight=400,fill=TEAL); d.leader(486,214,486,158)
d.text(300,110,"steel sleeve",size=9,weight=400,fill=TEAL); d.leader(263,114,163,124)
d.text(300,124,"M14 bolt runs",size=9,weight=400,fill=TEAL); d.text(300,136,"through it",size=9,weight=400,fill=TEAL)
d.text(300,16,"early (built to mid-2008) and late (2009 on) bushings differ · two insert part numbers",size=9,weight=400,fill=TEAL)
d.arrow(300,236,370,236,stroke=INK,sw=2,name="front-arrow"); d.text(292,240,"FRONT",size=9,weight=700,fill=INK,anchor="end")
OUT['dogbone-insert']=d

# 3. Engine bay plan -------------------------------------------------------------
d=Draw(600,300,"Plan view of a Mk5 engine bay from above, front of the car at the top: the engine on the right with its hydraulic mount on the passenger frame rail behind the reservoirs, the transmission on the left with its mount on the driver rail under the battery tray, and the dogbone under the front of the transmission reaching to the subframe")
d.text(300,28,"front of the car",size=9,weight=700,fill=INK)
d.rect(40,40,520,220,fill=LIGHT,stroke=INK,sw=2,rx=8,name="bay",region=True)
d.rect(40,40,18,220,fill=G2,stroke=INK,sw=1.5,rx=2,name="rail-l"); d.rect(542,40,18,220,fill=G2,stroke=INK,sw=1.5,rx=2,name="rail-r")
d.rect(300,90,180,130,fill=G3,stroke=INK,sw=2,rx=10,name="engine"); d.text(390,150,"engine",size=12,weight=700,fill=WHITE,on="engine"); d.text(390,166,"2.0T",size=9,weight=400,fill=WHITE,on="engine")
d.rect(130,100,170,110,fill=G2,stroke=INK,sw=2,rx=10,name="trans"); d.text(215,150,"transmission",size=11,weight=700,fill=WHITE,on="trans")
# mounts
d.rect(480,130,62,44,fill=G1,stroke=INK,sw=2,rx=4,name="eng-mount"); d.text(511,156,"mount",size=9,weight=700,fill=INK,on="eng-mount")
d.rect(58,130,72,44,fill=G1,stroke=INK,sw=2,rx=4,name="trans-mount"); d.text(94,156,"mount",size=9,weight=700,fill=INK,on="trans-mount")
d.rect(190,52,80,20,fill=G1,stroke=INK,sw=2,rx=5,name="dogbone"); d.text(230,66,"dogbone",size=9,weight=700,fill=INK,on="dogbone")
# things that sit over the mounts
d.rect(470,84,84,40,fill="none",stroke=G3,sw=1.5,rx=4,dash="4 4",name="reservoirs")
d.rect(48,84,100,40,fill="none",stroke=G3,sw=1.5,rx=4,dash="4 4",name="battery")
d.text(300,292,"three mounts: two carry the weight, the dogbone stops the engine rotating under torque",size=9,weight=400,fill=TEAL)
d.text(480,276,"engine mount · hydraulic",size=9,weight=700,fill=TEAL2); d.leader(480,266,511,176)
d.text(120,276,"transmission mount · rubber",size=9,weight=700,fill=TEAL2); d.leader(120,266,94,176)
d.text(512,100,"reservoirs",size=8,weight=400,fill=G3,on="reservoirs"); d.text(512,112,"sit over it",size=8,weight=400,fill=G3,on="reservoirs")
d.text(98,100,"battery tray",size=8,weight=400,fill=G3,on="battery"); d.text(98,112,"sits over it",size=8,weight=400,fill=G3,on="battery")
OUT['engine-mounts-hero']=d

# 4. Engine mount detail -------------------------------------------------------
d=Draw(600,300,"Passenger-side engine mount seen from the front: the cast bracket on the block reaches over to the mount, which sits against the frame rail; two M12 bolts drop through the bracket into the mount, two M10 bolts go sideways from the mount into the rail, a short M8 side brace ties the mount to the rail, and a floor jack with a wood block supports the end of the oil pan below")
d.rect(470,70,60,200,fill=G2,stroke=INK,sw=2,rx=4,name="rail"); d.text(500,266,"frame rail",size=9,weight=700,fill=WHITE,on="rail")
d.rect(40,80,120,150,fill=G3,stroke=INK,sw=2,rx=8,name="block"); d.text(100,158,"engine",size=11,weight=700,fill=WHITE,on="block")
d.rect(160,118,250,34,fill=G3,stroke=INK,sw=2,rx=6,name="bracket"); d.text(250,140,"engine bracket",size=9,weight=700,fill=WHITE,on="bracket")
d.rect(340,152,130,78,fill=G1,stroke=INK,sw=2,rx=8,name="mount"); d.text(405,192,"mount",size=10,weight=700,fill=INK,on="mount"); d.text(405,206,"hydraulic",size=8,weight=400,fill=INK,on="mount")
bolt_v(d,365,90,170,w=7,name="m12a",head_down=False); bolt_v(d,405,90,170,w=7,name="m12b",head_down=False)
bolt_h(d,176,462,500,w=6,name="m10a"); bolt_h(d,208,462,500,w=6,name="m10b")
d.rect(430,104,40,8,fill=G3,stroke=INK,sw=1.5,rx=2,name="brace"); d.rect(455,100,10,16,fill=GOLD,stroke=INK,sw=1.5,rx=1,name="m8")
d.rect(60,232,220,22,fill=G2,stroke=INK,sw=2,rx=4,name="pan"); d.text(170,247,"oil pan",size=9,weight=700,fill=INK,on="pan")
d.rect(200,254,70,14,fill=INK,stroke=INK,sw=1,rx=2,name="wood"); d.rect(210,268,50,12,fill=G3,stroke=INK,sw=1.5,rx=2,name="jack")
d.label(370,42,["2× M12 through the bracket · 18 mm","60 Nm + 90°"]); d.leader(370,66,385,80)
d.text(596,40,"2× M10 into the rail",size=9,weight=700,fill=TEAL2,anchor="end"); d.text(596,52,"16 mm · 40 Nm + 90°",size=9,weight=400,fill=TEAL,anchor="end"); d.leader(560,58,540,168)
d.text(300,68,"side brace 2× M8 · 13 mm · 20 Nm + 90°",size=9,weight=400,fill=TEAL); d.leader(392,74,440,102)
d.text(330,294,"jack + wood under the END of the pan, not the middle · just touching, never under it yourself",size=9,weight=400,fill=TEAL)
OUT['engine-mount-detail']=d

# 5. Transmission mount detail --------------------------------------------------
d=Draw(600,300,"Driver-side transmission mount seen from the front with the battery tray removed: the bracket on the transmission reaches over to the mount on the frame rail; three M12 bolts drop through the bracket into the mount, four M10 bolts go sideways from the mount into the rail under the lifted wiring channel, and a floor jack with a wood block supports the transmission case")
d.rect(70,70,60,200,fill=G2,stroke=INK,sw=2,rx=4,name="rail"); d.text(100,266,"frame rail",size=9,weight=700,fill=WHITE,on="rail")
d.rect(440,80,120,160,fill=G3,stroke=INK,sw=2,rx=8,name="case"); d.text(500,160,"transmission",size=10,weight=700,fill=WHITE,on="case")
d.rect(190,118,250,34,fill=G3,stroke=INK,sw=2,rx=6,name="bracket"); d.text(345,140,"transmission bracket",size=9,weight=700,fill=WHITE,on="bracket")
d.rect(130,152,140,84,fill=G1,stroke=INK,sw=2,rx=8,name="mount"); d.text(200,200,"mount",size=10,weight=700,fill=INK,on="mount"); d.text(200,214,"rubber, voided",size=8,weight=400,fill=INK,on="mount")
for x in (165,200,235): bolt_v(d,x,90,170,w=7,name=f"m12-{x}",head_down=False)
for y in (168,186,204,222): d.rect(100,y-3,38,6,fill=GOLD2,stroke=INK,sw=1.5,rx=1,name=f"m10-{y}"); d.rect(138,y-6,6,12,fill=GOLD,stroke=INK,sw=1.5,rx=1,name=f"m10h-{y}")
d.rect(140,60,150,16,fill="none",stroke=G3,sw=1.5,rx=4,dash="4 4",name="channel"); d.text(215,72,"wiring channel (lifted)",size=8,weight=400,fill=G3,on="channel")
d.rect(450,244,90,14,fill=INK,stroke=INK,sw=1,rx=2,name="wood"); d.rect(470,258,50,14,fill=G3,stroke=INK,sw=1.5,rx=2,name="jack")
d.label(330,30,["3× M12 through the bracket · 18 mm","60 Nm + 90°"]); d.leader(300,54,240,80)
d.text(40,40,"4× M10 into the rail",size=9,weight=700,fill=TEAL2,anchor="start"); d.text(40,52,"16 mm · 40 Nm + 90°",size=9,weight=400,fill=TEAL,anchor="start"); d.leader(100,58,100,164)
d.text(350,254,"jack + wood under the case",size=9,weight=400,fill=TEAL); d.leader(418,256,450,251)
d.text(300,290,"body bolts to torque first, then the three bracket bolts (ECS) · battery and tray are out of the picture",size=9,weight=400,fill=TEAL)
OUT['trans-mount-detail']=d

bad=0; svgs={}
for k,dd in OUT.items():
    p=dd.check(); print(k,"OK" if not p else p); bad+=len(p); svgs[k]=dd.svg()
json.dump(svgs,open('new_svgs_mounts.json','w'),ensure_ascii=False); print("problems:",bad)
