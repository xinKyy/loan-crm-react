module.exports = {
  apps: [
    {
      name: 'loan-admin',
      script: 'npm',
      args: 'start',
      env: {
        NODE_ENV: 'production',
      },
    },
  ],
};
