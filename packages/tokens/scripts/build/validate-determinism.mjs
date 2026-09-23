import { execFileSync } from 'node:child_process';
import { hashDirectory } from './hash-directory.mjs';

function executeBuild() {
  execFileSync('npm', ['run', 'build:tokens'], { stdio: 'inherit' });
}

async function validateDeterminism() {
  executeBuild();

  const firstHash = await hashDirectory('dist');

  executeBuild();

  const secondHash = await hashDirectory('dist');

  if (firstHash !== secondHash) {
    throw new Error(
      `El build no es determinista. Primer hash: ${firstHash}. Segundo hash: ${secondHash}.`,
    );
  }

  console.log(`Build determinista: ${firstHash}`);
}

await validateDeterminism();
