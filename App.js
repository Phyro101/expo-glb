const Duck = require('./assets/models/Duck.glb');

import { Suspense, useRef, useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Canvas, } from '@react-three/fiber/native';
import { useGLTF, useAnimations, Environment, OrthographicCamera } from '@react-three/drei/native'
import useControls from 'r3f-native-orbitcontrols';


function Model() {
  const group = useRef();
  const { materials, nodes } = useGLTF(Duck, true);

  return (
    <group ref={group} dispose={null}>
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.LOD3spShape.geometry}
          material={materials["blinn3-fx"]}
        />
        <OrthographicCamera
          makeDefault={false}
        // far={1000}
        // near={1}
        // fov={37.849}
        // position={[400.113, 500, -431.078]}
        // rotation={[-2.314, 0.566, 2.614]}
        />
      </group>
    </group>
  )
}

function HandleLoad({ setIsLoading }) {
  useEffect(() => {
    setIsLoading(true)
    return () => setIsLoading(false)
  }, [])
}

export default function App() {
  const [OrbitControls, events] = useControls();
  const [isLoading, setIsLoading] = useState(true);

  const handleCreated = (state) => {
    const _gl = state.gl.getContext();
    const pixelStorei = _gl.pixelStorei.bind(_gl);
    _gl.pixelStorei = function (...args) {
      const [parameter] = args;
      switch (parameter) {
        case _gl.UNPACK_FLIP_Y_WEBGL:
          return pixelStorei(...args);
      }
    };
  }
  return (
    <SafeAreaView style={styles.container} {...events}>
      <View style={styles.content}>
        <StatusBar style="auto" />
        <Text>Meong</Text>
        <Canvas
          gl={{ antialias: true, pixelRatio: 2, alpha: true }}
          camera={{
            zoom: 250,
            position: [2, 0, 2],
            fov: 60,
            near: 1,
            far: 100,
            castShadow: true,
          }}
          orthographic={true}
          style={styles.canvas}
          onCreated={handleCreated}
        >
          <OrbitControls />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={<HandleLoad setIsLoading={setIsLoading} />}>
            <Model />
            <Environment preset='sunset' />
          </Suspense>
        </Canvas>
        {isLoading && (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold' }}>Loading...</Text>
          </View>
        )}

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: '2%'
  },
  content: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  canvas: {
    flex: 1,
    width: '100%',
    height: '100%',
  }
});
