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
        files: ["components", "context", "hooks", "pages", "style", "utils"],
      })
    );

    return config;
  },
};
