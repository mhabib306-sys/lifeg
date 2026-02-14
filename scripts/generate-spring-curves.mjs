#!/usr/bin/env node
/**
 * Documents the spring parameters used to derive CSS cubic-bezier approximations.
 * CSS cannot represent true spring physics, so these are hand-tuned cubic-bezier
 * curves that approximate the feel of each spring config.
 *
 * Run: node scripts/generate-spring-curves.mjs
 */

const curves = [
  { name: '--spring-snappy', bezier: 'cubic-bezier(0.22, 1.0, 0.36, 1.0)', stiffness: 500, damping: 30, duration: '200ms' },
  { name: '--spring-smooth', bezier: 'cubic-bezier(0.25, 0.8, 0.25, 1.0)', stiffness: 300, damping: 30, duration: '350ms' },
  { name: '--spring-bouncy', bezier: 'cubic-bezier(0.34, 1.56, 0.64, 1.0)', stiffness: 400, damping: 15, duration: '500ms' },
  { name: '--spring-gentle', bezier: 'cubic-bezier(0.16, 1.0, 0.3, 1.0)', stiffness: 200, damping: 25, duration: '400ms' },
];

console.log('/* Spring curves — generated via scripts/generate-spring-curves.mjs */');
console.log(':root {');
for (const c of curves) {
  console.log(`  ${c.name}: ${c.bezier};   /* stiffness:${c.stiffness}, damping:${c.damping} */`);
}
console.log('  --spring-duration-snappy: 200ms;');
console.log('  --spring-duration-smooth: 350ms;');
console.log('  --spring-duration-bouncy: 500ms;');
console.log('  --spring-duration-gentle: 400ms;');
console.log('}');
