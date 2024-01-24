const Duck = require("./assets/models/Duck.glb");

import { Suspense, useRef, useEffect, useState } from "react";
import { LogBox, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Canvas } from "@react-three/fiber/native";
import { useGLTF, Environment } from "@react-three/drei/native";
import useControls from "r3f-native-orbitcontrols";
import Slider from "react-native-a11y-slider";

LogBox.ignoreAllLogs(true);

function Model({ position }) {
  const group = useRef();
  const { materials, nodes } = useGLTF(Duck, true);

  return (
    <group ref={group} dispose={null} position={[position.x, position.y, 0]}>
      <group scale={0.01}>
        <mesh
          castShadow
          receiveShadow
          geometry={nodes.LOD3spShape.geometry}
          material={materials["blinn3-fx"]}
        />
      </group>
    </group>
  );
}

function HandleLoad({ setIsLoading }) {
  useEffect(() => {
    setIsLoading(true);
    return () => setIsLoading(false);
  }, []);
}

export default function App() {
  const [OrbitControls, events] = useControls();
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState({
    x: 2,
    y: 0,
    z: 2,
  });
  const [zoom, setZoom] = useState(50);

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
  };
  return (
    <SafeAreaView style={styles.container} {...events}>
      <View style={styles.content}>
        <StatusBar style="auto" />
        <Canvas
          gl={{ antialias: true, pixelRatio: 2, alpha: true }}
          camera={{
            zoom: 50,
            position: [2, 0, 2],
            fov: 60,
            near: 1,
            far: 100,
            castShadow: true,
          }}
          orthographic={true}
          style={styles.canvas}
          onCreated={handleCreated}
          // onTouchMove={(e) => {
          //   console.log("Touch MOVE")
          // }}
          onTouchStart={(e) => {
            console.log("Touch START");
          }}
          // onTouchEnd={(e) => {
          //   console.log("Touch END")
          // }}
        >
          <OrbitControls />
          <ambientLight />
          <Suspense fallback={<HandleLoad setIsLoading={setIsLoading} />}>
            <Model position={position}/>
            <axesHelper args={[5]} />
            <Environment preset="sunset" />
          </Suspense>
        </Canvas>

        <View style={styles.sliderContainer}>
          <Text>X is {position.x}</Text>
          <Text>Y is {position.y}</Text>
          <Text>Z is {position.z}</Text>
          <Text>Zoom is {zoom}</Text>
          <Slider
            values={position.x}
            min={-50}
            max={50}
            increment={0.1}
            showLabel
            style={styles.slider}
            onChange={(value) => {
              setPosition({ ...position, x: value });
            }}
            markerComponent={() => (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "red",
                }}
              />
            )}
          />
          <Slider
            values={position.y}
            min={-50}
            max={50}
            increment={1}
            showLabel
            style={styles.slider}
            onChange={(value) => {
              setPosition({ ...position, y: value });
            }}
            markerComponent={() => (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "red",
                }}
              />
            )}
          />
          <Slider
            values={position.z}
            min={-50}
            max={50}
            increment={1}
            showLabel
            style={styles.slider}
            onChange={(value) => {
              setPosition({ ...position, z: value });
            }}
            markerComponent={() => (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "red",
                }}
              />
            )}
          />
          <Slider
            values={zoom}
            min={0}
            max={2000}
            increment={50}
            showLabel
            style={styles.slider}
            onChange={(value) => {
              setZoom(value);
            }}
            markerComponent={() => (
              <View
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  backgroundColor: "red",
                }}
              />
            )}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: "2%",
  },
  content: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  canvas: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  sliderContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    position: "absolute",
    bottom: 0,
    marginBottom: 20,
  },
  slider: {
    width: "100%",
  },
});
