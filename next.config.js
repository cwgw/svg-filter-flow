const path = require("path");
const ESLintPlugin = require("eslint-webpack-plugin");

module.exports = {
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|svg)$/i,
      use: [
        {
          loader: "url-loader",
          options: {
            limit: 8192,
          },
        },
      ],
    });

    config.plugins.push(
      new ESLintPlugin({
        extensions: ["js", "jsx"],
        exclude: [".husky", ".next", "node_modules", "out"],
        files: ["src"],
      })
    );

    config.resolve.modules.push(path.resolve("./src"));

    return config;
  },
};
