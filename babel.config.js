module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@app': './src/app',
            '@components': './src/components',
            '@hooks': './src/hooks',
            '@services': './src/services',
            '@utils': './src/utils',
            '@constants': './src/constants',
          },
        },
      ],
    ],
  };
};
