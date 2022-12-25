const { PI, sin, cos } = Math;
const TAU = 2 * PI;

const map = (value, sMin, sMax, dMin, dMax) => {
  return dMin + ((value - sMin) / (sMax - sMin)) * (dMax - dMin);
};

const range = (n, m = 0) =>
  Array(n)
    .fill(m)
    .map((i, j) => i + j);

const rand = (max, min = 0) => min + Math.random() * (max - min);
const randInt = (max, min = 0) => Math.floor(min + Math.random() * (max - min));
const randChoise = (arr) => arr[randInt(arr.length)];
const polar = (ang, r = 1) => [r * cos(ang), r * sin(ang)];

let scene, camera, renderer, analyser;
let step = 0;
const uniforms = {
  time: { type: "f", value: 0.0 },
  step: { type: "f", value: 0.0 },
};
const params = {
  exposure: 1,
  bloomStrength: 0.9,
  bloomThreshold: 0,
  bloomRadius: 0.5,
};
let composer;

const fftSize = 2048;
const totalPoints = 4000;/**4000 */

const listener = new THREE.AudioListener();
const TextureLoader = new THREE.TextureLoader();

const audio = new THREE.Audio(listener);

/*document.querySelector("input").addEventListener("change", uploadAudio, false);*/
document.getElementById("btnE").addEventListener("click", function game(){window.location.href="https://ephemeral-marigold-ea6f07.netlify.app/"})

const buttons = document.querySelectorAll(".btn");
var numbers = 0
buttons.forEach((button, index) => 
  button.addEventListener("click", () => loadAudio(index))
);
buttons.forEach((button, index) => 
  button.addEventListener("click", () => numbers = index)
);

function init() {     /**这就是我们的主函数！！ */
  const overlay = document.getElementById("overlay");
  overlay.remove(); /*清除屏幕 */

  scene = new THREE.Scene();
  scene.background = new THREE.Color('#020003')
  renderer = new THREE.WebGLRenderer({ antialias: true });/**渲染器 */
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
 /**var words=document.createElement("p");
  words.id="message";
  words.innerText="Dear my Yolanda";
  document.body.appendChild(words);
  var newgame=document.createElement("script");
  newgame.type="module"
  newgame.src="./star_script.js";
  var newgame_1=document.createElement("script");
  newgame_1.src="https://cdnjs.cloudflare.com/ajax/libs/three.js/101/three.min.js";
  document.body.appendChild(newgame_1);
  var newgame_2=document.createElement("script");
  newgame_2.src='https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.5/dat.gui.min.js';
  document.body.appendChild(newgame_2);*/
  camera = new THREE.PerspectiveCamera(       /**摄像机视角 */
    60,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );
  camera.position.set(-0.09397456774197047,-2.5597086635726947,24.420789670889008)
  camera.rotation.set(0.10443543723052419,-0.003827152981119352,0.0004011488708739715)

  const format = renderer.capabilities.isWebGL2
    ? THREE.RedFormat
    : THREE.LuminanceFormat;

  uniforms.tAudioData = {
    value: new THREE.DataTexture(analyser.data, fftSize / 2, 1, format),
  };

  addPlane(scene, uniforms, 3000);
  addSnow(scene, uniforms);
  addText1();
  addText2();
  range(10).map((i) => {
    addTree(scene, uniforms, totalPoints, [20, 0, -20 * i]);
    addTree(scene, uniforms, totalPoints, [-20, 0, -20 * i]);
  });

  const renderScene = new THREE.RenderPass(scene, camera);

  const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85
  );
  bloomPass.threshold = params.bloomThreshold;
  bloomPass.strength = params.bloomStrength;
  bloomPass.radius = params.bloomRadius;

  composer = new THREE.EffectComposer(renderer);
  composer.addPass(renderScene);
  composer.addPass(bloomPass);

  addListners(camera, renderer, composer);
  
  animate();
}
var clock = new THREE.Clock();
var totaltime;
var M=0;

function animate(time) {  /**循环中不断调用render */
  
  analyser.getFrequencyData();
  uniforms.tAudioData.value.needsUpdate = true;
  step = (step + 1) % 1000;
  var T = clock.getDelta();

  totaltime = clock.getElapsedTime()

  uniforms.time.value = time;
  uniforms.step.value = step;
  composer.render();
  // 创建渲染函数
  console.log('两帧渲染时间间隔',T*1000+'毫秒');
  console.log('查看每秒渲染频率',1/T);
  console.log('时钟运行的总时长为',totaltime);
  console.log(M)
  

	
  requestAnimationFrame(animate);
}

