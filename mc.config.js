module.exports = {
  apps: [
    {
      name: "mission-climat",
      script: "./index.js",
      increment_var: 'GOOGLE_APPLICATION_CREDENTIALS',
      instances: 3,
      namespace: "mc",
      exec_mode: "cluster",
      env: {
        "PORT": 4000,
        "GOOGLE_APPLICATION_CREDENTIALS": 0
      }
    }
  ]
};

