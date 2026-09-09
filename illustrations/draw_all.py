import json, math
from svgkit import *
OUT={}; ISSUES=[]
def build(name,h,label,body,cap=None):
    OUT[name]=svg(h,label,body,cap); ISSUES.extend(check(name,h)); reset()

# ---------- hero: cam follower cutaway
reset(); b=""
b+=R(190,20,120,70,METAL,8)+T(250,62,"HPFP",14,800,"middle",WHITE)
b+=R(240,90,20,60,STEEL)
b+=P("M215 130 V172 H285 V130",INK,6)
# egg cam
b+=P("M250 178 C 282 178, 292 214, 292 232 A 42 42 0 1 1 208 232 C 208 214, 218 178, 250 178 Z",INK,2,DARK)+C(250,232,8,METAL,INK,1.5)
b+=f'<ellipse cx="250" cy="176" rx="14" ry="4" fill="{BAR}"></ellipse>'
b+=L("M262 118 H370")+LBL(380,121,["Pump piston"])
b+=L("M288 150 H370")+LBL(380,150,["Cam follower","the sacrificial cup"])
b+=L("M292 232 H370")+LBL(380,235,["Intake cam lobe","rotates against the cup"])
b+=L("M236 176 H180")+LBL(170,172,["Wear happens here"],"end",BAR)+T(170,185,"the cup's face",9,400,"end",TEAL)
b+=P("M305 250 A 60 60 0 0 0 300 205",TEAL,2)+P("M300 205 l-6 8 l9 1 z",TEAL,1,TEAL)
build("hero",300,"Cutaway: fuel pump piston pressing on the cup-shaped follower, which rides on the camshaft lobe",b,"The cup is designed to wear so the cam does not. When the cup is gone, the cam goes next.")

# ---------- banjo
reset(); b=""
b+=R(270,20,140,70,METAL,8)+T(340,60,"HPFP · underside",11,800,"middle",WHITE)
b+=R(410,44,160,12,STEEL,0,INK,1.5)+R(414,36,32,28,BRASS,3,INK,1.5)
b+=R(220,132,90,12,STEEL,0,INK,1.5)
b+=C(320,138,22,BRASS)+R(310,90,20,20,BRASS,0,INK,1.5)+C(320,138,8,INK)
b+=R(313,160,14,38,DARK,0,INK,1.5)+R(313,166,14,10,YEL,0,YEL,0)
b+=R(320,186,120,16,METAL,3)+C(320,194,14,"none",INK,6)
b+=L("M430 64 V76 H460")+LBL(464,79,["17mm collar","already loosened"])
b+=L("M220 138 H190")+LBL(184,135,["Low-pressure line","into the banjo eye"],"end")
b+=L("M342 138 H380 V110 H460")+LBL(464,107,["Banjo eye","threads into brass"])
b+=L("M313 178 H190")+LBL(184,175,["Stubby M8 triple-square","tape it into the wrench"],"end")
b+=L("M400 194 H470")+LBL(474,197,["13mm box wrench","on the bit's shank"],"start",COB)
b+=T(474,222,"slow, small turns",9,700,"start",TEAL)
build("banjo",270,"Underside of the pump: banjo bolt on the low-pressure line, stubby triple-square bit in its head, box wrench on the bit",b,"The bolt is fine-threaded into brass. Small turns, re-oil, and stop if the bit starts to walk out.")

# ---------- lobe: flank vs nose + bolt order
reset(); b=""
def spring(x,y,h,n=5):
    seg=h/n; d=f"M{x} {y}"
    for i in range(n): d+=f" l10 {seg/2} l-20 {seg/2} l10 0"
    return P(d,INK,2)
def egg(cx,cy,r,rot):
    return f'<g transform="rotate({rot} {cx} {cy})">'+P(f"M{cx} {cy-r-12} C {cx+r*0.75} {cy-r-12}, {cx+r} {cy-r*0.45}, {cx+r} {cy} A {r} {r} 0 1 1 {cx-r} {cy} C {cx-r} {cy-r*0.45}, {cx-r*0.75} {cy-r-12}, {cx} {cy-r-12} Z",INK,2,DARK)+C(cx,cy,r*0.2,METAL,INK,1.5)+'</g>'
b+=T(140,24,"Lobe on the flank",13,800,"middle",BAR)+T(140,39,"pump seats easily",10,400,"middle",TEAL)
b+=spring(140,54,46)+R(130,100,20,28,STEEL)+P("M105 112 V146 H175 V112",INK,6)+egg(140,190,30,-90)
b+=P("M280 20 V230",METAL,1,"none",'stroke-dasharray="4 4"')
b+=T(420,24,"Lobe on the nose",13,800,"middle")+T(420,39,"spring fully compressed, bolts under load",10,400,"middle",GOLD)
b+=spring(420,54,22)+R(410,76,20,28,STEEL)+P("M385 88 V122 H455 V88",INK,6)+egg(420,190,30,0)
b+=P("M20 244 H540",METAL,1)
b+=T(20,268,"Three bolts. Alternate, a little at a time, in this order:",11,700)
b+=C(70,318,26,METAL)+C(70,318,10,INK)
for (x,y,n) in [(70,292,"1"),(92,332,"2"),(48,332,"3")]: b+=C(x,y,7,COB,INK,1)+T(x,y+3,n,9,800,"middle",WHITE)
b+=T(120,312,"Snug 1 → 2 → 3, then go around again",11,600)+T(120,328,"Final torque 10 Nm each. Never fully tighten one while the others are loose.",10,400,"start",TEAL)
build("lobe",356,"Cam lobe on its flank makes the pump easy to seat; on its nose the spring is compressed. Below, tighten the three bolts alternately.",b)

# ---------- wear: three followers
reset(); b=""
for (x,l,t,c) in [(110,"A","Coating intact",INK),(280,"B","Silver in the centre",INK),(450,"C","Worn through",COB)]:
    b+=C(x,90,48,INK,"#000")+P(f"M{x-32} 66 A 40 40 0 0 1 {x+6} 44","#3A3F48",4)
    b+=T(x,166,l,20,900,"middle",c)+T(x,186,t,11,600,"middle",TEAL)
b+=f'<ellipse cx="280" cy="90" rx="22" ry="15" fill="{STEEL}"></ellipse><ellipse cx="276" cy="87" rx="10" ry="5" fill="#E2E4E8"></ellipse>'
b+=f'<ellipse cx="450" cy="92" rx="30" ry="22" fill="{STEEL}"></ellipse><ellipse cx="450" cy="94" rx="16" ry="10" fill="{BG}" stroke="#6B7078" stroke-width="2"></ellipse>'+P("M432 76 L420 60 M468 80 L482 66 M454 114 L460 128","#6B7078",2)
build("wear",206,"Three followers face-on: intact coating, coating worn through in the centre, worn through with a hole",b)

