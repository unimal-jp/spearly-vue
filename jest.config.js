module.exports = {
  roots: ['<rootDir>/src'],
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['js', 'ts', 'vue', 'json', 'node'],
  transform: {
    '^.+\\.vue$': '@vue/vue3-jest',
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: './tsconfig.test.json'
    }],
  },
  transformIgnorePatterns: ['/node_modules/(?!(axios)/)'],
  testMatch: [
    '<rootDir>/src/**/*.spec.{js,ts}',
  ],
}
