import gsap from 'gsap';

export class Timeline {
  constructor(sceneManager, world) {
    this.sceneManager = sceneManager;
    this.world = world;
    
    this.speed = 0;
    this.baseSpeed = 0.3; // Slightly faster base speed
    this.maxSpeed = 1.2;
    this.score = 0;
    
    this.createScoreUI();
    
    window.addEventListener('scroll', () => {
        this.speed = this.maxSpeed;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.speed = this.baseSpeed;
        }, 200);
    });
    
    this.speed = this.baseSpeed;
  }

  createScoreUI() {
      // Ensure UI hook exists
      let ui = document.getElementById('score-uid');
      if(!ui) {
          ui = document.createElement('div');
          ui.id = 'score-uid';
          ui.style.position = 'fixed';
          ui.style.top = '20px';
          ui.style.left = '20px';
          ui.style.color = '#fff';
          ui.style.fontFamily = 'monospace';
          ui.style.fontSize = '2rem';
          ui.style.fontWeight = 'bold';
          ui.style.zIndex = '100';
          ui.style.textShadow = '0 2px 4px rgba(0,0,0,0.5)';
          document.body.appendChild(ui);
      }
      this.scoreEl = ui;
      this.updateScore(0);
  }

  updateScore(points) {
      this.score += points;
      this.scoreEl.innerText = `SCORE: ${this.score}`;
  }

  checkCollisions() {
      // Simple distance check between Player (0,0,0) and Stars
      const playerPos = this.world.player.position;
      
      this.world.stars.forEach(s => {
          if(!s.visible) return;
          
          // Distance checks
          const dx = s.position.x - playerPos.x;
          const dz = s.position.z - playerPos.z;
          
          // Simple box collision
          if(Math.abs(dx) < 1.0 && Math.abs(dz) < 1.0) {
              // Collected!
              s.visible = false;
              this.updateScore(100);
              
              // Pop animation
              const temp = s.clone();
              temp.position.copy(s.position);
              this.world.mesh.add(temp);
              
              gsap.to(temp.scale, { x: 2, y: 2, duration: 0.2 });
              gsap.to(temp.material, { opacity: 0, duration: 0.2, onComplete: () => {
                  this.world.mesh.remove(temp);
              }});
          }
      });
  }

  update() {
      // Decay
      if(this.speed > this.baseSpeed) {
          this.speed *= 0.95;
      }
      
      this.world.update(this.speed);
      this.checkCollisions();
  }
}
