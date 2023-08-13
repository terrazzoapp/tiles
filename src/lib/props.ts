/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Omit keys from an object
 */
export function omit<T = Record<string, any>>(props: T, propNames: string[]): T {
	if (!props) return props;
	const newProps = {} as T;
	for (const k of Object.keys(props)) {
		if (!propNames.includes(k)) (newProps as any)[k] = (props as any)[k];
	}
	return newProps;
}