# ---------- bits
reset(); b=""
g='<g transform="translate(150 80)">'+C(0,0,26,INK,INK,0)
for a in range(0,360,60): g+=C(24*math.cos(math.radians(a)),24*math.sin(math.radians(a)),11,INK,INK,0)
for a in range(30,360,60): g+=C(30*math.cos(math.radians(a)),30*math.sin(math.radians(a)),8,BG,BG,0)
b+=g+'</g>'
b+=T(150,138,"T30 Torx",13,800,"middle")+T(150,154,"6 rounded lobes · pump bolts",10,400,"middle",TEAL)
b+='<g transform="translate(410 80)">'+''.join(f'<rect x="-26" y="-26" width="52" height="52" fill="{INK}" transform="rotate({a})"></rect>' for a in (0,30,60))+'</g>'
b+=T(410,138,"M8 triple-square (XZN)",13,800,"middle")+T(410,154,"12 sharp points · banjo bolt",10,400,"middle",TEAL)
b+=T(280,84,"not the same",12,700,"middle",COB)
build("bits",176,"A six-lobed Torx bit compared with a twelve-point triple-square bit",b)

# ---------- rsbhero
reset(); b=""
b+=R(120,40,320,40,METAL,4)+T(280,65,"Rear subframe",12,700,"middle",WHITE)
b+=R(70,60,26,130,STEEL,4)+R(464,60,26,130,STEEL,4)
b+=T(83,208,"trailing arm",9,600,"middle",TEAL)+T(477,208,"trailing arm",9,600,"middle",TEAL)
b+=P("M110 160 L130 160 Q140 160 145 140 L150 110 L410 110 L415 140 Q420 160 430 160 L450 160",BAR,12)
b+=R(190,94,34,32,INK,3)+R(336,94,34,32,INK,3)
b+=P("M106 160 L90 120",INK,6)+P("M454 160 L470 120",INK,6)
b+=L("M207 128 V212")+LBL(207,226,["Bracket + bushing","2 bolts, 10mm triple-square"],"middle")
b+=L("M280 110 V28 H300")+LBL(304,25,["Sway bar","stock 21.7mm; upgrades 24–27mm"],"start",BAR)
b+=L("M98 140 H150 V184 H360")+LBL(364,187,["End link","16mm nut, 6mm stud"])
build("rsbhero",264,"View from under the rear of the car: sway bar in two subframe brackets, an end link to each trailing arm",b,"The exhaust runs between the brackets, which is why the bar has to rotate out.")

# ---------- endlink (rear sway bar guide)
reset(); b=""
b+=R(200,26,120,26,BAR,4,BAR,0)+T(260,44,"bar arm",11,800,"middle",WHITE)
b+=R(252,52,16,70,STEEL)+P("M240 76 h40 l6 10 l-6 10 h-40 l-6 -10 z",INK,2,METAL)
b+=R(180,78,60,16,METAL,3)
b+=R(256,122,8,40,DARK,0,INK,1.5)+R(250,162,20,24,INK,3,INK,0)+T(260,203,"6mm",9,600,"middle",TEAL)
b+=P("M150 130 A 40 40 0 0 0 180 110",BAR,2.5)+P("M180 110 l-8 2 l4 7 z",BAR,1,BAR)
b+=L("M210 86 H130")+LBL(124,83,["16mm wrench","this turns"],"end",BAR)
b+=L("M286 86 H370")+LBL(374,89,["End-link stud + nut","new self-locking nut"])
b+=L("M272 150 H370")+LBL(374,153,["6mm triple-square","holds the stud still; never turns"])
build("endlink",220,"End-link stud held still with a small triple-square bit while a 16mm wrench turns the nut",b)

# ---------- setting (two-hole bar)
reset(); b=""
b+=P("M60 70 H320 L420 70",BAR,14)+R(330,56,160,28,BAR,6,BAR,0)
b+=C(380,70,7,BG)+C(450,70,7,BG)
b+=P("M170 70 V172",METAL,1,"none",'stroke-dasharray="4 4"')+T(170,186,"pivot (bushing)",9,600,"middle",TEAL)
b+=T(380,40,"soft",11,800,"middle")+T(450,40,"stiff",11,800,"middle")
b+=P("M170 106 H450",INK,1.5)+P("M170 100 v12 M450 100 v12",INK,1.5)+T(310,124,"Forward hole · longer lever · softer (about 2× stock on a 25mm bar)",10,600,"middle")
b+=P("M170 142 H380",INK,1.5)+P("M170 136 v12 M380 136 v12",INK,1.5)+T(275,158,"Rearward hole · shorter lever · stiffer (about 2.5× stock)",10,600,"middle")
b+=T(540,190,"toward the rear of the car →",9,600,"end",TEAL)
build("setting",222,"End of an adjustable sway bar with two holes: forward is a longer lever and softer, rearward a shorter lever and stiffer",b)

# ---------- fsb-drop
reset(); b=""
b+=R(120,20,420,26,STEEL)+T(330,38,"Body / chassis rail",11,700,"middle",WHITE)
b+=P("M180 46 V70 M480 46 V70",INK,3,"none",'stroke-dasharray="6 4"')
b+=R(260,82,140,30,METAL,6)+T(330,102,"Steering rack",11,700,"middle",WHITE)+C(280,114,4,INK)+C(380,114,4,INK)
b+=R(150,158,360,40,STEEL,8)+T(330,183,"Subframe, lowered about 4 in.",11,700,"middle")
b+=R(300,198,60,28,DARK)+R(280,226,100,14,INK,3,INK,0)
b+=P("M170 132 H490",BAR,12)+R(220,122,24,20,INK,3)+R(416,122,24,20,INK,3)
b+=L("M492 132 H520")+LBL(524,129,["Sway bar","in the gap"],"start",BAR)
b+=L("M280 118 H230 V146 H160")+LBL(154,149,["Dowel pins","rack lifts off"],"end")
b+=L("M180 58 H140")+LBL(134,55,["Bolts out","marks made first"],"end")
b+=T(330,258,"jack + board",10,600,"middle",TEAL)
build("fsb-drop",274,"Side view: body above, subframe lowered on a jack, steering rack off its dowels, sway bar in the gap between them",b)

# ---------- fsb-bolts
reset(); b=""
b+=T(280,22,"FRONT OF CAR ↑",10,700,"middle",TEAL)
b+=P("M100 50 H460 L440 250 H120 Z",INK,2,STEEL)+P("M100 50 H460 L440 250 H120 Z",YEL,2,"none",'stroke-dasharray="6 4"')
b+=R(200,120,160,24,METAL,4,INK,1.5)+T(280,137,"steering rack",10,700,"middle",WHITE)
b+=P("M130 170 H430",BAR,8)
def bolt(x,y,n,c): return C(x,y,10,c,INK,1.5)+T(x,y+4,n,10,800,"middle",WHITE)
b+=bolt(120,64,"4",COB)+bolt(440,64,"4",COB)+bolt(140,232,"5",COB)+bolt(420,232,"5",COB)+bolt(112,210,"1",TEAL)+bolt(448,210,"1",TEAL)
b+=bolt(220,112,"2",METAL)+bolt(340,112,"2",METAL)+bolt(220,150,"2",METAL)+bolt(340,150,"2",METAL)+bolt(170,170,"3",BAR)+bolt(390,170,"3",BAR)
b+=T(470,246,"paint marks",9,600,"start",GOLD)
b+=T(20,278,"1  rear control-arm bolts    2  rack bolts (seat on dowels first)    3  sway-bar brackets",10,600)
b+=T(20,294,"4  forward subframe bolts    5  long rear subframe bolts",10,600)
b+=T(20,316,"Start all by hand → align to the paint marks → torque + angle, rack and subframe last.",10,700,"start",TEAL)
build("fsb-bolts",330,"Top view of the subframe showing bolt groups and the order to start and torque them",b)