function loadAudio(i) {                                  /*添加音乐函数*/
  document.getElementById("overlay").innerHTML =
    '<div class="text-loading">Please Wait...</div>';
  const files = [
    /*"https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Simon_Panrucker/Happy_Christmas_You_Guys/Simon_Panrucker_-_01_-_Snowflakes_Falling_Down.mp3",*/
    "https://m801.music.126.net/20221225145937/08d99086c0b84df1bd30111628dc7c17/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/22259860097/d8b8/99b3/0d4d/26166b14b5682cf74264120364440111.mp3",
    "https://m801.music.126.net/20221224200059/4f842d54cf2b6dea4a07849da015546d/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/22216964210/3455/c2a2/abd0/ccbe67c6d3ffbc506bed74334093ce44.mp3",
    "https://m701.music.126.net/20221224193124/4683d2d9d368c2ebbbaf1a716f66ef9c/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096492045/99dc/ae67/db65/9c46f1c5507fdd8a3ff1dbad0042cf9b.mp3",
    "https://m701.music.126.net/20221224195323/b70427e318cd893c2520956c234f25ab/jdymusic/obj/wo3DlMOGwrbDjj7DisKw/14096600726/c9b6/fe3a/c474/11ecaf459423dad398d2a1d3813ecd3a.mp3",
    "https://music.163.com/song/media/outer/url?id=1911206410",
    
  
  ];
  const file = files[i];

  const loader = new THREE.AudioLoader();
    loader.load(file, function (buffer) {
      audio.setBuffer(buffer);
      audio.play();
      analyser = new THREE.AudioAnalyser(audio, fftSize);
      init();
    });                                                   /*这可能是我们要找的主函数！ */

  

  
}


function uploadAudio(event) {
  document.getElementById("overlay").innerHTML =
    '<div class="text-loading">Please Wait...</div>';  /**在这边可以修改文本 */
  const files = event.target.files;
  const reader = new FileReader();

  reader.onload = function (file) {
    var arrayBuffer = file.target.result;

    listener.context.decodeAudioData(arrayBuffer, function (audioBuffer) {
      audio.setBuffer(audioBuffer);
      audio.play();
      analyser = new THREE.AudioAnalyser(audio, fftSize);
      init();
    });
  };

  reader.readAsArrayBuffer(files[0]);
}

function addTree(scene, uniforms, totalPoints, treePosition) { /**树 */
  const vertexShader = `
  attribute float mIndex;
  varying vec3 vColor;
  varying float opacity;
  uniform sampler2D tAudioData;

  float norm(float value, float min, float max ){
      return (value - min) / (max - min);
  }
  float lerp(float norm, float min, float max){
  return (max - min) * norm + min;
  }

  float map(float value, float sourceMin, float sourceMax, float destMin, float destMax){
  return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
  }


  void main() {
      vColor = color;
      vec3 p = position;
      vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );
      float amplitude = texture2D( tAudioData, vec2( mIndex, 0.1 ) ).r;
      float amplitudeClamped = clamp(amplitude-0.4,0.0, 0.6 );
      float sizeMapped = map(amplitudeClamped, 0.0, 0.6, 1.0, 20.0);
      opacity = map(mvPosition.z , -200.0, 15.0, 0.0, 1.0);
      gl_PointSize = sizeMapped * ( 100.0 / -mvPosition.z );
      gl_Position = projectionMatrix * mvPosition;
  }
`;
  const fragmentShader = `
  varying vec3 vColor;
  varying float opacity;
  uniform sampler2D pointTexture;
  void main() {
      gl_FragColor = vec4( vColor, opacity );
      gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord ); 
  }
  `;
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ...uniforms,
      pointTexture: {
        /*value: new THREE.TextureLoader().load(`https://assets.codepen.io/3685267/spark1.png`),*/
        value: new THREE.TextureLoader().load('./spark3.jpg'),
      },
    },
    vertexShader,
    fragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true,
  });

  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const sizes = [];
  const phases = [];
  const mIndexs = [];

  const color = new THREE.Color();

  for (let i = 0; i < totalPoints; i++) {
    const t = Math.random();
    const y = map(t, 0, 1, -8, 10);
    const ang = map(t, 0, 1, 0, 6 * TAU) + (TAU / 2) * (i % 2);
    const [z, x] = polar(ang, map(t, 0, 1, 5, 0));

    const modifier = map(t, 0, 1, 1, 0);
    positions.push(x + rand(-0.3 * modifier, 0.3 * modifier));
    positions.push(y + rand(-0.3 * modifier, 0.3 * modifier));
    positions.push(z + rand(-0.3 * modifier, 0.3 * modifier));

    /*color.setHSL(map(i, 0, 800, 1.0, 0.1), 1.0, 0.2);*/
    /*color.set(randChoise(["#541407", "#05186b", "#5e430c", "#033804"]));*/
    color.set(randChoise([ "#9e2509","#2e5c09","#947f16", "#874e08"]));
    colors.push(color.r, color.g, color.b);
    phases.push(rand(1000));
    sizes.push(1);
    const mIndex = map(i, 0, totalPoints, 1.0, 0.0);
    mIndexs.push(mIndex);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3).setUsage(
      THREE.DynamicDrawUsage
    )
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));/**2 */
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute("phase", new THREE.Float32BufferAttribute(phases, 1));
  geometry.setAttribute("mIndex", new THREE.Float32BufferAttribute(mIndexs, 1));

  const tree = new THREE.Points(geometry, shaderMaterial);

  const [px, py, pz] = treePosition;

  tree.position.x = px;
  tree.position.y = py;
  tree.position.z = pz;

  scene.add(tree);
}

