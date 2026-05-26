import { checkRateLimit } from './src/lib/security/rate-limit.js';

async function main() {
    console.log(await checkRateLimit('test', 10, 60));
}
main();
