import * as THREE from 'three';

export class World {
  constructor(scene) {
    this.scene = scene;
    this.mesh = new THREE.Group();

    // Fog for depth
    this.scene.fog = new THREE.FogExp2(0xe0b0ff, 0.02);

    this.textures = this.loadTextures();

    // 1. Skybox
    this.createSkybox();

    // 2. Road System 
    this.roadChunks = [];
    this.chunkSize = 20;
    this.initRoad();

    // 3. City
    this.buildings = [];
    this.initCity();

    // 4. Collectibles (Stars) - NEW
    this.stars = [];
    this.initStars();

    // 5. Player
    this.player = this.createPlayer();
    this.mesh.add(this.player);

    // Light
    const ambient = new THREE.AmbientLight(0xffffff, 0.8);
    this.scene.add(ambient);
    
    const sun = new THREE.DirectionalLight(0xffaa00, 1.5);
    sun.position.set(10, 20, -10);
    this.scene.add(sun);
  }

  loadTextures() {
    const loader = new THREE.TextureLoader();
    
    // Helper to handle loading errors
    const load = (path) => {
        return loader.load(path, undefined, undefined, (err) => {
            console.error(`Error loading texture ${path}:`, err);
        });
    };

    const road = load('./assets/textures/asphalt_road.png');
    road.wrapS = THREE.RepeatWrapping;
    road.wrapT = THREE.RepeatWrapping;
    road.repeat.set(1, 4);
    road.colorSpace = THREE.SRGBColorSpace;
    
    const building = load('./assets/textures/building.png');
    building.colorSpace = THREE.SRGBColorSpace;
    
    const sky = load('./assets/textures/skybox.png');
    sky.colorSpace = THREE.SRGBColorSpace;

    const star = load('./assets/textures/star.png');
    star.colorSpace = THREE.SRGBColorSpace;

    return { road, building, sky, star };
  }

  createSkybox() {
      const geo = new THREE.SphereGeometry(100, 32, 32);
      const mat = new THREE.MeshBasicMaterial({ 
          map: this.textures.sky, 
          side: THREE.BackSide,
          color: 0xffffff // Ensure no tint makes it invisible
      });
      const sky = new THREE.Mesh(geo, mat);
      this.scene.add(sky);
  }

  initRoad() {
    const geo = new THREE.PlaneGeometry(10, this.chunkSize);
    const mat = new THREE.MeshStandardMaterial({ 
        map: this.textures.road,
        roughness: 0.8,
        color: 0x888888 
    });
    
    for(let i=0; i<6; i++) {
        const mesh = new THREE.Mesh(geo, mat);
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.z = -i * this.chunkSize;
        this.mesh.add(mesh);
        this.roadChunks.push(mesh);
    }
  }

  initCity() {
      const geo = new THREE.BoxGeometry(4, 15, 4);
      const mat = new THREE.MeshStandardMaterial({ map: this.textures.building });
      
      for(let i=0; i<30; i++) {
          const b = new THREE.Mesh(geo, mat);
          this.resetBuilding(b);
          this.mesh.add(b);
          this.buildings.push(b);
      }
  }

  resetBuilding(b) {
      b.position.x = (Math.random() > 0.5 ? 1 : -1) * (8 + Math.random() * 5);
      b.position.z = -20 - Math.random() * 100;
      b.position.y = 7.5;
  }

  initStars() {
      const geo = new THREE.PlaneGeometry(1, 1);
      const mat = new THREE.MeshBasicMaterial({ 
          map: this.textures.star, 
          transparent: true,
          side: THREE.DoubleSide
      });

      for(let i=0; i<10; i++) {
          const s = new THREE.Mesh(geo, mat);
          this.resetStar(s);
          this.mesh.add(s);
          this.stars.push(s);
      }
  }

  resetStar(s) {
      // Random lane (Left, Center, Right)
      const lane = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
      s.position.x = lane * 3; 
      s.position.z = -20 - Math.random() * 50;
      s.position.y = 1;
      s.visible = true;
  }

  createPlayer() {
      const group = new THREE.Group();
      
      // Scooter Body
      const bodyGeo = new THREE.BoxGeometry(1, 0.2, 2);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff0055 });
      const body = new THREE.Mesh(bodyGeo, bodyMat);
      body.position.y = 0.5;
      group.add(body);
      
      // Handlebar
      const barGeo = new THREE.BoxGeometry(2, 0.1, 0.1);
      const bar = new THREE.Mesh(barGeo, bodyMat);
      bar.position.set(0, 1.5, -0.8);
      group.add(bar);
      
      const stemGeo = new THREE.BoxGeometry(0.1, 1.2, 0.1);
      const stem = new THREE.Mesh(stemGeo, bodyMat);
      stem.position.set(0, 1, -0.8);
      group.add(stem);

      return group;
  }

  update(speed) {
    // Road Scroll
    this.roadChunks.forEach(chunk => {
        chunk.position.z += speed;
        if(chunk.position.z > this.chunkSize) {
            chunk.position.z -= this.chunkSize * 6;
        }
    });

    // Building Scroll
    this.buildings.forEach(b => {
        b.position.z += speed;
        if(b.position.z > 10) {
            this.resetBuilding(b);
        }
    });

    // Star Scroll & Rotation
    this.stars.forEach(s => {
        s.rotation.y += 0.05;
        s.position.z += speed;
        if(s.position.z > 5) {
            this.resetStar(s);
        }
    });

    // Player Wobble
    this.player.rotation.z = Math.sin(Date.now() * 0.005) * 0.05;
  }
}
