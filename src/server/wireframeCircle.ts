export function wireframeCircle(cframe: CFrame, radius: number, color: Color3, segments: number) {
	const wireframe = new Instance("WireframeHandleAdornment");
	wireframe.Color3 = color;

	for (const i of $range(1, segments)) {
		const point0 = cframe
			.mul(CFrame.Angles(0, ((i - 1) / segments) * 2 * math.pi, 0))
			.mul(new CFrame(0, 0, -radius)).Position;

		const point1 = cframe
			.mul(CFrame.Angles(0, (i / segments) * 2 * math.pi, 0))
			.mul(new CFrame(0, 0, -radius)).Position;

		wireframe.AddLine(point0, point1);
	}

	return wireframe;
}
