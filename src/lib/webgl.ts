/** create a WebGL2 rendering context and throw errors if needed */
export function createRenderingContext(canvas: HTMLCanvasElement): WebGL2RenderingContext {
	// init canvas
	if (!canvas) {
		throw new Error('Canvas element missing');
	}

	// init GL
	const gl = canvas.getContext('webgl2');
	if (!gl) {
		throw new Error('Could not get WebGL context');
	}
	const canvasRect = canvas.getBoundingClientRect();
	canvas.width = canvasRect.width * devicePixelRatio;
	canvas.height = canvasRect.height * devicePixelRatio;
	gl.viewport(0, 0, canvasRect.width, canvasRect.height);

	return gl;
}

export interface CreateProgramOptions {
	gl: WebGL2RenderingContext;
	vShaderSrc: string;
	fShaderSrc: string;
}

/** create a WebGL program from vertex shader & fragment shader sources */
export function createProgram({ gl, vShaderSrc, fShaderSrc }: CreateProgramOptions): WebGLProgram {
	// vertex shader
	const vShader = gl.createShader(gl.VERTEX_SHADER)!;
	gl.shaderSource(vShader, vShaderSrc);
	gl.compileShader(vShader);
	if (!gl.getShaderParameter(vShader, gl.COMPILE_STATUS)) {
		throw new Error(`VECTOR SHADER: ${gl.getShaderInfoLog(vShader)}`);
	}

	// fragment shader
	const fShader = gl.createShader(gl.FRAGMENT_SHADER)!;
	gl.shaderSource(fShader, fShaderSrc);
	gl.compileShader(fShader);
	if (!gl.getShaderParameter(fShader, gl.COMPILE_STATUS)) {
		throw new Error(`FRAGMENT SHADER: ${gl.getShaderInfoLog(fShader)}`);
	}

	// build program
	const program = gl.createProgram()!;
	gl.attachShader(program, vShader);
	gl.attachShader(program, fShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw new Error(gl.getProgramInfoLog(program)!);
	}
	gl.useProgram(program);
	return program;
}
