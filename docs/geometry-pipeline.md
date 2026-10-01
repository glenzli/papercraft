# Paper geometry pipeline

The schema is the authored asset. `compilePaperModel` converts it once into physical triangles,
welded topology, printable islands and numbered seams. The 3D viewer, SVG preview, PNG and PDF
consume this compiled result. Units in the geometry and page layout are millimetres; the 3D
viewport applies a display scale of 0.01.

## Ownership

- `src/core/schema/compilePaperModel.ts`: schema compatibility, triangulation, explicit interior cuts.
- `src/core/paper/topology.ts`: geometric vertex identity, corner UVs, T-junction subdivision,
  orientation, adjacency, signed fold angles and non-manifold rejection.
- `src/core/paper/netBuilder.ts`: validated template hints, bounded alternative roots/hinges,
  overlap checks, disconnected components, numbered seams, tabs and joining strips.
- `src/core/paper/printMarks.ts`: shared construction lines and label positions in millimetres.
- `src/core/unfoldEngine.ts`: page rotation and A4 placement, including every island and tab.
- `src/texture/textureBaker.ts`: shared surface canvases and role-specific texture lookup.
- `src/core/unfolder/AffineTextureProjector.ts`: corner UV to triangle affine mapping.
- `src/export/pdfExporter.ts`: raster art/captions with vector construction marks and seam numbers.

`ThreeMeshUnfolder` and `packPartsToA4` remain compatibility adapters to the same pipeline.
There is no second unfolding implementation behind those entry points.

## Asset authoring

Use stable part and face IDs. `vertices3D`, triangle `indices` and per-corner `uvCoords` describe
the actual surface. Render vertices at a UV seam may differ while referring to the same geometric
vertex. Welding does not merge their UV coordinates. Non-planar authored polygons are treated as
the physical triangles supplied by their indices. If indices are omitted, the polygon must be
planar and its vertices must follow the boundary in order.

`vertices2D` is optional layout guidance: the complete template is accepted only if all edges
preserve their 3D lengths and triangles do not overlap. Otherwise the engine unfolds rigid
triangles from 3D. The search tries at most four deterministic roots, favours long/coplanar and
authored shared edges, retries rejected faces at other hinges, and starts another island when
necessary. It does not guarantee the fewest cuts or the best paper utilisation.

Use optional part-level `unfoldRegions` to declare construction panels independently of texture
slots. Each region has an `id`, a printable `name`, and `faces: [{ faceId, triangles? }]`; triangle
ordinals are zero-based in the source indices, and omitting `triangles` selects the entire face.
Invalid or overlapping selections are rejected. Region boundaries become paired cuts in the same
welded surface; geometry and UVs are unchanged, and subdivision inherits region membership.
Unassigned triangles share the default region. A region may still split if needed to avoid overlap
or fit the page. The CR400 Master head explicitly separates the body/chassis, complete windshield,
upper nose, left/right cheeks and lower lip; regression checks keep each of these six panels intact.

Use `cutEdges: [[vertexIndexA, vertexIndexB]]` for mandatory edge cuts. Use `cuts3D` for physical
interior slots. Cuts survive edge subdivision and page rotation. Legacy interior 2D cut marks
are transferred through triangle correspondences where available; old boundary/fold/tab drawings
are superseded by topology. Incompatible legacy assets should migrate their interior slots to
`cuts3D`. Missing/degenerate UV triangles receive a diagnostic and a projected fallback; author
explicit UVs when artwork continuity matters.

Accessories with `faces` use those surfaces in both views. An accessory without `faces` is treated
as its supplied triangle mesh, not as a separate rectangle in the net. Tabs are printable joining
material; joining strips are separate backing pieces and are not added to the assembled exterior
mesh. Accessory installation offsets remain authored data: this pipeline does not solve mechanical
coupler attachment or assembly order.

## Construction and printing

A kept physical edge is scored only if its adjacent triangles have a nonzero fold angle. Coplanar
triangulation diagonals are hidden. Each cut seam has exactly two target faces/edges and one tab,
or a separately numbered backing strip if neither side has room for a tab. Tab candidates are
checked as whole polygons against all faces and already accepted tabs. Very narrow strips produce
assembly notes. Numbers are local to a car; use the printed car number when sorting parts.

Printable surface triangles use negative signed area in SVG coordinates (downward y). Computed
roots and complete authored islands are normalized to this orientation; mixed-winding templates
fall back to geometric unfolding. This makes the printed exterior and signed mountain/valley
dihedrals agree. Concave seam tabs use valley folds, convex seam tabs use mountain folds. Backing
strips fold in the opposite sense because they attach inside the body.

All islands are packed, including disconnected surfaces. Packing reserves A4 margins, headers,
part captions and a footer. Rotation moves geometry, tabs, marks and texture correspondence
together. Overflow starts a new page. Pieces are never independently scaled to fit; a triangle
that cannot fit causes an error before import registration instead of silently being dropped.

Each car's largest body piece gets a primary page. Remaining construction panels and accessories
are sorted by footprint and fill available space across the whole consist before opening shared
supplementary pages. Mixed sheets list their car numbers; each piece keeps its original car number
and seam pairs. CR400 Master's default three-car consist currently fits four A4 sheets. This bounded
packing heuristic preserves print size and does not claim a minimum page count.

PDF art and multilingual captions use an A4 300 DPI canvas. Construction lines and seam numbers
are native PDF vectors. Texture detail still depends on the source canvas resolution. Print using
**100% / Actual size** and measure the included **50 mm** ruler. PNG uses the same marks and UV
projection. Mathematical length/overlap checks do not prove a practical folding order, paper
thickness clearance, glue access or strength; representative physical assembly remains necessary.

## Validation

Run `npm test` for all 24 built-in families plus independent geometry fixtures. The tests check:

- Box geometry with indexed and unindexed UV seams: all 12 triangles retained, one island.
- Disconnected meshes, T-junction subdivision and forced cuts, non-manifold rejection.
- Every compiled triangle printed once, rigid edge lengths, whole-polygon face/tab collisions.
- Seam targets, counterpart lengths and exactly one tab or backing strip per pair.
- UV correspondence before and after 90-degree page rotation.
- Every part placed once, no cross-part collisions, and all points inside the printable A4 area.
- CR400 closed body and two physical 9 mm bottom slots; simple E235 body remains one island.
- CR400 Master windshield/panels remain complete, both cheek nets are congruent, and region cuts
  leave physical geometry and UVs unchanged.
- Native vector PDF paths and seam text; tab bases have fold lines rather than cut lines.
- Printed-face winding and reconstruction of retained folds from their printed labels, including
  signed 3D volume to detect mirrored assemblies; concave/convex tab direction.
- All 38 distinct minimum/maximum consist configurations stay within A4 margins without overlap.
- Articulated joint end contact, alternating folds, yaw clearance and developed-length reserve;
  genuinely open pickup bed, closed car/aircraft shells, integral aircraft mounting flanges.
- Sampled full attachment pads for wheel arms, engine pylons, aircraft stands, helicopter supports
  and float struts; tyre/arch clearance, support planes, rotor facing and accessory dimensions.
- Readable professional/transport lettering and model-specific instructions preserved in packages.

`npm run build` checks the production TypeScript/Vite bundle. Browser smoke testing additionally
covers displayed 3D/SVG output, actual PDF download, and texture replacement across car roles.
Fold animation, interactive seam editing, optimal net search and automatic manufacture certification
are outside this implementation.
