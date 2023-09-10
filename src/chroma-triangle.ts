import { oklch } from './lib/oklch.js';
import { createProgram, createRenderingContext } from './lib/webgl.js';

/** vector shader source */
export const V_SHADER = `#version 300 es

in vec4 a_position;
in vec2 a_resolution;
in float a_hue;
out float v_hue;
out float v_cusp_l;
out float v_cusp_c;
out vec2 v_resolution;

${oklch}

void main() {
	gl_Position = a_position;
	v_resolution = a_resolution;
	v_hue = a_hue;
	float a = cos(radians(a_hue));
	float b = sin(radians(a_hue));
	vec2 cusp = find_cusp(a, b);
	v_cusp_l = cusp.x;
	v_cusp_c = cusp.y;
}`;

// 0.0----------0.7-------1.0
//                 0.8 = 0.466…
//                   0.9 = 0.233…
//                     1.0 = 0
/** fragment shader source */
export const F_SHADER = `#version 300 es
precision highp float;

${oklch}

in vec2 v_resolution;
in float v_hue;
in float v_cusp_l;
in float v_cusp_c;
out vec4 f_color;

void main() {
	float max_c = 0.4; // max displayed chroma; theoretically is 0.4 but for sRGB it’s closer to 0.37
	vec2 xy = gl_FragCoord.xy / v_resolution;
  float l = xy.x;
	float c = xy.y * max_c;
	float c_range = v_cusp_c / max_c;

	// -- OLD --
	// float y_threshold = l < v_cusp_l
	// 	? (l / v_cusp_l) * c_range
	// 	: c_range - (l - v_cusp_l) / (1.0 - v_cusp_l) * c_range;
	// -- OLD --

	vec3 rgb = oklch_to_srgb(vec3(l, c, v_hue), false);
	float y_threshold = c_range * l / v_cusp_l;
	if (xy.y > y_threshold || rgb.x > 1.001 || rgb.y > 1.001 || rgb.z > 1.001) {
		f_color = vec4(1.0, 1.0, 1.0, 1.0);
	} else {
		f_color = vec4(rgb.xyz, 1.0);
	}
}`;

export default class ChromaTriangle {
	gl: WebGL2RenderingContext;
	hue: number;
	program: WebGLProgram;
	attr = { a_position: -1, a_resolution: -1, a_hue: -1, a_chroma: -1 };

	private lastFrame: number | undefined;

	constructor(canvas: HTMLCanvasElement, hue: number) {
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
		this.gl.vertexAttrib1f(this.attr.a_hue, hue);
		this.gl.vertexAttrib2f(this.attr.a_resolution, this.gl.canvas.width, this.gl.canvas.height);
		this.render();
	}

	setHue(hue: number) {
		this.hue = hue;
		this.gl.vertexAttrib1f(this.attr.a_hue, this.hue);
		this.render();
	}

	setSize(rect: DOMRect) {
		this.gl.canvas.width = rect.width * devicePixelRatio;
		this.gl.canvas.height = rect.height * devicePixelRatio;
		this.gl.vertexAttrib2f(this.attr.a_resolution, this.gl.canvas.width, this.gl.canvas.height);
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
