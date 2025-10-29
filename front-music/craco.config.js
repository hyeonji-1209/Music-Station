module.exports = {
  style: {
    modules: {
      localIdentName: '[local]--[hash:base64:5]',
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      return webpackConfig;
    },
  },
};

