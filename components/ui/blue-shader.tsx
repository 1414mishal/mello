"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface BlueShaderProps {
  className?: string;
}

export function BlueShader({ className }: BlueShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const gl = canvas.getContext("webgl");
    if (!gl) return;

    const vertexShaderSource = `
      attribute vec2 aPosition;
      void main() {
        gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `;

    const fragmentShaderSource = `
      precision highp float;
      uniform vec2 iResolution;
      uniform float iTime;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        f = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
      }

      float fbm(vec2 p) {
        float f = 0.0;
        float amp = 0.5;
        for (int i = 0; i < 5; i++) {
          f += amp * noise(p);
          p *= 2.0;
          amp *= 0.5;
        }
        return f;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / iResolution.xy;
        float t = iTime * 0.08;

        vec2 q = vec2(
          fbm(uv * 3.0 + vec2(0.0, t * 0.5)),
          fbm(uv * 3.0 + vec2(5.2, t * 0.3))
        );

        vec2 r = vec2(
          fbm(uv * 3.0 + 4.0 * q + vec2(1.7, 9.2) + t * 0.15),
          fbm(uv * 3.0 + 4.0 * q + vec2(8.3, 2.8) + t * 0.12)
        );

        float f = fbm(uv * 3.0 + 4.0 * r);

        vec3 deepBlack = vec3(0.02, 0.02, 0.03);
        vec3 darkBlue = vec3(0.03, 0.06, 0.15);
        vec3 mediumBlue = vec3(0.05, 0.12, 0.28);
        vec3 brightBlue = vec3(0.10, 0.20, 0.45);
        vec3 whiteHighlight = vec3(0.25, 0.30, 0.45);

        vec3 col = deepBlack;
        col = mix(col, darkBlue, smoothstep(0.0, 0.4, f));
        col = mix(col, mediumBlue, smoothstep(0.3, 0.6, f * q.x));
        col = mix(col, brightBlue, smoothstep(0.5, 0.8, f * r.y));
        col = mix(col, whiteHighlight, smoothstep(0.7, 1.0, f * f * 1.5));

        col *= 0.7 + 0.3 * smoothstep(0.0, 0.5, uv.y);

        gl_FragColor = vec4(col, 1.0);
      }
    `;

    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertexShader = compileShader(vertexShaderSource, gl.VERTEX_SHADER);
    const fragmentShader = compileShader(
      fragmentShaderSource,
      gl.FRAGMENT_SHADER
    );
    if (!vertexShader || !fragmentShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;
    gl.useProgram(program);

    const vertices = new Float32Array([
      -1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1,
    ]);
    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const aPosition = gl.getAttribLocation(program, "aPosition");
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
    const iTimeLocation = gl.getUniformLocation(program, "iTime");

    const startTime = performance.now();
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(iResolutionLocation, canvas.width, canvas.height);
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const renderLoop = () => {
      if (!gl || gl.isContextLost()) return;
      gl.uniform1f(iTimeLocation, (performance.now() - startTime) / 1000.0);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      animationFrameId = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      if (gl && !gl.isContextLost()) {
        gl.deleteProgram(program);
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        gl.deleteBuffer(vertexBuffer);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn("absolute inset-0 w-full h-full", className)}
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}
