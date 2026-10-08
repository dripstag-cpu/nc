import { ROUTES, exists } from './lib-dist.mjs';
const missing = ROUTES.filter((r) => !exists(r));
console.log(missing.length ? `ROUTES FAIL missing ${missing}` : `ROUTES OK ${ROUTES.length}`);
