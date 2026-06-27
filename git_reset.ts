import { execSync } from 'child_process';
try {
  execSync('git reset --hard', { stdio: 'inherit' });
  console.log('Reset complete');
} catch (e) {
  console.log('Git failed');
}
