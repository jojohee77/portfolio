module.exports = {
    apps: [
      {
        name: "agoffice",
        cwd: "/data/www/mpctest.xyz/next/app",
        script: "node",
        // 일반 스타트 (standalone 미사용 시)
        args: "node_modules/next/dist/bin/next start -p 3000",
  
        // ★ standalone 빌드 사용 시에는 아래 한 줄로 교체하세요.
        // args: ".next/standalone/server.js",
  
        env: {
          NODE_ENV: "production",
          PORT: 3000
        },
  
        // 로그
        out_file: "/data/pm2-logs/agoffice-front-out.log",
        error_file: "/data/pm2-logs/agoffice-front-error.log",
        log_date_format: "YYYY-MM-DD HH:mm:ss",
  
        // 운영 옵션
        max_memory_restart: "1G",
        instances: 1,
        exec_mode: "fork",   // ★ fork 대신 클러스터
        autorestart: true,
        max_restarts: 10,
        min_uptime: 5000,
        kill_timeout: 5000,
        listen_timeout: 10000
        
      }
    ]
  }
  