function addSnow(scene, uniforms) {
  const vertexShader = `
  attribute float size;
  attribute float phase;
  attribute float phaseSecondary;

  varying vec3 vColor;
  varying float opacity;


  uniform float time;
  uniform float step;

  float norm(float value, float min, float max ){
      return (value - min) / (max - min);
  }
  float lerp(float norm, float min, float max){
      return (max - min) * norm + min;
  }

  float map(float value, float sourceMin, float sourceMax, float destMin, float destMax){
      return lerp(norm(value, sourceMin, sourceMax), destMin, destMax);
  }
  void main() {
      float t = time* 0.0006;

      vColor = color;

      vec3 p = position;

      p.y = map(mod(phase+step, 1000.0), 0.0, 1000.0, 25.0, -8.0);

      p.x += sin(t+phase);
      p.z += sin(t+phaseSecondary);

      opacity = map(p.z, -150.0, 15.0, 0.0, 1.0);

      vec4 mvPosition = modelViewMatrix * vec4( p, 1.0 );

      gl_PointSize = size * ( 100.0 / -mvPosition.z );

      gl_Position = projectionMatrix * mvPosition;

  }
  `;

  const fragmentShader = `
  uniform sampler2D pointTexture;
  varying vec3 vColor;
  varying float opacity;

  void main() {
      gl_FragColor = vec4( vColor, opacity );
      gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord ); 
  }
  `;
  function createSnowSet(sprite) {
    const totalPoints = 300;
    const shaderMaterial = new THREE.ShaderMaterial({
      uniforms: {
        ...uniforms,
        pointTexture: {
          value: new THREE.TextureLoader().load(sprite),
        },
      },
      vertexShader,
      fragmentShader,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true,
      vertexColors: true,
    });

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];
    const sizes = [];
    const phases = [];
    const phaseSecondaries = [];

    const color = new THREE.Color();

    for (let i = 0; i < totalPoints; i++) {
      const [x, y, z] = [rand(25, -25), 0, rand(15, -150)];
      positions.push(x);
      positions.push(y);
      positions.push(z);

      /*color.set(randChoise(["#f1d4d4", "#f1f6f9", "#eeeeee", "#f1f1e8"]));*/
      
      color.set(randChoise(["#f7f6f2", "#f5efda", "#e6da91", "#f0cd51"]));


      colors.push(color.r, color.g, color.b);
      phases.push(rand(1000));
      phaseSecondaries.push(rand(1000));
      sizes.push(rand(6, 2.5));
    }

    geometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
    geometry.setAttribute("phase", new THREE.Float32BufferAttribute(phases, 1));
    geometry.setAttribute(
      "phaseSecondary",
      new THREE.Float32BufferAttribute(phaseSecondaries, 1)
    );

    const mesh = new THREE.Points(geometry, shaderMaterial);

    scene.add(mesh);
  }
  const sprites = [
    "https://assets.codepen.io/3685267/snowflake1.png",
    "https://assets.codepen.io/3685267/snowflake2.png",
    "https://assets.codepen.io/3685267/snowflake3.png",
    "https://assets.codepen.io/3685267/snowflake5.png",
  ];
  sprites.forEach((sprite) => {
    createSnowSet(sprite);
  });
}

