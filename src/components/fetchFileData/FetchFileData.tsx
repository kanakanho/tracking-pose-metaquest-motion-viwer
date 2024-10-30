import * as THREE from 'three';
import type { ReactElement } from 'react';
import styles from './FetchFileData.module.css';
import type { Distances, Quaternions } from '../../types/type';

type Props = {
  setDistancesData: React.Dispatch<React.SetStateAction<Distances>>;
  setQuaternionData: React.Dispatch<React.SetStateAction<Quaternions>>;
};

type FileDistances = {
  t: number;
  x: number;
  y: number;
  z: number;
};

type FileQuaternion = {
  t: number;
  x: number;
  y: number;
  z: number;
  w: number;
};

const FetchFileData = ({ setDistancesData, setQuaternionData }: Props): ReactElement => {
  const onVector3FileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    const tmpJson = JSON.parse(await file.text()) as FileDistances[];

    const distance = tmpJson.map((data) => ({
      time: data.t,
      distance: new THREE.Vector3(data.x, data.y, data.z),
    }));
    // const distance = JSON.parse(await file.text()) as Distances;
    setDistancesData(distance);
    console.log(distance);
  };

  const onQuaternionFileInputChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    const json = JSON.parse(await file.text()) as FileQuaternion[];

    const quaternion = json.map((data) => ({
      time: data.t,
      quaternion: new THREE.Quaternion(data.x, data.y, data.z, data.w),
    }));
    // const quaternion = JSON.parse(await file.text()) as Quaternions;
    setQuaternionData(quaternion);
    console.log(quaternion);
  };

  return (
    <div className={styles.box}>
      <h2>Vector3</h2>
      <input type="file" onChange={onVector3FileInputChange} accept=".json" />
      <h2>Quaternion</h2>
      <input type="file" onChange={onQuaternionFileInputChange} accept=".json" />
    </div>
  );
};

export default FetchFileData;
