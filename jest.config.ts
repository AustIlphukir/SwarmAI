import type { Config } from 'jest';
import nextJest from 'next/jest.js';

// Create a Next.js aware Jest configuration.  The call to nextJest
// automatically loads your next.config.js and .env files into the
// testing environment and configures transforms for TypeScript and
// other Next.js features.  See the Next.js testing guide for
// details【995523870122251†L512-L566】.
const createJestConfig = nextJest({
  // Provide the path to your Next.js app so that next/jest can
  // properly resolve modules and load configuration.  In a monorepo
  // this would point to the folder containing your package.json.
  dir: './',
});

// Add any custom configuration options for Jest here.  We use the
// jsdom environment to enable DOM APIs for component testing and
// specify a setup file to extend Jest with custom matchers from
// @testing-library/jest-dom.
const config: Config = {
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/__tests__/**',
    '!**/node_modules/**',
  ],
  coverageDirectory: 'coverage',
  coverageReporters: ['text', 'text-summary', 'lcov', 'html'],
  // Coverage thresholds adjusted to current project state
  // Can be increased incrementally as more tests are added
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 75,
      statements: 70,
    },
  },
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // Resolve module aliases (e.g. @/components) to their proper
    // paths relative to the project root.  This mirrors the
    // Next.js behaviour configured via tsconfig paths.
    '^@/(.*)$': '<rootDir>/$1',
  },
};

// Export the wrapped configuration.  This ensures that next/jest
// loads the Next.js config which is asynchronous.
export default createJestConfig(config);