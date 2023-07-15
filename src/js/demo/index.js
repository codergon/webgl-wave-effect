import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

import Media from "./Media";
import postvertex from "../shaders/postvertex.glsl";
import postfragment from "../shaders/postfragment.glsl";

export default class One {
  constructor() {
    this.mouse = new THREE.Vector2();

    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.createGallery();

    this.onResize();

    this.createGeometry();
    this.createMedias();

    this.initPostProcessing();

    this.update();

    this.addEventListeners();
  }

  // Post processing
  initPostProcessing() {
    // Create EffectComposer and passes
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    //custom shader pass
    var myEffect = {
      uniforms: {
        tDiffuse: { value: null },
        resolution: {
          value: new THREE.Vector2(1, window.innerHeight / window.innerWidth),
        },
        uMouse: { value: new THREE.Vector2(-10, -10) },
        uVelo: { value: 0.05 },
      },
      vertexShader: postvertex,
      fragmentShader: postfragment,
    };

    this.customPass = new ShaderPass(myEffect);
    this.customPass.renderToScreen = true;
    this.composer.addPass(this.customPass);
  }

  onMouseMove(event) {
    this.mouse.x = event.clientX / window.innerWidth;
    this.mouse.y = 1 - event.clientY / window.innerHeight;
  }

  // Renderer
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    document.body.appendChild(this.renderer.domElement);
  }

  // Camera
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.z = 5;
  }

  // Scene
  createScene() {
    this.scene = new THREE.Scene();
  }

  createGallery() {
    this.gallery = document.querySelector(".gallery");
  }

  createGeometry() {
    this.planeGeometry = new THREE.PlaneGeometry(1, 1, 10);
  }

  createMedias() {
    this.mediasElements = document.querySelectorAll(".gallery__figure");
    this.medias = Array.from(this.mediasElements).map(element => {
      let media = new Media({
        element,
        geometry: this.planeGeometry,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
      });

      return media;
    });
  }

  /**
   * Wheel.
   */
  onWheel(event) {}

  /**
   * Resize.
   */
  onResize() {
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth,
    };

    this.renderer.setSize(this.screen.width, this.screen.height);

    this.camera.aspect = this.screen.width / this.screen.height;
    this.camera.updateProjectionMatrix();

    const fov = THREE.MathUtils.degToRad(this.camera.fov);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.viewport = {
      height,
      width,
    };

    this.galleryBounds = this.gallery.getBoundingClientRect();
    this.galleryHeight =
      (this.viewport.height * this.galleryBounds.height) / this.screen.height;

    if (this.medias) {
      this.medias.forEach(media =>
        media.onResize({
          screen: this.screen,
          viewport: this.viewport,
        })
      );
    }
  }

  /**
   * Update.
   */
  update() {
    // this.renderer.render(this.scene, this.camera);

    this.customPass.uniforms.uMouse.value = this.mouse;
    if (this.composer) this.composer.render();

    window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));

    window.addEventListener("mousewheel", this.onWheel.bind(this));
    window.addEventListener("wheel", this.onWheel.bind(this));

    window.addEventListener("mousemove", this.onMouseMove.bind(this));
  }
}
