module.exports = {
    env: {
      node: true,
      browser: true,
      commonjs: true,
      es2021: true,
      jest: true,
    },
    extends: 'eslint:recommended',
    overrides: [
      {
        env: {
          node: true,
        },
        files: ['.eslintrc.{js,cjs}'],
        parserOptions: {
          sourceType: 'script',
        },
      },
    ],
    parserOptions: {
      ecmaVersion: 'latest',
      sourceType: "module"
    },
    rules: {},
  };
  