# ---------- fsb-endlink
reset(); b=""
b+=R(360,20,40,190,METAL,6)+T(380,120,"strut",10,700,"middle",WHITE)
b+=R(332,60,30,16,STEEL,0,INK,1.5)
b+=P("M60 180 H180",BAR,12)
b+=P("M180 178 L336 70",INK,10)+C(180,178,14,DARK)+C(336,70,14,DARK)
b+=P("M180 178 H220",STEEL,8)+P("M216 170 h16 l6 8 l-6 8 h-16 z",INK,1.5,METAL)+R(244,173,60,10,METAL,0,INK,1.5)
b+=R(142,174,30,8,DARK,0,INK,1)+R(126,170,16,16,INK,2,INK,0)
b+=L("M134 168 V134")+LBL(134,128,["6mm triple-square","holds the stud"],"middle",COB)
b+=L("M274 184 V212")+LBL(274,226,["18mm (front) / 16mm (rear) · turns the nut"],"middle")
b+=L("M336 56 V30 H350")+LBL(346,33,["boot torn = replace link"],"end")
b+=P("M410 160 A 40 40 0 0 1 440 128",TEAL,2)+P("M440 128 l-8 2 l4 7 z",TEAL,1,TEAL)+T(452,134,"nut turns",10,700,"start",TEAL)
b+=T(120,212,"sway bar end",10,700,"middle",BAR)
build("fsb-endlink",250,"An end link joining the sway bar to the strut bracket; a triple-square bit holds the stud while a wrench turns the nut",b)

# ---------- airbox-bay
reset(); b=""
b+=T(280,20,"FRONT OF CAR (radiator) ↑",10,700,"middle",TEAL)
b+=R(60,32,440,220,PALE,18,INK,1.5)+R(60,32,440,14,STEEL,6,STEEL,0)
b+=R(76,64,70,120,STEEL,8,INK,1.5)+T(111,128,"battery",10,700,"middle")
b+=R(180,72,220,120,METAL,14)+T(290,126,"ENGINE COVER",13,800,"middle",WHITE)+T(290,142,"= the airbox",11,500,"middle","#F1FAFF")
b+=P("M180 104 H160 Q150 104 150 94 V54",INK,10)+P("M180 104 H160 Q150 104 150 94 V54",STEEL,6)
b+=P("M400 156 H430 Q440 156 440 166 V206",INK,12)+P("M400 156 H430 Q440 156 440 166 V206",DARK,8)
b+=C(440,212,14,DARK)+T(440,216,"turbo",7,700,"middle",WHITE)
b+=R(392,146,16,20,BAR,3,BAR,0)
b+=C(195,84,4,INK)+C(385,84,4,INK)+C(195,180,4,INK)+C(385,180,4,INK)
b+=L("M150 60 H126 V50 H58")+LBL(54,47,["snorkel","2 screws"],"end")
b+=L("M400 146 V128 H430")+LBL(434,125,["MAF sensor","unplug first"],"start",BAR)
b+=L("M424 180 V196 H380")+LBL(376,199,["inlet pipe · 2 clips"],"end")
b+=L("M195 184 V222 H180")+LBL(176,225,["4 grommets","pull straight up"],"end")
build("airbox-bay",278,"Top-down view of the engine bay: the engine cover is the airbox, fed by a snorkel from the front-left and feeding the turbo inlet at the rear",b,"The filter is inside the cover. Nothing else has to come off.")

# ---------- airbox exploded
reset(); b=""
b+=R(160,30,240,50,METAL,12)+T(280,60,"Engine cover · top half",11,700,"middle",WHITE)
b+=R(120,45,40,18,STEEL,4,INK,1.5)+C(130,70,3,INK)+C(150,70,3,INK)
b+=L("M140 74 V92")+LBL(140,104,["2× T20/T25","snorkel screws"],"middle")
b+=R(400,45,50,20,STEEL,4,INK,1.5)+P("M410 70 v6 M440 70 v6",INK,3)
b+=L("M425 80 V92")+LBL(425,104,["2 clips + MAF plug","to the turbo inlet"],"middle")
b+=R(170,126,220,26,WHITE,3,INK,1.5)+P(" ".join(f"M{x} 126 v26" for x in range(174,390,10)),METAL,1)
b+=L("M390 139 H430")+LBL(434,136,["filter","seal edge in the groove"],"start",BAR)
b+=R(160,166,240,40,METAL,12)+T(280,191,"bottom half",11,700,"middle",WHITE)
for x in range(172,392,28): b+=C(x,166,3,INK)
b+=L("M120 166 H160")+LBL(114,169,["8× Phillips"],"end")
for x in (180,240,320,380): b+=C(x,228,7,DARK,INK,1.5)
build("airbox",264,"Exploded view of the engine cover airbox: snorkel screws, inlet clips, filter, screws, grommets",b,"4 rubber grommets on the engine studs — pull the cover straight up.")

# ---------- intake-hero
reset(); b=""
b+=T(280,20,"FRONT OF CAR (radiator) ↑",10,700,"middle",TEAL)
b+=R(60,32,440,220,PALE,18,INK,1.5)+R(60,32,440,14,STEEL,6,STEEL,0)
b+=R(76,64,70,120,STEEL,8,INK,1.5)+T(111,128,"battery",10,700,"middle")
b+=R(190,72,220,120,"#D9DCE0",14,INK,1.5)+T(300,136,"engine (cover removed)",10,600,"middle",TEAL)
b+=R(150,116,30,72,STEEL,6)+P("M150 130 L124 152 L150 174 Z",INK,1.5,METAL)+R(100,140,34,32,DARK,0,INK,1.5)
b+=P("M180 152 H370 Q400 152 410 172 V204",INK,14)+P("M180 152 H370 Q400 152 410 172 V204",STEEL,9)
b+=R(250,142,20,20,BAR,3,BAR,0)+C(410,212,14,DARK)+T(410,216,"turbo",7,700,"middle",WHITE)+R(396,186,28,12,"#0B4664",4,"#0B4664",0)
b+=C(320,164,4,INK)+P("M320 164 V180",INK,2)
b+=L("M260 140 V96 H300")+LBL(304,93,["Factory MAF, moved to the new pipe","pipe bore matches the sensor"],"start",BAR)
b+=L("M424 192 H470")+LBL(474,189,["Silicone coupler","onto the turbo inlet"],"start")
b+=L("M320 182 V222 H300")+LBL(296,225,["isolator stud → vacuum-pump bracket"],"end")
b+=L("M165 190 V246 H190")+LBL(194,249,["heat shield on the battery-tray posts, filter inside"],"start")
build("intake-hero",292,"Top-down engine bay after an aftermarket intake: filter under a heat shield on the battery tray, pipe with the MAF sensor to the turbo inlet",b,"Every clamp stays loose until the whole run sits relaxed.")

