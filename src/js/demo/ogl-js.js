import Media from "./Media";
import { Renderer, Camera, Transform, Plane } from "ogl";

export default class One {
  constructor() {
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.createGallery();

    this.onResize();

    this.createGeometry();
    this.createMedias();

    this.update();

    this.addEventListeners();
  }

  // Renderer
  createRenderer() {
    this.renderer = new Renderer({
      alpha: true,
      antialias: true,
    });

    this.renderer.dpr = window.devicePixelRatio;
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.gl = this.renderer.gl;

    document.body.appendChild(this.gl.canvas);
  }
  // Camera
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 5;
  }
  // Scene
  createScene() {
    this.scene = new Transform();
  }

  createGallery() {
    this.gallery = document.querySelector(".gallery");
  }

  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 10,
    });
  }

  createMedias() {
    this.mediasElements = document.querySelectorAll(".gallery__figure");
    this.medias = Array.from(this.mediasElements).map(element => {
      let media = new Media({
        element,
        geometry: this.planeGeometry,
        gl: this.gl,
        height: this.galleryHeight,
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

    this.camera.perspective({
      aspect: this.gl.canvas.width / this.gl.canvas.height,
    });

    const fov = this.camera.fov * (Math.PI / 180);
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
    this.renderer.render({
      scene: this.scene,
      camera: this.camera,
    });

    window.requestAnimationFrame(this.update.bind(this));
  }

  /**
   * Listeners.
   */
  addEventListeners() {
    window.addEventListener("resize", this.onResize.bind(this));

    window.addEventListener("mousewheel", this.onWheel.bind(this));
    window.addEventListener("wheel", this.onWheel.bind(this));
  }
}

import { Mesh, Program, Texture } from "ogl";
import vertex from "../shaders/vertex.glsl";
import fragment from "../shaders/fragment.glsl";

export class Media {
  constructor({ element, geometry, gl, scene, screen, viewport }) {
    this.element = element;
    this.image = this.element.querySelector("img");

    this.geometry = geometry;
    this.gl = gl;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;

    this.createMesh();
    this.createBounds();

    this.onResize();
  }

  createMesh() {
    const image = new Image();
    const texture = new Texture(this.gl);

    image.src = this.image.src;
    image.onload = _ => {
      program.uniforms.uImageSizes.value = [
        image.naturalWidth,
        image.naturalHeight,
      ];
      texture.image = image;
    };

    const program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uViewportSizes: { value: [this.viewport.width, this.viewport.height] },
        uStrength: { value: 0 },
      },
      transparent: true,
    });

    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program,
    });

    this.plane.setParent(this.scene);
  }

  createBounds() {
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();
    this.updateY();

    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
  }

  updateScale() {
    this.plane.scale.x =
      (this.viewport.width * this.bounds.width) / this.screen.width;
    this.plane.scale.y =
      (this.viewport.height * this.bounds.height) / this.screen.height;
  }

  updateX(x = 0) {
    this.plane.position.x =
      -(this.viewport.width / 2) +
      this.plane.scale.x / 2 +
      ((this.bounds.left - x) / this.screen.width) * this.viewport.width;
  }

  updateY(y = 0) {
    this.plane.position.y =
      this.viewport.height / 2 -
      this.plane.scale.y / 2 -
      ((this.bounds.top - y) / this.screen.height) * this.viewport.height -
      this.extra;
  }

  update(y) {
    this.updateScale();
    this.updateX();
    this.updateY(y);
  }

  /**
   * Events.
   */
  onResize(sizes) {
    this.extra = 0;

    if (sizes) {
      const { height, screen, viewport } = sizes;

      if (height) this.height = height;
      if (screen) this.screen = screen;
      if (viewport) {
        this.viewport = viewport;

        this.plane.program.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }

    this.createBounds();
  }
}
