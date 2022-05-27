(function () {
  const container = document.getElementById("globe");
  const canvas = container.getElementsByTagName("canvas")[0];

  function init(points) {
    const { width, height } = container.getBoundingClientRect();

    // 1. Setup scene
    const scene = new THREE.Scene();
    // 2. Setup camera
    const camera = new THREE.PerspectiveCamera(45, width / height);
    // 3. Setup renderer
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(width, height);

    const color = 0x1f1fc6;
    const intensity = 2;
    const light = new THREE.PointLight(color, intensity);

    light.position.set(-484, 365, 294);
    light.castShadow = true;
    light.angle = 1;
    scene.add(camera);
    camera.add(light);

    // Single geometry to contain all points.
    const mergedGeometry = new THREE.Geometry();
    // Material that the points will be made of.
    // const pointGeometry = new THREE.SphereGeometry(0.5, 1, 1);

    const pointGeometry = new THREE.BoxGeometry(0.5, 1.0, 1.0);

    pointGeometry.applyMatrix(new THREE.Matrix4().makeRotationZ(Math.PI / 3));
    pointGeometry.applyMatrix(new THREE.Matrix4().makeScale(1, 1, 1));

    const pointMaterial = new THREE.MeshBasicMaterial({
      color: "#7C83DB"
    });
    const globeMaterial = new THREE.MeshStandardMaterial({
      color: "#070A2D"
    });

    const globeRadius = 100;
    const globeWidth = 4098 / 2;
    const globeHeight = 1968 / 2;

    const globeBgGeometry = new THREE.SphereGeometry(100, 200, 200);

    const globeShape = new THREE.Mesh(mergedGeometry, pointMaterial);
    const globeBgShape = new THREE.Mesh(globeBgGeometry, globeMaterial);

    for (let point of points) {
      const { x, y, z } = convertFlatCoordsToSphereCoords(
        point.x,
        point.y,
        width,
        height
      );

      pointGeometry.translate(x, y, z);
      mergedGeometry.merge(pointGeometry);
      pointGeometry.translate(-x, -y, -z);
    }

    const date = new Date();
    const timeZoneOffset = date.getTimezoneOffset() || 0;
    const timeZoneMaxOffset = 60 * 12;
    const rotate = 0 + Math.PI * (timeZoneOffset / timeZoneMaxOffset);

    globeShape.rotation.y = rotate - 300;

    scene.add(globeShape);
    scene.add(globeBgShape);

    var customMaterial = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: document.getElementById("vertexShader").textContent,
      fragmentShader: document.getElementById("fragmentShader").textContent,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });
    var customMaterial2 = new THREE.ShaderMaterial({
      uniforms: {},
      vertexShader: document.getElementById("vertexShader2").textContent,
      fragmentShader: document.getElementById("fragmentShader2").textContent,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    var ballGeometry = new THREE.SphereGeometry(108, 36, 18);
    var ball = new THREE.Mesh(ballGeometry, customMaterial);
    scene.add(ball);
    var ball2 = new THREE.Mesh(ballGeometry, customMaterial2);
    scene.add(ball2);

    camera.orbitControls = new THREE.OrbitControls(camera, canvas);
    camera.orbitControls.enablePan = true;
    camera.orbitControls.enableRotate = true;
    camera.orbitControls.autoRotate = true;
    // Tweak this value based on how far/away you'd like the camera
    // to be from the globe.
    camera.position.z = 400;

    function convertFlatCoordsToSphereCoords(x, y) {
      let latitude = ((x - globeWidth) / globeWidth) * -180;
      let longitude = ((y - globeHeight) / globeHeight) * -90;
      latitude = (latitude * Math.PI) / 180;
      longitude = (longitude * Math.PI) / 180;
      const radius = Math.cos(longitude) * globeRadius;

      return {
        x: Math.cos(latitude) * radius,
        y: Math.sin(longitude) * globeRadius,
        z: Math.sin(latitude) * radius
      };
    }

    // 4. Use requestAnimationFrame to recursively draw the scene in the DOM.
    function animate() {
      camera.orbitControls.update();
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    }
    animate();
  }

  function hasWebGL() {
    const gl =
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
    if (gl && gl instanceof WebGLRenderingContext) {
      return true;
    } else {
      return false;
    }
  }

  if (hasWebGL()) {
    window
      .fetch("https://cdn.jsdelivr.net/gh/danielunited/gists/globe/points.json")
      .then((response) => response.json())
      .then((data) => {
        init(data.points);
      });
  }
})();
