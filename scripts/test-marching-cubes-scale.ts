/**
 * Test script to measure the actual scale factor of MarchingCubes output
 * Run with: bun run scripts/test-marching-cubes-scale.ts
 */

import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";

// Import the actual vessel generation function to test with real parameters
import { generateVesselGeometry } from "../components/home/SDFVesselGen";

// Test function that creates a single metaball and measures output size
function testMarchingCubesScale(inputRadius: number): { inputRadius: number; outputRadius: number; scaleFactor: number } {
    const resolution = 64;
    const effect = new MarchingCubes(resolution, new THREE.MeshBasicMaterial(), true, true, 100000);

    // Setup bounding box exactly like generateVesselGeometry
    const center = new THREE.Vector3(0, 0, 0);
    const padding = 1.5; // Same padding as vessel generation
    const min = new THREE.Vector3(-padding, -padding, -padding);
    const max = new THREE.Vector3(padding, padding, padding);
    const size = new THREE.Vector3().subVectors(max, min); // = (3, 3, 3)

    effect.position.copy(min).addScaledVector(size, 0.5); // center at (0,0,0)
    effect.scale.copy(size).multiplyScalar(0.5); // scale = (1.5, 1.5, 1.5)
    effect.updateMatrix();
    effect.updateMatrixWorld();
    effect.reset();

    // Add a single ball at center with specified radius
    const worldToGrid = (v: THREE.Vector3) => ({
        x: (v.x - min.x) / size.x,
        y: (v.y - min.y) / size.y,
        z: (v.z - min.z) / size.z,
    });

    const gridPos = worldToGrid(center);
    const gridRadius = inputRadius / Math.max(size.x, size.y, size.z);
    const influence = gridRadius * 12.0; // Same as vessel generation

    effect.addBall(gridPos.x, gridPos.y, gridPos.z, influence, 12);

    effect.isolation = 80;
    // @ts-ignore
    if (effect.update) effect.update();

    const geometry = effect.geometry.clone();
    geometry.applyMatrix4(effect.matrix);

    // Measure actual output size
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox!;
    const outputSize = new THREE.Vector3();
    bbox.getSize(outputSize);

    // Output radius is half the diameter (average of all axes)
    const outputRadius = (outputSize.x + outputSize.y + outputSize.z) / 6;

    return {
        inputRadius,
        outputRadius,
        scaleFactor: outputRadius / inputRadius
    };
}

// Test with various input radii
console.log("=== MarchingCubes Scale Factor Test ===\n");
console.log("Testing single metaball at center with various input radii:\n");

const testRadii = [0.10, 0.14, 0.16, 0.22, 0.30];

for (const radius of testRadii) {
    const result = testMarchingCubesScale(radius);
    console.log(`Input radius: ${result.inputRadius.toFixed(2)}`);
    console.log(`Output radius: ${result.outputRadius.toFixed(4)}`);
    console.log(`Scale factor: ${result.scaleFactor.toFixed(4)}`);
    console.log("---");
}

// Test with a tube (series of balls along a line) like vessel generation
function testTubeScale(inputRadius: number): { inputRadius: number; outputRadius: number; scaleFactor: number } {
    const resolution = 64;
    const effect = new MarchingCubes(resolution, new THREE.MeshBasicMaterial(), true, true, 100000);

    const padding = 1.5;
    const min = new THREE.Vector3(-padding, -padding - 2, -padding);
    const max = new THREE.Vector3(padding, padding + 2, padding);
    const size = new THREE.Vector3().subVectors(max, min);

    effect.position.copy(min).addScaledVector(size, 0.5);
    effect.scale.copy(size).multiplyScalar(0.5);
    effect.updateMatrix();
    effect.updateMatrixWorld();
    effect.reset();

    const worldToGrid = (v: THREE.Vector3) => ({
        x: (v.x - min.x) / size.x,
        y: (v.y - min.y) / size.y,
        z: (v.z - min.z) / size.z,
    });

    // Create a tube along Y axis (like vessel generation does)
    const tubeLength = 2.0;
    const steps = 40; // 20 spheres per unit length

    for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const y = -tubeLength / 2 + t * tubeLength;
        const point = new THREE.Vector3(0, y, 0);
        const gridPos = worldToGrid(point);
        const gridRadius = inputRadius / Math.max(size.x, size.y, size.z);
        const influence = gridRadius * 12.0;
        effect.addBall(gridPos.x, gridPos.y, gridPos.z, influence, 12);
    }

    effect.isolation = 80;
    // @ts-ignore
    if (effect.update) effect.update();

    const geometry = effect.geometry.clone();
    geometry.applyMatrix4(effect.matrix);

    // Measure actual output size - we care about X and Z (perpendicular to tube)
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox!;
    const outputSize = new THREE.Vector3();
    bbox.getSize(outputSize);

    // Output radius is half the diameter in X and Z
    const outputRadius = (outputSize.x + outputSize.z) / 4;

    return {
        inputRadius,
        outputRadius,
        scaleFactor: outputRadius / inputRadius
    };
}

console.log("\n=== Testing Tube (like vessel generation) ===\n");

for (const radius of testRadii) {
    const result = testTubeScale(radius);
    console.log(`Input radius: ${result.inputRadius.toFixed(2)}`);
    console.log(`Output tube radius: ${result.outputRadius.toFixed(4)}`);
    console.log(`Scale factor: ${result.scaleFactor.toFixed(4)}`);
    console.log("---");
}

// Test with ACTUAL generateVesselGeometry function
function testActualVesselGeometry(inputRadius: number): { inputRadius: number; outputRadius: number; scaleFactor: number } {
    // Create a simple straight path
    const path = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -2, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 2, 0),
    ]);

    const geometry = generateVesselGeometry([{ path, radius: inputRadius }]);

    // Measure actual output size
    geometry.computeBoundingBox();
    const bbox = geometry.boundingBox!;
    const outputSize = new THREE.Vector3();
    bbox.getSize(outputSize);

    // Output radius is half the diameter in X and Z (perpendicular to Y axis)
    const outputRadius = (outputSize.x + outputSize.z) / 4;

    return {
        inputRadius,
        outputRadius,
        scaleFactor: outputRadius / inputRadius
    };
}

console.log("\n=== Testing ACTUAL generateVesselGeometry ===\n");

for (const radius of testRadii) {
    const result = testActualVesselGeometry(radius);
    console.log(`Input radius: ${result.inputRadius.toFixed(2)}`);
    console.log(`ACTUAL output radius: ${result.outputRadius.toFixed(4)}`);
    console.log(`ACTUAL scale factor: ${result.scaleFactor.toFixed(4)}`);
    console.log("---");
}

// Summary
console.log("\n=== SUMMARY ===\n");
console.log("For the clot at left branch (input radius 0.16):");
const clotTest = testActualVesselGeometry(0.16);
console.log(`Vessel input radius: 0.16`);
console.log(`Vessel OUTPUT radius: ${clotTest.outputRadius.toFixed(4)}`);
console.log(`Scale factor: ${clotTest.scaleFactor.toFixed(4)}`);
console.log(`\nClot should use visual radius = 0.16 * ${clotTest.scaleFactor.toFixed(2)} * 0.9 = ${(0.16 * clotTest.scaleFactor * 0.9).toFixed(4)}`);
console.log(`(0.9 factor to keep clot slightly inside vessel walls)`);
