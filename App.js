const Avatar = require('./assets/models/AVATAR.glb');

import { Suspense, useRef, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Canvas, } from '@react-three/fiber/native';
import { useGLTF, useAnimations, Environment } from '@react-three/drei/native'
import useControls from 'r3f-native-orbitcontrols';


function Model() {
  const group = useRef();
  const { materials, animations, nodes } = useGLTF(Avatar, true);
  const { actions, mixer } = useAnimations(animations, group)
  // console.log(materials)

  // Play animation
  useEffect(() => {
    const anims = ['BODY_1_IDLE', 'FACE_1_IDLE', 'LASH_2', 'LASH_1'];
    anims.forEach(anim => {
      const animation = actions[anim];
      animation?.play();
      animation?.setEffectiveTimeScale(1);
    });
  }, [mixer]);

  return (
    <group ref={group} dispose={null}>
      <group name="Scene">
        <group name="ARMATURE">
          <skinnedMesh
            name="BASE_HEAD_1"
            geometry={nodes.BASE_HEAD_1.geometry}
            material={materials.BASE_HEAD_1}
            skeleton={nodes.BASE_HEAD_1.skeleton}
            morphTargetDictionary={nodes.BASE_HEAD_1.morphTargetDictionary}
            morphTargetInfluences={nodes.BASE_HEAD_1.morphTargetInfluences}
          />
          <skinnedMesh
            name="BASE_BODY"
            geometry={nodes.BASE_BODY.geometry}
            material={materials.BASE_BODY}
            skeleton={nodes.BASE_BODY.skeleton}
          />
          <skinnedMesh
            name="EYES_1_L"
            geometry={nodes.EYES_1_L.geometry}
            material={materials.EYES_1}
            skeleton={nodes.EYES_1_L.skeleton}
            morphTargetDictionary={nodes.EYES_1_L.morphTargetDictionary}
            morphTargetInfluences={nodes.EYES_1_L.morphTargetInfluences}
          />
          <skinnedMesh
            name="EYES_1_R"
            geometry={nodes.EYES_1_R.geometry}
            material={materials.EYES_1}
            skeleton={nodes.EYES_1_R.skeleton}
            morphTargetDictionary={nodes.EYES_1_R.morphTargetDictionary}
            morphTargetInfluences={nodes.EYES_1_R.morphTargetInfluences}
          />
          <skinnedMesh
            name="HAIR_1"
            geometry={nodes.HAIR_1.geometry}
            material={materials.HAIR_1}
            skeleton={nodes.HAIR_1.skeleton}
            morphTargetDictionary={nodes.HAIR_1.morphTargetDictionary}
            morphTargetInfluences={nodes.HAIR_1.morphTargetInfluences}
          />
          <group name="SHOES_1">
            <skinnedMesh
              name="SHOES_1_1"
              geometry={nodes.SHOES_1_1.geometry}
              material={materials.BASE_SHOES}
              skeleton={nodes.SHOES_1_1.skeleton}
            />
            <skinnedMesh
              name="SHOES_1_2"
              geometry={nodes.SHOES_1_2.geometry}
              material={materials.DARK_SHOES}
              skeleton={nodes.SHOES_1_2.skeleton}
            />
          </group>
          <primitive object={nodes.mixamorigHips} />
          <primitive object={nodes.Ctrl_Master} />
          <primitive object={nodes.Ctrl_ArmPole_IK_Left} />
          <primitive object={nodes.Ctrl_Hand_IK_Left} />
          <primitive object={nodes.Ctrl_ArmPole_IK_Right} />
          <primitive object={nodes.Ctrl_Hand_IK_Right} />
          <primitive object={nodes.Ctrl_Foot_IK_Left} />
          <primitive object={nodes.Ctrl_LegPole_IK_Left} />
          <primitive object={nodes.Ctrl_Foot_IK_Right} />
          <primitive object={nodes.Ctrl_LegPole_IK_Right} />
          <primitive object={nodes["MCH-eyes_parent"]} />
        </group>
        <skinnedMesh
          name="CLOTHES_1"
          geometry={nodes.CLOTHES_1.geometry}
          material={materials.CLOTHES_1}
          skeleton={nodes.CLOTHES_1.skeleton}
        />
      </group>
    </group>
  )
}

export default function App() {
  const [OrbitControls, events] = useControls();

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
          camera={{ position: [0, 0, 5] }}
          style={styles.canvas}
          onCreated={handleCreated}
        >
          <OrbitControls />
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Suspense fallback={null}>
            <Model />
            <Environment preset='sunset' />
          </Suspense>
        </Canvas>

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
