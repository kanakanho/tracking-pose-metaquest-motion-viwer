# 座標トラッキングしたHMDのアニメーションビューワー

## 座標トラッキングを行うシステム

https://github.com/kanakanho/react-three-fiber-xr-anchor  

上記のレポジトリでWebからHMDの座標のトラッキングができます

## 座標と姿勢のデータについて

プロジェクトのルートに`data`フォルダを作って、その中に座標を示す`distances.json`とクオータにオンを示す`quaternion.json`を用意してください。それぞれのjsonのフォーマットは以下の通りです。

```json:distances.json
[
  {
    "t": 1730292173.376,
    "x": -0.09096779674291611,
    "y": 2.548135280609131,
    "z": 0.3692112863063812
  },
]
```

```json:distances.json
[
  {
    "t": 1730292173.376,
    "x": -0.03750552641362064,
    "y": 0.06806743487845085,
    "z": -0.02886445291174555,
    "w": 0.9965575764378147
  },
]
```

## MetaQuest の 3Dデータ について

`public/gltf/hmd.glb` は[こちら](https://booth.pm/en/items/5661008)で公開されているものを利用させていただきました。



# 謝辞

https://github.com/NenfuAT/pose-estimation-web

実装にあたってこちらのレポジトリを参考にさせていただきました。

