import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/** 3D场景相关变量 */
let scene: THREE.Scene;
let camera: THREE.PerspectiveCamera;
let renderer: THREE.WebGLRenderer;
let controls: OrbitControls;
let model: THREE.Group;
let mixer: THREE.AnimationMixer;
let resizeObserver: ResizeObserver;

/** 
 * 位置接口定义
 * @interface positionClass
 * @property {number} x - X轴坐标
 * @property {number} y - Y轴坐标
 * @property {number} z - Z轴坐标
 */
export interface positionClass {
    x: number;
    y: number;
    z: number;
}

/**
 * 初始化参数接口定义
 * @interface propsClass
 * @property {positionClass} cameraPosition - 相机位置
 * @property {string} modelPath - GLTF模型路径
 * @property {number} scale - 模型缩放比例
 * @property {positionClass} position - 模型位置
 */
export interface propsClass {
    cameraPosition: positionClass;
    modelPath: string;
    scale: number;
    position: positionClass
}

/**
 * 初始化Three.js场景
 * @param {propsClass} props - 初始化参数
 * @param {HTMLElement} container - 容器元素
 */
export const init = (props: propsClass, container: HTMLElement): void => {
    // 创建场景
    scene = new THREE.Scene();
    scene.background = null;  // 设置场景背景为透明
    
    // 创建相机
    camera = new THREE.PerspectiveCamera(75, 5/6, 0.1, 1000);
    camera.position.set(props.cameraPosition.x, props.cameraPosition.y, props.cameraPosition.z);
    
    // 创建渲染器
    renderer = new THREE.WebGLRenderer({ 
        antialias: true,
        alpha: true  // 启用透明背景
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);
    
    // 添加轨道控制器
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;
    controls.screenSpacePanning = false;
    controls.minDistance = 0;
    controls.maxDistance = 10;
    
    // 添加环境光和平行光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);
    
    // 初始化 ResizeObserver
    initResizeObserver(container);
    // 加载模型
    loadModel(props);
    // 动画
    animate();
};

/**
 * 更新渲染器尺寸和相机参数
 * @param {HTMLElement} containerElement - 容器元素
 */
const updateRendererSize = (containerElement: HTMLElement): void => {
    if (!containerElement || !renderer || !camera) return;
    
    const width = containerElement.clientWidth;
    const height = containerElement.clientHeight;
    
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
};

/**
 * 加载GLTF模型
 * @param {propsClass} props - 模型参数
 */
const loadModel = (props: propsClass): void => {
    const loader = new GLTFLoader();
    loader.load(props.modelPath, (gltf) => {
        model = gltf.scene;
        model.scale.set(props.scale, props.scale, props.scale);
        model.position.set(props.position.x, props.position.y, props.position.z);
        scene.add(model);

        // 创建动画混合器
        mixer = new THREE.AnimationMixer(model);

        // 播放所有动画
        gltf.animations.forEach((clip) => {
            mixer.clipAction(clip).play();
        });
    });
};

/**
 * 动画循环
 */
const animate = (): void => {
    if(!controls || !scene || !camera) return;
    requestAnimationFrame(animate);
    controls.update();
    
    // 更新动画
    if (mixer) {
        mixer.update(0.016); // 假设60fps的更新频率
    }
    renderer.render(scene, camera);
};

/**
 * 清除当前模型
 */
export const clearCurrentModel = (): void => {
    if (model) {
        // 停止所有动画
        if (mixer) {
            mixer.stopAllAction();
            mixer.uncacheRoot(model);
        }
        // 从场景中移除模型
        scene.remove(model);
    }
};

/**
 * 监听模型路径变化
 * @param {string} newPath - 新模型路径
 * @param {string} oldPath - 旧模型路径
 * @param {propsClass} props - 模型参数
 */
export const modelPathstate = (newPath: string, oldPath: string, props: propsClass): void => {
    if (newPath && newPath !== oldPath && scene) {
        clearCurrentModel();
        loadModel(props);
        
        if (camera && controls) {
            // 重置相机位置
            camera.position.set(props.cameraPosition.x, props.cameraPosition.y, props.cameraPosition.z);
            camera.updateProjectionMatrix();
            // 重置控制器
            controls.target.set(0, 0, 0);
            controls.update();
        }
    }
};

/**
 * 初始化ResizeObserver
 * @param {HTMLElement} containerElement - 容器元素
 */
const initResizeObserver = (containerElement: HTMLElement): void => {
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
    
    resizeObserver = new ResizeObserver(() => {
        updateRendererSize(containerElement);
    });
    
    if (containerElement instanceof HTMLElement) {
        resizeObserver.observe(containerElement);
    }
};

/**
 * 销毁并清理Three.js场景
 */
export const allDestroyed = (): void => {
    // 清理ResizeObserver
    if (resizeObserver) {
        resizeObserver.disconnect();
    }
    
    // 清除当前模型
    clearCurrentModel();
    
    // 清理控制器
    if (controls) {
        controls.dispose();
    }
    
    // 清理渲染器
    if (renderer) {
        renderer.dispose();
        renderer.forceContextLoss();
        renderer.domElement.remove();
    }
    
    // 清理场景
    scene = undefined as unknown as THREE.Scene;
    camera = undefined as unknown as THREE.PerspectiveCamera;
    renderer = undefined as unknown as THREE.WebGLRenderer;
    controls = undefined as unknown as OrbitControls;
    model = undefined as unknown as THREE.Group;
    mixer = undefined as unknown as THREE.AnimationMixer;
};