// Basic Setup
const container = document.getElementById('webgl-container');
const scene = new THREE.Scene();

// Camera setup for First-Person View (Fariha's View)
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 1.6, 6); 

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

// Night Environment Lights
scene.fog = new THREE.FogExp2(0x050515, 0.035);

const ambientLight = new THREE.AmbientLight(0x222255, 1.2);
scene.add(ambientLight);

const moonLight = new THREE.DirectionalLight(0x88bbff, 1.5);
moonLight.position.set(15, 30, -20);
moonLight.castShadow = true;
scene.add(moonLight);

// Create Night Moonlight, River & Ground Setup
function createWorld() {
    // Grass Ground
    const planeGeo = new THREE.PlaneGeometry(100, 100);
    const planeMat = new THREE.MeshStandardMaterial({ color: 0x0a1a0a, roughness: 0.9 });
    const ground = new THREE.Mesh(planeGeo, planeMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // River
    const riverGeo = new THREE.PlaneGeometry(100, 15);
    const riverMat = new THREE.MeshStandardMaterial({ color: 0x001133, roughness: 0.1, metalness: 0.8 });
    const river = new THREE.Mesh(riverGeo, riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.01, -12);
    scene.add(river);

    // Glowing Moon
    const moonGeo = new THREE.SphereGeometry(2.5, 32, 32);
    const moonMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const moon = new THREE.Mesh(moonGeo, moonMat);
    moon.position.set(12, 22, -35);
    scene.add(moon);
}

createWorld();

// 3D Objects Elements (Table, Chair, Cake, Cat, Smart Guy)
let candleFlames = [];
let cat, smartGuy;

function createSceneObjects() {
    // Table
    const tableGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.8, 32);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0x3d2314 });
    const table = new THREE.Mesh(tableGeo, tableMat);
    table.position.set(0, 0.4, -3.5);
    scene.add(table);

    // Fariha's Chair
    const chairGeo = new THREE.BoxGeometry(0.6, 0.8, 0.6);
    const chairMat = new THREE.MeshStandardMaterial({ color: 0x2b180d });
    const chairFariha = new THREE.Mesh(chairGeo, chairMat);
    chairFariha.position.set(0, 0.4, -2.2);
    scene.add(chairFariha);

    // Your Chair
    const chairYou = new THREE.Mesh(chairGeo, chairMat);
    chairYou.position.set(0, 0.4, -4.8);
    scene.add(chairYou);

    // Cake
    const cakeGeo = new THREE.CylinderGeometry(0.35, 0.35, 0.25, 32);
    const cakeMat = new THREE.MeshStandardMaterial({ color: 0xffa0b4 });
    const cake = new THREE.Mesh(cakeGeo, cakeMat);
    cake.position.set(0, 0.92, -3.5);
    scene.add(cake);

    // Candles on Cake
    for (let i = -0.1; i <= 0.1; i += 0.1) {
        const candleGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12);
        const candleMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const candle = new THREE.Mesh(candleGeo, candleMat);
        candle.position.set(i, 1.1, -3.5);
        scene.add(candle);

        // Candle Flame Light
        const flameLight = new THREE.PointLight(0xffaa00, 0.8, 1.5);
        flameLight.position.set(i, 1.18, -3.5);
        scene.add(flameLight);
        candleFlames.push(flameLight);
    }

    // Cat Representation
    const catGeo = new THREE.SphereGeometry(0.2, 16, 16);
    const catMat = new THREE.MeshStandardMaterial({ color: 0xffaa44 });
    cat = new THREE.Mesh(catGeo, catMat);
    cat.position.set(0.5, 0.2, 3);
    scene.add(cat);

    // Ball of Yarn
    const ballGeo = new THREE.SphereGeometry(0.1, 16, 16);
    const ballMat = new THREE.MeshStandardMaterial({ color: 0xff3366 });
    const ball = new THREE.Mesh(ballGeo, ballMat);
    ball.position.set(0.8, 0.1, 3.2);
    scene.add(ball);

    // Smart Guy Model Representation (Black Shirt)
    const guyGeo = new THREE.CylinderGeometry(0.25, 0.25, 1.5);
    const guyMat = new THREE.MeshStandardMaterial({ color: 0x111111 }); // Black Shirt
    smartGuy = new THREE.Mesh(guyGeo, guyMat);
    smartGuy.position.set(-1.5, 0.75, 2);
    scene.add(smartGuy);
}

createSceneObjects();

// Dialogue Controller
function showDialogue(text) {
    const box = document.getElementById('dialogue-box');
    const txt = document.getElementById('dialogue-text');
    txt.innerText = text;
    box.classList.remove('hidden');
}

function hideDialogue() {
    document.getElementById('dialogue-box').classList.add('hidden');
}

// Story Sequence Timeline
document.getElementById('start-btn').addEventListener('click', () => {
    document.getElementById('start-overlay').classList.add('hidden');
    runStoryTimeline();
});

function runStoryTimeline() {
    // Step 1: Cat playing scene
    showDialogue("🐱 (A cute cat playing with a yarn ball near your feet...)");

    // Step 2: Picking up cat & Dialogue
    setTimeout(() => {
        // Move smart guy closer to cat
        smartGuy.position.set(0.2, 0.75, 2.8);
        cat.position.set(0.2, 1.1, 2.8); // Picked up in arms
        showDialogue("🙋‍♂️ Smart Guy (Black Shirt): Come with me...");
    }, 4000);

    // Step 3: Walking towards table (Camera Moves - First Person)
    setTimeout(() => {
        hideDialogue();
        smoothMoveCamera(0, 1.4, -1.8, 4000, () => {
            showDialogue("🙋‍♂️ You: Please, have a seat.");
            
            // Guy sits down & puts cat down
            smartGuy.position.set(0, 0.75, -4.8);
            cat.position.set(0.5, 0.2, -4.5);
        });
    }, 8000);

    // Step 4: Birthday Wish & Interactive Blow Candle
    setTimeout(() => {
        showDialogue("🎉 Happy Birthday my good friend, Fariha! 🎂");
        document.getElementById('interaction-prompt').classList.remove('hidden');
    }, 14000);
}

// Camera Movement Function
function smoothMoveCamera(targetX, targetY, targetZ, duration, onComplete) {
    const startX = camera.position.x;
    const startY = camera.position.y;
    const startZ = camera.position.z;
    const startTime = performance.now();

    function animateCam(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        camera.position.x = startX + (targetX - startX) * progress;
        camera.position.y = startY + (targetY - startY) * progress;
        camera.position.z = startZ + (targetZ - startZ) * progress;

        if (progress < 1) {
            requestAnimationFrame(animateCam);
        } else if (onComplete) {
            onComplete();
        }
    }
    requestAnimationFrame(animateCam);
}

// Blow Candle Button Interaction
document.getElementById('blow-candle-btn').addEventListener('click', () => {
    document.getElementById('interaction-prompt').classList.add('hidden');
    
    // Extinguish candles
    candleFlames.forEach(flame => flame.intensity = 0);
    playBlowSound();

    showDialogue("✨ May Allah bless you and make all your wishes come true!");

    setTimeout(() => {
        showDialogue("🎁 Because of our long distance friendship I can't give you any physical gift... so as a gift, you will do everything you told me to do for the rest of the day! 😉❤️");
    }, 6000);
});

// Sound Effect
function playBlowSound() {
    try {
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'white';
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 1.2);
    } catch(e){}
}

// Render Loop
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// Screen Resize Handler
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
