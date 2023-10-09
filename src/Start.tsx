import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const Start: React.FC = () => {
  const mount = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let scene: THREE.Scene;
    let camera: THREE.PerspectiveCamera | null = null;
    let renderer: THREE.WebGLRenderer | null = null;
    let cube: THREE.Mesh;

    const init = () => {
      // 创建场景
      scene = new THREE.Scene();

      // 创建相机
      camera = new THREE.PerspectiveCamera(
        75,
        mount.current!.clientWidth / mount.current!.clientHeight,
        0.1,
        1000
      );
      camera.position.set(5,5,5);
      camera.lookAt(1,0,0); // 设置相机位置

      // 灯光
      const pointLight = new THREE.PointLight( 0x333, 1, 2000 );
      pointLight.position.set(0, 0, 8);
      scene.add( pointLight );

      // 创建渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mount.current!.clientWidth, mount.current!.clientHeight);
      mount.current!.appendChild(renderer.domElement);

      // 创建几何体
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

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

  return <div ref={mount} style={{width: '100vw', height: '100vh'}}  />;
};

export default Start;
