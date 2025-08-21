/**
 * This function computes the "D" attributue
 * of an SVG path for a hexagon with rounded corners.
 * The math is based on a hexagon with a center at (cx, cy),
 * a "radius" R which is the distance from the center to the point
 * and a corner radius cornerR, where cornerR is the radius of
 * a circle that is tangent to two adjacent sides of the hexagon.
 * (It took me like 30 minutes with a whiteboard to figure this out,
 * so you'll just have to trust me on the math.)
 */
export function roundedHexPath(cx, cy, r, cornerR) {
  // The distance from the hex center to the edge of the rounded corner
  const rad = Math.sqrt(
    r ** 2 + cornerR ** 2 / 3 - (r * cornerR) / Math.sqrt(3),
  );
  // The difference in angle from the usual sharp corner to the edge
  // of the rounded corner
  const angleOffset = Math.atan(
    cornerR / 2 / (r - cornerR / (2 * Math.sqrt(3))),
  );

  const angle = Math.PI / 3;

  let d = "";
  for (let i = 0; i < 6; i++) {
    const currentAngle = angle * i;
    const flag = i === 0 ? "M" : "L";

    // First draw a line to the edge of the rounded corner
    // (or start the path there, in the case of (i === 0)
    const sx = cx + rad * Math.cos(currentAngle - angleOffset);
    const sy = cy + rad * Math.sin(currentAngle - angleOffset);
    d += `${flag} ${sx} ${sy} `;

    // Then find the other side of the rounded corner, and draw
    // an arc to it
    const ex = cx + rad * Math.cos(currentAngle + angleOffset);
    const ey = cy + rad * Math.sin(currentAngle + angleOffset);
    d += `A ${cornerR} ${cornerR} 0 0 1 ${ex} ${ey} `;
  }

  // Close the path back to the first point
  d += "Z";

  return d;
}