# ---------- downpipe-hero
reset(); b=""
b+=T(40,24,"FRONT →",10,700,"start",TEAL)
b+=R(50,50,80,60,DARK,8)+T(90,84,"turbo",10,700,"middle",WHITE)+R(130,62,14,40,METAL,0,INK,1.5)
for (x,y) in [(137,68),(137,96),(123,68),(123,96)]: b+=C(x,y,3,INK,INK,0)
path="M144 82 H176 Q198 82 208 106 L226 140 Q236 160 262 160 H470"
b+=P(path,INK,16)+P(path,STEEL,11)+P("M182 86 L204 122",INK,11,"none",'stroke-dasharray="3 3"')
b+=R(250,148,64,24,BRASS,6,INK,1.5)+T(282,164,"cat",9,800,"middle",WHITE)
b+=C(166,74,5,BAR,BAR,0)+C(350,152,5,BAR,BAR,0)
b+=R(380,170,10,30,METAL,0,INK,1.5)+R(366,198,40,8,INK,0,INK,0)
b+=R(446,150,30,20,"none",2,INK,2)
b+=P("M320 214 H420",METAL,6)+P("M150 214 H240",METAL,6)
b+=L("M130 50 V34 H160")+LBL(164,31,["4 flange nuts · 16mm","soak them overnight"])
b+=L("M166 70 V90 H150 V114")+LBL(150,126,["O2 (front)"],"middle",BAR)
b+=L("M200 118 L175 150")+LBL(175,164,["flex"],"middle")
b+=L("M350 146 V120 H380")+LBL(384,117,["O2 sensor (rear)"],"start",BAR)
b+=L("M385 206 V226 H420")+LBL(424,229,["bracket → crossmember","2× 13mm"],"start")
b+=L("M461 148 V126 H490")+LBL(494,123,["slip joint","to the cat-back"])
b+=T(195,240,"chassis braces (come off)",9,600,"middle",TEAL)
build("downpipe-hero",256,"Side view of the downpipe from the turbo flange through the flex and catalyst to the crossmember bracket and the slip joint",b)

# ---------- catback-hero
reset(); b=""
b+=T(40,24,"FRONT →",10,700,"start",TEAL)
b+=R(30,40,500,180,PALE,10,INK,1.5)
b+=R(80,50,12,160,STEEL,0,INK,1)+T(86,236,"brace",8,600,"middle",TEAL)
b+=R(230,56,110,60,STEEL,8,INK,1.5)+T(285,91,"fuel tank",9,700,"middle")
b+=R(470,50,12,160,STEEL,0,INK,1)+T(476,236,"crossmember",8,600,"middle",TEAL)
path="M40 170 H150 Q180 170 190 160 L230 150 H330 Q360 150 370 170 H440"
b+=P(path,INK,12)+P(path,STEEL,8)
b+=R(430,152,60,36,METAL,10)+T(460,174,"muffler",9,700,"middle",WHITE)
b+=P("M490 162 L515 150 M490 178 L515 190",INK,8)
b+=R(44,164,14,12,INK,2,INK,0)
for (x,y) in [(140,170),(250,150),(320,150),(440,152),(485,152)]:
    b+=P(f"M{x} {y-12} l-3 -12",INK,2)+C(x-3,y-24,4,YEL,INK,1.5)
b+=L("M51 160 V130 H90")+LBL(94,127,["slip joint / adapter","stock downpipe: use the reducer"])
b+=L("M482 128 V54 H460")+LBL(456,51,["5 rubber hangers (yellow)","bottom hole 10–15 mm forward"],"end")
build("catback-hero",270,"Underside plan view of the cat-back: front slip joint, mid-pipe over the brace and past the tank, muffler, tips, five hangers",b,"Loose → align → clearance at brace, tank, crossmember → then torque.")

# ---------- brake-hero
reset(); b=""
b+=C(180,150,100,STEEL)+C(180,150,98,"none","#6B7078",1)+C(180,150,36,METAL)+C(180,150,6,INK,INK,0)
for a in (0.6,1.85,3.1,4.35,5.6): b+=C(180+26*math.cos(a),150+26*math.sin(a),4,INK,INK,0)
b+=C(198,116,3.5,YEL,INK,1)
b+=P("M262 86 L326 86 Q342 86 342 102 L342 198 Q342 214 326 214 L262 214 Z",INK,2,METAL)
b+=R(268,108,60,84,DARK,8)+T(298,154,"caliper",9,700,"middle",WHITE)
b+=C(280,96,6,BAR,INK,1.5)+C(280,204,6,BAR,INK,1.5)+C(334,110,7,COB,INK,1.5)+C(334,190,7,COB,INK,1.5)
b+=R(266,122,4,56,BRASS,0,BRASS,0)
b+=L("M280 90 V60 H370")+LBL(374,57,["Guide bolts (small)","front 28–35 Nm · rear 35 Nm new"],"start",BAR)
b+=L("M341 110 H370 V140")+LBL(374,143,["Carrier bolts (big)","front 190–200 · rear 90 Nm + 90° new"],"start",COB)
b+=L("M198 112 V44 H160")+LBL(154,41,["Set screw, T30","snug only; it strips easily"],"end")
b+=L("M180 186 V262")+T(180,276,"clean the hub face before the new rotor goes on",10,600,"middle",TEAL)
b+=L("M268 150 H230 V222 H300")+LBL(304,225,["pads: grease the ears, never the faces"])
build("brake-hero",290,"Brake assembly: rotor on the hub, carrier bolted to the knuckle with two large bolts, caliper sliding on two guide pins held by two small bolts",b)

# ---------- bleed-order
reset(); b=""
b+=T(280,20,"FRONT ↑",10,700,"middle",TEAL)
b+=P("M200 40 Q200 26 220 26 H340 Q360 26 360 40 V230 Q360 246 340 246 H220 Q200 246 200 230 Z",INK,2,PALE)
b+=R(230,66,100,70,STEEL,8,INK,1.5)+T(280,106,"engine",9,700,"middle")
b+=R(236,40,30,14,YEL,3,INK,1.5)+T(251,63,"reservoir",8,600,"middle",TEAL)
def wheel(x,y,n,label):
    return R(x-10,y-24,20,48,INK,5,INK,0)+C(x,y,13,COB,WHITE,2)+T(x,y+5,n,13,900,"middle",WHITE)+T(x,y+44,label,9,600,"middle",TEAL)
