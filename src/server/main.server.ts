import { Bin } from "@rbxts/bin";
import { RunService, Workspace } from "@rbxts/services";
import { Setting } from "./Setting";
import { wireframeCircle } from "./wireframeCircle";

const { Terrain } = Workspace;

const wormCount = new Setting("WormCount", 5);
const wormLength = new Setting("WormLength", 50);
const wormStepLength = new Setting("WormStepLength", 10);
const wormSpreadDegY = new Setting("WormSpreadDegY", 60);
const wormSpreadDegX = new Setting("WormSpreadDegX", 0);
const wormScale = new Setting("WormScale", 1);
const circleRadius = new Setting("CircleRadius", 250);

const CAVE_SEED_N = 32768;

const bin = new Bin();

RunService.Heartbeat.Connect(() => {
	bin.destroy();

	const center = bin.add(new Instance("SphereHandleAdornment"));
	center.Color3 = BrickColor.White().Color;
	center.Radius = 0.5;
	center.Adornee = Terrain;
	center.Parent = Terrain;

	const circle = bin.add(wireframeCircle(CFrame.identity, circleRadius.get(), BrickColor.White().Color, 100));
	circle.Adornee = Terrain;
	circle.Parent = Terrain;

	const random = new Random(0);

	function createVector3Seed() {
		return new Vector3(
			random.NextInteger(-CAVE_SEED_N, CAVE_SEED_N),
			random.NextInteger(-CAVE_SEED_N, CAVE_SEED_N),
			random.NextInteger(-CAVE_SEED_N, CAVE_SEED_N),
		);
	}

	function vectorNoise(value: Vector3) {
		return math.noise(value.X, value.Y, value.Z);
	}

	const wormSeedY = createVector3Seed();
	const wormSeedX = createVector3Seed();

	function createWorm(wormNoiseOffset: number, initial: Vector3, steps: number) {
		const points = [initial];
		// eslint-disable-next-line prefer-const
		for (const i of $range(1, steps - 1)) {
			const prev = points[i - 1];

			const dir = i === 1 ? random.NextUnitVector().mul(new Vector3(1, 0, 1)).Unit : prev.sub(points[i - 2]).Unit;

			const cf = CFrame.lookAt(prev, prev.add(dir));

			const input = prev.add(Vector3.one.mul(wormNoiseOffset)).mul(wormScale.get());
			const yRad = vectorNoise(input.add(wormSeedY)) * math.rad(wormSpreadDegY.get());
			const xRad = vectorNoise(input.add(wormSeedX)) * math.rad(wormSpreadDegX.get());

			const pos = cf.mul(CFrame.Angles(xRad, yRad, 0)).mul(new CFrame(0, 0, -wormStepLength.get())).Position;

			points[i] = pos;

			// current = current.mul(CFrame.Angles(xRad, yRad, 0)).mul(new CFrame(0, 0, -wormStepLength.get()));
			// points.push(current.Position);
		}
		return points;
	}

	for (const wormIdx of $range(0, wormCount.get() - 1)) {
		const wireframe = bin.add(new Instance("WireframeHandleAdornment"));
		wireframe.Adornee = Terrain;
		wireframe.Parent = Terrain;
		wireframe.Color3 = Color3.fromHSV(random.NextNumber(0, 1), 1, 1);

		const wormNoiseOffset = random.NextInteger(-1000, 1000) * math.pi;
		const initial = Vector3.zero;
		const worm = createWorm(wormNoiseOffset, initial, wormLength.get());

		for (const i of $range(1, worm.size() - 1)) {
			wireframe.AddLine(worm[i - 1], worm[i]);
		}
	}
});
