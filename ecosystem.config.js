module.exports = {
  apps: [
    {
      name: 'seva32',
      script: './src/server/main.js',
      watch: false,
      wait_ready: true,
      env: {
        NODE_ENV: 'production',
        PORT: 8081,
      },
    },
  ],
};