b+=wheel(188,96,"1","front-left")+wheel(372,96,"2","front-right")+wheel(188,200,"3","rear-left")+wheel(372,200,"4","rear-right")
b+=C(316,160,10,BAR,WHITE,2)+T(316,164,"0",11,900,"middle",WHITE)
b+=L("M326 160 H400")+LBL(404,157,["clutch slave first","manual cars only"],"start",BAR)
build("bleed-order",276,"Top-down car showing the bleed order: clutch slave first, then front-left, front-right, rear-left, rear-right",b,"VW's order: front first, because of the ABS unit. 11mm nipples, 10–15 psi.")

# ---------- dsg-hero
reset(); b=""
b+=P("M110 70 Q110 50 130 50 H330 Q370 50 380 90 L390 170 Q392 200 360 200 H130 Q110 200 110 180 Z",INK,2,METAL)
b+=T(250,124,"02E / DQ250",13,800,"middle",WHITE)+T(250,140,"6-speed wet-clutch DSG",9,500,"middle","#F1FAFF")
b+=R(210,30,40,22,DARK,4)+T(230,45,"24mm",8,700,"middle",WHITE)
b+=L("M250 40 H300")+LBL(304,37,["filter cap · 20 Nm","filter + o-ring under it"])
b+=R(236,200,28,14,INK,0,INK,0)+T(250,212,"14mm",7,700,"middle",WHITE)
b+=R(244,172,12,28,BRASS,0,INK,1)
b+=P("M130 172 H244 M256 172 H370",BAR,3,"none",'stroke-dasharray="6 3"')
b+=L("M264 207 H320")+LBL(324,204,["drain plug · 45 Nm","new washer"])
b+=L("M244 186 H110")+LBL(104,183,["overflow tube","8mm hex · 3 Nm"],"end",BRASS)
b+=L("M370 172 H420")+LBL(424,169,["fluid level","set at 35–45°C"],"start",BAR)
b+=R(60,236,440,22,PALE,4,INK,1)+R(210,236,110,22,YEL,0,YEL,0)
b+=T(80,251,"cold",9,600,"start")+T(265,251,"35–45°C: set level here",9,800,"middle")+T(480,251,"hot: reads low",9,600,"end")
build("dsg-hero",272,"DSG transmission side view: filter cap on top, drain plug underneath with the overflow tube inside it, and the level-setting temperature window",b)

# ---------- clutch-hero
reset(); b=""
b+=T(40,24,"ENGINE →",10,700,"start",TEAL)+T(560,24,"← TRANSMISSION",10,700,"end",TEAL)
b+=R(40,125,44,30,STEEL,4)+T(62,144,"crank",8,700,"middle")
b+=f'<ellipse cx="130" cy="140" rx="18" ry="70" fill="{METAL}" stroke="{INK}" stroke-width="2"></ellipse>'
b+=f'<ellipse cx="190" cy="140" rx="10" ry="60" fill="{BRASS}" stroke="{INK}" stroke-width="2"></ellipse>'
b+=f'<ellipse cx="245" cy="140" rx="16" ry="66" fill="{DARK}" stroke="{INK}" stroke-width="2"></ellipse>'
b+=f'<ellipse cx="310" cy="140" rx="10" ry="28" fill="{BAR}" stroke="{INK}" stroke-width="2"></ellipse>'
b+=R(330,132,190,16,STEEL)+T(425,144,"input shaft",8,700,"middle")+P("M370 132 V100 H400 V132",INK,2)
b+=L("M130 70 V46 H160")+LBL(164,43,["Flywheel · 8 bolts, NEW · 30 → 60 Nm → +90°"])
b+=L("M190 80 V70 H220")+LBL(224,73,["Clutch disc · marked side faces the gearbox"],"start",BRASS)
b+=L("M245 206 V226 H210")+LBL(206,229,["Pressure plate · bolts ×6, NEW","20–22 Nm per your kit"],"end")
b+=L("M310 168 V196 H340")+LBL(344,199,["Release bearing + slave cylinder","never reuse · 12–15 Nm"],"start",BAR)
b+=L("M84 140 H108")+LBL(62,178,["rear main seal","replace now"],"middle",COB)
build("clutch-hero",268,"Exploded clutch: crankshaft flange, flywheel, clutch disc, pressure plate, release bearing and slave cylinder, transmission input shaft",b,"Everything here is reached only with the transmission out.")

# ---------- pcv-hero
reset(); b=""
b+=R(80,140,400,60,METAL,10)+T(280,175,"valve cover",11,700,"middle",WHITE)
b+=R(260,90,100,50,DARK,6)+T(310,112,"PCV valve",10,800,"middle",WHITE)+T(310,127,"06F 129 101 P / R",8,500,"middle","#F1FAFF")
for (x,y) in [(268,98),(352,98),(268,132),(352,132)]: b+=C(x,y,3,YEL,YEL,0)
p1="M360 104 Q400 104 410 80 Q420 60 450 60"; p2="M260 120 H200 Q180 120 180 140"
b+=P(p1,INK,9)+P(p1,STEEL,5,"none",'stroke-dasharray="3 3"')+P(p2,INK,9)+P(p2,STEEL,5,"none",'stroke-dasharray="3 3"')
b+=L("M268 98 H240 V64")+LBL(236,58,["4× T25 · 3.4 Nm","reuse the screws"],"end")
b+=L("M450 60 H480 V40")+LBL(480,34,["upper pipe → manifold"],"middle",BAR)
b+=L("M210 120 V84 H170")+LBL(166,81,["lower pipe from the block","four-point clip: be gentle"],"end",BAR)
build("pcv-hero",236,"PCV valve on top of the valve cover with the upper breather pipe to the intake manifold and the lower breather pipe, held by four screws",b,"Read the part number moulded into the bottom of the old valve before ordering.")

# ---------- catchcan-hero
reset(); b=""
b+=R(50,80,130,70,METAL,8)+T(115,110,"crankcase",11,700,"middle",WHITE)+T(115,126,"vent (valve cover)",8,500,"middle","#F1FAFF")
b+=R(300,40,80,150,DARK,10)+T(340,66,"CATCH CAN",10,800,"middle",WHITE)
b+=R(308,150,64,32,BRASS,0,BRASS,0)+T(340,171,"oil",9,700,"middle",WHITE)
b+=P("M308 96 H372 M308 112 H372",STEEL,2)+T(340,130,"baffles",8,600,"middle","#F1FAFF")
b+=P("M180 100 H300",BAR,8)+P("M290 94 l8 6 l-8 6",WHITE,2)+T(240,90,"feed",9,700,"middle",BAR)
b+=P("M380 60 H430 Q450 60 450 80 V220 H240 Q220 220 220 200 V186",TEAL,8)
b+=C(220,176,14,DARK)+T(220,180,"turbo",7,700,"middle",WHITE)+T(220,206,"inlet",8,600,"middle",TEAL)
b+=T(470,56,"return: clean vapour",9,700,"start",TEAL)
b+=R(50,166,130,16,YEL,3,YEL,0)+T(115,178,"manifold port: capped",8,800,"middle","#1B1300")
b+=L("M340 190 V236")+T(340,250,"drain at 2 in. · weekly below freezing",9,700,"middle",TEAL)
build("catchcan-hero",264,"Flow diagram: crankcase vent to the catch can where oil separates, clean vapour returns to the turbo inlet",b)

