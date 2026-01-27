import * as THREE from 'three';

export class SceneManager {
    constructor(canvas) {
        this.canvas = canvas;
        this.screenDimensions = {
            width: window.innerWidth,
            height: window.innerHeight
        };

        this.scene = this.buildScene();
        this.renderer = this.buildRenderer(this.screenDimensions);
        this.camera = this.buildCamera(this.screenDimensions);

        this.subjects = [];

        // Bind resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    buildScene() {
        const scene = new THREE.Scene();
        // Warm purple fog matching the sunset skybox
        scene.fog = new THREE.FogExp2(0x221133, 0.015);

        // Load Skybox/Environment
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./assets/textures/skybox.png');
        texture.mapping = THREE.EquirectangularReflectionMapping;
        texture.colorSpace = THREE.SRGBColorSpace;

        scene.background = texture;
        scene.environment = texture; // Enable PBR reflections

        return scene;
    }

    buildRenderer({ width, height }) {
        const renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        // Output encoding for better colors
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        return renderer;
    }

    buildCamera({ width, height }) {
        const aspectRatio = width / height;
        const fieldOfView = 60;
        const nearPlane = 0.1;
        const farPlane = 300;
        const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, nearPlane, farPlane);
        // Initial position
        camera.position.set(0, 2, 5);
        return camera;
    }

    addSubject(subject) {
        this.subjects.push(subject);
        this.scene.add(subject.mesh);
    }

    update() {
        for (const subject of this.subjects)
            subject.update();

        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        const { innerWidth, innerHeight } = window;
        this.screenDimensions.width = innerWidth;
        this.screenDimensions.height = innerHeight;

        this.camera.aspect = innerWidth / innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(innerWidth, innerHeight);
    }
}
