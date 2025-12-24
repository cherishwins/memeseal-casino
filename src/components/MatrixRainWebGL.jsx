import { useRef, useEffect, useMemo, memo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Matrix Rain Shader
const matrixVertexShader = `
  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const matrixFragmentShader = `
  uniform float uTime;
  uniform vec2 uResolution;
  uniform float uSpeed;
  uniform float uDensity;
  uniform vec3 uColor;

  varying vec2 vUv;

  // Pseudo-random function
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // Character-like noise
  float charNoise(vec2 st, float t) {
    vec2 i = floor(st);
    float r = random(i);
    float speed = r * 0.5 + 0.5;
    float y = fract(st.y - t * speed * uSpeed);
    float fade = smoothstep(0.0, 0.3, y) * smoothstep(1.0, 0.5, y);
    return step(0.5, random(i + floor(t * speed * 3.0))) * fade;
  }

  void main() {
    vec2 uv = vUv;

    // Create columns
    float columns = uDensity;
    vec2 st = vec2(floor(uv.x * columns), uv.y * 30.0);

    // Offset each column differently
    float colOffset = random(vec2(floor(uv.x * columns), 0.0)) * 10.0;

    // Main rain effect
    float rain = charNoise(st, uTime + colOffset);

    // Add glow
    float glow = rain * 0.5;
    for (float i = 1.0; i <= 3.0; i++) {
      glow += charNoise(st + vec2(0.0, i * 0.1), uTime + colOffset) * (0.3 / i);
    }

    // Leading character (brighter)
    float lead = charNoise(st, uTime + colOffset);
    float leadBrightness = step(0.95, random(st + uTime));

    // Combine effects
    vec3 color = uColor * glow;
    color += vec3(1.0) * lead * leadBrightness * 0.5; // White flash for leading chars

    // Vignette
    float vignette = 1.0 - length(uv - 0.5) * 0.5;
    color *= vignette;

    // Output with transparency
    float alpha = glow * 0.8;
    gl_FragColor = vec4(color, alpha);
  }
`

// Shader Material Component
function MatrixShaderPlane({ speed = 1, density = 40, color = [0, 1, 0.25] }) {
  const meshRef = useRef()
  const { viewport } = useThree()

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(viewport.width, viewport.height) },
      uSpeed: { value: speed },
      uDensity: { value: density },
      uColor: { value: new THREE.Color(color[0], color[1], color[2]) },
    }),
    [viewport, speed, density, color]
  )

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.material.uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <mesh ref={meshRef} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial
        uniforms={uniforms}
        vertexShader={matrixVertexShader}
        fragmentShader={matrixFragmentShader}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

// Main WebGL Matrix Rain Component
function MatrixRainWebGL({
  speed = 1,
  density = 40,
  color = [0, 1, 0.25],
  className = ''
}) {
  return (
    <div className={`fixed inset-0 -z-10 pointer-events-none ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 1] }}
        gl={{
          antialias: false,
          alpha: true,
          powerPreference: 'low-power'
        }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
      >
        <MatrixShaderPlane speed={speed} density={density} color={color} />
      </Canvas>
    </div>
  )
}

// CSS Fallback for low-end devices
function MatrixRainCSS() {
  const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
  const columns = 30

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none opacity-30">
      <div className="flex h-full">
        {Array.from({ length: columns }).map((_, i) => (
          <div
            key={i}
            className="flex-1 text-matrix-green font-mono text-xs leading-none animate-matrix-fall"
            style={{
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${5 + Math.random() * 5}s`
            }}
          >
            {chars.split('').map((char, j) => (
              <div key={j} className="opacity-70">{char}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// Smart loader
function MatrixRainLoader(props) {
  const [useWebGL, setUseWebGL] = useState(true)

  useEffect(() => {
    // Check if WebGL is available and performant
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl')

      if (!gl) {
        setUseWebGL(false)
        return
      }

      // Check for software rendering
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info')
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL)
        if (/swiftshader|llvmpipe|softpipe/i.test(renderer)) {
          setUseWebGL(false)
        }
      }

      // Check memory
      if ((navigator.deviceMemory || 4) < 2) {
        setUseWebGL(false)
      }

      // Check for reduced motion
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        setUseWebGL(false)
      }
    } catch (e) {
      setUseWebGL(false)
    }
  }, [])

  if (useWebGL) {
    return <MatrixRainWebGL {...props} />
  }

  return <MatrixRainCSS />
}

export default memo(MatrixRainLoader)
export { MatrixRainWebGL, MatrixRainCSS }
