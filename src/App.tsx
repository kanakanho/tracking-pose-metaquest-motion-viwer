import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useEffect, useRef, useState } from 'react';
import type { Distances, Quaternions } from './types/type';
import FetchFileData from './components/fetchFileData/FetchFileData';


function App() {
  const [quaternionData, setQuaternionData] = useState<Quaternions>([]);
  const [distanceData, setDistanceData] = useState<Distances>([]);
  const modelUrl: string = 'gltf/hmd.glb';
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (quaternionData.length === 0 || distanceData.length === 0) return;

    if (canvas) create(canvas);

    function create(canvas: HTMLCanvasElement) {
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x999999); // 背景色を黒に設定
      const sizes = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: true,
        alpha: true,
      });

      renderer.setSize(sizes.width, sizes.height);
      renderer.setPixelRatio(window.devicePixelRatio);

      // グリッドヘルパーを追加
      const gridHelper = new THREE.GridHelper(100, 500, 0xffffff, 0xffffff); // サイズ100、分割数10、色白
      // グリッドの線を薄くするために不透明度を設定
      (gridHelper.material as THREE.Material).opacity = 0.2;
      (gridHelper.material as THREE.Material).transparent = true;
      scene.add(gridHelper);
      //軸の表示
      const axes = new THREE.AxesHelper(100);
      scene.add(axes);

      // カメラを作成
      const camera = new THREE.PerspectiveCamera(45, sizes.width / sizes.height, 1, 10000);
      camera.position.set(5, 30, 5);

      // カメラコントローラーを作成
      const controls = new OrbitControls(camera, canvas);
      controls.enableDamping = true;
      controls.dampingFactor = 0.2;

      const directionlLight = new THREE.DirectionalLight(0xe8d2cc, 4.5);
      directionlLight.position.set(20, 20, 60).normalize();
      scene.add(directionlLight);

      const pointLight = new THREE.PointLight(0xffffff, 0.2);
      pointLight.position.set(1, 2, 3);
      scene.add(pointLight);

      const gltfLoader = new GLTFLoader();
      let model: THREE.Group<THREE.Object3DEventMap>;
      gltfLoader.load(modelUrl, (gltf) => {
        model = gltf.scene;
        model.scale.set(10.0, 10.0, 10.0); // Adjust scale as needed
        model.position.set(0, 0, 0);
        scene.add(model);
        let frameIndex = 0;

        let interval = quaternionData[1].time - quaternionData[0].time; // フレームごとの時間間隔
        let startTime = 0; // 最後のフレームの時間

        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const delta = timestamp - startTime;
          if (delta > interval) {
            if (frameIndex < quaternionData.length) {
              interval = quaternionData[frameIndex].time - quaternionData[0].time;
              const { quaternion } = quaternionData[frameIndex];
              const { distance } = distanceData[frameIndex];
              // 時間に対応するクォータニオンを取得し、モデルに適用する
              model.setRotationFromQuaternion(quaternion);
              // 移動データをモデルに適用
              if (distance) {
                model.position.set(distance.x * 10, distance.y * 10, distance.z * 10);
              }

              frameIndex++; // 次のフレームへ進む
            }
          }

          renderer.render(scene, camera);
          controls.update();
          requestAnimationFrame(animate);
        };

        requestAnimationFrame(animate);
      });

      const handleResize = () => {
        sizes.width = window.innerWidth;
        sizes.height = window.innerHeight;
        camera.aspect = sizes.width / sizes.height;
        camera.updateProjectionMatrix();
        renderer.setSize(sizes.width, sizes.height);
        renderer.setPixelRatio(window.devicePixelRatio);
      };

      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [distanceData, quaternionData]);

  return (
    <>
      <canvas style={{ width: '100vw', height: '100vh' }} id="canvas" ref={canvasRef} />
      <FetchFileData setDistancesData={setDistanceData} setQuaternionData={setQuaternionData} />
    </>
  );
}

export default App;
