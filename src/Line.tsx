import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

class CustomSinCurve extends THREE.Curve {
  constructor(scale = 1) {
    super();
    this.scale = scale;
  }
  getPoint(t, optionalTarget = new THREE.Vector3()) {
    const tx = t * 3 - 1.5;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;
    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}

const Line: React.FC = () => {
  const mount = useRef<HTMLDivElement>(null);
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let cube: THREE.Mesh;
  let updateLine;
  const MAX_POINTS = 500;

  useEffect(() => {
    const init = () => {
      // 创建场景
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a1a);
      // scene.fog = new THREE.Fog(0x333, 1, 1000);

      // 创建相机
      camera = new THREE.PerspectiveCamera(
        70,
        mount.current!.clientWidth / mount.current!.clientHeight,
        1,
        1000,
      );
      camera.position.set(-100, 0, 0);
      // camera.lookAt(100,100,0); // 设置相机位置
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
      cube.position.set(-300, 0, 0);
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

      const line2Geometry = new THREE.BufferGeometry();
      // 创建曲线
      const curve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(-10, -20, -10),
        new THREE.Vector3(-10, 40, -10),
        new THREE.Vector3(10, 40, 10),
        new THREE.Vector3(10, -20, 10),
      );
      // getPoints 方法从曲线中获取点
      const points = curve.getPoints(100);
      // 将这系列点赋值给几何体
      line2Geometry.setFromPoints(points);
      // 创建材质
      const line2Material = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const line2 = new THREE.Line(line2Geometry, line2Material);
      scene.add(line2);

      const tubeGeometry = new THREE.TubeGeometry(
        new CustomSinCurve(10),
        20,
        2,
        8,
        false,
      );
      const tubeMaterial = new THREE.MeshStandardMaterial({
        color: 0x156289,
        emissive: 0x072534,
        side: THREE.DoubleSide,
      });
      const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
      scene.add(tube);

      // 绘制生长的线
      // 创建几何体
      const updateGeometry = new THREE.BufferGeometry();
      // 设置几何体的属性
      const updatePositions = new Float32Array(MAX_POINTS * 3); // 一个顶点向量需要3个位置描述
      updateGeometry.setAttribute(
        'position',
        new THREE.BufferAttribute(updatePositions, 3),
      );
      // 控制绘制范围
      const drawCount = 2; // 只绘制前两个点
      updateGeometry.setDrawRange(0, drawCount);
      // 创建材质
      const updateMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      // 创建线
      updateLine = new THREE.Line(updateGeometry, updateMaterial);
      scene.add(updateLine);
      updateLine.geometry.attributes.position.needsUpdate = true; // 需要加在第一次渲染之后

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
        cube.rotation.x += 0.01;
        cube.rotation.z += 0.01;
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

export default Line;
