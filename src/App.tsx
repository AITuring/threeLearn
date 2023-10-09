import { Suspense, useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, OrbitControls, Html, useProgress, Cloud } from '@react-three/drei'
import { AxesHelper } from 'three';
import {Model} from './Model'

const Loader = () => {
  const { progress } = useProgress();
  return <Html center>{progress}%</Html>
}

const KeyboardControls =  () => {
  const { camera } =  useThree();
  const ref = useRef();

  useFrame(() => {
    if (ref.current) {
      ref.current.focus();
    }
  })

  const handleKeyDown = (event: KeyboardEvent) => {
    // 处理按键事件
    const { key } = event;

    // 根据按键改变相机位置
    switch (key) {
      case 'ArrowUp':
        camera.position.z -= 10;
        break;
      case 'ArrowDown':
        camera.position.z += 10;
        break;
      case 'ArrowLeft':
        camera.position.x -= 10;
        break;
      case 'ArrowRight':
        camera.position.x += 10;
        break;
      default:
        break;
    }
  };

  return (
    <Html>
      <div
      ref={ref}
      tabIndex={0}
      style={{ outline: 'none' }}
      onKeyDown={handleKeyDown}
    />
    </Html>
  );
}


export default function App() {

  const cameraRef = useRef();

  const handleKeyDown = (event) => {
    console.log(event)

  };

  return (
    <div className="App">
      <Canvas
        style={{
        width: '100vw',
        height: '100vh',
        }}
      >
        {/* 蓝色z轴 绿色y轴 红色x轴 */}
        <Suspense fallback={<Loader />}>
          <KeyboardControls />
          <perspectiveCamera ref={cameraRef} position={[0, 0, 5]} />
          <Model position = {[0,100,0]} />
          <Cloud opacity={1}/>
          <OrbitControls />
          <primitive object={new AxesHelper(100)} />
          <Environment preset="park" background />
        </Suspense>
      </Canvas>
    </div>
  )
}
