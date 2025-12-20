"use client";

import { useRef, useMemo, useEffect, useState, useCallback, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
	Environment,
	PerspectiveCamera,
	useProgress,
	Html,
} from "@react-three/drei";
import * as THREE from "three";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { generateVesselGeometry, generateClotGeometryForVessel } from "./SDFVesselGen";

// ============================================
// VESSEL PATH DEFINITIONS
// ============================================

// Vessel paths - extended beyond visible area so ends are off-screen
const createMainVesselPath = () => {
	return new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, -8, 0), // Extended far below (off-screen)
		new THREE.Vector3(0, -6, 0),
		new THREE.Vector3(0.03, -4, 0.02),
		new THREE.Vector3(0.05, -2, 0.03),
		new THREE.Vector3(0.04, -1, 0.02),
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0, 0.3, 0),
	]);
};

const createLeftBranchPath = () => {
	return new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-0.2, 0.4, 0.1),
		new THREE.Vector3(-0.5, 1.0, 0.25),
		new THREE.Vector3(-0.85, 1.6, 0.42),
		new THREE.Vector3(-1.2, 2.2, 0.58),
		new THREE.Vector3(-1.5, 2.8, 0.72),
		new THREE.Vector3(-1.8, 3.5, 0.9), // Extended
		new THREE.Vector3(-2.1, 4.2, 1.1), // Off-screen
	]);
};

const createRightBranchPath = () => {
	return new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(0.25, 0.45, -0.08),
		new THREE.Vector3(0.55, 1.1, -0.18),
		new THREE.Vector3(0.85, 1.75, -0.22),
		new THREE.Vector3(1.1, 2.4, -0.18),
		new THREE.Vector3(1.4, 3.2, -0.1), // Extended
		new THREE.Vector3(1.7, 4.0, 0), // Off-screen
	]);
};

const createCerebralPath = () => {
	return new THREE.CatmullRomCurve3([
		new THREE.Vector3(-1.5, 2.8, 0.72),
		new THREE.Vector3(-1.75, 2.9, 0.9),
		new THREE.Vector3(-2.05, 3.1, 1.1),
		new THREE.Vector3(-2.35, 3.35, 1.25),
		new THREE.Vector3(-2.6, 3.6, 1.35),
		new THREE.Vector3(-2.9, 3.9, 1.5), // Extended off-screen
	]);
};

const createLeftContinuationPath = () => {
	return new THREE.CatmullRomCurve3([
		new THREE.Vector3(-1.5, 2.8, 0.72),
		new THREE.Vector3(-1.55, 3.0, 0.62),
		new THREE.Vector3(-1.62, 3.3, 0.55),
		new THREE.Vector3(-1.68, 3.6, 0.48),
		new THREE.Vector3(-1.75, 4.0, 0.4), // Extended off-screen
	]);
};

// Blood flow paths - CONTINUOUS from bottom through branches
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

const createBloodFlowRightPath = () => {
	// Main vessel → Right branch (continuous flow)
	return new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, -6, 0),
		new THREE.Vector3(0.03, -4, 0.02),
		new THREE.Vector3(0.05, -2, 0.03),
		new THREE.Vector3(0.04, -1, 0.02),
		new THREE.Vector3(0, 0, 0),
		// Continue into right branch
		new THREE.Vector3(0.25, 0.45, -0.08),
		new THREE.Vector3(0.55, 1.1, -0.18),
		new THREE.Vector3(0.85, 1.75, -0.22),
		new THREE.Vector3(1.1, 2.4, -0.18),
	]);
};

const createCatheterPath = () => {
	return new THREE.CatmullRomCurve3([
		new THREE.Vector3(0, -4, 0),
		new THREE.Vector3(0.03, -3, 0.02),
		new THREE.Vector3(0.05, -2, 0.03),
		new THREE.Vector3(0.04, -1, 0.02),
		new THREE.Vector3(0, 0, 0),
		new THREE.Vector3(-0.2, 0.4, 0.1),
		new THREE.Vector3(-0.5, 1.0, 0.25),
		new THREE.Vector3(-0.85, 1.6, 0.42),
		new THREE.Vector3(-1.2, 2.2, 0.58),
		new THREE.Vector3(-1.5, 2.8, 0.72),
		new THREE.Vector3(-1.75, 2.9, 0.9),
		new THREE.Vector3(-2.05, 3.1, 1.1),
		new THREE.Vector3(-2.35, 3.35, 1.25),
		new THREE.Vector3(-2.55, 3.55, 1.33),
	]);
};

// ============================================
// UNIFIED BLOOD VESSEL SYSTEM - CSG Union
// ============================================

function UnifiedVesselNetwork() {
	const mergedGeometry = useMemo(() => {
		const mainPath = createMainVesselPath();
		const leftPath = createLeftBranchPath();
		const rightPath = createRightBranchPath();
		const cerebralPath = createCerebralPath();
		const continuationPath = createLeftContinuationPath();

		return generateVesselGeometry([
			{ path: mainPath, radius: 0.22 },
			{ path: leftPath, radius: 0.16 },
			{ path: rightPath, radius: 0.14 },
			{ path: cerebralPath, radius: 0.10 },
			{ path: continuationPath, radius: 0.09 }
		]);
	}, []);

	// Inner lumen geometry (slightly smaller)
	const lumenGeometry = useMemo(() => {
		const mainPath = createMainVesselPath();
		const leftPath = createLeftBranchPath();
		const rightPath = createRightBranchPath();
		const cerebralPath = createCerebralPath();
		const continuationPath = createLeftContinuationPath();

		return generateVesselGeometry([
			{ path: mainPath, radius: 0.22 - 0.04 },
			{ path: leftPath, radius: 0.16 - 0.035 },
			{ path: rightPath, radius: 0.14 - 0.035 },
			{ path: cerebralPath, radius: 0.10 - 0.03 },
			{ path: continuationPath, radius: 0.09 - 0.03 }
		]);
	}, []);

	return (
		<group>
			{/* Inner lumen - dark interior visible through transparent walls */}
			<mesh geometry={lumenGeometry}>
				<meshStandardMaterial
					color="#1a0000"
					roughness={0.9}
					metalness={0}
					side={THREE.BackSide}
				/>
			</mesh>
			{/* Outer vessel wall - translucent organic tissue */}
			<mesh geometry={mergedGeometry}>
				<meshPhysicalMaterial
					color="#d42020"
					roughness={0.4}
					metalness={0}
					clearcoat={0.3}
					clearcoatRoughness={0.4}
					transparent
					opacity={0.5}
					transmission={0.3}
					ior={1.4}
					thickness={0.3}
					side={THREE.DoubleSide}
					depthWrite={false}
				/>
			</mesh>
			{/* Subtle outer glow for depth */}
			<mesh geometry={mergedGeometry} scale={1.02}>
				<meshBasicMaterial
					color="#ff3333"
					transparent
					opacity={0.08}
					side={THREE.BackSide}
				/>
			</mesh>
		</group>
	);
}

// ============================================
// CATHETER COMPONENT
// ============================================

interface CatheterProps {
	path: THREE.CatmullRomCurve3;
	progress: number;
	length?: number;
}

