
import * as THREE from "three";
import { MarchingCubes } from "three/examples/jsm/objects/MarchingCubes.js";
import { INTERSECTION, Brush, Evaluator } from "three-bvh-csg";

// ==========================================
// EXPORTED GENERATOR
// ==========================================

// Clot configuration for generating clot INSIDE the vessel MarchingCubes
export interface ClotConfig {
    path: THREE.Curve<THREE.Vector3>;
    tPosition: number;      // Position along path (0-1)
    vesselRadius: number;   // Should match the vessel radius at this position
    length?: number;        // Length of clot along vessel axis
}

// Generate ORGANIC clot geometry using MarchingCubes
// Uses the SAME technique as vessel generation for consistent look
// The clot follows the vessel path and has irregular, organic edges
export function generateClotGeometryForVessel(
    vesselPaths: { path: THREE.Curve<THREE.Vector3>, radius: number }[],
    clotPath: THREE.Curve<THREE.Vector3>,
    clotTPosition: number,
    clotRadius: number,
    clotLength: number = 0.3
): THREE.BufferGeometry {
    // Use same bounds as vessel for consistent coordinates
    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);

    vesselPaths.forEach(p => {
        const points = p.path.getPoints(20);
        points.forEach(pt => {
            min.min(pt);
            max.max(pt);
        });
    });

    min.subScalar(1.5);
    max.addScalar(1.5);
    const size = new THREE.Vector3().subVectors(max, min);

    // Setup MarchingCubes with SAME parameters as vessel
    const resolution = 64;
    const effect = new MarchingCubes(resolution, new THREE.MeshBasicMaterial(), true, true, 100000);

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

    // CRITICAL: MarchingCubes output radius differs from input radius
    // Clot must fit INSIDE the vessel, not overflow
    // Use smaller scale factor to ensure clot stays within artery walls
    const visualScaleFactor = 1.8;
    const visualRadius = clotRadius * visualScaleFactor * 0.7; // 70% to stay inside vessel walls

    // Use seeded random for consistent clot shape
    const seededRandom = (seed: number) => {
        const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
        return x - Math.floor(x);
    };

    // Sample points along the clot region (following the path curve)
    const numSlices = 8; // Slices along the length
    const tRange = clotLength / clotPath.getLength(); // Convert length to t range

    for (let i = 0; i < numSlices; i++) {
        const t = clotTPosition - tRange/2 + (i / (numSlices - 1)) * tRange;
        const sampleT = Math.max(0.01, Math.min(0.99, t));

        const point = clotPath.getPoint(sampleT);
        const tangent = clotPath.getTangent(sampleT).normalize();

        // Create local coordinate system (Frenet frame)
        let up = new THREE.Vector3(0, 1, 0);
        if (Math.abs(tangent.dot(up)) > 0.9) up.set(1, 0, 0);
        const right = new THREE.Vector3().crossVectors(up, tangent).normalize();
        const forward = new THREE.Vector3().crossVectors(tangent, right).normalize();

        const gridPos = worldToGrid(point);
        const maxSize = Math.max(size.x, size.y, size.z);

        // Create DENSE fill with overlapping metaballs to fill the cross-section
        // Large center ball
        const centerInfluence = (visualRadius * 0.5 / maxSize) * 12;
        effect.addBall(gridPos.x, gridPos.y, gridPos.z, centerInfluence * 1.3, 12);

        // Concentric rings filling the cross-section
        const numRings = 3;
        for (let ring = 1; ring <= numRings; ring++) {
            const ringRadius = (ring / numRings) * visualRadius;
            const numBalls = 6 + ring * 3; // More balls in outer rings
            const ballSize = visualRadius * (0.35 - ring * 0.05); // Smaller balls in outer rings

            for (let j = 0; j < numBalls; j++) {
                // Use seeded random for irregular but consistent placement
                const seed = i * 1000 + ring * 100 + j;
                const angleVariation = (seededRandom(seed) - 0.5) * 0.4;
                const radiusVariation = 1 + (seededRandom(seed + 1) - 0.5) * 0.3;

                const angle = (j / numBalls) * Math.PI * 2 + angleVariation + i * 0.3;
                const dist = ringRadius * radiusVariation;

                const offset = right.clone().multiplyScalar(Math.cos(angle) * dist)
                    .add(forward.clone().multiplyScalar(Math.sin(angle) * dist));

                const ballPos = point.clone().add(offset);
                const ballGrid = worldToGrid(ballPos);
                const ballInfluence = (ballSize / maxSize) * 12;

                effect.addBall(ballGrid.x, ballGrid.y, ballGrid.z, ballInfluence, 12);
            }
        }

        // Irregular surface bumps - smaller to stay inside vessel
        const numEdgeBumps = 6 + Math.floor(seededRandom(i * 500) * 3);
        for (let j = 0; j < numEdgeBumps; j++) {
            const seed = i * 2000 + j;
            const angle = (j / numEdgeBumps) * Math.PI * 2 + seededRandom(seed) * 0.5;
            const bumpDist = visualRadius * (0.5 + seededRandom(seed + 1) * 0.25); // Smaller range
            const bumpSize = visualRadius * (0.1 + seededRandom(seed + 2) * 0.08); // Smaller bumps

            const offset = right.clone().multiplyScalar(Math.cos(angle) * bumpDist)
                .add(forward.clone().multiplyScalar(Math.sin(angle) * bumpDist));

            const bumpPos = point.clone().add(offset);
            const bumpGrid = worldToGrid(bumpPos);
            const bumpInfluence = (bumpSize / maxSize) * 12;

            effect.addBall(bumpGrid.x, bumpGrid.y, bumpGrid.z, bumpInfluence, 12);
        }
    }

    effect.isolation = 80;
    // @ts-ignore
    if (effect.update) effect.update();

    const geometry = effect.geometry.clone();
    geometry.applyMatrix4(effect.matrix);

    return geometry;
}