# ---------- ignition-hero
reset(); b=""
b+=R(60,140,320,100,STEEL)+T(100,230,"cylinder head",10,700,"start")
b+=R(60,116,320,24,METAL)+T(100,132,"valve cover",9,700,"start",WHITE)
b+=R(216,116,48,124,BG,0,INK,1.5)
b+=R(224,36,32,104,DARK,4)+T(240,94,"coil",9,800,"middle",WHITE)+R(216,26,48,14,INK,3,INK,0)
b+=R(230,140,20,44,PALE,0,INK,1.5)+R(226,184,28,12,METAL,0,INK,1.5)+R(236,196,8,24,STEEL,0,INK,1)+P("M228 220 V226 H240",INK,2.5)+C(240,225,2,BAR,BAR,0)
b+=L("M264 33 H400")+LBL(404,36,["connector · lift the lock tab"])
b+=L("M256 80 H400")+LBL(404,77,["pull the coil straight up","no bolts · red or black, same part"])
b+=L("M254 190 H400")+LBL(404,187,["5/8\" (16mm) socket","hand-start · 25–30 Nm"])
b+=L("M240 230 V250 H400")+LBL(404,253,["gap .032 stock · .028 tuned"],"start",BAR)
b+=L("M228 116 V100 H160")+LBL(156,103,["blow the well clear first"],"end")
build("ignition-hero",270,"Cross-section of a plug well: coil pack on top held by friction, spark plug below it in the cylinder head",b)

# ---------- coilover-hero
reset(); b=""
b+=T(150,22,"FRONT",11,800,"middle",TEAL)+T(400,22,"REAR",11,800,"middle",TEAL)
b+=R(80,40,140,12,STEEL,0,INK,1.5)+C(110,46,3,INK,INK,0)+C(150,46,3,INK,INK,0)+C(190,46,3,INK,INK,0)
b+=R(130,52,40,18,DARK,4,INK,1.5)+R(144,70,12,160,METAL,0,INK,1.5)
for y in range(92,176,14): b+=f'<ellipse cx="150" cy="{y}" rx="26" ry="6" fill="none" stroke="{BAR}" stroke-width="4"></ellipse>'
b+=R(122,178,56,10,YEL,0,INK,1)+R(124,190,52,8,GOLD,0,GOLD,0)
b+=P("M126 230 h48 v40 h-48 z",INK,2,STEEL)+C(150,252,5,INK,INK,0)
b+=L("M150 46 V30 H200")+LBL(204,33,["3 top bolts · 15 Nm + 90°"],"start")
b+=L("M170 61 H240")+LBL(244,58,["mount + bearing","reuse, or new (install kit)"])
b+=L("M178 183 H240")+LBL(244,180,["perch + lock ring","sets ride height"],"start",GOLD)
b+=L("M174 252 H240")+LBL(244,249,["pinch bolt M14 · 70 Nm + 90°","spreader tool to release the strut"])
b+=R(370,60,60,12,STEEL,0,INK,1.5)+C(385,66,3,INK,INK,0)+C(415,66,3,INK,INK,0)
b+=R(394,72,12,120,METAL,0,INK,1.5)
b+=R(340,192,160,16,STEEL,4,INK,1.5)+T(420,204,"control arm",8,700,"middle")+C(400,192,5,INK,INK,0)
for y in range(126,190,12): b+=f'<ellipse cx="470" cy="{y}" rx="18" ry="5" fill="none" stroke="{BAR}" stroke-width="3.5"></ellipse>'
b+=R(456,116,28,8,YEL,0,INK,1)
b+=L("M400 60 V44 H430")+LBL(434,41,["2 upper bolts · 50 Nm + 45°"])
b+=L("M470 116 V96 H500")+LBL(504,93,["separate spring","kit perch on top"],"start",BAR)
b+=L("M400 192 V226 H430")+LBL(434,229,["lower bolt · 180 Nm","torque AT RIDE HEIGHT"],"start",GOLD)
build("coilover-hero",290,"Front coilover in its strut tower and the rear shock with its separate spring, with the fasteners and torques called out",b,"Measure fender heights before you start. It's your only reference.")

# ---------- shifter-hero
reset(); b=""
b+=R(120,130,240,80,METAL,14)+T(240,176,"transmission (top)",11,700,"middle",WHITE)
b+=C(140,130,8,INK,INK,0)+R(136,80,8,50,DARK,0,INK,1.5)+C(140,78,6,BAR,BAR,0)
b+=R(236,100,8,30,DARK,0,INK,1.5)+C(240,98,6,BAR,BAR,0)
b+=P("M140 72 Q170 40 460 40",INK,5)+P("M240 92 Q270 60 460 60",INK,5)
b+=R(460,30,50,40,STEEL,4,INK,1.5)+T(485,54,"cabin",8,700,"middle")
b+=R(200,90,6,40,YEL,0,INK,1)
b+=L("M136 120 H110 V150 H60")+LBL(20,153,["selector lever","kit: shorter arm"],"start",COB)
b+=L("M240 98 H290 V126")+LBL(290,138,["relay lever (side to side)"],"middle")
b+=L("M140 72 V22 H180")+LBL(184,19,["cable end + clip","kit: solid end on a spherical bearing"],"start",BAR)
b+=L("M203 90 V72")+LBL(203,66,["locking pin"],"middle",GOLD)
build("shifter-hero",236,"Top of the transmission: selector lever and relay lever, each with a shift cable on a pin; the kit replaces the selector lever and the cable ends",b,"Adjust with the box pinned in neutral and the cabin shifter pinned, then lock the cables.")

# ---------- battery-hero
reset(); b=""
b+=R(160,70,240,120,"#2A2E34",8)+T(280,140,"Group H6 · 12V",12,800,"middle",WHITE)+T(280,157,"AGM or flooded",9,500,"middle","#F1FAFF")
b+=R(184,54,30,20,INK,4,INK,0)+T(199,69,"−",14,900,"middle",WHITE)
b+=R(346,54,30,20,"#B3261E",4,"#B3261E",0)+T(361,69,"+",14,900,"middle",WHITE)
b+=R(160,186,240,10,STEEL,0,INK,1)
b+=R(130,160,30,20,METAL,0,INK,1.5)+C(145,170,4,INK,INK,0)
b+=C(199,30,10,COB,COB,0)+T(199,34,"1",10,900,"middle",WHITE)+T(50,34,"negative off first · 10mm",9,700,"start")
b+=C(361,30,10,COB,COB,0)+T(361,34,"2",10,900,"middle",WHITE)+T(380,34,"then positive",9,700,"start")
b+=C(90,170,10,COB,COB,0)+T(90,174,"3",10,900,"middle",WHITE)+L("M100 170 H130")+T(90,200,"hold-down clamp · 13mm",9,700,"middle")
b+=C(430,130,10,COB,COB,0)+T(430,134,"4",10,900,"middle",WHITE)+T(446,134,"lift out · about 45 lb",9,700,"start")
build("battery-hero",232,"Battery with negative and positive terminals and the base hold-down clamp; the removal order is numbered",b,"Install in reverse: clamp, positive, negative last. No coding on a Mk5.")

