# xb-threejs-sheif-single

一个基于Three.js的轻量级3D模型展示组件，支持GLTF/GLB格式模型的加载、展示和动画播放。

## 特性

- 🚀 基于Three.js开发，提供流畅的3D模型展示体验
- 💡 支持GLTF/GLB格式模型的加载和展示
- 🎮 内置轨道控制器，支持模型视角的自由调整
- 🎭 支持模型动画的自动播放
- 📱 响应式设计，自动适应容器尺寸变化
- 🎨 支持透明背景，易于与其他UI元素集成

## 安装

```bash
npm install xb-threejs-sheif-single
```

## 使用方法

```typescript
import { init, modelPathstate, allDestroyed } from 'xb-threejs-sheif-single';

// 配置参数
const props = {
  cameraPosition: { x: 0, y: 0, z: 5 },  // 相机位置
  modelPath: 'path/to/your/model.glb',     // 模型路径
  scale: 1,                                // 模型缩放
  position: { x: 0, y: 0, z: 0 }          // 模型位置
};

// 初始化
const container = document.getElementById('container');
init(props, container);

// 切换模型
modelPathstate(newPath, oldPath, props);

// 销毁实例
allDestroyed();
```

## API

### init(props: propsClass, container: HTMLElement)

初始化3D场景和模型。

参数：
- `props`: 配置对象
  - `cameraPosition`: 相机位置 {x, y, z}
  - `modelPath`: 模型文件路径
  - `scale`: 模型缩放比例
  - `position`: 模型位置 {x, y, z}
- `container`: 容器DOM元素

### modelPathstate(newPath: string, oldPath: string, props: propsClass)

切换显示的3D模型。

参数：
- `newPath`: 新模型路径
- `oldPath`: 旧模型路径
- `props`: 配置对象

### allDestroyed()

销毁3D场景和清理资源。

## 技术栈

- Three.js: ^0.174.0
- TypeScript: ^5.8.2

## 特别说明

- 组件会自动处理窗口大小变化，无需手动调整
- 支持模型动画的自动播放功能
- 内置环境光和平行光源，确保模型正确显示
- 支持透明背景，方便与其他UI元素叠加

## 许可证

ISC License