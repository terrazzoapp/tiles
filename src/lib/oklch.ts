// Copyright(c) 2021 Björn Ottosson
//
// Permission is hereby granted, free of charge, to any person obtaining a copy of
// this softwareand associated documentation files(the "Software"), to deal in
// the Software without restriction, including without limitation the rights to
// use, copy, modify, merge, publish, distribute, sublicense, and /or sell copies
// of the Software, and to permit persons to whom the Software is furnished to do
// so, subject to the following conditions :
// The above copyright noticeand this permission notice shall be included in all
// copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.
export const oklch = `float cbrt(float x) {
	return sign(x) * pow(abs(x), 1.0 / 3.0);
}

float srgb_transfer_fn(float a) {
	float v = abs(a);
	return v <= 0.0031308 ? 12.92 * v : 1.055 * pow(v, (1.0 / 2.4)) - 0.055;
}

float srgb_inverse_transfer_fn(float a) {
	float v = abs(a);
	return v <= 0.04045 ? v / 12.92 : pow((v + 0.055) / 1.055, 2.4);
}

vec3 lab_to_lch(vec3 lab) {
	float chroma = sqrt(lab.y * lab.y + lab.z * lab.z);
	float hue = abs(lab.y) > 0.00001 && abs(lab.z) > 0.00001 ? degrees(atan(lab.z, lab.y)) : 0.0;
	if (hue < 0.0) hue += 360.0;
	return vec3(lab.x, chroma, hue);
}

vec3 lch_to_lab(vec3 lch) {
	// return black if lightness is sufficiently dark
	if (lch.x < 0.00001) {
		return vec3(0.0, 0.0, 0.0);
	}

	return vec3(
		lch.x,
		lch.y * cos(radians(lch.z)),
		lch.y * sin(radians(lch.z))
	);
}

vec3 srgb_to_linear_rgb(vec3 rgb) {
	return vec3(
		srgb_inverse_transfer_fn(rgb.x),
		srgb_inverse_transfer_fn(rgb.y),
		srgb_inverse_transfer_fn(rgb.z)
	);
}

vec3 linear_srgb_to_srgb(vec3 rgb) {
	return vec3(
		srgb_transfer_fn(rgb.x),
		srgb_transfer_fn(rgb.y),
		srgb_transfer_fn(rgb.z)
	);
}

vec3 oklab_to_linear_srgb(vec3 oklab) {
	float l = pow(oklab.x + 0.3963377774 * oklab.y + 0.2158037573 * oklab.z, 3.0);
	float m = pow(oklab.x - 0.1055613458 * oklab.y - 0.0638541728 * oklab.z, 3.0);
	float s = pow(oklab.x - 0.0894841775 * oklab.y - 1.2914855480 * oklab.z, 3.0);

	return vec3(
		+4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
		-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
		-0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s
	);
}

vec3 linear_srgb_to_oklab(vec3 rgb) {
	float l = cbrt(0.4122214708 * rgb.r + 0.5363325363 * rgb.g + 0.0514459929 * rgb.b);
	float m = cbrt(0.2119034982 * rgb.r + 0.6806995451 * rgb.g + 0.1073969566 * rgb.b);
	float s = cbrt(0.0883024619 * rgb.r + 0.2817188376 * rgb.g + 0.6299787005 * rgb.b);

	return vec3(
		0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
		1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
		0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s
	);
}

// Finds the maximum saturation possible for a given hue that fits in sRGB
// Saturation here is defined as S = C/L
// a and b must be normalized so a^2 + b^2 == 1
float compute_max_saturation(float a, float b) {
	// Max saturation will be when one of r, g or b goes below zero.

	// Select different coefficients depending on which component goes below zero first
	float k0, k1, k2, k3, k4, wl, wm, ws;

	if (-1.88170328 * a - 0.80936493 * b > 1.0) {
		// Red component
		k0 = +1.19086277; k1 = +1.76576728; k2 = +0.59662641; k3 = +0.75515197; k4 = +0.56771245;
		wl = +4.0767416621; wm = -3.3077115913; ws = +0.2309699292;
	}
	else if (1.81444104 * a - 1.19445276 * b > 1.0) {
		// Green component
		k0 = +0.73956515; k1 = -0.45954404; k2 = +0.08285427; k3 = +0.12541070; k4 = +0.14503204;
		wl = -1.2684380046; wm = +2.6097574011; ws = -0.3413193965;
	}
	else {
		// Blue component
		k0 = +1.35733652; k1 = -0.00915799; k2 = -1.15130210; k3 = -0.50559606; k4 = +0.00692167;
		wl = -0.0041960863; wm = -0.7034186147; ws = +1.7076147010;
	}

	// Approximate max saturation using a polynomial:
	float S = k0 + k1 * a + k2 * b + k3 * a * a + k4 * a * b;

	// Do one step Halley's method to get closer
	// this gives an error less than 10e6, except for some blue hues where the dS/dh is close to infinite
	// this should be sufficient for most applications, otherwise do two/three steps

	float k_l = +0.3963377774 * a + 0.2158037573 * b;
	float k_m = -0.1055613458 * a - 0.0638541728 * b;
	float k_s = -0.0894841775 * a - 1.2914855480 * b;

	{
		float l_ = 1.0 + S * k_l;
		float m_ = 1.0 + S * k_m;
		float s_ = 1.0 + S * k_s;

		float l = l_ * l_ * l_;
		float m = m_ * m_ * m_;
		float s = s_ * s_ * s_;

		float l_dS = 3.0 * k_l * l_ * l_;
		float m_dS = 3.0 * k_m * m_ * m_;
		float s_dS = 3.0 * k_s * s_ * s_;

		float l_dS2 = 6.0 * k_l * k_l * l_;
		float m_dS2 = 6.0 * k_m * k_m * m_;
		float s_dS2 = 6.0 * k_s * k_s * s_;

		float f = wl * l + wm * m + ws * s;
		float f1 = wl * l_dS + wm * m_dS + ws * s_dS;
		float f2 = wl * l_dS2 + wm * m_dS2 + ws * s_dS2;

		S = S - f * f1 / (f1 * f1 - 0.5 * f * f2);
	}

	return S;
}

// finds L_cusp and C_cusp for a given hue
// a and b must be normalized so a^2 + b^2 == 1
vec2 find_cusp(float a, float b) {
	// First, find the maximum saturation (saturation S = C/L)
	float S_cusp = compute_max_saturation(a, b);

	// Convert to linear sRGB to find the first point where at least one of r,g or b >= 1:
	vec3 rgb_at_max = oklab_to_linear_srgb(vec3(1.0, S_cusp * a, S_cusp * b));
	float L_cusp = cbrt(1.0 / max(max(rgb_at_max.x, rgb_at_max.y), rgb_at_max.z));
	float C_cusp = L_cusp * S_cusp;

	return vec2(L_cusp, C_cusp);
}


// Finds intersection of the line defined by
// L = L0 * (1 - t) + t * L1;
// C = t * C1;
// a and b must be normalized so a^2 + b^2 == 1
float find_gamut_intersection(float a, float b, float L1, float C1, float L0) {
	// Find the cusp of the gamut triangle
	vec2 cusp = find_cusp(a, b);
	float cusp_l = cusp.x;
	float cusp_c = cusp.y;

	// Find the intersection for upper and lower half seprately
	if (((L1 - L0) * cusp_c - (cusp_l - L0) * C1) <= 0.0) {
		// Lower half

		return cusp_c * L0 / (C1 * cusp_l + cusp_c * (L0 - L1));
	}

	// Upper half

	// First intersect with triangle
	float t = (cusp_c * (L0 - 1.0)) / (C1 * (cusp_l - 1.0) + cusp_c * (L0 - L1));

	// Then one step Halley's method
	{
		float dL = L1 - L0;
		float dC = C1;

		float k_l = +0.3963377774 * a + 0.2158037573 * b;
		float k_m = -0.1055613458 * a - 0.0638541728 * b;
		float k_s = -0.0894841775 * a - 1.2914855480 * b;

		float l_dt = dL + dC * k_l;
		float m_dt = dL + dC * k_m;
		float s_dt = dL + dC * k_s;

		// If higher accuracy is required, 2 or 3 iterations of the following block can be used:
		{
			float L = L0 * (1.0 - t) + t * L1;
			float C = t * C1;

			float l_ = L + C * k_l;
			float m_ = L + C * k_m;
			float s_ = L + C * k_s;

			float l = l_ * l_ * l_;
			float m = m_ * m_ * m_;
			float s = s_ * s_ * s_;
			float ldt = 3.0 * l_dt * l_ * l_;
			float mdt = 3.0 * m_dt * m_ * m_;
			float sdt = 3.0 * s_dt * s_ * s_;
			float ldt2 = 6.0 * l_dt * l_dt * l_;
			float mdt2 = 6.0 * m_dt * m_dt * m_;
			float sdt2 = 6.0 * s_dt * s_dt * s_;

			float r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s - 1.0;
			float r1 = 4.0767416621 * ldt - 3.3077115913 * mdt + 0.2309699292 * sdt;
			float r2 = 4.0767416621 * ldt2 - 3.3077115913 * mdt2 + 0.2309699292 * sdt2;
			float u_r = r1 / (r1 * r1 - 0.5 * r * r2);
			float t_r = -r * u_r;

			float g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s - 1.0;
			float g1 = -1.2684380046 * ldt + 2.6097574011 * mdt - 0.3413193965 * sdt;
			float g2 = -1.2684380046 * ldt2 + 2.6097574011 * mdt2 - 0.3413193965 * sdt2;
			float u_g = g1 / (g1 * g1 - 0.5 * g * g2);
			float t_g = -g * u_g;

			float b = -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s - 1.0;
			float b1 = -0.0041960863 * ldt - 0.7034186147 * mdt + 1.7076147010 * sdt;
			float b2 = -0.0041960863 * ldt2 - 0.7034186147 * mdt2 + 1.7076147010 * sdt2;
			float u_b = b1 / (b1 * b1 - 0.5 * b * b2);
			float t_b = -b * u_b;

			if (u_r < 0.0) t_r = 100.0; // 100.0 = some arbitrary value > 1.0
			if (u_g < 0.0) t_g = 100.0;
			if (u_b < 0.0) t_b = 100.0;

			t += min(t_r, min(t_g, t_b));
		}
	}

	return t;
}

vec3 oklch_to_srgb(vec3 oklch, bool clamp_chroma) {
	vec3 oklab = lch_to_lab(oklch);
	vec3 linear_srgb = oklab_to_linear_srgb(oklab);
	vec3 srgb = linear_srgb_to_srgb(linear_srgb);

	// for anything sufficiently dark, return 0,0,0 (rather than negative RGB values)
	if (srgb.x < 0.001 && srgb.y < 0.001 && srgb.z < 0.001) {
		return vec3(0.0, 0.0, 0.0);
	}

	// if color is out of sRGB range (0.0, 1.0), use the “Preserve light, clamp Chroma” method
	// https://bottosson.github.io/posts/gamutclipping/
	if (clamp_chroma && (srgb.x > 1.001 || srgb.y > 1.001 || srgb.z > 1.001)) {
		float eps = 0.00001;
		float c = max(eps, sqrt(pow(oklab.y, 2.0) + pow(oklab.z, 2.0)));
		float l_gamut = max(min(oklab.x, 1.0), 0.0);
		float a = oklab.y / c;
		float b = oklab.z / c;
		float t = find_gamut_intersection(a, b, oklab.x, c, l_gamut);

		vec3 clamped_oklab = vec3(
			l_gamut * (1.0 - t) + t * oklab.x,
			a * (t * c),
			b * (t * c)
		);
		return linear_srgb_to_srgb(oklab_to_linear_srgb(clamped_oklab));
	}

	return srgb;
}

vec3 srgb_to_oklch(vec3 rgb) {
	vec3 linear_srgb = srgb_to_linear_rgb(rgb);
	vec3 oklab = linear_srgb_to_oklab(linear_srgb);
	return lab_to_lch(oklab);
}`;