# ---------- headlight-hero
reset(); b=""
b+=P("M60 70 H330 Q400 70 410 130 L410 170 H60 Z",INK,2,STEEL)+T(200,124,"headlight housing",11,700,"middle")
b+=P("M60 170 H500 Q520 170 520 190 V220 H60 Z",INK,2,PALE)+T(290,202,"bumper cover",10,700,"middle")
b+=P("M60 170 H500",YEL,4)
b+=C(110,76,4,INK,INK,0)+C(270,76,4,INK,INK,0)+C(400,158,4,INK,INK,0)
b+=C(120,130,16,DARK,INK,1.5)+T(120,134,"low",8,700,"middle",WHITE)
b+=C(210,150,12,DARK,INK,1.5)+T(210,153,"high",7,700,"middle",WHITE)
b+=C(320,120,10,BAR,BAR,0)+T(320,123,"DRL",6,700,"middle",WHITE)
b+=L("M110 72 V44 H140")+LBL(144,41,["housing screws (Torx)","reachable once the cover's top edge is loose"])
b+=L("M400 162 H440 V130")+LBL(440,124,["side screw"],"middle")
b+=L("M280 170 V186 H460")+LBL(464,189,["cover screws + clips"],"start",GOLD)
build("headlight-hero",250,"Front corner: headlight housing with mounting screws hidden behind the bumper cover's top edge; bulb caps on the back",b,"Halogen: H7 low (+ H7 high, confirm). Bi-xenon: one D2S does both via a shutter.")

json.dump(OUT,open('svgs.json','w'))
print("drawn", len(OUT))
print("\n".join(ISSUES) if ISSUES else "checker: no text overlaps or edge clipping")

# ---------- airbox-tsi (side-mounted airbox)
reset(); b=""
b+=T(280,20,"FRONT OF CAR (radiator) ↑",10,700,"middle",TEAL)
b+=R(60,58,440,176,PALE,18,INK,1.5)+R(60,58,440,14,STEEL,6,STEEL,0)
b+=R(80,96,120,90,METAL,10)+T(140,136,"AIRBOX",12,800,"middle",WHITE)+T(140,152,"lid: 6 captive T25",8,500,"middle","#F1FAFF")
for (x,y) in [(90,104),(140,104),(190,104),(90,178),(140,178),(190,178)]: b+=C(x,y,3,INK,INK,0)
b+=P("M140 96 V72",INK,10)+P("M140 96 V72",STEEL,6)
b+=R(270,150,190,70,"#D9DCE0",14,INK,1.5)+T(400,182,"engine (cover is just a cover)",9,600,"middle",TEAL)
b+=R(200,130,40,20,DARK,4,INK,1.5)+R(240,134,16,12,BAR,2,BAR,0)
b+=P("M256 140 H330 Q350 140 350 160 V196",INK,12)+P("M256 140 H330 Q350 140 350 160 V196",DARK,8)
b+=C(350,204,14,DARK)+T(350,208,"turbo",7,700,"middle",WHITE)
b+=L("M140 72 H160 V44")+LBL(164,41,["intake duct from the grille · 2 T25 screws, lid unclips"],"start")
b+=L("M220 128 V100 H260")+LBL(264,97,["outlet tube · 2 more T25","MAF sensor sits here"],"start",BAR)
b+=L("M85 186 V214 H110")+LBL(114,217,["breather / SAI hose: squeeze and pull"],"start")
b+=L("M200 180 H230 V250 H260")+LBL(264,253,["box lifts off rubber posts (1 T25 at the back)"],"start")
build("airbox-tsi",290,"Top-down engine bay of a TSI: separate airbox at the front-left with a captive-screw lid, outlet tube with the MAF sensor to the turbo, engine cover separate",b,"Six captive screws on the lid, two at the outlet tube, breather hose off, lid up.")

# ---------- dv-hero (diverter valve on the compressor housing)
reset(); b=""
b+=C(200,150,80,METAL)+C(200,150,60,DARK)+C(200,150,22,STEEL)+T(200,154,"turbo",9,700,"middle",INK)
b+=T(200,236,"compressor housing (cold side)",9,600,"middle",TEAL)
b+=R(268,96,70,70,INK,35,INK,0)+C(303,131,26,DARK,INK,1.5)+C(303,131,10,BAR,BAR,0)
for (x,y) in [(303,100),(276,146),(330,146)]: b+=C(x,y,5,YEL,INK,1.5)
b+=R(330,120,24,14,STEEL,3,INK,1.5)
b+=L("M303 96 V60 H340")+LBL(344,57,["3× T30 bolts in a triangle","the lower two are the awkward ones"])
b+=L("M354 127 H400")+LBL(404,124,["connector","slide the lock, unplug"],"start")
b+=L("M303 168 V196 H400")+LBL(404,199,["Diverter valve","FSI 06F145710G · TSI 06H145710D"],"start",BAR)
build("dv-hero",270,"Diverter valve bolted to the turbo's compressor housing with three Torx bolts and one connector",b,"Torn diaphragm inside the old one = your underboost.")

import xml.etree.ElementTree as ET
for k,v in OUT.items():
    try: ET.fromstring(v)
    except ET.ParseError as e: ISSUES.append(f"XML {k}: {e}")
json.dump(OUT,open('svgs.json','w'))
print("\n".join(ISSUES) if ISSUES else "checker: clean (text clearance + well-formed XML)")

# ---------- tensioner-hero: upper timing chain, sprockets, tensioner
reset(); b=""
b+=T(300,22,"passenger side of the engine, mount and covers removed",10,700,"middle",TEAL)
b+=C(280,90,34,METAL)+C(280,90,8,INK,INK,0)+T(280,112,"exhaust",8,700,"middle",WHITE)
b+=C(400,90,34,METAL)+C(400,90,8,INK,INK,0)+T(400,112,"intake",8,700,"middle",WHITE)
b+=C(340,246,26,METAL)+C(340,246,6,INK,INK,0)+T(340,284,"crank sprocket",9,600,"middle")
b+=P("M250 102 L318 242",INK,7)+P("M430 102 L364 242",INK,7)+P("M280 56 H400",INK,7)
for (x,y) in [(280,56),(400,56),(340,220)]: b+=C(x,y,5,BRASS,INK,1)
b+=P("M258 120 L316 228",DARK,12)
b+=R(220,160,30,40,YEL,4,INK,1.5)+P("M250 180 H266",INK,6)
b+=R(230,170,8,8,BAR,0,BAR,0)
b+=L("M220 176 H196")+LBL(192,173,["Tensioner · 2× T30 · 9 Nm"],"end",GOLD)+T(192,185,"new 06K 109 467 K, pinned",9,400,"end",TEAL)
b+=L("M234 178 V222 H196")+LBL(192,225,["blue: spring clip"],"end",BAR)+T(192,237,"slide it back after the pin",9,400,"end",TEAL)
b+=L("M280 56 V40 H240")+LBL(236,43,["coloured links on the marks"],"end",BRASS)
b+=L("M434 90 H470")+LBL(474,87,["cam locks T40271","(full kit only)"])
b+=L("M366 246 H470")+LBL(474,243,["damper: one wide key","spacer T10368"])
build("tensioner-hero",318,"Upper timing chain from the crank sprocket to both camshaft sprockets, with the hydraulic tensioner on the left guide and the marks the chain's coloured links must land on",b,"Two turns by hand, then measure 61–64 mm and 124–126 mm before anything else happens.")

