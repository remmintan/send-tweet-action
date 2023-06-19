import process from 'process';
import cp from 'child_process';
import path from 'path';

test('action runs', () => {
    const ip = path.join('./dist/index.js');
    const result = cp.execSync(`node ${ip}`, {env: process.env}).toString();
    console.log(result);
});