function addPlane(scene, uniforms, totalPoints) {
  const vertexShader = `
  attribute float size;
  attribute vec3 customColor;
  varying vec3 vColor;

  void main() {
      vColor = customColor;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_PointSize = size * ( 300.0 / -mvPosition.z );
      gl_Position = projectionMatrix * mvPosition;

  }
  `;
  const fragmentShader = `
  uniform vec3 color;
  uniform sampler2D pointTexture;
  varying vec3 vColor;

  void main() {
      gl_FragColor = vec4( vColor, 1.0 );
      gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );

  }
  `;
  const shaderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      ...uniforms,
      pointTexture: {
        value: new THREE.TextureLoader().load(`https://assets.codepen.io/3685267/spark1.png`),
      },
    },
    vertexShader,
    fragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true,
    vertexColors: true,
  });

  const geometry = new THREE.BufferGeometry();
  const positions = [];
  const colors = [];
  const sizes = [];

  const color = new THREE.Color();

  for (let i = 0; i < totalPoints; i++) {
    const [x, y, z] = [rand(-25, 25), 0, rand(-150, 15)];
    positions.push(x);
    positions.push(y);
    positions.push(z);

    color.set(randChoise(["#93abd3", "#f2f4c0", "#9ddfd3"]));

    colors.push(color.r, color.g, color.b);
    sizes.push(1);
  }

  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3).setUsage(
      THREE.DynamicDrawUsage
    )
  );
  geometry.setAttribute(
    "customColor",
    new THREE.Float32BufferAttribute(colors, 3)
  );
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));

  const plane = new THREE.Points(geometry, shaderMaterial);

  plane.position.y = -8;
  scene.add(plane);
}

function addText1(){
  var loader = new THREE.FontLoader();

  loader.load( './Note Script SemiBold_Regular.json', function ( font ) {

    var textGeometry = new THREE.TextGeometry( 'Merry Christmas!', {
      font: font,
      size: 2,
      height: 0.3,
      curveSegments: 6,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0,
      bevelSegments: 5
    } );
    textGeometry.computeBoundingBox();
    textGeometry.translate(
      - textGeometry.boundingBox.max.x * 0.5,
      + textGeometry.boundingBox.max.y * 2.5,
      - textGeometry.boundingBox.max.z * 0.5,
    )
    const matcapTexture = TextureLoader.load('./dark_golden.png')
    const textMaterial = new THREE.MeshMatcapMaterial({ matcap:matcapTexture })
    const text = new THREE.Mesh(textGeometry,textMaterial);
    scene.add(text);
  } );
}

function addText2(){
  var loader = new THREE.FontLoader();
  const texts=["ALL  I  Want  For  Christmas  Is  You!","The  only  thing  in  my  Christmas  List  is  U!","我想和你一起看最长的电影","那个表白的傍晚 是我一生中最勇敢的瞬间","夏夜里的晚风 只有和你和我相拥"]
  
//clock.getDelta()方法获得两帧的时间间隔，返回时间单位：秒
  
      loader.load( './NanFengXingShu_Regular.json', function ( font ) {
        var textGeometry = new THREE.TextGeometry( texts[numbers], {
          font: font,
          size: 1.5,
          height: 0.1,
          curveSegments: 6,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0,
          bevelSegments: 5
        } );
        textGeometry.computeBoundingBox();
        textGeometry.translate(
          - textGeometry.boundingBox.max.x * 0.5,
          - textGeometry.boundingBox.max.y * 5,
          - textGeometry.boundingBox.max.z * 0.5,
        )
        const matcapTexture = TextureLoader.load('./millk.png')
        const textMaterial = new THREE.MeshMatcapMaterial({ matcap:matcapTexture })
        const text = new THREE.Mesh(textGeometry,textMaterial);
        scene.add(text);
      })
    ;
}


function addListners(camera, renderer, composer) {
  document.addEventListener("keydown", (e) => {
    const { x, y, z } = camera.position;
    console.log(`camera.position.set(${x},${y},${z})`);
    const { x: a, y: b, z: c } = camera.rotation;
    console.log(`camera.rotation.set(${a},${b},${c})`);
  });

  window.addEventListener(
    "resize",
    () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
      composer.setSize(width, height);
    },
    false
  );
}

