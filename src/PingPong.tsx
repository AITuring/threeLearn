import ReactDOM from 'react-dom/client';
import { Canvas, useFrame, useLoader} from '@react-three/fiber';
import { Perf } from 'r3f-perf';
import { Physics, useBox, usePlane, useSphere } from '@react-three/cannon';
import { Mesh, TextureLoader } from 'three';
import { GLTFLoader } from "three-stdlib/loaders/GLTFLoader";
import crossImg from '/cross.jpg';
import { useRef } from 'react';

function lerp(v0, v1, t) {
  return v0*(1-t)+v1*t
}

function ContactGround() {
  const [ref] = usePlane(
    () => ({
      position: [0, -10, 0],
      rotation: [-Math.PI / 2, 0, 0],
      type: "Static",
    }),
    useRef < Mesh > null
  );
  return <mesh ref={ref} />;
}

function Ball () {
  const map = useLoader(TextureLoader, crossImg);
  const [ref] = useSphere(
    (s) => ({args: [0.5], mass: 1, position: [0,5,0]}),
    useRef< Mesh > null
  )

    return (
      <mesh castShadow ref={ref}>
        <sphereGeometry args={[0.5, 64, 64]} />
        <meshStandardMaterial map={map} />
      </mesh>
    )
}

function Paddle() {
  const { nodes, materials } = useLoader(
    GLTFLoader,
    '/pingpong.glb',
  );
  const model = useRef();
  const [ref, api] = useBox(() => ({
    type: 'Kinematic',
    args: [3.4, 1, 3.5],
  }));
  const values = useRef([0, 0]);
  useFrame((state) => {
    values.current[0] = lerp(
      values.current[0],
      (state.mouse.x * Math.PI) / 5,
      0.2
    );
    values.current[1] = lerp(
      values.current[1],
      (state.mouse.x * Math.PI) / 5,
      0.2
    );
    api.position.set(state.mouse.x * 10, state.mouse.y * 5, 0);
    api.rotation.set(0, 0, values.current[1]);
    if (!model.current) return;
    model.current.rotation.x = lerp(
      model.current.rotation.x,
      started ? Math.PI / 2 : 0,
      0.2
    );
    model.current.rotation.y = values.current[0];
  });

  return (
    <mesh ref={ref} dispose={null}>
      <group
        ref={model}
        position={[-0.05, 0.37, 0.3]}
        scale={[0.15, 0.15, 0.15]}
      >
        <group rotation={[1.88, -0.35, 2.32]} scale={[2.97, 2.97, 2.97]}>
          <primitive object={nodes.Bone} />
          <primitive object={nodes.Bone003} />
          { /* ... */ }
          <skinnedMesh
            castShadow
            receiveShadow
            material={materials.glove}
            material-roughness={1}
            geometry={nodes.arm.geometry}
            skeleton={nodes.arm.skeleton}
          />
        </group>
        <group rotation={[0, -0.04, 0]} scale={[141.94, 141.94, 141.94]}>
          <mesh
            castShadow
            receiveShadow
            material={materials.wood}
            geometry={nodes.mesh.geometry}
          />
          { /* ... */ }
        </group>
      </group>
    </mesh>
  );
}

const PingPongMain = () => {
  return (
    <>
      <Physics
      iterations={20}
      tolerance={0.0001}
      defaultContactMaterial={{
        contactEquationRelaxation: 1,
        contactEquationStiffness: 1e7,
        friction: 0.9,
        frictionEquationRelaxation: 2,
        frictionEquationStiffness: 1e7,
        restitution: 0.7,
      }}
      gravity={[0, -40, 0]}
      allowSleep={false}
      >
        <mesh position={[0, 0, -10]} receiveShadow>
          <planeGeometry args={[1000, 1000]} />
          <meshPhongMaterial color="#5081ca" />
        </mesh>
        <ContactGround />
        <Ball />
        <Paddle />
      </Physics>
    </>
  )
}



const PingPong = () => {
  return (
    <div
      id='canvas'
      style={{
        width: '100vw',
        height: '100vh',
      }}
    >
      <Canvas
        shadows
        camera={{fov: 50, position:[0,5,12]}}
      >
        <Perf position="top=right" />
        <gridHelper args={[50, 50, '#11f1ff', '#0b50aa']} position={[0, -1.1, -4]} rotation={[Math.PI / 2.68, 0, 0]}/>
        <color attach="background" args={["lightgreen"]} />
        <ambientLight intensity={0.5} />
        <pointLight color="red" position={[-10, -10, -10]} />
        <spotLight
          position={[10, 10, 10]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
          shadow-bias={-0.0001}
        />
        {/* <mesh>
          <boxGeometry args={[2,2,2]} />
          <meshStandardMaterial />
        </mesh> */}
        <PingPongMain />
      </Canvas>
    </div>
  )
}

export default  PingPong;
