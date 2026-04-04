jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

beforeEach(async () => {
  const AsyncStorage = require('@react-native-async-storage/async-storage');
  await AsyncStorage.clear();
  jest.clearAllMocks();
});
