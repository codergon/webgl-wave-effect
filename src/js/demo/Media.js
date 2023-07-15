import * as THREE from "three";
import vertexShader from "../shaders/vertex.glsl";
import fragmentShader from "../shaders/fragment.glsl";

export default class {
  constructor({ element, geometry, scene, screen, viewport }) {
    this.element = element;
    this.image = this.element.querySelector("img");

    this.geometry = geometry;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;

    this.createMesh();
    this.createBounds();

    this.onResize();
  }

  createMesh() {
    const image = new Image();

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(this.image.src);

    image.src = this.image.src;
    image.onload = _ => {
      this.mesh.material.uniforms.uImageSizes.value = [
        image.naturalWidth,
        image.naturalHeight,
      ];
    };

    const material = new THREE.ShaderMaterial({
      uniforms: {
        tMap: { value: texture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uViewportSizes: { value: [this.viewport.width, this.viewport.height] },
        uStrength: { value: 0 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, material);

    this.scene.add(this.mesh);
  }

  createBounds() {
    this.bounds = this.element.getBoundingClientRect();

    this.updateScale();
    this.updateX();

    this.mesh.material.uniforms.uPlaneSizes.value = [
      this.mesh.scale.x,
      this.mesh.scale.y,
    ];
  }

  updateScale() {
    this.mesh.scale.x =
      (this.viewport.width * this.bounds.width) / this.screen.width;
    this.mesh.scale.y =
      (this.viewport.height * this.bounds.height) / this.screen.height;
  }

  updateX(x = 0) {
    this.mesh.position.x =
      -(this.viewport.width / 2) +
      this.mesh.scale.x / 2 +
      ((this.bounds.left - x) / this.screen.width) * this.viewport.width;
  }

  update(y) {
    y = {
      current: 100,
      last: 10,
    };

    this.updateScale();
    this.updateX();

    this.mesh.material.uniforms.uStrength.value = -0.8;
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

        this.mesh.material.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }

    this.createBounds();
  }
}