// Legacy function for compatibility
export function generateClotGeometry(
    _center: THREE.Vector3,
    _vesselRadius: number,
    _clotLength: number = 0.3,
    _tangent: THREE.Vector3 = new THREE.Vector3(0, 1, 0)
): THREE.BufferGeometry {
    return new THREE.BufferGeometry();
}

export function generateVesselGeometry(
    paths: { path: THREE.Curve<THREE.Vector3>, radius: number }[],
    clot?: ClotConfig
): THREE.BufferGeometry {
    // 1. Setup Marching Cubes
    // Resolution: 64 is a safe default for performance/quality balance.
    // Higher (e.g., 128) gives smoother results but costs more CPU/GPU.
    const resolution = 64;

    // Material is placeholder, it will be replaced by the scene material
    const effect = new MarchingCubes(resolution, new THREE.MeshBasicMaterial(), true, true, 100000);
    
    // 2. Determine bounds (scale and offset)
    // The MarchingCubes object operates in a normalized -1 to 1 space or 0-1 depending on implementation,
    // but typically we position the effect object in the scene.
    // However, we want to extract the geometry, so we need to map our world space paths into the MC local space.
    
    const min = new THREE.Vector3(Infinity, Infinity, Infinity);
    const max = new THREE.Vector3(-Infinity, -Infinity, -Infinity);
    
    paths.forEach(p => {
        const points = p.path.getPoints(20);
        points.forEach(pt => {
            min.min(pt);
            max.max(pt);
        });
    });
    
    // Add padding
    min.subScalar(1.5);
    max.addScalar(1.5);
    
    const size = new THREE.Vector3().subVectors(max, min);
    
    // We will place the metaballs in the MC grid.
    // The MC grid is effectively a 1x1x1 box centered at 0,0,0 usually? 
    // Wait, Three.js MC implementation usually requires setting 'scale' and 'position' of the object 
    // to match the world volume we want to render.
    // But here we want to return a geometry that matches the world coordinates given by the paths.
    
    // Strategy:
    // 1. Reset MC object
    effect.position.copy(min).addScaledVector(size, 0.5); // Center of the volume
    effect.scale.copy(size).multiplyScalar(0.5); // Half-extent? No, scale is usually total size.
    // Actually, looking at docs/examples: 
    // effect.scale.set( 700, 700, 700 ); // Sets the world size of the cubic volume.
    effect.scale.copy(size).multiplyScalar(0.5); // The MC geometry goes from -1 to 1 by default.
    
    effect.updateMatrix();
    effect.updateMatrixWorld();
    
    // 3. Paint blobs
    effect.reset();
    
    // Define the strength/isolation of the field.
    // Standard isolation is often 0.5 or 80 depending on the implementation details.
    // Three.js MC: isolation level is typically set.
    // We'll use addBall(x, y, z, strength, subtract, colors)
    // Access methods: effect.addBall(x, y, z, strength, subtract, colors)
    // Coordinates (x,y,z) are in 0..1 relative to the resolution grid.
    
    const strength = 0.5; // Blob strength
    const subtract = 12; // Isolation level? No, subtract is boolean or strength modifier.
    // In Three.js implementation:
    // addBall: function ( ballx, bally, ballz, strength, subtract, colors )
    
    const worldToGrid = (v: THREE.Vector3) => {
        // Map v from [min, max] to [0, 1]
        const x = (v.x - min.x) / size.x;
        const y = (v.y - min.y) / size.y;
        const z = (v.z - min.z) / size.z;
        return { x, y, z };
    };
    
    // Iterate paths
    paths.forEach(p => {
        // Density of spheres along the path
        const length = p.path.getLength();
        const steps = Math.ceil(length * 20); // 20 spheres per unit length?
        
        for (let i = 0; i <= steps; i++) {
            const t = i / steps;
            const point = p.path.getPoint(t);
            const gridPos = worldToGrid(point);
            
            // Radius of metaball
            // In mapping to 0..1, we need to consider the relative radius.
            // A ball of radius R in world space is (R / size.axis) in grid space.
            // The 'strength' parameter in standard MC is often roughly the radius squared or similar influence.
            // Let's deduce: in standard metaballs, field = R^2 / r^2.
            // Three.js MC uses overlapping influence.
            
            // Experimentally: strength ~ radius * scaling_factor
            // Let's try 2.0 * radius relative to grid.
            const gridRadius = (p.radius / Math.max(size.x, size.y, size.z)); 
            
            // Strength needs to be tuned. 
            // Usually, strength ~ 0.5-1.0 works for standard blobs at 0.5 isolation.
            // Wait, proper way:
            // effect.addBall(gridPos.x, gridPos.y, gridPos.z, influence, subtract)
            
            // We just use a constant high density of balls.
            // Tunable:
            const influence = gridRadius * 12.0; 
            
            effect.addBall(gridPos.x, gridPos.y, gridPos.z, influence, 12);
        }
    });

    // 3b. Add CLOT metaballs if configured
    // The clot is generated in the SAME MarchingCubes so it fuses with the vessel walls
    if (clot) {
        const clotCenter = clot.path.getPoint(clot.tPosition);
        const clotTangent = clot.path.getTangent(clot.tPosition);
        const clotLength = clot.length ?? clot.vesselRadius * 2;

        // Create coordinate system aligned with vessel at clot position
        const up = new THREE.Vector3(0, 1, 0);
        if (Math.abs(clotTangent.dot(up)) > 0.99) {
            up.set(1, 0, 0);
        }
        const right = new THREE.Vector3().crossVectors(clotTangent, up).normalize();
        const forward = new THREE.Vector3().crossVectors(right, clotTangent).normalize();

        // Generate dense metaballs that fill the vessel cross-section
        // Using SAME radius as vessel so they fuse with walls
        const numSlices = 5;
        const numRings = 4;
        const ballRadius = clot.vesselRadius * 0.4;

        for (let slice = 0; slice < numSlices; slice++) {
            const sliceT = (slice / (numSlices - 1)) - 0.5;
            const axisOffset = clotTangent.clone().multiplyScalar(clotLength * sliceT);
            const sliceCenter = clotCenter.clone().add(axisOffset);

            // Large center ball
            const centerGrid = worldToGrid(sliceCenter);
            const centerInfluence = (ballRadius * 1.5) / Math.max(size.x, size.y, size.z) * 12;
            effect.addBall(centerGrid.x, centerGrid.y, centerGrid.z, centerInfluence, 12);

            // Rings filling the cross-section up to vessel wall
            for (let ring = 1; ring <= numRings; ring++) {
                const ringRadius = (ring / numRings) * clot.vesselRadius * 0.95;
                const numBalls = 6 + ring * 2;

                for (let i = 0; i < numBalls; i++) {
                    const angle = (i / numBalls) * Math.PI * 2 + slice * 0.3;
                    const radialOffset = right.clone().multiplyScalar(Math.cos(angle) * ringRadius)
                        .add(forward.clone().multiplyScalar(Math.sin(angle) * ringRadius));

                    const ballPos = sliceCenter.clone().add(radialOffset);
                    const gridPos = worldToGrid(ballPos);
                    const gridRadius = (ballRadius) / Math.max(size.x, size.y, size.z);
                    const influence = gridRadius * 12;

                    effect.addBall(gridPos.x, gridPos.y, gridPos.z, influence, 12);
                }
            }
        }
    }

    // 4. Generate the geometry
    // This creates the geometry inside the 'effect' object
    // effect.update(); // Not a method?
    // Looking at source: update() calls generateGeometry() etc.
    // Actually, usually we don't call update() manually if not in loop, but we need the geometry *now*.
    // effect.resolution = resolution; 
    
    // We need to trigger the generation.
    // effect.update() is likely the render-loop method.
    // We want to force it.
    
    // The implementation of MarchingCubes.js typically has:
    // this.generateGeometry = function() ...
    // this.update = function() ...
    
    // Force direct call if possible or just rely on public API.
    // To generate geometry we probably just need to access effect.generateGeometry() if exposed, 
    // or typically relying on `effect` being a Mesh, we want its geometry.
    // Because we are not adding it to the scene, we must force computation.
    
    // Standard Three.js MC doesn't always expose a synchronous "compute now" easily without rendering.
    // However, looking at the code structure:
    // It builds a bufferGeometry on the fly.
    
    // We can simulate a "frame" update manually?
    // effect.update(); // calculates isosurface
    
    // Wait, the standard Three.js MarchingCubes is a Mesh subclass but handles its own geometry inside.
    // It creates 'this.geometry' which is a BufferGeometry.
    
    // Let's assume effect.update() or effect.generateGeometry() does the work.
    // If we look at type definitions or source...
    // It seems 'update' is not always public in the main export or it expects to be part of scene.
    
    // Let's try the direct approach:
    // The internal shader/worker? No, Three examples MC is CPU based.
    // It has a method `update()`.
    
    // Important: We need to set the isolation level properly.
    effect.isolation = 80; // Standard default is often 80/100ish for their specific field math.
    
    // Let's update.
    // Note: older versions had .update(), newer might just be needed.
    // We'll wrap in try-catch to be safe, but it should be effect.update().
    
    // @ts-ignore
    if (effect.update) effect.update();

    // Now extract geometry. 
    // The geometry is in local space (-1 to 1 perhaps, or 0 to 1).
    // We need to transform it back to world space to match our vessels.
    
    const geometry = effect.geometry.clone();
    
    // Transform geometry to world space matches bounds
    // MC local space is usually -1 to +1?
    // Let's verify standard Three MC:
    // It creates geometry in [ -axis/2, axis/2 ].
    
    // We apply the transformation matrix we calculated earlier.
    geometry.applyMatrix4(effect.matrix);
    
    return geometry;
}
