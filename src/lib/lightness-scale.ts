import { oklch } from './oklch.js';
import { createProgram, createRenderingContext } from './webgl.js';

/** vector shader source */
export const V_SHADER = `#version 300 es

in vec4 a_position;
in vec2 a_resolution;
in float a_hue;
in float a_chroma;

out float v_hue;
out float v_chroma;
out vec2 v_resolution;

void main() {
	gl_Position = a_position;
	v_resolution = a_resolution;
	v_hue = a_hue;
	v_chroma = a_chroma;
}`;

/** fragment shader source */
export const F_SHADER = `#version 300 es
precision highp float;

in vec2 v_resolution;
in float v_hue;
in float v_chroma;
out vec4 f_color;

${oklch}

void main() {
	// get lightness from y coordinate
  float l = vec2(gl_FragCoord.xy / v_resolution).y;
	vec3 rgb = oklch_to_srgb(vec3(l, v_chroma, v_hue), true);
	f_color = vec4(rgb.xyz, 1.0);
}`;

export class LightnessScale {
	gl: WebGL2RenderingContext;
	chroma: number;
	hue: number;
	program: WebGLProgram;
	attr = { a_position: -1, a_resolution: -1, a_hue: -1, a_chroma: -1 };

	private lastFrame: number | undefined;

	constructor(canvas: HTMLCanvasElement, chroma: number, hue: number) {
		this.gl = createRenderingContext(canvas);
		this.program = createProgram({ gl: this.gl, vShaderSrc: V_SHADER, fShaderSrc: F_SHADER });

		// get attribute locations
		this.attr.a_position = this.gl.getAttribLocation(this.program, 'a_position');
		this.attr.a_resolution = this.gl.getAttribLocation(this.program, 'a_resolution');
		this.attr.a_hue = this.gl.getAttribLocation(this.program, 'a_hue');
		this.attr.a_chroma = this.gl.getAttribLocation(this.program, 'a_chroma');
		this.gl.enableVertexAttribArray(this.attr.a_position);

		// keep canvas size up-to-date
		const ro = new ResizeObserver((entries) => this.setSize(entries[0]!.contentRect));
		if (!(this.gl.canvas instanceof OffscreenCanvas)) {
			ro.observe(this.gl.canvas);
		}

		// init attribs & first paint
		this.hue = hue;
		this.chroma = chroma;
		this.gl.vertexAttrib1f(this.attr.a_hue, hue);
		this.gl.vertexAttrib2f(this.attr.a_resolution, this.gl.canvas.width, this.gl.canvas.height);
		this.render();
	}

	setColor(chroma: number, hue: number) {
		this.chroma = chroma;
		this.gl.vertexAttrib1f(this.attr.a_chroma, this.chroma);
		this.hue = hue;
		this.gl.vertexAttrib1f(this.attr.a_hue, this.hue);
		this.render();
	}

	setSize(rect: DOMRect) {
		this.gl.vertexAttrib2f(this.attr.a_resolution, rect.width, rect.height);
		this.gl.canvas.width = rect.width;
		this.gl.canvas.height = rect.height;
		this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
		this.render();
	}

	/** render the canvas */
	render() {
		if (this.lastFrame) {
			cancelAnimationFrame(this.lastFrame);
		}
		this.lastFrame = requestAnimationFrame(() => {
			const positionBuffer = this.gl.createBuffer();
			this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
			this.gl.vertexAttribPointer(this.attr.a_position, 2, this.gl.FLOAT, false, 0, 0);
			// prettier-ignore
			this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array([
				-1,-1,		1,-1,		-1, 1, // first triangle
				-1, 1,		1,-1,		 1, 1, // second triangle
			]), this.gl.STATIC_DRAW);
			this.gl.drawArrays(this.gl.TRIANGLES, 0, 6);

			this.lastFrame = undefined;
		});
	}
}