function Catheter({ path, progress }: CatheterProps) {
	const tipGlowRef = useRef<THREE.PointLight>(null);

	const { position, tangent, catheterGeometry, guidewireGeometry, tipGeometry } = useMemo(() => {
		const t = Math.max(0.001, Math.min(0.999, progress));
		const pos = path.getPoint(t);
		const tang = path.getTangent(t).normalize();

		const points: THREE.Vector3[] = [];

		// Part 1: From tip (current progress) back to path start
		const numPathSegments = 60;
		for (let i = 0; i < numPathSegments; i++) {
			const segmentT = t * (1 - i / (numPathSegments - 1));
			points.push(path.getPoint(Math.max(0, segmentT)));
		}

		// Part 2: Extend FAR beyond path start (going down/backward)
		const startPoint = path.getPoint(0);
		const startTangent = path.getTangent(0).normalize();
		const extensionLength = 15; // Long extension
		const extensionSegments = 40;

		for (let i = 1; i <= extensionSegments; i++) {
			const extendDist = (i / extensionSegments) * extensionLength;
			const extendedPoint = new THREE.Vector3(
				startPoint.x - startTangent.x * extendDist,
				startPoint.y - startTangent.y * extendDist,
				startPoint.z - startTangent.z * extendDist
			);
			points.push(extendedPoint);
		}

		if (points.length < 2) {
			return { position: pos, tangent: tang, catheterGeometry: null, guidewireGeometry: null, tipGeometry: null };
		}

		const curve = new THREE.CatmullRomCurve3(points);
		const catheterRadius = 0.22;
		const guideRadius = catheterRadius * 0.35;
		const cathGeo = new THREE.TubeGeometry(curve, 100, catheterRadius, 16, false);
		const guideGeo = new THREE.TubeGeometry(curve, 100, guideRadius, 12, false);

		// Create smooth rounded tip using lathe geometry
		// Profile: starts at tube radius, curves smoothly to a rounded end
		const tipLength = 0.35;
		const tipPoints: THREE.Vector2[] = [];
		const tipSegments = 20;

		for (let i = 0; i <= tipSegments; i++) {
			const tParam = i / tipSegments;
			// Smooth curve from tube radius to center point
			// Using cosine curve for smooth transition
			const angle = tParam * Math.PI * 0.5;
			const radius = catheterRadius * Math.cos(angle);
			const z = tipLength * Math.sin(angle);
			tipPoints.push(new THREE.Vector2(radius, z));
		}

		const tipGeo = new THREE.LatheGeometry(tipPoints, 24);

		return { position: pos, tangent: tang, catheterGeometry: cathGeo, guidewireGeometry: guideGeo, tipGeometry: tipGeo };
	}, [path, progress]);

	useFrame((state) => {
		if (tipGlowRef.current) {
			tipGlowRef.current.intensity = 5 + Math.sin(state.clock.elapsedTime * 3) * 2;
		}
	});

	if (!catheterGeometry || !guidewireGeometry || !tipGeometry) return null;

	// Calculate rotation to align tip with catheter direction
	const tipRotation = useMemo(() => {
		const quaternion = new THREE.Quaternion();
		// Default lathe points up (Y axis), we need to point along tangent
		const defaultDir = new THREE.Vector3(0, 1, 0);
		quaternion.setFromUnitVectors(defaultDir, tangent);
		const euler = new THREE.Euler().setFromQuaternion(quaternion);
		return euler;
	}, [tangent]);

	return (
		<group>
			{/* Main catheter body */}
			<mesh geometry={catheterGeometry}>
				<meshPhysicalMaterial
					color="#e8e8e8"
					metalness={0.85}
					roughness={0.15}
					clearcoat={1}
					envMapIntensity={1.2}
				/>
			</mesh>

			{/* Guidewire */}
			<mesh geometry={guidewireGeometry}>
				<meshStandardMaterial
					color="#ffd700"
					emissive="#cc9900"
					emissiveIntensity={0.2}
					metalness={0.8}
					roughness={0.25}
				/>
			</mesh>

			{/* Smooth rounded tip - integrated with tube */}
			<mesh geometry={tipGeometry} position={position} rotation={tipRotation}>
				<meshPhysicalMaterial
					color="#e8e8e8"
					metalness={0.85}
					roughness={0.15}
					clearcoat={1}
					envMapIntensity={1.2}
				/>
			</mesh>

			{/* Tip glow effect - subtle ring at opening */}
			<group position={position}>
				{/* Inner glow ring at tip opening */}
				<mesh rotation={tipRotation}>
					<torusGeometry args={[0.18, 0.03, 8, 24]} />
					<meshBasicMaterial color="#00ffcc" transparent opacity={0.6} />
				</mesh>
				{/* Subtle outer glow */}
				<mesh rotation={tipRotation}>
					<torusGeometry args={[0.22, 0.05, 8, 24]} />
					<meshBasicMaterial color="#00ffcc" transparent opacity={0.2} />
				</mesh>
				{/* Point light for glow effect */}
				<pointLight
					ref={tipGlowRef}
					color="#00ffcc"
					intensity={6}
					distance={2}
					decay={2}
				/>
			</group>
		</group>
	);
}

// ============================================
// BLOOD COMPOSITION - Realistic Cell Types
// ============================================

// Cell type definitions based on real blood composition
const BLOOD_CELL_TYPES = {
	// Globules rouges (érythrocytes) - 99% des cellules
	RED_BLOOD_CELL: {
		color: new THREE.Color("#c41e3a"),
		emissive: new THREE.Color("#8b0000"),
		size: 0.035, // ~7-8 micromètres (référence)
		proportion: 0.94, // 94% of particles
	},
	// Globules blancs (leucocytes) - très rares, plus grands
	WHITE_BLOOD_CELL: {
		color: new THREE.Color("#f5f5dc"),
		emissive: new THREE.Color("#e8e8d0"),
		size: 0.065, // ~10-20 micromètres (2x plus grands)
		proportion: 0.01, // 1% of particles
	},
	// Plaquettes (thrombocytes) - petits fragments
	PLATELET: {
		color: new THREE.Color("#b8a9c9"),
		emissive: new THREE.Color("#9370db"),
		size: 0.015, // ~2-3 micromètres (plus petites)
		proportion: 0.05, // 5% of particles
	},
};

interface BloodParticlesProps {
	paths: THREE.CatmullRomCurve3[];
	count?: number;
	clotWorldPosition?: THREE.Vector3; // 3D position of clot
	clotRadius?: number; // Collision radius
	clotCleared?: boolean;
}

