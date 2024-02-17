import "./style.css";

import { animate, inView } from "motion";
import {
  MeshBasicMaterial,
  AmbientLight,
  Clock,
  DirectionalLight,
  Group,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  TorusKnotGeometry,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { NoiseShader } from "./noise-shader";
// FOR IMPORTING OUR MODEL AND WE REPLACE THE MES FROM THREE.JS
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
const modelPath = "/model/sneaker.glb";





// Define your main function

const main = () => {
  // DEFINING THE BEGINING AND END OF OUR EFFECT
  let currentEffect = 0;
  let aimEffect = 0;
  // CONST FOR DEFINING WHEN WE WANT OUR EFFECT TO STOP OR TRANSFORM AGAIN SET IN THE SCROLL FUNCTION
  let timeoutEffect;

  // ANIMATING THE HEADER AND "NEW DROP" IMAGE
  // I ALSO MOVED THIS ANIMATION FUNCTION INTO MY GLTF LOADER FUNCTION TOO SO IT ANIMATES WHEN IT IS LOADED TOO, SO THAT IS WHY IT IS ALSO COMMENTED OUT
  // animate(
  //   "header",
  //   {
  //     y: [-100, 0],
  //     opacity: [0, 1],
  //   },
  //   { duration: 1, delay: 2.5 }
  // );

  // animate(
  //   "section.new-drop",
  //   {
  //     y: [-100, 0],
  //     opacity: [0, 1],
  //   },
  //   { duration: 1, delay: 2 }
  // );

  animate("section.content p, section.content img", { opacity: 0 });
  inView("section.content", (info) => {
    animate(
      info.target.querySelectorAll("p, img"),
      { opacity: 1 },
      { duration: 1, delay: 1 }
    );
  });


  // SELECTING OUR EMPTY SECTION WITH A CLASS NAME WHERE WE PUT OUR 3D MODEL
  const sneakerTag = document.querySelector("section.sneaker");
  // SELECTING OUR LOADER 
  const loaderTag = document.querySelector('div.loader')

  //   DEFINING OUR CLOCK WHICH WORKS WITH OUR POSTPROCESSING
  const clock = new Clock();

  // DEFINING OUR THREE JS ( I.E WITH SCENE, RENDERER AND CAMERA )
  const scene = new Scene();
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  const renderer = new WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);
  sneakerTag.appendChild(renderer.domElement);

  // LIGHTING
  const ambience = new AmbientLight(0x404040);
  camera.add(ambience);

  const keyLight = new DirectionalLight(0xffffff, 1);
  keyLight.position.set(-1, 1, 3);
  camera.add(keyLight);

  const fillLight = new DirectionalLight(0xffffff, 0.5);
  fillLight.position.set(1, 1, 3);
  camera.add(fillLight);

  const backLight = new DirectionalLight(0xffffff, 1);
  backLight.position.set(-1, 3, -1);
  camera.add(backLight);

  // WHY WE'RE USING CAMERA IS SO THAT THE LIGHT FOLLOWS THE CAMERA, IF WE'D USED SCENE , THE LIGHT IS STATIC!
  scene.add(camera);

  // CONTROLS
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 2;
  controls.update();

  camera.position.z = 5

  // POST PROCESSING
  const composer = new EffectComposer(renderer);

  const renderPass = new RenderPass(scene, camera);
  composer.addPass(renderPass);

  const noisePass = new ShaderPass(NoiseShader);
  // The first part is from our shader and the second after the "=" is from three.js
  noisePass.uniforms.time.value = clock.getElapsedTime();
  //   CURRENT EFFECT NEVER UPDATES, ALWAYS 0 BUT WE'LL BE ACCESSING WITH OUR SCROLL FUNCTION TO UPDATE
  noisePass.uniforms.effect.value = currentEffect;
  //THERE IS A CHANGE THAT HAPPENS TO OUR SHADER AS WE CHANGE THE SIZE OF OUR SCREEN TO PREVENT THIS , WE SET ASPECT RATIO ALSO DEFINED IN OUR NOISE-SHADER.JS ANDE WE PASS IT NTO OUR RESIZE FUNCTION BELOW AS WELL
  noisePass.uniforms.aspectRatio.value = window.innerWidth / window.innerHeight;
  composer.addPass(noisePass);

  const outputPass = new OutputPass();
  composer.addPass(outputPass);

  // DEFINING OUR 3D SHAPE
  //   const geometry = new TorusKnotGeometry(1, 0.25, 100, 16);
  //   const material = new MeshLambertMaterial({ color: 0xff0000 });
  //   const shape = new Mesh(geometry, material);

    //   3D OBJECT IMPORT
    const gltfLoader = new GLTFLoader();

  

  // WE ADDED A GROUP SO WE CAN ANIMATE WITH OUR EXTERNAL "MOTION-ONE" LIBRABRY
  // THIS CONTROLS HOW THE MODEL ANIMATESFROM THE BOTTOM WHEN THE PAGES LOADS (LIKE COMING INTO VIEW)
  const loadGroup = new Group();
  loadGroup.position.y = -10;
//   loadGroup.add(shape);

  // THE REASON FOR THE SCROLLGROUP IS TO BE ABLE TO ANIMATE ON SCROLL
  // THAT IS HOW THE MODEL ROTATEON IT'S X'S AXIS AS WE SCROLL
  // THEN WE ADD IT IN THE RENDERER ITSELF
  const scrollGroup = new Group();
  scrollGroup.add(loadGroup);

  scene.add(scrollGroup);


  // REASON FOR THIS IS BECAUSE WE ARE ANIMATING WITH OUR MODEL AFTER IT IS LOADED, SO SETTING THE DEFAULT STATE BEFORE ANIMATION SO IT DOESN'T JUST BE THERE
  animate('header', { y: -100, opacity: 0 })
  animate('section.new-drop', { y: -100, opacity: 0 })

  // gltfLoader.load( './sneaker.glb' , (gltf) => {
  //   loadGroup.add(gltf.scene);
  // });
  
  gltfLoader.load(modelPath, (gltf) => {
    loadGroup.add(gltf.scene);

    // THE REASON FOR MOVING OUR ANIMATED FUNCTIONS HERE IS BECAUSE WE WOULD DEFINE A PRE-LOADER
    // THAT PRE-LOADER WOULD BE FOR LOADING OUR MODEL SO THAT THE ANIMATION THEN TRIGGERS WHEN IT IS ALL LOADED
    // THIS IS BECAUSE THE MODEL IS 5MB WHICH WOULD TAKE TIME TO LOAD ON THE INTERNET!
    animate(
      "header",
      {
        y: [-100, 0],
        opacity: [0, 1],
      },
      { duration: 1, delay: 2.5 }
    );
  
    animate(
      "section.new-drop",
      {
        y: [-100, 0],
        opacity: [0, 1],
      },
      { duration: 1, delay: 2 }
    );

    animate(
      (t) => {
        loadGroup.position.y = -10 + 10 * t;
      },
      { duration: 2, delay: 1 }
    );

    // OUR LOADER  ANIMATION ONCE LOADED!
    animate(
      'div.loader',
      {
        y: '-100%',
      },
      { duration: 1, delay: 1 },
    )
  },
  // DEFINING OUR PRE-LOADER AND OUR ERROR-HANDLER ALL PROVIDED IN THREE.JS
  // PRE-LOADER
  // "xhr" from three.js
  // THEN WE HAVE A PRE-LOADER IN HEADER.JSX WITH "loader" CLASS
  (xhr) => {

    // MATH.ROUND SO WE'LL ALWAYS GET AN INTEGER AND THIS IS BASICALLY OUR LOADER
    // NOW WE HAVE TO ANIMATE IT AWAY WHEN IT IS COMPLETE SO THAT'S WHY WE HAVE ANOTHER ANIMATE FUCNTION IN OUR GLTF LOADER 
    const p = Math.round((xhr.loaded / xhr.total) * 100)
    loaderTag.querySelector('span').innerHTML = p + '%'
  },
  // ERROR-HANDLER
  (error) => {console.error(error)}
  );

  // ANIMATE LOADGROUP
  // THE 'T' HERE IS TIMELINE
  // I EVENTUALLY MOVEED THIS INSIDE MY GLTFLOADER SO IT ANIMATES WHEN IT IS LOADED, AS IN, THE MODEL SO THAT'S WHY THIS IS COMMENTED OUT
  // animate(
  //   (t) => {
  //     loadGroup.position.y = -10 + 10 * t;
  //   },
  //   { duration: 2, delay: 1 }
  // );

  camera.position.z = 2;

  // OUR RENDERER
  const render = () => {
    controls.update();

    // ADDING SCROLL-GROUP
    scrollGroup.rotation.set(0, window.scrollY * 0.001, 0);

    currentEffect += (aimEffect - currentEffect) * 0.05;

    // CONSTANTLY UPDATING OUR TIME
    noisePass.uniforms.time.value = clock.getElapsedTime();
    // UPDATING OUR CURRENTEFFECT
    noisePass.uniforms.effect.value = currentEffect;

    requestAnimationFrame(render);
    composer.render();
  };
  render();

  // THIS IS FOR THE RESPONSIVENESS OF OUR 3D MODEL  SO WHEN WE RESIZE OUR SCREEN IT ADJUSTS TO THE SCREENSIZE
  const resize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    noisePass.uniforms.aspectRatio.value =
      window.innerWidth / window.innerHeight;

    renderer.setSize(window.innerWidth, window.innerHeight);
  };

  // USING THIS FUNCTION TO USE OUR AIMEFFECT AS WE SCROLL, UPDATING IT FROM 0 TO 1 WHILE SCROLLING
  const scroll = () => {
    clearTimeout(timeoutEffect);

    aimEffect = 1;

    timeoutEffect = setTimeout(() => {
      aimEffect = 0;
    }, 500);
  };

  // WE UPDATE THE SIZE OF OUR RENDERER
  render();
  window.addEventListener("resize", resize);
  window.addEventListener("scroll", scroll);

  //   CONSOLE LOG STATE TO SEE IF MY MAIN.JS IS WORKING
  console.log("VADO");
};

export default main;
