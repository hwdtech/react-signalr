const path = require("path");

module.exports = (baseConfig, env, config) => {
  config.module.rules.push({
    test: /\.tsx?$/,
    include: [
      path.resolve(__dirname, "../src"),
      path.resolve(__dirname, "../examples"),
    ],
    use: [require.resolve("ts-loader")],
  });
  config.resolve.extensions.push(".ts", ".tsx");
  return config;
};