// Red Blood Cells - biconcave disc shape (main component)
function RedBloodCells({ paths, count, clotWorldPosition, clotRadius, clotCleared, particleData, getRadialBounds }: {
	paths: THREE.CatmullRomCurve3[];
	count: number;
	clotWorldPosition?: THREE.Vector3;
	clotRadius: number;
	clotCleared: boolean;
	particleData: Array<{ pathIndex: number; initialOffset: number; speed: number; radialFraction: number; radialAngle: number; wobbleAmount: number; stuckOffset: number }>;
	getRadialBounds: (pathIndex: number, t: number) => { min: number; max: number };
}) {
	const meshRef = useRef<THREE.InstancedMesh>(null);
	const dummy = useMemo(() => new THREE.Object3D(), []);

	// Biconcave disc geometry for red blood cells
	const geometry = useMemo(() => {
		const geo = new THREE.SphereGeometry(1, 16, 12);
		const pos = geo.attributes.position;
		for (let i = 0; i < pos.count; i++) {
			const x = pos.getX(i);
			const y = pos.getY(i);
			const z = pos.getZ(i);
			// Flatten into disc and create biconcave shape
			const r = Math.sqrt(x * x + z * z);
			const concave = 0.3 * (1 - r * r) * Math.sign(y);
			pos.setY(i, y * 0.35 + concave);
		}
		geo.computeVertexNormals();
		return geo;
	}, []);

	// Store stuck positions for cells blocked by clot
	const stuckPositions = useRef<Map<number, { pos: THREE.Vector3; jitter: THREE.Vector3 }>>(new Map());

	useFrame((state) => {
		if (!meshRef.current) return;
		const time = state.clock.elapsedTime;

		for (let i = 0; i < count; i++) {
			const data = particleData[i];
			const path = paths[data.pathIndex];
			if (!path) continue;

			const t = (data.initialOffset + time * data.speed) % 1;
			const clampedT = Math.max(0, Math.min(1, t));
			const pos = path.getPoint(clampedT);
			const tangent = path.getTangent(clampedT);
			const up = new THREE.Vector3(0, 1, 0);
			const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
			const forward = new THREE.Vector3().crossVectors(right, tangent).normalize();

			const bounds = getRadialBounds(data.pathIndex, clampedT);
			const wobble = Math.sin(time * 2 + data.initialOffset * 10) * data.wobbleAmount;
			const effectiveRadius = bounds.min + data.radialFraction * (bounds.max - bounds.min) + wobble;

			const radX = Math.cos(data.radialAngle) * right.x + Math.sin(data.radialAngle) * forward.x;
			const radY = Math.cos(data.radialAngle) * right.y + Math.sin(data.radialAngle) * forward.y;
			const radZ = Math.cos(data.radialAngle) * right.z + Math.sin(data.radialAngle) * forward.z;

			pos.x += radX * effectiveRadius;
			pos.y += radY * effectiveRadius;
			pos.z += radZ * effectiveRadius;

			// Check collision with clot on FINAL position (after radial offset)
			let isStuck = false;
			if (clotWorldPosition && !clotCleared && data.pathIndex === 0) {
				const distToClot = pos.distanceTo(clotWorldPosition);
				const collisionRadius = clotRadius + 0.25; // Increased margin

				if (distToClot < collisionRadius) {
					isStuck = true;
					// Use cached stuck position or find one
					if (!stuckPositions.current.has(i)) {
						// Search backward along path for safe position
						let safePos = pos.clone();
						for (let step = 1; step <= 60; step++) {
							const safeT = Math.max(0, clampedT - step * 0.008);
							const testPos = path.getPoint(safeT);
							// Add same radial offset
							testPos.x += radX * effectiveRadius;
							testPos.y += radY * effectiveRadius;
							testPos.z += radZ * effectiveRadius;
							if (testPos.distanceTo(clotWorldPosition) >= collisionRadius + 0.05) {
								safePos = testPos;
								break;
							}
						}
						// Add stacking offset based on particle index
						const stackOffset = data.stuckOffset * 0.12;
						safePos.x -= tangent.x * stackOffset;
						safePos.y -= tangent.y * stackOffset;
						safePos.z -= tangent.z * stackOffset;

						stuckPositions.current.set(i, {
							pos: safePos,
							jitter: new THREE.Vector3(
								(Math.random() - 0.5) * 0.015,
								(Math.random() - 0.5) * 0.015,
								(Math.random() - 0.5) * 0.015
							)
						});
					}
					const stuck = stuckPositions.current.get(i)!;
					pos.copy(stuck.pos);
					// Add subtle jitter animation
					pos.x += stuck.jitter.x + Math.sin(time * 3 + i) * 0.003;
					pos.y += stuck.jitter.y + Math.cos(time * 4 + i) * 0.003;
					pos.z += stuck.jitter.z + Math.sin(time * 2.5 + i) * 0.003;
				} else {
					stuckPositions.current.delete(i);
				}
			} else if (clotCleared) {
				stuckPositions.current.delete(i);
			}

			dummy.position.copy(pos);
			dummy.scale.setScalar(BLOOD_CELL_TYPES.RED_BLOOD_CELL.size);
			// Rotate disc to face flow direction
			dummy.lookAt(pos.clone().add(tangent));
			dummy.rotateX(Math.PI / 2 + Math.sin(time + data.initialOffset * 5) * 0.3);
			dummy.updateMatrix();
			meshRef.current.setMatrixAt(i, dummy.matrix);
		}

		meshRef.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
			<meshStandardMaterial
				color={BLOOD_CELL_TYPES.RED_BLOOD_CELL.color}
				emissive={BLOOD_CELL_TYPES.RED_BLOOD_CELL.emissive}
				emissiveIntensity={0.3}
				roughness={0.7}
				metalness={0.1}
			/>
		</instancedMesh>
	);
}

// White Blood Cells - larger, spherical, rare
function WhiteBloodCells({ paths, count, clotWorldPosition, clotRadius, clotCleared, particleData, getRadialBounds }: {
	paths: THREE.CatmullRomCurve3[];
	count: number;
	clotWorldPosition?: THREE.Vector3;
	clotRadius: number;
	clotCleared: boolean;
	particleData: Array<{ pathIndex: number; initialOffset: number; speed: number; radialFraction: number; radialAngle: number; wobbleAmount: number; stuckOffset: number }>;
	getRadialBounds: (pathIndex: number, t: number) => { min: number; max: number };
}) {
	const meshRef = useRef<THREE.InstancedMesh>(null);
	const dummy = useMemo(() => new THREE.Object3D(), []);
	const stuckPositions = useRef<Map<number, { pos: THREE.Vector3; jitter: THREE.Vector3 }>>(new Map());

	useFrame((state) => {
		if (!meshRef.current) return;
		const time = state.clock.elapsedTime;

		for (let i = 0; i < count; i++) {
			const data = particleData[i];
			const path = paths[data.pathIndex];
			if (!path) continue;

			// White blood cells move slightly slower
			const t = (data.initialOffset + time * data.speed * 0.8) % 1;
			const clampedT = Math.max(0, Math.min(1, t));
			const pos = path.getPoint(clampedT);
			const tangent = path.getTangent(clampedT);
			const up = new THREE.Vector3(0, 1, 0);
			const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
			const forward = new THREE.Vector3().crossVectors(right, tangent).normalize();

			const bounds = getRadialBounds(data.pathIndex, clampedT);
			const wobble = Math.sin(time * 1.5 + data.initialOffset * 10) * data.wobbleAmount * 1.5;
			const effectiveRadius = bounds.min + data.radialFraction * (bounds.max - bounds.min) + wobble;

			const radX = Math.cos(data.radialAngle) * right.x + Math.sin(data.radialAngle) * forward.x;
			const radY = Math.cos(data.radialAngle) * right.y + Math.sin(data.radialAngle) * forward.y;
			const radZ = Math.cos(data.radialAngle) * right.z + Math.sin(data.radialAngle) * forward.z;

			pos.x += radX * effectiveRadius;
			pos.y += radY * effectiveRadius;
			pos.z += radZ * effectiveRadius;

			// Check collision with clot on FINAL position
			if (clotWorldPosition && !clotCleared && data.pathIndex === 0) {
				const distToClot = pos.distanceTo(clotWorldPosition);
				const collisionRadius = clotRadius + 0.28; // Larger margin for bigger cells

				if (distToClot < collisionRadius) {
					if (!stuckPositions.current.has(i)) {
						let safePos = pos.clone();
						for (let step = 1; step <= 60; step++) {
							const safeT = Math.max(0, clampedT - step * 0.008);
							const testPos = path.getPoint(safeT);
							testPos.x += radX * effectiveRadius;
							testPos.y += radY * effectiveRadius;
							testPos.z += radZ * effectiveRadius;
							if (testPos.distanceTo(clotWorldPosition) >= collisionRadius + 0.05) {
								safePos = testPos;
								break;
							}
						}
						const stackOffset = data.stuckOffset * 0.15;
						safePos.x -= tangent.x * stackOffset;
						safePos.y -= tangent.y * stackOffset;
						safePos.z -= tangent.z * stackOffset;

						stuckPositions.current.set(i, {
							pos: safePos,
							jitter: new THREE.Vector3(
								(Math.random() - 0.5) * 0.02,
								(Math.random() - 0.5) * 0.02,
								(Math.random() - 0.5) * 0.02
							)
						});
					}
					const stuck = stuckPositions.current.get(i)!;
					pos.copy(stuck.pos);
					pos.x += stuck.jitter.x + Math.sin(time * 2 + i) * 0.005;
					pos.y += stuck.jitter.y + Math.cos(time * 3 + i) * 0.005;
					pos.z += stuck.jitter.z;
				} else {
					stuckPositions.current.delete(i);
				}
			} else if (clotCleared) {
				stuckPositions.current.delete(i);
			}

			dummy.position.copy(pos);
			// Slightly irregular size
			const sizeVariation = 1 + Math.sin(data.initialOffset * 20) * 0.2;
			dummy.scale.setScalar(BLOOD_CELL_TYPES.WHITE_BLOOD_CELL.size * sizeVariation);
			dummy.updateMatrix();
			meshRef.current.setMatrixAt(i, dummy.matrix);
		}

		meshRef.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
			<sphereGeometry args={[1, 12, 12]} />
			<meshStandardMaterial
				color={BLOOD_CELL_TYPES.WHITE_BLOOD_CELL.color}
				emissive={BLOOD_CELL_TYPES.WHITE_BLOOD_CELL.emissive}
				emissiveIntensity={0.1}
				roughness={0.8}
				metalness={0}
				transparent
				opacity={0.9}
			/>
		</instancedMesh>
	);
}

// Platelets - tiny, irregular fragments
function Platelets({ paths, count, clotWorldPosition, clotRadius, clotCleared, particleData, getRadialBounds }: {
	paths: THREE.CatmullRomCurve3[];
	count: number;
	clotWorldPosition?: THREE.Vector3;
	clotRadius: number;
	clotCleared: boolean;
	particleData: Array<{ pathIndex: number; initialOffset: number; speed: number; radialFraction: number; radialAngle: number; wobbleAmount: number; stuckOffset: number }>;
	getRadialBounds: (pathIndex: number, t: number) => { min: number; max: number };
}) {
	const meshRef = useRef<THREE.InstancedMesh>(null);
	const dummy = useMemo(() => new THREE.Object3D(), []);
	const stuckPositions = useRef<Map<number, { pos: THREE.Vector3; jitter: THREE.Vector3 }>>(new Map());

	// Irregular fragment geometry
	const geometry = useMemo(() => {
		const geo = new THREE.IcosahedronGeometry(1, 0);
		// Deform slightly for irregular shape
		const pos = geo.attributes.position;
		for (let i = 0; i < pos.count; i++) {
			pos.setX(i, pos.getX(i) * (0.8 + Math.random() * 0.4));
			pos.setY(i, pos.getY(i) * (0.6 + Math.random() * 0.3));
			pos.setZ(i, pos.getZ(i) * (0.8 + Math.random() * 0.4));
		}
		geo.computeVertexNormals();
		return geo;
	}, []);

	useFrame((state) => {
		if (!meshRef.current) return;
		const time = state.clock.elapsedTime;

		for (let i = 0; i < count; i++) {
			const data = particleData[i];
			const path = paths[data.pathIndex];
			if (!path) continue;

			// Platelets move faster, tumbling
			const t = (data.initialOffset + time * data.speed * 1.2) % 1;
			const clampedT = Math.max(0, Math.min(1, t));
			const pos = path.getPoint(clampedT);
			const tangent = path.getTangent(clampedT);
			const up = new THREE.Vector3(0, 1, 0);
			const right = new THREE.Vector3().crossVectors(tangent, up).normalize();
			const forward = new THREE.Vector3().crossVectors(right, tangent).normalize();

			const bounds = getRadialBounds(data.pathIndex, clampedT);
			const wobble = Math.sin(time * 3 + data.initialOffset * 10) * data.wobbleAmount * 2;
			const effectiveRadius = bounds.min + data.radialFraction * (bounds.max - bounds.min) + wobble;

			const radX = Math.cos(data.radialAngle) * right.x + Math.sin(data.radialAngle) * forward.x;
			const radY = Math.cos(data.radialAngle) * right.y + Math.sin(data.radialAngle) * forward.y;
			const radZ = Math.cos(data.radialAngle) * right.z + Math.sin(data.radialAngle) * forward.z;

			pos.x += radX * effectiveRadius;
			pos.y += radY * effectiveRadius;
			pos.z += radZ * effectiveRadius;

			// Check collision with clot on FINAL position
			if (clotWorldPosition && !clotCleared && data.pathIndex === 0) {
				const distToClot = pos.distanceTo(clotWorldPosition);
				const collisionRadius = clotRadius + 0.22; // Smaller margin for tiny particles

				if (distToClot < collisionRadius) {
					if (!stuckPositions.current.has(i)) {
						let safePos = pos.clone();
						for (let step = 1; step <= 60; step++) {
							const safeT = Math.max(0, clampedT - step * 0.008);
							const testPos = path.getPoint(safeT);
							testPos.x += radX * effectiveRadius;
							testPos.y += radY * effectiveRadius;
							testPos.z += radZ * effectiveRadius;
							if (testPos.distanceTo(clotWorldPosition) >= collisionRadius + 0.03) {
								safePos = testPos;
								break;
							}
						}
						const stackOffset = data.stuckOffset * 0.08;
						safePos.x -= tangent.x * stackOffset;
						safePos.y -= tangent.y * stackOffset;
						safePos.z -= tangent.z * stackOffset;

						stuckPositions.current.set(i, {
							pos: safePos,
							jitter: new THREE.Vector3(
								(Math.random() - 0.5) * 0.01,
								(Math.random() - 0.5) * 0.01,
								(Math.random() - 0.5) * 0.01
							)
						});
					}
					const stuck = stuckPositions.current.get(i)!;
					pos.copy(stuck.pos);
					pos.x += stuck.jitter.x + Math.sin(time * 5 + i) * 0.002;
					pos.y += stuck.jitter.y + Math.cos(time * 6 + i) * 0.002;
					pos.z += stuck.jitter.z;
				} else {
					stuckPositions.current.delete(i);
				}
			} else if (clotCleared) {
				stuckPositions.current.delete(i);
			}

			dummy.position.copy(pos);
			dummy.scale.setScalar(BLOOD_CELL_TYPES.PLATELET.size);
			// Tumbling rotation
			dummy.rotation.set(
				time * 2 + data.initialOffset * 10,
				time * 3 + data.initialOffset * 15,
				time * 1.5 + data.initialOffset * 8
			);
			dummy.updateMatrix();
			meshRef.current.setMatrixAt(i, dummy.matrix);
		}

		meshRef.current.instanceMatrix.needsUpdate = true;
	});

	return (
		<instancedMesh ref={meshRef} args={[geometry, undefined, count]}>
			<meshStandardMaterial
				color={BLOOD_CELL_TYPES.PLATELET.color}
				emissive={BLOOD_CELL_TYPES.PLATELET.emissive}
				emissiveIntensity={0.2}
				roughness={0.5}
				metalness={0.2}
			/>
		</instancedMesh>
	);
}

// Main Blood Particles Component - combines all cell types
function BloodParticles({ paths, count = 600, clotWorldPosition, clotRadius = 0.25, clotCleared = false }: BloodParticlesProps) {
	const SCALE_FACTOR = 2.35;
	const CATHETER_VISUAL_RADIUS = 0.02; // Reduced to allow particles closer to center

	const getRadialBounds = useCallback((pathIndex: number, t: number): { min: number; max: number } => {
		let inputRadius: number;
		if (t < 0.5) {
			inputRadius = 0.22;
		} else {
			inputRadius = pathIndex === 0 ? 0.16 : 0.14;
		}
		const visualRadius = inputRadius * SCALE_FACTOR * 0.95; // Increased spread
		return {
			min: CATHETER_VISUAL_RADIUS,
			max: visualRadius * 0.98, // Closer to vessel walls
		};
	}, []);

	// Calculate counts based on proportions
	const redCount = Math.floor(count * BLOOD_CELL_TYPES.RED_BLOOD_CELL.proportion);
	const whiteCount = Math.max(3, Math.floor(count * BLOOD_CELL_TYPES.WHITE_BLOOD_CELL.proportion));
	const plateletCount = Math.floor(count * BLOOD_CELL_TYPES.PLATELET.proportion);

	// Generate particle data for each type - more diffuse distribution
	const generateParticleData = useCallback((particleCount: number, seedOffset: number) => {
		return Array.from({ length: particleCount }, (_, i) => {
			const seed = (i + seedOffset) * 0.618033988749;
			const seed2 = ((i + seedOffset) * 1.41421356) % 1;
			const seed3 = ((i + seedOffset) * 2.71828) % 1;
			const seed4 = ((i + seedOffset) * 3.14159265) % 1;
			const seed5 = ((i + seedOffset) * 1.732) % 1;

			// Use sqrt for more uniform radial distribution (not clustered at center)
			const radialRaw = ((seed * 5.678) % 1);
			const radialFraction = Math.sqrt(radialRaw); // Uniform disk distribution

			return {
				pathIndex: i % 2,
				initialOffset: (seed * 2.718 + seed2 * 0.5) % 1,
				speed: 0.06 + seed2 * 0.04, // Faster flow
				radialFraction,
				radialAngle: seed4 * Math.PI * 2,
				wobbleAmount: 0.008 + seed3 * 0.015,
				stuckOffset: seed5, // Random offset for stacking near clot
			};
		});
	}, []);

	const redData = useMemo(() => generateParticleData(redCount, 0), [redCount, generateParticleData]);
	const whiteData = useMemo(() => generateParticleData(whiteCount, 1000), [whiteCount, generateParticleData]);
	const plateletData = useMemo(() => generateParticleData(plateletCount, 2000), [plateletCount, generateParticleData]);

	return (
		<group>
			{/* Red Blood Cells - dominant, biconcave discs */}
			<RedBloodCells
				paths={paths}
				count={redCount}
				clotWorldPosition={clotWorldPosition}
				clotRadius={clotRadius}
				clotCleared={clotCleared}
				particleData={redData}
				getRadialBounds={getRadialBounds}
			/>
			{/* White Blood Cells - rare, large spheres */}
			<WhiteBloodCells
				paths={paths}
				count={whiteCount}
				clotWorldPosition={clotWorldPosition}
				clotRadius={clotRadius}
				clotCleared={clotCleared}
				particleData={whiteData}
				getRadialBounds={getRadialBounds}
			/>
			{/* Platelets - small fragments */}
			<Platelets
				paths={paths}
				count={plateletCount}
				clotWorldPosition={clotWorldPosition}
				clotRadius={clotRadius}
				clotCleared={clotCleared}
				particleData={plateletData}
				getRadialBounds={getRadialBounds}
			/>
		</group>
	);
}

// ============================================
// DISSOLVE SHADER MATERIAL FOR CLOT
// ============================================

// Simplex 3D Noise (from ashima/webgl-noise)
const noiseGLSL = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);

  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);

  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;

  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));

  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);

  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);

  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

