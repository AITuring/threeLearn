import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Line2 } from 'three/examples/jsm/lines/Line2.js';


const Planet: React.FC = () => {
  const mount = useRef<HTMLDivElement>(null);
  const axis = new THREE.Vector3(0,0,1);
  const loader = new GLTFLoader();
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera | null = null;
  let renderer: THREE.WebGLRenderer | null = null;
  let cube: THREE.Mesh;
  let planet: THREE.Mesh;
  let ring:THREE.Mesh;
  let satellite: THREE.Mesh;
  const stars = new THREE.Group();
  let rot = 0;
  const plane = new THREE.Group();


  useEffect(() => {

    const init = () => {
      // 创建场景
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a1a);
      scene.fog = new THREE.Fog(0x333, 1, 1000);

      // 创建相机
      camera = new THREE.PerspectiveCamera(
        40,
        mount.current!.clientWidth / mount.current!.clientHeight,
        0.1,
        1000
      );
      camera.position.set(20,100,450);
      // camera.lookAt(1,0,0); // 设置相机位置

      // 灯光
      const amberLight = new THREE.AmbientLight(0xffffff, 15);
      scene.add(amberLight);

      // 创建渲染器
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(mount.current!.clientWidth, mount.current!.clientHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      mount.current!.appendChild(renderer.domElement);

      // 创建几何体
      const sphereMaterial = new THREE.MeshLambertMaterial({
        color: 0x03c03c,
        wireframe: true,
      });
      const sphereGeometry = new THREE.SphereGeometry(80, 32, 32);
      planet = new THREE.Mesh(sphereGeometry, sphereMaterial);
      scene.add(planet);

      const geometry = new THREE.BoxGeometry(10, 10, 10);
      const material = new THREE.MeshBasicMaterial({ color: 0xfffc00, wireframe: true });
      cube = new THREE.Mesh(geometry, material);
      scene.add(cube);

      const torusGeometry = new THREE.TorusGeometry(150,8,2,120);
      const torusMaterial = new THREE.MeshBasicMaterial({ color: 0x40a9ff, wireframe: true });
      ring = new THREE.Mesh(torusGeometry, torusMaterial);
      ring.rotation.x = Math.PI / 2;
      ring.rotation.y = -0.1 * (Math.PI / 2);
      scene.add(ring);

      const icoGeometry =  new THREE.IcosahedronGeometry(10,0);
      const icoMaterial = new THREE.MeshToonMaterial({color: 0xfffc00});
      satellite = new THREE.Mesh(icoGeometry, icoMaterial);
      satellite.position.set(-110,100,100);
      scene.add(satellite);

      loader.load('/twing.glb', gltf => {
        console.log(gltf);
        gltf.scene.traverse( function ( child ) {
          if ( child.isMesh ) {
            child.material.emissive =  child.material.color;
            child.material.emissiveMap = child.material.map ;
          }
        });
        // gltf.scene.position.set(1,1,1);
        plane.add(gltf.scene);
        gltf.scene.position.set(100,100,100);

        scene.add(plane);
      });

      for (let i = 0; i < 1000; i++) {
        const starGeometry = new THREE.IcosahedronGeometry(Math.random() * 2,0);
        const starMaterial = new THREE.MeshToonMaterial({color: 0xeeeeee});
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.set((Math.random() - 0.5)* 700, (Math.random() - 0.5) * 700, (Math.random() - 0.5) * 700);
        star.rotation.x = Math.random() * Math.PI * 2;
        star.rotation.y = Math.random() * Math.PI * 2;
        star.rotation.z = Math.random() * Math.PI * 2;
        stars.add( star );
      }
      scene.add(stars);

      // 画线
      const lineMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
      const lineGeometry = new THREE.BufferGeometry();
      const linePoints = [];
      linePoints.push(new THREE.Vector3(20, 20, 0));
      linePoints.push(new THREE.Vector3(20, -20, 0));
      linePoints.push(new THREE.Vector3(-20, -20, 0));
      linePoints.push(new THREE.Vector3(-20, 20, 0));
      lineGeometry.setFromPoints(linePoints);
      const line = new THREE.LineLoop(lineGeometry, lineMaterial);
      scene.add(line);

      // 创建控制器
      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;


      // 渲染场景
      animate();
    };

    const animate = () => {
      rot += Math.random() * 0.8;
      requestAnimationFrame(animate);

      if (planet) {
        planet.rotation.y += 0.005;
      }

      if (ring) {
        ring.rotateOnAxis(axis, Math.PI / 400);
      }

      if (satellite) {
        const radian = (rot * Math.PI) / 180;
        satellite.position.x = 250 * Math.sin(radian);
        satellite.position.y = 100 * Math.cos(radian);
        satellite.position.z = -100 * Math.cos(radian);
        satellite.rotation.x += 0.005;
        satellite.rotation.y += 0.005;
        satellite.rotation.z -= 0.005;
      }

      if (plane) {
        const radian = (rot * Math.PI) / 180;
        plane.position.set(-100 * Math.sin(radian), 50 * Math.cos(radian), -100 * Math.cos(radian));

        // plane.position.x = 250 * Math.sin(radian);
        // plane.position.y = 100 * Math.cos(radian);
        // plane.position.z = -100 * Math.cos(radian);
        // plane.rotation.x += 0.005;
        // plane.rotation.y += 0.005;
        // plane.rotation.z -= 0.005;
      }

      if (stars) {
        stars.rotation.y += 0.0009;
        stars.rotation.z -= 0.0003;
        stars.rotation.x += 0.0003;
      }

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

export default Planet;
