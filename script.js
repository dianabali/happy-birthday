// Confetti (Canvas) — gentle falling
(function(){
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  let w = canvas.width = innerWidth;
  let h = canvas.height = innerHeight;

  const pastel = ['#ffd6e0','#ffb3c7','#ff8faa','#fff0d9','#fff8ee','#e6f7f0','#e4f0ff'];

  const confetti = [];
  const CONFETTI_COUNT = Math.max(500, Math.floor((w*h)/8000)); 
  for(let i=0;i<CONFETTI_COUNT;i++){
    confetti.push({
      x: Math.random()*w,
      y: Math.random()*h,
      size: (Math.random()*6)+3,
      tilt: Math.random()*Math.PI,
      speedY: 0.6 + Math.random()*3,
      speedX: Math.random()*1.8 - 0.9,
      color: pastel[Math.floor(Math.random()*pastel.length)],
      swing: Math.random()*0.02 + 0.01
    });
  }

  function draw(){
    ctx.clearRect(0,0,w,h);
    for(let p of confetti){
      ctx.save();
      ctx.translate(p.x,p.y);
      ctx.rotate(Math.sin(p.tilt)*0.6);
      ctx.fillStyle = p.color;
      roundRect(ctx, -p.size/2, -p.size/2, p.size*1.6, p.size*0.9, p.size*0.25, true, false);
      ctx.restore();
    }
    update();
  }

  function update(){
    for(let p of confetti){
      p.tilt += p.swing;
      p.y += p.speedY;
      p.x += Math.sin(p.tilt) * 1.2 + p.speedX;
      if(p.y > h + 20){
        p.y = -20;
        p.x = Math.random()*w;
      }
      if(p.x > w + 50) p.x = -50;
      if(p.x < -50) p.x = w + 50;
    }
  }

  function roundRect(ctx, x, y, width, height, radius, fill, stroke){
    if (typeof stroke === 'undefined') stroke = true;
    if (typeof radius === 'undefined') radius = 5;
    if (typeof radius === 'number') {
      radius = {tl: radius, tr: radius, br: radius, bl: radius};
    } else {
      var defaultRadius = {tl: 0, tr: 0, br: 0, bl: 0};
      for (var side in defaultRadius) radius[side] = radius[side] || defaultRadius[side];
    }
    ctx.beginPath();
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  }

  function loop(){
    draw();
    requestAnimationFrame(loop);
  }
  loop();

  addEventListener('resize', () => {
    w = canvas.width = innerWidth;
    h = canvas.height = innerHeight;
  });
})();

// Fireworks
(function(){
  const canvas = document.getElementById('fireworks');
  const ctx = canvas.getContext('2d');
  let W = canvas.width = innerWidth;
  let H = canvas.height = innerHeight;
  const particles = [];
  const colors = ['#ff9ecb','#bcdcff','#ffe9a8','#c6f0d6','#ffd6e0'];

  function spawnFirework(){
    // spawn near top-center with random offset
    const x = W/2 + (Math.random()*360 - 180);
    const y = H*0.22 + (Math.random()*60 - 30);
    const count = 26 + Math.floor(Math.random()*18);
    const baseSpeed = 2.3 + Math.random()*2.2;
    for(let i=0;i<count;i++){
      const angle = (Math.PI * 2 * i)/count + (Math.random()*0.2 - 0.1);
      const speed = baseSpeed * (0.6 + Math.random()*2);
      particles.push({
        x,y,
        vx: Math.cos(angle)*speed,
        vy: Math.sin(angle)*speed,
        life: 60 + Math.random()*40,
        color: colors[Math.floor(Math.random()*colors.length)],
        size: 1 + Math.random()*8
      });
    }
  }

  function draw(){
    ctx.clearRect(0,0,W,H);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      ctx.beginPath();
      ctx.globalAlpha = Math.max(0, p.life / 90);
      ctx.fillStyle = p.color;
      ctx.arc(p.x, p.y, p.size, 0, Math.PI*2);
      ctx.fill();
      // motion
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.04; // gravity
      p.vx *= 0.995;
      p.life--;
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
    ctx.globalAlpha = 1;
  }

  let last = 0;
  function loop(t){
    if(t - last > 700 + Math.random()*900){ // sporadic bursts
      spawnFirework();
      last = t;
    }
    draw();
    requestAnimationFrame(loop);
  }
  loop();

  addEventListener('resize', () => {
    W = canvas.width = innerWidth;
    H = canvas.height = innerHeight;
  });
})();

// Accessibility: allow user to click background to re-burst fireworks
(function(){
  document.addEventListener('click', (e) => {
    const burst = document.createElement('div');
    burst.style.position = 'absolute';
    burst.style.left = `${e.clientX - 12}px`;
    burst.style.top = `${e.clientY - 12}px`;
    burst.style.width = '24px';
    burst.style.height = '24px';
    burst.style.borderRadius = '50%';
    burst.style.background = 'radial-gradient(circle, rgba(255,220,235,0.95) 0%, rgba(220,240,255,0.6) 40%, rgba(255,250,210,0.4) 70%, rgba(0,0,0,0) 100%)';
    burst.style.zIndex = 9;
    burst.style.pointerEvents = 'none';
    burst.style.opacity = '0.95';
    burst.style.transform = 'scale(0.2)';
    burst.style.transition = 'transform 420ms cubic-bezier(.2,.9,.2,1), opacity 420ms ease-out';
    document.body.appendChild(burst);
    requestAnimationFrame(()=> { burst.style.transform = 'scale(1.6)'; burst.style.opacity = '0'; });
    setTimeout(()=> burst.remove(), 450);
  });
})();