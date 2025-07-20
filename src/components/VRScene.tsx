
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Users, Maximize, RotateCcw } from "lucide-react";
import * as THREE from "three";

interface VRSceneProps {
  user: any;
  onBack: () => void;
}

export const VRScene = ({ user, onBack }: VRSceneProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const animationRef = useRef<number>();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [connectedUsers] = useState(3); // Mock connected users

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 2, 8);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;
    mountRef.current.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.3);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Add neon lights
    const neonLight1 = new THREE.PointLight(0x00ffff, 2, 20);
    neonLight1.position.set(5, 3, 0);
    scene.add(neonLight1);

    const neonLight2 = new THREE.PointLight(0xff00ff, 2, 20);
    neonLight2.position.set(-5, 3, 0);
    scene.add(neonLight2);

    // Create floor
    const floorGeometry = new THREE.PlaneGeometry(20, 20);
    const floorMaterial = new THREE.MeshLambertMaterial({ 
      color: 0x111111,
      transparent: true,
      opacity: 0.8
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Create central rotating cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x00ffff,
      emissive: 0x002244,
      transparent: true,
      opacity: 0.8,
      roughness: 0.1,
      metalness: 0.9
    });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.y = 2;
    cube.castShadow = true;
    scene.add(cube);

    // Create orbiting spheres (representing other users)
    const spheres: THREE.Mesh[] = [];
    const colors = [0xff0080, 0x00ff80, 0x8000ff];
    
    for (let i = 0; i < 3; i++) {
      const sphereGeometry = new THREE.SphereGeometry(0.5, 32, 32);
      const sphereMaterial = new THREE.MeshPhysicalMaterial({
        color: colors[i],
        emissive: colors[i],
        emissiveIntensity: 0.2,
        transparent: true,
        opacity: 0.7
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.castShadow = true;
      spheres.push(sphere);
      scene.add(sphere);
    }

    // Create particle system
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 100;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.1,
      transparent: true,
      opacity: 0.6
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    // Animation loop
    let time = 0;
    const animate = () => {
      time += 0.01;

      // Rotate central cube
      cube.rotation.x += 0.01;
      cube.rotation.y += 0.01;
      cube.rotation.z += 0.005;

      // Animate orbiting spheres
      spheres.forEach((sphere, index) => {
        const radius = 4;
        const speed = 0.5 + index * 0.2;
        const angle = time * speed + (index * Math.PI * 2) / 3;
        sphere.position.x = Math.cos(angle) * radius;
        sphere.position.z = Math.sin(angle) * radius;
        sphere.position.y = 1 + Math.sin(time * 2 + index) * 0.5;
        sphere.rotation.y += 0.02;
      });

      // Animate particles
      particles.rotation.y += 0.001;

      // Animate lights
      neonLight1.intensity = 1 + Math.sin(time * 3) * 0.5;
      neonLight2.intensity = 1 + Math.cos(time * 2) * 0.5;

      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Mouse controls
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
      targetX = mouseX * 0.5;
      targetY = mouseY * 0.5;
    };

    const updateCamera = () => {
      camera.position.x += (targetX * 2 - camera.position.x) * 0.05;
      camera.position.y += (targetY * 2 + 2 - camera.position.y) * 0.05;
      camera.lookAt(0, 1, 0);
      requestAnimationFrame(updateCamera);
    };

    window.addEventListener('mousemove', handleMouseMove);
    updateCamera();

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mountRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const resetView = () => {
    // Reset camera position - this would be more sophisticated in a real implementation
    console.log("Resetting view...");
  };

  return (
    <div className="min-h-screen bg-black relative">
      {/* Header Controls */}
      <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-center">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-black/50 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Exit VR
        </Button>

        <div className="flex gap-2">
          <Button
            onClick={resetView}
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            onClick={toggleFullscreen}
            variant="outline"
            size="sm"
            className="bg-black/50 border-white/20 text-white hover:bg-white/10 backdrop-blur-sm"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* User Info */}
      <Card className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 bg-black/50 border-white/20 backdrop-blur-sm">
        <CardContent className="p-3 flex items-center gap-3">
          <Users className="w-4 h-4 text-cyan-400" />
          <span className="text-white text-sm">
            {connectedUsers} users connected
          </span>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <div className="absolute bottom-4 left-4 z-10">
        <Card className="bg-black/50 border-white/20 backdrop-blur-sm">
          <CardContent className="p-4">
            <h3 className="text-white font-semibold mb-2">Controls</h3>
            <ul className="text-gray-300 text-sm space-y-1">
              <li>• Move mouse to look around</li>
              <li>• Colored spheres represent other users</li>
              <li>• Central cube shows real-time interactions</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* VR Scene Container */}
      <div
        ref={mountRef}
        className="w-full h-screen"
        style={{ cursor: 'grab' }}
      />
    </div>
  );
};
