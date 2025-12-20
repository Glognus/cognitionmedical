/**
 * Test script to verify clot position and measure actual vessel radius at that location
 * Run with: bun run scripts/test-clot-position.ts
 */

import * as THREE from "three";
import { generateVesselGeometry } from "../components/home/SDFVesselGen";

// Recreate the exact paths from VascularScene3D.tsx
const createLeftBranchPath = () => {
	return new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-0.2, 0.4, 0.1),
		new THREE.Vector3(-0.5, 1.0, 0.25),
		new THREE.Vector3(-0.85, 1.6, 0.42),
		new THREE.Vector3(-1.2, 2.2, 0.58),
		new THREE.Vector3(-1.5, 2.8, 0.72),
		new THREE.Vector3(-1.8, 3.5, 0.9),
		new THREE.Vector3(-2.1, 4.2, 1.1),
	]);
};

const createBloodFlowLeftPath = () => {
	// Main vessel → Left branch (continuous flow)
	return new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, -6, 0),
		new THREE.Vector3(0.03, -4, 0.02),
		new THREE.Vector3(0.05, -2, 0.03),
		new THREE.Vector3(0.04, -1, 0.02),
		new THREE.Vector3(0, 0, 0),
		// Continue into left branch
		new THREE.Vector3(-0.2, 0.4, 0.1),
		new THREE.Vector3(-0.5, 1.0, 0.25),
		new THREE.Vector3(-0.85, 1.6, 0.42),
		new THREE.Vector3(-1.2, 2.2, 0.58),
		new THREE.Vector3(-1.5, 2.8, 0.72),
	]);
};

// Clot parameters from VascularScene3D.tsx
const clotTPosition = 0.85;
const clotVesselRadius = 0.16; // This is what the code uses

console.log("=== CLOT POSITION ANALYSIS ===\n");

// Get clot position on bloodFlowLeftPath
const bloodFlowLeftPath = createBloodFlowLeftPath();
const clotPosition = bloodFlowLeftPath.getPoint(clotTPosition);
const clotTangent = bloodFlowLeftPath.getTangent(clotTPosition);

console.log(`Clot t position: ${clotTPosition}`);
console.log(
	`Clot 3D position: (${clotPosition.x.toFixed(3)}, ${clotPosition.y.toFixed(3)}, ${clotPosition.z.toFixed(3)})`,
);
console.log(
	`Clot tangent: (${clotTangent.x.toFixed(3)}, ${clotTangent.y.toFixed(3)}, ${clotTangent.z.toFixed(3)})`,
);
console.log(`\nClot vessel radius used in code: ${clotVesselRadius}`);

// Now let's understand which vessel this corresponds to
// The bloodFlowLeftPath goes: main vessel (t=0 to ~0.5) -> left branch (t=0.5 to 1.0)
console.log("\n=== PATH ANALYSIS ===\n");
console.log("bloodFlowLeftPath structure:");
console.log("  t=0.0 to ~0.5: Main vessel (input radius 0.22)");
console.log("  t=0.5 to 1.0: Left branch (input radius 0.16)");
console.log(`\nAt t=${clotTPosition}, we're in the LEFT BRANCH`);

// Let's check what percentage along the left branch this is
// The bloodFlowLeftPath has 10 points total
// Points 0-4 are main vessel, points 5-9 are left branch
// At t=0.85, we're near the end of the path (point 8-9 area)
const leftBranchPath = createLeftBranchPath();
const leftBranchEndPos = leftBranchPath.getPoint(1.0);
console.log(
	`Left branch end position: (${leftBranchEndPos.x.toFixed(3)}, ${leftBranchEndPos.y.toFixed(3)}, ${leftBranchEndPos.z.toFixed(3)})`,
);

// Compare clot position to left branch
const leftBranchPoint85 = leftBranchPath.getPoint(0.7); // Approximate
console.log(
	`Left branch at t=0.7: (${leftBranchPoint85.x.toFixed(3)}, ${leftBranchPoint85.y.toFixed(3)}, ${leftBranchPoint85.z.toFixed(3)})`,
);

// Now measure the ACTUAL visual radius of the vessel at the clot position
console.log("\n=== MEASURING ACTUAL VESSEL RADIUS ===\n");

// Generate vessel geometry with just the left branch
const leftBranchGeometry = generateVesselGeometry([{ path: leftBranchPath, radius: 0.16 }]);

leftBranchGeometry.computeBoundingBox();
const bbox = leftBranchGeometry.boundingBox!;
const size = new THREE.Vector3();
bbox.getSize(size);

console.log(
	`Left branch bounding box: X=${size.x.toFixed(3)}, Y=${size.y.toFixed(3)}, Z=${size.z.toFixed(3)}`,
);

// The vessel is roughly cylindrical - X and Z give us diameter
const estimatedVisualDiameter = (size.x + size.z) / 2;
const estimatedVisualRadius = estimatedVisualDiameter / 2;

console.log(`Estimated visual diameter: ${estimatedVisualDiameter.toFixed(4)}`);
console.log(`Estimated visual radius: ${estimatedVisualRadius.toFixed(4)}`);
console.log(`Scale factor: ${(estimatedVisualRadius / 0.16).toFixed(4)}`);

// But this is the max - let's try to measure at a specific point
// We need to sample the geometry to find the radius at the clot position

console.log("\n=== SAMPLING GEOMETRY AT CLOT POSITION ===\n");

// Get all vertices near the clot Y position
const positions = leftBranchGeometry.attributes.position;
const clotY = clotPosition.y;
const tolerance = 0.3; // Search within this Y range

let maxDistFromCenter = 0;
let sampledPoints = 0;

for (let i = 0; i < positions.count; i++) {
	const y = positions.getY(i);
	if (Math.abs(y - clotY) < tolerance) {
		const x = positions.getX(i);
		const z = positions.getZ(i);
		// Distance from the path center line (approximately)
		const distFromPath = Math.sqrt((x - clotPosition.x) ** 2 + (z - clotPosition.z) ** 2);
		if (distFromPath > maxDistFromCenter) {
			maxDistFromCenter = distFromPath;
		}
		sampledPoints++;
	}
}

console.log(`Sampled ${sampledPoints} vertices near clot Y position (${clotY.toFixed(3)})`);
console.log(`Max distance from path center: ${maxDistFromCenter.toFixed(4)}`);
console.log(`This is the ACTUAL visual radius at clot position: ${maxDistFromCenter.toFixed(4)}`);

// Calculate what the clot radius should be
const clotRadiusNeeded = maxDistFromCenter * 0.98; // 98% to fill vessel
console.log(`\n=== RECOMMENDED CLOT SETTINGS ===\n`);
console.log(`Actual vessel visual radius at clot: ${maxDistFromCenter.toFixed(4)}`);
console.log(`Clot radius should be: ${clotRadiusNeeded.toFixed(4)} (98% of vessel)`);
console.log(`\nCurrent code uses: vesselRadius * 2.35 * 0.97 = ${(0.16 * 2.35 * 0.97).toFixed(4)}`);
console.log(`Difference: ${(clotRadiusNeeded - 0.16 * 2.35 * 0.97).toFixed(4)}`);

// Direct recommendation
const neededScaleFactor = clotRadiusNeeded / 0.16;
console.log(`\nTo fix: Use scale factor ${neededScaleFactor.toFixed(4)} instead of 2.35 * 0.97`);
console.log(`Or set visualRadius directly to ${clotRadiusNeeded.toFixed(4)}`);
