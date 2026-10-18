module.exports = {
  apps: [
    {
      name: "roblox-voting-web",
      // When deployed with standalone output, the entrypoint is server.js
      script: "server.js",
      instances: "max",
      exec_mode: "cluster",
      autorestart: true,
      watch: false,
      max_memory_restart: "800M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
