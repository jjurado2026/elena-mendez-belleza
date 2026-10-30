/* Elena Méndez — «Oro líquido»: el oro de su logo, líquido y en tiempo real (WebGL, sin librerías).
   El oro se vierte sobre el blanco y se abre alrededor de su cara; responde al cursor y, al bajar,
   se cierra e inunda la pantalla. Sin WebGL, imagen quieta (ver home.css). */
window.OroLiquido = (function () {
  'use strict';
  var VERT = 'attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}';
  var FRAG = [
    'precision highp float;',
    'uniform vec2 uR,uC,uW,uM,uFace;uniform float uT,uF,uI,uV,uFotoH,uAsp;uniform sampler2D uTex;',
    'vec2 hs(vec2 p){p=vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3)));return -1.+2.*fract(sin(p)*43758.5453);}',
    'float nz(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*f*(f*(f*6.-15.)+10.);',
    ' return mix(mix(dot(hs(i),f),dot(hs(i+vec2(1,0)),f-vec2(1,0)),u.x),mix(dot(hs(i+vec2(0,1)),f-vec2(0,1)),dot(hs(i+vec2(1,1)),f-vec2(1,1)),u.x),u.y);}',
    'float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<3;i++){s+=a*nz(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return s;}',
    'float smin(float a,float b,float k){float h=clamp(.5+.5*(b-a)/k,0.,1.);return mix(b,a,h)-k*h*(1.-h);}',
    'float eo(float x){return 1.-pow(1.-clamp(x,0.,1.),3.);}',
    'float sFoto(vec2 p){return (p-uC).x/uFotoH/uAsp+uFace.x;}',
    // Campo: >0 dentro del oro. nv y no: ruido de los bordes, ya calculado para este píxel
    'float campo(vec2 p,float nv,float no,out float fuera){',
    ' float abre=eo((uI-.28)/.72)*(1.-smoothstep(.05,.72,uF));',
    ' float w=length((p-uC)/uW);',
    ' float ang=atan((p-uC).y/uW.y,(p-uC).x/uW.x);',
    ' float ven=(w-abre*(1.+.2*nv+.035*sin(ang*3.+uT*.12)))*min(uW.x,uW.y);',                 // >0 fuera de la ventana de la cara
    ' ven=max(ven,(.006-sFoto(p))*uAsp*uFotoH)+uF*uF*3.;',                       // a la izquierda de la foto, siempre oro
    ' float rO=eo(uI/.7)+uF*uF*7.;',
    ' float o=length((p-uC)/(uW*vec2(1.9,1.2)));',
    ' float lob=(.13*sin(ang*5.+uT*.09+1.)+.09*sin(ang*8.-uT*.13)+.05*sin(ang*13.+uT*.07))*(1.-uF);',
    ' float ex=(rO*(1.+.62*no+lob)-o)*min(uW.x,uW.y);',                     // >0 dentro del charco
    ' float dd=-ex;',
    ' for(int i=0;i<4;i++){float fi=float(i),per=7.+fi*2.3,t=mod(uT+fi*3.1,per)/per;',  // gotas que se desprenden y caen
    '  float x=uC.x+(fi-1.5)*uW.x*1.05+.03*sin(fi*7.);float y=uC.y-uW.y*.95-t*t*1.1;',
    '  dd=smin(dd,length(p-vec2(x,y))-(.012+.006*fi)*smoothstep(1.,.7,t)*step(.2,uI),.05);}',
    ' dd=smin(dd,length(p-uM)-.016-.05*uV,.075);',                       // la gota del cursor
    ' fuera=dd;',
    ' return smin(ven,-dd,.05);}',
    'vec3 rampa(float g){',
    ' vec3 a=vec3(.30,.17,.03),b=vec3(.66,.44,.09),c=vec3(.93,.72,.22),d=vec3(.99,.87,.50),e=vec3(1.,.985,.90);',
    ' a=mix(a,c,uF*.75);b=mix(b,c,uF*.5);',
    ' g=clamp(g,0.,1.);',
    ' if(g<.3)return mix(a,b,g/.3);if(g<.58)return mix(b,c,(g-.3)/.28);if(g<.82)return mix(c,d,(g-.58)/.24);return mix(d,e,(g-.82)/.18);}',
    'float alt(vec2 dq,float s){float f=fbm(dq);return (1.-exp(-max(s,0.)*30.))*.075+.11*f+.016*sin(f*30.+dq.y*1.5);}',
    'void main(){',
    ' vec2 p=(gl_FragCoord.xy-.5*uR)/uR.y;float t=uT*.055;',
    ' float nv=fbm(p*2.6+vec2(3.,t*1.3)),no=fbm(p*1.25+vec2(-t,t*.7)+7.);',
    ' vec2 q=vec2(fbm(p*1.15+vec2(t,-t*.6)),fbm(p*1.15+vec2(5.2,1.3)-t*.8));',
    ' float fu;float s=campo(p,nv,no,fu);',
    ' float aa=1.6/uR.y;',
    ' vec3 col=vec3(1.);',
    // Sombra del oro sobre el blanco
    ' float f2;campo(p+vec2(-.003,.009),nv,no,f2);col=mix(col,vec3(.90,.85,.74),.8*smoothstep(.022,0.,f2));',
    // La foto, en la ventana, con la sombra del borde del oro
    ' if(s<aa*2.&&fu<0.){float u=sFoto(p);float v=uFace.y-(p-uC).y/uFotoH;',
    '  vec3 fo=texture2D(uTex,vec2(u,v)).rgb;',
    '  float so=smoothstep(0.,.045,-s);fo*=mix(vec3(.50,.38,.20),vec3(1.),so);col=fo;}',
    ' if(s>-aa){',
    '  float e=.0028;vec2 dq=p*2.1+2.6*q;',
    '  float fx,fy;float sx=campo(p+vec2(e,0.),nv,no,fx),sy=campo(p+vec2(0.,e),nv,no,fy);',
    '  float h0=alt(dq,s),hx=alt(dq+vec2(e*2.1,0.),sx),hy=alt(dq+vec2(0.,e*2.1),sy);',
    '  float ri=uV*exp(-dot(p-uM,p-uM)*90.)*.014;',
    '  h0+=sin(length(p-uM)*70.-uT*7.)*ri;hx+=sin(length(p+vec2(e,0.)-uM)*70.-uT*7.)*ri;hy+=sin(length(p+vec2(0.,e)-uM)*70.-uT*7.)*ri;',
    '  vec3 n=normalize(vec3(-(hx-h0)/e,-(hy-h0)/e,1.15));',
    '  vec3 r=2.*n.z*n-vec3(0.,0.,1.);',
    '  float g=.54+.40*r.y+.12*sin(r.x*4.+r.y*6.+1.2)-.06*r.x;',
    '  vec3 oro=rampa(g);',
    '  float sp=pow(max(dot(r,normalize(vec3(-.38,.58,.72))),0.),90.)*.8+pow(max(dot(r,normalize(vec3(.55,.2,.81))),0.),150.)*.6;',
    '  oro+=vec3(1.,.96,.82)*sp;',
    '  oro*=mix(.72,1.,smoothstep(0.,.03,s));',                         // canto
    '  col=mix(col,oro,smoothstep(-aa,aa,s));}',
    ' gl_FragColor=vec4(col,1.);}'
  ].join('\n');

  function crear(canvas, img, opciones) {
    var gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
    if (!gl) return null;
    function sh(tipo, src) { var o = gl.createShader(tipo); gl.shaderSource(o, src); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; }
    var pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VERT)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG)); gl.linkProgram(pr);
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(pr));
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    var la = gl.getAttribLocation(pr, 'a'); gl.enableVertexAttribArray(la); gl.vertexAttribPointer(la, 2, gl.FLOAT, false, 0, 0);
    var U = {}; ['uR', 'uC', 'uW', 'uM', 'uFace', 'uT', 'uF', 'uI', 'uV', 'uFotoH', 'uAsp', 'uTex'].forEach(function (n) { U[n] = gl.getUniformLocation(pr, n); });
    var tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, img);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.uniform1i(U.uTex, 0); gl.uniform1f(U.uAsp, img.naturalWidth / img.naturalHeight); gl.uniform2f(U.uFace, 0.195, 0.52);
    var estado = { t: opciones.t || 0, f: 0, i: opciones.quieto ? 1 : 0, mx: 9, my: 9, gx: 9, gy: 9, v: 0 };
    var hueco = opciones.hueco, W = 0, H = 0, calidad = 1;
    function medir() {
      var r = canvas.getBoundingClientRect(), h = hueco.getBoundingClientRect();
      W = r.width; H = r.height;
      var es = Math.min(window.devicePixelRatio || 1, 1.5), tope = 1500000 * calidad, total = W * H * es * es;
      if (total > tope) es *= Math.sqrt(tope / total);
      canvas.width = Math.round(W * es); canvas.height = Math.round(H * es);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(U.uR, canvas.width, canvas.height);
      var ry = h.height / 2 / H, rx = h.width / 2 / H;
      gl.uniform2f(U.uC, (h.left + h.width / 2 - r.left - W / 2) / H, -(h.top + h.height / 2 - r.top - H / 2) / H);
      gl.uniform2f(U.uW, rx, ry);
      gl.uniform1f(U.uFotoH, 2 * ry / 0.9);
    }
    function pintar() {
      gl.uniform1f(U.uT, estado.t); gl.uniform1f(U.uF, estado.f); gl.uniform1f(U.uI, estado.i); gl.uniform1f(U.uV, estado.v);
      gl.uniform2f(U.uM, estado.gx, estado.gy);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function raton(cx, cy) {
      var r = canvas.getBoundingClientRect();
      var nx = (cx - r.left - W / 2) / H, ny = -(cy - r.top - H / 2) / H;
      if (estado.mx > 8) { estado.gx = nx; estado.gy = ny; }
      estado.mx = nx; estado.my = ny;
    }
    function fuera() { estado.mx = 9; estado.my = 9; estado.gx = 9; estado.gy = 9; }
    function paso(dt) {
      estado.t += dt;
      if (estado.mx < 8) {
        var ax = estado.gx, ay = estado.gy;
        estado.gx += (estado.mx - estado.gx) * Math.min(1, dt * 7); estado.gy += (estado.my - estado.gy) * Math.min(1, dt * 7);
        var vel = Math.hypot(estado.gx - ax, estado.gy - ay) / Math.max(dt, .001);
        estado.v += (Math.min(1, vel * 1.1) - estado.v) * Math.min(1, dt * 5);
      } else estado.v *= Math.max(0, 1 - dt * 3);
    }
    // Si el equipo no llega, baja la resolución (el oro líquido admite perder detalle)
    function bajarCalidad() { if (calidad > .35) { calidad *= .72; medir(); } }
    medir();
    return { estado: estado, medir: medir, pintar: pintar, paso: paso, raton: raton, fuera: fuera, bajarCalidad: bajarCalidad };
  }
  return { crear: crear };
})();
