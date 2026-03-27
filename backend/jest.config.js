/** @type {import('jest').Config} */
export default {
  // .js files are already treated as ESM because package.json has "type":"module"
  transform: {},
  testEnvironment: 'node',
  testMatch: ['**/*.test.js']
}