const dissolveVertexShader = `
varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const dissolveFragmentShader = `
${noiseGLSL}

uniform float uProgress;
uniform float uEdgeWidth;
uniform vec3 uEdgeColor;
uniform vec3 uBaseColor;
uniform float uTime;
uniform vec3 uDissolveDirection;

varying vec3 vPosition;
varying vec3 vNormal;
varying vec2 vUv;

void main() {
  // Multi-octave noise for organic dissolve pattern
  float noise = snoise(vPosition * 8.0 + uTime * 0.5) * 0.5 + 0.5;
  noise += snoise(vPosition * 16.0 - uTime * 0.3) * 0.25;
  noise += snoise(vPosition * 32.0) * 0.125;
  noise = noise / 1.875; // Normalize

  // Directional dissolve - dissolve from catheter direction
  float directionalBias = dot(normalize(vPosition), uDissolveDirection) * 0.3 + 0.5;
  noise = mix(noise, directionalBias, 0.4);

  // Dissolve threshold
  float dissolveThreshold = uProgress;

  // Discard dissolved fragments
  if (noise < dissolveThreshold) {
    discard;
  }

  // Edge glow effect
  float edge = smoothstep(dissolveThreshold, dissolveThreshold + uEdgeWidth, noise);
  float edgeGlow = 1.0 - edge;

  // Base color with subsurface scattering approximation
  vec3 baseColor = uBaseColor;
  float fresnel = pow(1.0 - max(dot(vNormal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
  baseColor += vec3(0.2, 0.12, 0.06) * fresnel; // Brown/amber tint

  // Mix base color with edge glow
  vec3 finalColor = mix(baseColor, uEdgeColor, edgeGlow * edgeGlow);

  // Add emissive glow at edges
  float emissive = edgeGlow * edgeGlow * 2.0;

  gl_FragColor = vec4(finalColor + uEdgeColor * emissive, 1.0);
}
`;

// Custom dissolve material component
function DissolveClotMaterial({ progress, isAspirating }: { progress: number; isAspirating: boolean }) {
	const materialRef = useRef<THREE.ShaderMaterial>(null);

	const uniforms = useMemo(() => ({
		uProgress: { value: 0 },
		uEdgeWidth: { value: 0.12 },
		uEdgeColor: { value: new THREE.Color("#cc8844") }, // Orange/amber edge glow
		uBaseColor: { value: new THREE.Color("#2a1515") }, // Dark brown/maroon base
		uTime: { value: 0 },
		uDissolveDirection: { value: new THREE.Vector3(1, 0, 0) },
	}), []);

	useFrame((state) => {
		if (materialRef.current) {
			materialRef.current.uniforms.uProgress.value = isAspirating ? progress : 0;
			materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
		}
	});

	return (
		<shaderMaterial
			ref={materialRef}
			vertexShader={dissolveVertexShader}
			fragmentShader={dissolveFragmentShader}
			uniforms={uniforms}
			side={THREE.DoubleSide}
			transparent
		/>
	);
}

// ============================================
// CLOT COMPONENT - Using MarchingCubes for organic shape
// ============================================

// Vessel paths configuration - shared between components
const VESSEL_PATHS = () => [
	{ path: createMainVesselPath(), radius: 0.22 },
	{ path: createLeftBranchPath(), radius: 0.16 },
	{ path: createRightBranchPath(), radius: 0.14 },
	{ path: createCerebralPath(), radius: 0.10 },
	{ path: createLeftContinuationPath(), radius: 0.09 }
];

interface ClotProps {
	path: THREE.CatmullRomCurve3;
	tPosition: number;
	vesselRadius: number;
	progress: number;
	catheterTipPosition: THREE.Vector3;
}

// Aspirated particles - small fragments being sucked into catheter during dissolution
function AspiratedParticles({
	clotPosition,
	catheterTipPosition,
	aspirationProgress,
	isAspirating
}: {
	clotPosition: THREE.Vector3;
	catheterTipPosition: THREE.Vector3;
	aspirationProgress: number;
	isAspirating: boolean;
}) {
	const particlesRef = useRef<THREE.InstancedMesh>(null);
	const particleCount = 80;
	const dummy = useMemo(() => new THREE.Object3D(), []);

	// Organic irregular fragment geometry
	const geometry = useMemo(() => {
		const geo = new THREE.IcosahedronGeometry(1, 0);
		const pos = geo.attributes.position;
		for (let i = 0; i < pos.count; i++) {
			pos.setX(i, pos.getX(i) * (0.7 + Math.random() * 0.6));
			pos.setY(i, pos.getY(i) * (0.5 + Math.random() * 0.5));
			pos.setZ(i, pos.getZ(i) * (0.7 + Math.random() * 0.6));
		}
		geo.computeVertexNormals();
		return geo;
	}, []);

	// Generate particle data - distributed over time
	const particleData = useMemo(() => {
		return Array.from({ length: particleCount }, (_, i) => {
			const seed = i * 0.618033988749;
			const seed2 = ((i + 100) * 0.414) % 1;
			const seed3 = ((i + 200) * 0.577) % 1;
			const seed4 = ((i + 300) * 0.732) % 1;

			// Spawn time distributed across dissolution - continuous stream
			const spawnTime = (i / particleCount) * 0.85;

			return {
				// Start on clot surface - spherical distribution
				theta: seed * Math.PI * 2,
				phi: seed2 * Math.PI,
				surfaceRadius: 0.08 + seed3 * 0.08,
				// Varied sizes - mix of small debris and larger chunks
				size: seed4 < 0.2 ? (0.03 + seed3 * 0.04) : (0.012 + seed2 * 0.018),
				// When this particle appears
				spawnTime,
				// Particle lifetime (how long to animate)
				lifetime: 0.15 + seed3 * 0.12,
				// Spiral properties
				spiralSpeed: 3 + seed2 * 4,
				spiralRadius: 0.05 + seed3 * 0.08,
				// Rotation
				rotationSpeed: 4 + seed * 5,
				rotationOffset: seed * Math.PI * 2,
			};
		});
	}, []);

	useFrame((state) => {
		if (!particlesRef.current || !isAspirating) return;
		const time = state.clock.elapsedTime;

		for (let i = 0; i < particleCount; i++) {
			const data = particleData[i];

			// Calculate this particle's local progress
			// Particle appears at spawnTime and takes lifetime to reach catheter
			const localProgress = (aspirationProgress - data.spawnTime) / data.lifetime;

			if (localProgress <= 0 || localProgress >= 1) {
				dummy.scale.setScalar(0);
			} else {
				// Start position on clot surface
				const startPos = new THREE.Vector3(
					clotPosition.x + Math.sin(data.phi) * Math.cos(data.theta) * data.surfaceRadius,
					clotPosition.y + Math.sin(data.phi) * Math.sin(data.theta) * data.surfaceRadius,
					clotPosition.z + Math.cos(data.phi) * data.surfaceRadius
				);

				// Accelerating movement toward catheter (faster at the end)
				const eased = Math.pow(localProgress, 0.4);
				const currentPos = startPos.clone().lerp(catheterTipPosition, eased);

				// Spiral motion - tightens as particle approaches catheter
				const spiralPhase = time * data.spiralSpeed + data.rotationOffset + localProgress * Math.PI * 3;
				const currentSpiralRadius = data.spiralRadius * (1 - eased) * (1 - eased);
				currentPos.x += Math.cos(spiralPhase) * currentSpiralRadius;
				currentPos.z += Math.sin(spiralPhase) * currentSpiralRadius;

				dummy.position.copy(currentPos);

				// Scale: fade in quickly, visible during travel, fade out at catheter
				let scale = data.size;
				if (localProgress < 0.1) {
					scale *= localProgress / 0.1; // Quick fade in
				} else if (localProgress > 0.85) {
					scale *= (1 - localProgress) / 0.15; // Fade out at catheter
				}
				dummy.scale.setScalar(scale);

				// Tumbling rotation
				dummy.rotation.set(
					time * data.rotationSpeed + data.rotationOffset,
					time * data.rotationSpeed * 1.2,
					time * data.rotationSpeed * 0.8
				);
			}

			dummy.updateMatrix();
			particlesRef.current.setMatrixAt(i, dummy.matrix);
		}

		particlesRef.current.instanceMatrix.needsUpdate = true;
	});

	if (!isAspirating) return null;

	return (
		<instancedMesh ref={particlesRef} args={[geometry, undefined, particleCount]}>
			<meshStandardMaterial
				color="#4a2a1a"
				emissive="#aa6633"
				emissiveIntensity={0.4}
				roughness={0.7}
				metalness={0}
			/>
		</instancedMesh>
	);
}

// Suction vortex effect
function SuctionVortex({
	catheterTipPosition,
	isAspirating,
	intensity
}: {
	catheterTipPosition: THREE.Vector3;
	isAspirating: boolean;
	intensity: number;
}) {
	const vortexRef = useRef<THREE.Points>(null);
	const particleCount = 60;

	const { positions, velocities } = useMemo(() => {
		const pos = new Float32Array(particleCount * 3);
		const vel = new Float32Array(particleCount * 3);
		for (let i = 0; i < particleCount; i++) {
			const angle = (i / particleCount) * Math.PI * 2;
			const radius = 0.1 + Math.random() * 0.15;
			pos[i * 3] = Math.cos(angle) * radius;
			pos[i * 3 + 1] = (Math.random() - 0.5) * 0.2;
			pos[i * 3 + 2] = Math.sin(angle) * radius;
			vel[i * 3] = (Math.random() - 0.5) * 0.02;
			vel[i * 3 + 1] = 0.01 + Math.random() * 0.02;
			vel[i * 3 + 2] = (Math.random() - 0.5) * 0.02;
		}
		return { positions: pos, velocities: vel };
	}, []);

	// Create buffer geometry with position attribute - must be before any conditional return
	const geometry = useMemo(() => {
		const geo = new THREE.BufferGeometry();
		geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
		return geo;
	}, [positions]);

	useFrame((state) => {
		if (!vortexRef.current || !isAspirating) return;
		const posAttr = vortexRef.current.geometry.attributes.position;
		const time = state.clock.elapsedTime;

		for (let i = 0; i < particleCount; i++) {
			let x = positions[i * 3];
			let y = positions[i * 3 + 1];
			let z = positions[i * 3 + 2];

			// Spiral inward toward center
			const angle = Math.atan2(z, x);
			const radius = Math.sqrt(x * x + z * z);
			const newAngle = angle + 0.1 * intensity;
			const newRadius = Math.max(0.02, radius - 0.005 * intensity);

			x = Math.cos(newAngle) * newRadius;
			z = Math.sin(newAngle) * newRadius;
			y += velocities[i * 3 + 1] * intensity;

			// Reset particles that get too close or too far
			if (newRadius < 0.03 || y > 0.15) {
				const resetAngle = Math.random() * Math.PI * 2;
				const resetRadius = 0.12 + Math.random() * 0.08;
				x = Math.cos(resetAngle) * resetRadius;
				z = Math.sin(resetAngle) * resetRadius;
				y = -0.1;
			}

			positions[i * 3] = x;
			positions[i * 3 + 1] = y;
			positions[i * 3 + 2] = z;

			posAttr.setXYZ(i,
				catheterTipPosition.x + x,
				catheterTipPosition.y + y * 0.5,
				catheterTipPosition.z + z
			);
		}

		posAttr.needsUpdate = true;
	});

	if (!isAspirating) return null;

	return (
		<points ref={vortexRef} geometry={geometry}>
			<pointsMaterial
				color="#00ffcc"
				size={0.015}
				transparent
				opacity={0.6 * intensity}
				sizeAttenuation
			/>
		</points>
	);
}

function Clot({ path, tPosition, vesselRadius, progress, catheterTipPosition }: ClotProps) {
	const mainRef = useRef<THREE.Group>(null);
	const clotMeshRef = useRef<THREE.Mesh>(null);

	// Get clot position and tangent from path
	const { position, tangent } = useMemo(() => {
		return {
			position: path.getPoint(tPosition),
			tangent: path.getTangent(tPosition)
		};
	}, [path, tPosition]);

	// Generate clot geometry
	const clotGeometry = useMemo(() => {
		const vesselPaths = VESSEL_PATHS();
		return generateClotGeometryForVessel(
			vesselPaths,
			path,
			tPosition,
			vesselRadius,
			0.5
		);
	}, [path, tPosition, vesselRadius]);

	// Aspiration phases - starts at contact (50%)
	const contactPhase = progress >= 0.48 && progress < 0.50; // Brief contact moment
	const aspiratingPhase = progress >= 0.50 && progress < 0.75; // Aspiration starts immediately at contact
	const isComplete = progress >= 0.75;

	// Dissolve progress for shader (0 to 1 during aspiration phase)
	const dissolveProgress = aspiratingPhase
		? Math.pow((progress - 0.50) / 0.25, 0.6) // Faster start for dramatic effect
		: isComplete ? 1 : 0;

	useFrame((state) => {
		if (!mainRef.current) return;
		const time = state.clock.elapsedTime;

		if (aspiratingPhase) {
			// Subtle vibration during dissolution
			const vibration = 0.008 * (1 - dissolveProgress);
			mainRef.current.position.x = Math.sin(time * 25) * vibration;
			mainRef.current.position.z = Math.cos(time * 22) * vibration;
			mainRef.current.position.y = Math.sin(time * 20) * vibration * 0.5;
		} else if (isComplete) {
			mainRef.current.scale.setScalar(0);
		} else if (contactPhase) {
			// Pulse when contact is made
			const pulse = 1 + Math.sin(time * 12) * 0.02;
			mainRef.current.scale.setScalar(pulse);
			mainRef.current.position.set(0, 0, 0);
		} else {
			mainRef.current.scale.setScalar(1);
			mainRef.current.position.set(0, 0, 0);
		}
	});

	return (
		<group>
			{/* Main clot body with dissolve shader */}
			<group ref={mainRef}>
				<mesh ref={clotMeshRef} geometry={clotGeometry}>
					<DissolveClotMaterial
						progress={dissolveProgress}
						isAspirating={aspiratingPhase || isComplete}
					/>
				</mesh>
			</group>

			{/* Aspirated particles being sucked into catheter */}
			<AspiratedParticles
				clotPosition={position}
				catheterTipPosition={catheterTipPosition}
				aspirationProgress={dissolveProgress}
				isAspirating={aspiratingPhase}
			/>

			{/* Suction vortex effect */}
			<SuctionVortex
				catheterTipPosition={catheterTipPosition}
				isAspirating={contactPhase || aspiratingPhase}
				intensity={aspiratingPhase ? 1.2 : 0.3}
			/>

			{/* Suction effect light */}
			{(contactPhase || aspiratingPhase) && (
				<pointLight
					position={catheterTipPosition}
					color="#00ffcc"
					intensity={aspiratingPhase ? 12 : 4}
					distance={1.5}
				/>
			)}

			{/* Edge glow effect during aspiration */}
			{aspiratingPhase && (
				<pointLight
					position={position}
					color="#cc8844"
					intensity={6 * (1 - dissolveProgress)}
					distance={0.8}
				/>
			)}

			{/* Success effect */}
			{isComplete && (
				<>
					<pointLight position={position} color="#00ffcc" intensity={10} distance={2} />
					<mesh position={position}>
						<sphereGeometry args={[0.15, 16, 16]} />
						<meshBasicMaterial color="#00ffcc" transparent opacity={0.5} />
					</mesh>
				</>
			)}
		</group>
	);
}

// ============================================
// CAMERA CONTROLLER
// ============================================

function CameraController({ progress, catheterPath }: { progress: number; catheterPath: THREE.CatmullRomCurve3 }) {
	const { camera } = useThree();

	useFrame(() => {
		const t = Math.max(0.001, Math.min(0.999, progress));
		const catheterPos = catheterPath.getPoint(t);
		const tangent = catheterPath.getTangent(t);

		// Start with wide establishing shot, zoom in progressively
		// At progress=0: far away, seeing whole artery
		// At progress=1: close to catheter tip
		const zoomProgress = Math.pow(progress, 0.7); // Ease the zoom

		// Distance interpolation: start at 12, end at 2.5
		const distance = 12 - zoomProgress * 9.5;

		// At the beginning, look at center of vessel network
		// At the end, follow the catheter closely
		const vesselCenter = new THREE.Vector3(-0.5, 0, 0.3);

		// Interpolate look target from vessel center to catheter
		const lookTarget = vesselCenter.clone().lerp(catheterPos, zoomProgress);

		// Camera position: start high and wide, end close to catheter
		const startPos = new THREE.Vector3(4, 4, 10);
		const endOffset = new THREE.Vector3(
			-tangent.x * 1.2 + 1,
			-tangent.y * 1.2 + 1.5,
			-tangent.z * 1.2 + 2.5
		);
		const endPos = catheterPos.clone().add(endOffset);

		// Interpolate camera position
		const targetPos = startPos.clone().lerp(endPos, zoomProgress);

		camera.position.lerp(targetPos, 0.03);
		camera.lookAt(lookTarget);
	});

	return null;
}

// ============================================
// LOADER
// ============================================

function Loader() {
	const { progress } = useProgress();
	return (
		<Html center>
			<div className="flex flex-col items-center gap-3">
				<div className="h-1 w-32 rounded-full bg-border overflow-hidden">
					<div className="h-full bg-primary" style={{ width: `${progress}%` }} />
				</div>
				<span className="text-xs text-text-muted">Loading... {progress.toFixed(0)}%</span>
			</div>
		</Html>
	);
}

// ============================================
// MAIN SCENE
// ============================================

function Scene({ progress }: { progress: number }) {
	const catheterPath = useMemo(() => createCatheterPath(), []);

	// Continuous blood flow paths (main → branches)
	const bloodFlowLeftPath = useMemo(() => createBloodFlowLeftPath(), []);
	const bloodFlowRightPath = useMemo(() => createBloodFlowRightPath(), []);
	const bloodFlowPaths = useMemo(() => [bloodFlowLeftPath, bloodFlowRightPath], [bloodFlowLeftPath, bloodFlowRightPath]);

	// Clot parameters - position along LEFT BRANCH (not bloodFlowLeftPath)
	// Use leftBranchPath directly for more predictable positioning
	const leftBranchPath = useMemo(() => createLeftBranchPath(), []);
	const clotTPosition = 0.6; // Position in left branch (0=bifurcation, 1=end)
	const clotVesselRadius = 0.16; // Left branch radius from vessel definitions

	// Get clot's 3D world position for collision detection
	const clotWorldPosition = useMemo(() => {
		return leftBranchPath.getPoint(clotTPosition);
	}, [leftBranchPath, clotTPosition]);

	// Is clot cleared? (catheter reached it)
	const clotCleared = progress >= 0.75;

	// Catheter tip position for aspiration effect
	const catheterTipPosition = useMemo(() => {
		const t = Math.max(0.001, Math.min(0.999, progress));
		return catheterPath.getPoint(t);
	}, [catheterPath, progress]);

	return (
		<>
			{/* Lighting */}
			<ambientLight intensity={0.45} />
			<directionalLight position={[4, 5, 4]} intensity={1.3} castShadow />
			<directionalLight position={[-3, 3, -3]} intensity={0.6} color="#ffaaaa" />
			<directionalLight position={[0, -4, 2]} intensity={0.35} color="#ff8888" />

			<Environment preset="studio" />

			{/* Unified Blood Vessel Network */}
			<UnifiedVesselNetwork />

			{/* Blood Particles - flow stops at clot until cleared */}
			<BloodParticles
				paths={bloodFlowPaths}
				count={400}
				clotWorldPosition={clotWorldPosition}
				clotRadius={clotVesselRadius * 1.2}
				clotCleared={clotCleared}
			/>

			{/* Catheter */}
			<Catheter path={catheterPath} progress={progress} />

			{/* Clot - blocks the artery, sized to match vessel */}
			<Clot
				path={leftBranchPath}
				tPosition={clotTPosition}
				vesselRadius={clotVesselRadius}
				progress={progress}
				catheterTipPosition={catheterTipPosition}
			/>

			{/* Camera */}
			<CameraController progress={progress} catheterPath={catheterPath} />
		</>
	);
}

// ============================================
// MAIN EXPORT
// ============================================

export function VascularScene3D() {
	const t = useTranslations("Home.journey");
	const containerRef = useRef<HTMLDivElement>(null);
	const [progress, setProgress] = useState(0);
	const [isVisible, setIsVisible] = useState(false);
	const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

	useEffect(() => {
		const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
		setPrefersReducedMotion(mq.matches);
		const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
		mq.addEventListener("change", handler);
		return () => mq.removeEventListener("change", handler);
	}, []);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;
		const observer = new IntersectionObserver(
			([entry]) => setIsVisible(entry.isIntersecting),
			{ threshold: 0.1 }
		);
		observer.observe(container);
		return () => observer.disconnect();
	}, []);

	const handleScroll = useCallback(() => {
		if (!containerRef.current || !isVisible || prefersReducedMotion) return;
		const rect = containerRef.current.getBoundingClientRect();
		const vh = window.innerHeight;
		const scrolled = vh - rect.top;
		const total = rect.height + vh * 0.5;
		const p = Math.max(0, Math.min(1, scrolled / total));
		requestAnimationFrame(() => setProgress(p));
	}, [isVisible, prefersReducedMotion]);

	useEffect(() => {
		if (!isVisible) return;
		let ticking = false;
		const handler = () => {
			if (!ticking) {
				requestAnimationFrame(() => { handleScroll(); ticking = false; });
				ticking = true;
			}
		};
		window.addEventListener("scroll", handler, { passive: true });
		handleScroll();
		return () => window.removeEventListener("scroll", handler);
	}, [isVisible, handleScroll]);

	const panels = [
		{ key: "problem", color: "accent" },
		{ key: "solution", color: "primary" },
		{ key: "technology", color: "secondary" },
		{ key: "impact", color: "primary" },
	] as const;

	const activePanel = Math.min(Math.floor(progress * panels.length), panels.length - 1);

	if (prefersReducedMotion) {
		return (
			<section className="py-20 text-center">
				<p className="text-text-muted">Animation désactivée</p>
			</section>
		);
	}

	return (
		<section ref={containerRef} className="relative min-h-[400vh]">
			<div className="sticky top-0 h-screen overflow-hidden">
				<div className="absolute inset-0 flex">
					{/* 3D Canvas */}
					<div className="relative w-1/2 h-full">
						<Canvas shadows dpr={[1, 2]} gl={{ antialias: true, alpha: true }} style={{ background: "transparent" }}>
							<PerspectiveCamera makeDefault position={[4, 4, 10]} fov={50} near={0.1} far={100} />
							<Suspense fallback={<Loader />}>
								<Scene progress={progress} />
							</Suspense>
						</Canvas>
						<div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-transparent via-transparent to-bg" />
					</div>

					{/* Content */}
					<div className="w-1/2 h-full flex items-center">
						<div className="w-full max-w-lg px-8 lg:px-12">
							{panels.map((panel, idx) => {
								const isActive = idx === activePanel;
								const isPast = idx < activePanel;
								return (
									<div
										key={panel.key}
										className={cn(
											"relative mb-6 p-6 rounded-2xl border transition-all duration-500",
											isActive ? "bg-bg-card border-border-hover scale-100 opacity-100"
												: isPast ? "bg-bg-elevated/50 border-border scale-95 opacity-40"
												: "bg-transparent border-transparent scale-95 opacity-20"
										)}
									>
										<h3 className="font-display text-xl font-bold text-text">{t(`panels.${panel.key}.title`)}</h3>
										<p className="mt-2 text-sm text-text-muted leading-relaxed">{t(`panels.${panel.key}.description`)}</p>
										{isActive && (
											<div className="inline-flex items-center gap-2 mt-4 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/30 text-xs font-medium text-primary">
												<span className="live-dot" />
												<span>{t(`panels.${panel.key}.status`)}</span>
											</div>
										)}
									</div>
								);
							})}
						</div>
					</div>
				</div>

				{/* Progress */}
				<div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4">
					<div className="w-32 h-1 rounded-full bg-border overflow-hidden">
						<div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progress * 100}%` }} />
					</div>
					<span className="text-xs text-text-muted font-mono">{Math.round(progress * 100)}%</span>
				</div>

				{progress < 0.05 && (
					<div className="absolute bottom-20 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
						<span className="text-xs text-text-subtle">{t("scrollHint")}</span>
						<svg className="h-5 w-5 text-text-subtle" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
						</svg>
					</div>
				)}
			</div>
		</section>
	);
}
