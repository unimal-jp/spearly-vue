module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.test.json',
    },
  },
  moduleFileExtensions: ['js', 'ts', 'vue', 'json', 'node'],
  transform: {
    '^.+\\.vue$': 'vue-jest',
    '^.+\\.tsx?$': 'ts-jest',
  },
  testMatch: [
    '<rootDir>/src/specs/**/*.spec.{js,ts}',
  ],
}
