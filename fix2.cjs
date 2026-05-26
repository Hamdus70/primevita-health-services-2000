const fs = require('fs');
let code = fs.readFileSync('src/pages/dashboard/AdminDashboard.tsx', 'utf-8');
code = code.replace(/ \/>\}>/g, '>');
fs.writeFileSync('src/pages/dashboard/AdminDashboard.tsx', code);
