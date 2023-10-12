import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';

// 创建了两个gui，不知道哪出问题了

const guiDefault = {
  size: 1,
  transparent: true,
  opacity: 0.6,
  vertexColors: true,
  color: 0xffffff,
  vertexColor: 0x00ff00,
  sizeAttenuation: true,
  rotate: true,
};

const Sprite: React.FC = () => {
  const mount = useRef<HTMLDivElement>(null);
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let cube: THREE.Mesh;
  let sprite: THREE.Sprite | null = null;
  let points: THREE.Points | null = null;
  const sprites = new THREE.Group();

  const createPointSprites = () => {
    const pointGeometry = new THREE.BufferGeometry();
    const pointMaterial = new THREE.PointsMaterial({
      size: 1,
      vertexColors: true,
      color: 0xffffff,
    });

    const veticsFloat32Arr = [];
    const veticsColors = [];

    for (let x = -15; x < 15; x++) {
      for (let y = -15; y < 15; y++) {
        veticsFloat32Arr.push(x * 4, y * 4, 0);
        const randomColor = new THREE.Color(Math.random() * 0xffffff);
        veticsColors.push(randomColor.r, randomColor.g, randomColor.b);
      }
    }

    const vertices = new THREE.Float32BufferAttribute(veticsFloat32Arr, 3);
    const colors = new THREE.Float32BufferAttribute(veticsColors, 3);
    pointGeometry.attributes.position = vertices;
    pointGeometry.attributes.color = colors;
    points = new THREE.Points(pointGeometry, pointMaterial);
    points.rotation.y = (90 * Math.PI) / 180;
    scene.add(points);
  };

  const createPointSpritesCtrls = (ctrls) => {
    const pointGeometry = new THREE.BufferGeometry();
    const pointMaterial = new THREE.PointsMaterial({
      size: ctrls.size,
      transparent: ctrls.transparent,
      opacity: ctrls.opacity,
      vertexColors: ctrls.vertexColors,
      color: new THREE.Color(ctrls.color),
      sizeAttenuation: ctrls.sizeAttenuation,
    });

    if (ctrls.vertexColors) {
      const veticsFloat32Arr = [];
      const veticsColors = [];

      for (let x = -15; x < 15; x++) {
        for (let y = -15; y < 15; y++) {
          veticsFloat32Arr.push(x * 4, y * 4, 0);
          const randomColor = new THREE.Color(
            Math.random() * ctrls.vertexColors,
          );
          veticsColors.push(randomColor.r, randomColor.g, randomColor.b);
        }
      }

      const vertices = new THREE.Float32BufferAttribute(veticsFloat32Arr, 3);
      const colors = new THREE.Float32BufferAttribute(veticsColors, 3);
      pointGeometry.attributes.position = vertices;
      pointGeometry.attributes.color = colors;
    }
    points = new THREE.Points(pointGeometry, pointMaterial);
    points.rotation.y = (90 * Math.PI) / 180;
    points.name = 'points';
    scene.add(points);
  };

  const redraw = (name: string, value) => {
    // 根据name修改value
    console.log(scene.getObjectByName('points'));
    const obj = scene.getObjectByName('points');
    console.log(obj);
    if (obj) {
      if (name === 'size') {
        obj.material.size = value;
      } else if (name === 'transparent') {
        obj.material.transparent = value;
      } else if (name === 'opacity') {
        obj.material.opacity = value;
      }
      const veticsColors = [];

      for (let x = -15; x < 15; x++) {
        for (let y = -15; y < 15; y++) {
          const randomColor = new THREE.Color(Math.random() * 0xffffff);
          veticsColors.push(randomColor.r, randomColor.g, randomColor.b);
        }
      }

      const colors = new THREE.Float32BufferAttribute(veticsColors, 3);
      obj.geometry.attributes.color = colors;
      // scene.remove(scene.getObjectByName('points'));
    }
  };

  useEffect(() => {
    const init = () => {
      // 创建场景
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a1a);
      // scene.fog = new THREE.Fog(0x333, 1, 1000);
      const axesHelper = new THREE.AxesHelper(500);
      scene.add(axesHelper);

      const gui = new dat.GUI();
      gui
        .add(guiDefault, 'size', 0, 10)
        .onChange((e: number) => redraw('size', e));
      gui
        .add(guiDefault, 'transparent')
        .onChange((e) => redraw('transparent', e));
      gui
        .add(guiDefault, 'opacity', 0, 1)
        .onChange((e) => redraw('opacity', e));

      // 创建相机
      camera = new THREE.PerspectiveCamera(
        70,
        mount.current!.clientWidth / mount.current!.clientHeight,
        0.1,
        1000,
      );
      camera.position.set(0, 0, 120);
      camera.lookAt(0, 0, 0); // 设置相机位置
      camera.updateProjectionMatrix();

      // 灯光
      const amberLight = new THREE.AmbientLight(0xffffff, 15);
      scene.add(amberLight);

      // 创建渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mount.current!.clientWidth, mount.current!.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0.0);
      mount.current!.appendChild(renderer.domElement);

      const geometry = new THREE.BoxGeometry(10, 10, 10);
      const material = new THREE.MeshBasicMaterial({
        color: 0xfffc00,
        wireframe: true,
      });
      cube = new THREE.Mesh(geometry, material);
      cube.position.set(0, 0, 0);
      scene.add(cube);

      // 画线
      const lineMaterial = new THREE.LineBasicMaterial({ color: 0x03c03c });
      const lineGeometry = new THREE.BufferGeometry();
      const linePoints = [];
      linePoints.push(new THREE.Vector3(20, 20, 0));
      linePoints.push(new THREE.Vector3(20, -20, 0));
      linePoints.push(new THREE.Vector3(-20, -20, 0));
      linePoints.push(new THREE.Vector3(-20, 20, 0));
      lineGeometry.setFromPoints(linePoints);
      const line = new THREE.LineLoop(lineGeometry, lineMaterial);
      scene.add(line);

      // 粒子
      for (let x = -15; x < 15; x++) {
        for (let y = -15; y < 15; y++) {
          const material = new THREE.SpriteMaterial({
            color: Math.random() * 0xffffff,
          });
          sprite = new THREE.Sprite(material);
          sprite.position.set(x * 4, y * 4, 0);
          sprites.add(sprite);
        }
      }
      scene.add(sprites);

      createPointSpritesCtrls(guiDefault);

      // 创建控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.minDistance = 10;
      controls.maxDistance = 500;

      // 渲染场景
      animate();
    };

    const animate = () => {
      requestAnimationFrame(animate);

      // 旋转几何体
      if (cube) {
        // cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
      }

      if (sprites) {
        // sprites.rotation.x += 0.02;
        sprites.rotation.y += 0.02;
      }

      if (points) {
        points.rotation.y += 0.02;
      }

      // 渲染场景
      if (renderer) {
        renderer.setClearColor(0x000000, 0);

        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);

        renderer.render(scene, camera!);
      }
    };

    init();

    // 组件卸载时清除资源
    return () => {
      if (mount.current && renderer) {
        mount.current.removeChild(renderer.domElement);
        renderer.dispose();
      }
      camera = null;
      renderer = null;
    };
  }, []);

  return <div ref={mount} style={{ width: '100vw', height: '100vh' }} />;
};

export default Sprite;