# ---------- waterpump-hero: back of the block
reset(); b=""
b+=T(300,22,"looking at the back of the engine, from the firewall side",10,700,"middle",TEAL)
b+=R(60,40,480,60,STEEL,6)+T(300,76,"intake manifold (stays on)",11,700,"middle")
b+=R(60,100,480,150,METAL,8)+T(80,118,"block, rear face",9,600,"start",WHITE)
b+=R(280,120,120,90,DARK,10)+T(340,160,"pump housing",10,800,"middle",WHITE)+T(340,176,"+ thermostat + sensor",8,500,"middle","#F1FAFF")
for (x,y) in [(290,130),(390,130),(290,200),(390,200),(340,205)]: b+=C(x,y,4,YEL,INK,1)
b+=C(240,190,18,STEEL)+C(240,190,6,INK,INK,0)+P("M258 178 L282 150 M258 202 L282 195",INK,5)
b+=R(400,150,30,20,BRASS,4,INK,1.5)+R(430,152,60,16,STEEL,3,INK,1.5)
b+=R(200,110,14,100,INK,3,INK,0)
b+=L("M340 209 V262")+LBL(340,265,["5× T30 · 9 Nm","clean the block face first"],"middle")
b+=L("M240 208 V262 H222")+LBL(60,265,["belt to the balance-shaft gear","new belt every time"],"start")
b+=L("M470 168 V262 H520")+LBL(540,265,["coupler → oil cooler","wet the o-rings"],"end",BRASS)
b+=L("M207 110 V84 H180")+LBL(176,81,["brace: T50 + 12mm nut"],"end")
build("waterpump-hero",292,"Rear face of the block: water pump and thermostat housing on five bolts, driven by a small belt from the balance-shaft gear, coupled to the oil cooler, with a brace in front",b)

# ---------- p2015-hero: manifold end with flap actuator
reset(); b=""
b+=R(60,60,340,120,STEEL,10)+T(230,124,"intake manifold",11,700,"middle")
for x in (100,160,220,280): b+=R(x,180,40,26,METAL,4,INK,1.5)
b+=P("M80 100 H380",INK,4,"none",'stroke-dasharray="8 6"')
b+=R(400,80,60,60,DARK,8)+T(430,106,"flap",9,800,"middle",WHITE)+T(430,120,"motor",9,800,"middle",WHITE)
b+=P("M400 110 L382 100",INK,6)+C(382,100,7,YEL,INK,1.5)
b+=R(372,86,20,28,"none",0,BAR,2)
b+=L("M382 92 V50 H340")+LBL(336,47,["arm's pivot: the plastic mount wears here"],"end",GOLD)
b+=L("M392 100 H420 V56 H440")+LBL(444,53,["repair bracket (blue)","holds the pivot · 2 screws"],"start",BAR)
b+=L("M430 140 V166 H440")+LBL(444,169,["actuator: 3 screws"])
b+=L("M230 100 V212")+T(230,226,"flap shaft, one flap per runner",9,600,"middle",TEAL)
build("p2015-hero",262,"End of the intake manifold: flap actuator motor, its arm to the flap shaft, the worn pivot, and the repair bracket that captures it",b,"P2015 is the pivot, not the motor. Fix the mount before buying a motor.")

import xml.etree.ElementTree as ET
for k,v in OUT.items():
    try: ET.fromstring(v)
    except ET.ParseError as e: ISSUES.append(f"XML {k}: {e}")
json.dump(OUT,open('svgs.json','w'))
print("\n".join(ISSUES) if ISSUES else "checker: clean (text clearance + well-formed XML)")

# ---------- haldex-hero: rear drivetrain plan view
reset(); b=""
b+=T(300,22,"underside, rear of the car (front is up)",10,700,"middle",TEAL)
b+=R(240,40,120,50,METAL,8)+T(300,62,"DSG",11,800,"middle",WHITE)+T(300,78,"02E · 4Motion",8,500,"middle","#F1FAFF")
b+=R(360,52,44,30,STEEL,6,INK,1.5)+T(382,71,"bevel",7,700,"middle")
b+=R(376,82,12,90,STEEL,0,INK,1.5)
b+=C(382,180,8,INK,INK,0)
b+=R(340,190,84,40,DARK,10)+T(382,208,"HALDEX",10,800,"middle",WHITE)+T(382,222,"coupling",8,500,"middle","#F1FAFF")
b+=R(330,232,104,34,METAL,8)+T(382,254,"rear differential",9,700,"middle",WHITE)
b+=P("M330 250 H200 M434 250 H540",INK,8)
b+=R(160,224,40,52,INK,6,INK,0)+R(540,224,40,52,INK,6,INK,0)
b+=C(342,200,4,YEL,INK,1)+C(382,230,4,YEL,INK,1)+C(336,250,4,YEL,INK,1)+C(382,266,4,YEL,INK,1)+C(364,60,4,YEL,INK,1)+C(382,84,4,YEL,INK,1)
b+=L("M404 67 H440 V44 H470")+LBL(474,41,["bevel box (front)","G 052 145 S2 · ~0.95 L"])
b+=L("M388 130 H470")+LBL(474,127,["propshaft","centre support bearing"])
b+=L("M424 210 H470")+LBL(474,207,["Haldex oil + filter","G 055 175 A2 · 0.65 L"],"start",GOLD)
b+=L("M434 258 V290 H470")+LBL(474,293,["rear diff: gear oil","G 052 145 S2 · ~0.95 L"])
b+=L("M336 246 V120 H300")+LBL(296,117,["plugs: drain 8mm hex · 30 Nm","fill 5mm hex · 15 Nm · open the fill first"],"end")
build("haldex-hero",330,"Plan view of the 4Motion drivetrain: bevel box on the transmission, propshaft, Haldex coupling, rear differential, with the three oils and plug torques",b,"Three units, two oils. Never put gear oil in the Haldex or Haldex oil in the differential.")

json.dump(OUT,open('svgs.json','w'))
import xml.etree.ElementTree as ET
for k,v in OUT.items():
    try: ET.fromstring(v)
    except ET.ParseError as e: ISSUES.append(f"XML {k}: {e}")
print("\n".join(ISSUES) if ISSUES else "checker: clean (incl. haldex)")
