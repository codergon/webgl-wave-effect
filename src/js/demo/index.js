import * as THREE from "three";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";

import Media from "./Media";
import { lerp } from "../utils/math";
import postvertex from "../shaders/postvertex.glsl";
import postfragment from "../shaders/postfragment.glsl";

export default class One {
  constructor() {
    this.scroll = {
      current: 0,
      target: 0,
      ease: 0.1,
    };

    this.speed = 2;
    this.cursor = 0.0;
    this.imgWidth = 0.0;
    this.strength = 0.6;
    this.widthMultiplier = 1.0;
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

    this.imgWidth = this.mediasElements[0].querySelector("img").clientWidth;

    this.medias = Array.from(this.mediasElements).map(element => {
      element.addEventListener("click", () => {
        const imgcenter =
          element.getBoundingClientRect().left + this.imgWidth / 2;
        const moveTo = imgcenter / window.innerWidth - 0.5;

        console.log(moveTo);

        if (
          Math.round(moveTo * 100) / 100 ===
          Math.round(this.scroll.target * 100) / 100
        )
          return;

        this.strength = 0.6;
        this.widthMultiplier = 1.2;
        this.scroll.target = moveTo;
      });

      let media = new Media({
        element,
        imgWidth: this.imgWidth,
        geometry: this.planeGeometry,
        scene: this.scene,
        screen: this.screen,
        strength: this.strength,
        viewport: this.viewport,
        cursor: this.cursor,
      });

      return media;
    });
  }

  /**
   * Post Processing.
   */
  initPostProcessing() {
    // Create EffectComposer and passes
    this.composer = new EffectComposer(this.renderer);
    const renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(renderPass);

    //custom shader pass
    var myEffect = {
      uniforms: {
        tDiffuse: { value: null },
        uCursor: { value: this.cursor },
        uImgWidth: { value: this.imgWidth },
        uViewportSizes: { value: [this.viewport.width, this.viewport.height] },
      },
      vertexShader: postvertex,
      fragmentShader: postfragment,
    };

    this.customPass = new ShaderPass(myEffect);
    this.customPass.renderToScreen = true;
    this.composer.addPass(this.customPass);
  }

  /**
   * Update.
   */
  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease
    );

    this.diff =
      Math.round(Math.abs(this.scroll.current - this.scroll.target) * 1000) /
      1000;

    if (this.diff < 0.01) {
      this.strength = lerp(this.strength, 0, 0.1);
      this.widthMultiplier = lerp(this.widthMultiplier, 1, 0.1);
    }

    this.cursor = this.scroll.current;

    if (this.medias)
      this.medias.forEach(media => media.update(this.cursor, this.strength));

    this.customPass.uniforms.uCursor.value = this.cursor;
    this.customPass.uniforms.uImgWidth.value =
      (this.imgWidth * this.widthMultiplier * this.viewport.width) /
      this.screen.width;

    if (this.composer) this.composer.render();

    window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Resize.
   */
  onResize() {
    this.screen = {
      height: window.innerHeight,
      width: window.innerWidth,
    };

    this.imgWidth = this.mediasElements
      ? this.mediasElements[0].querySelector("img").clientWidth
      : 0;

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

    if (this.customPass) {
      this.customPass.uniforms.uViewportSizes.value = [
        this.viewport.width,
        this.viewport.height,
      ];
    }

    this.galleryBounds = this.gallery.getBoundingClientRect();
    this.galleryHeight =
      (this.viewport.height * this.galleryBounds.height) / this.screen.height;

    if (this.medias) {
      this.medias.forEach(media =>
        media.onResize(
          {
            screen: this.screen,
            viewport: this.viewport,
          },
          this.imgWidth
        )
      );
    }
  }

  /**
   * Events.
   */
  onMouseMove(event) {
    this.mouse.x = event.clientX / window.innerWidth;
    this.mouse.y = 1 - event.clientY / window.innerHeight;

    // this.cursor = event.clientX / window.innerWidth - 0.5;
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));
    window.addEventListener("mousemove", this.onMouseMove.bind(this));
  }
}
