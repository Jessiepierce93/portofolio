/* ============================================================
   SCENE.js — elegant 3D background with Three.js
   (subtle floating particles + parallax, not a full game)
   ============================================================ */
(function () {
    'use strict';

    const canvas = document.getElementById('scene-canvas');
    if (!canvas || typeof THREE === 'undefined') return;

    // Respect reduced motion
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();

    // Subtle fog for depth
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0008);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    /* ---------- Particle field ---------- */
    const count = 700;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 160;
    }

    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMat = new THREE.PointsMaterial({
        color: 0x2dd4bf,
        size: 0.18,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    /* ---------- Central accent shape (subtle) ---------- */
    const shapeGeo = new THREE.IcosahedronGeometry(6, 1);
    const shapeMat = new THREE.MeshBasicMaterial({
        color: 0x2dd4bf,
        wireframe: true,
        transparent: true,
        opacity: 0.12,
    });
    const shape = new THREE.Mesh(shapeGeo, shapeMat);
    shape.position.set(0, 0, -20);
    scene.add(shape);

    /* ---------- Mouse parallax target ---------- */
    let mouseX = 0, mouseY = 0;

    document.addEventListener('mousemove', function (e) {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    /* ---------- Animate loop ---------- */
    let raf;
    function animate() {
        raf = requestAnimationFrame(animate);

        // rotate particles slowly
        particles.rotation.y += 0.0006;
        particles.rotation.x += 0.0002;

        // subtle breathing on the shape
        const t = Date.now() * 0.0004;
        shape.scale.setScalar(1 + Math.sin(t) * 0.03);
        shape.rotation.y += 0.001;
        shape.rotation.x += 0.0005;

        // parallax camera following the mouse
        camera.position.x += (mouseX * 2 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 2 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, -10);

        renderer.render(scene, camera);
    }

    /* ---------- Resize ---------- */
    function onResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
    window.addEventListener('resize', onResize);

    if (reduced) {
        // render a single static frame, no animation
        renderer.render(scene, camera);
    } else {
        animate();
    }

    // Expose cleanup (optional)
    window.__sceneDestroy = function () {
        if (raf) cancelAnimationFrame(raf);
        scene.traverse(function (o) {
            if (o.geometry) o.geometry.dispose();
            if (o.material) o.material.dispose();
        });
    };
})();