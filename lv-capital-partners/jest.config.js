module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
-  // Only run schema unit tests
-  testMatch: ['<rootDir>/src/lib/schemas/**/*.test.ts'],
+  // Run schema and documents API route tests
+  testMatch: [
+    '<rootDir>/src/lib/schemas/**/*.test.ts',
+    '<rootDir>/src/app/api/documents/**/*.test.ts'
+  ],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
-  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/tests/'],
+  testPathIgnorePatterns: ['/node_modules/', '/.next/', '/tests/e2e/'],
};
