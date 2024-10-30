import type * as THREE from 'three';

export type Quaternions = {
  time: number;
  quaternion: THREE.Quaternion;
}[];

export type Distances = {
  time: number;
  distance: THREE.Vector3;
}[];
