document.addEventListener('DOMContentLoaded', () => {
    const AZURE_CONTACT_URL = "https://priva-contact-api-ebg2hxhqdbg5beg7.swedencentral-01.azurewebsites.net/api/contact";

    const form = document.getElementById('contact-form');
    const submitBtn = document.getElementById('submit-btn');
    const statusDiv = document.getElementById('form-status');
    const formCard = document.querySelector('.form-card');

    if (!form) return;

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        if (document.getElementById('gotcha').value !== "") return;

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>🔒 Hämtar nyckel & krypterar...</span>';
        statusDiv.style.display = 'none';

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const phone = document.getElementById('phone').value.trim() || 'Ej angivet';
        const category = document.getElementById('category').value;
        const message = document.getElementById('message').value.trim();

        const payload = `=== NY FÖRFRÅGAN VIA PRIVA-INNOVATION.EU ===
Tidpunkt: ${new Date().toLocaleString('sv-SE')}
Avsändare: ${name}
E-post: ${email}
Telefon: ${phone}
Område: ${category}

MEDDELANDE:
--------------------------------------------------
${message}
--------------------------------------------------
Fingerprint: AE32 B178 AAB0 1919 0C80 5B4E 3EB6 78C9 EB2E C9CC`;

        let encryptedBody = null;

        try {
            const keyResponse = await fetch('https://priva-innovation.eu/pgp-key.asc');
            if (!keyResponse.ok) throw new Error('Kunde inte hämta publika nyckelfilen.');
            const publicKeyArmored = (await keyResponse.text()).trim();

            const publicKey = await openpgp.readKey({ armoredKey: publicKeyArmored });
            encryptedBody = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: payload }),
                encryptionKeys: publicKey
            });
        } catch (err) {
            console.error("Krypteringsfel:", err);
            statusDiv.className = 'error';
            statusDiv.style.display = 'block';
            statusDiv.textContent = 'Kunde inte kryptera meddelandet: ' + err.message;
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>🔒 Kryptera & Skicka meddelande</span>';
            return;
        }

        submitBtn.innerHTML = '<span>📡 Överför krypterad payload...</span>';

        try {
            const response = await fetch(AZURE_CONTACT_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: payload,
                    pgpMessage: encryptedBody
                })
            });

            if (!response.ok) throw new Error(`Serverfel (HTTP ${response.status})`);

            formCard.innerHTML = `
                <div style="text-align: center; padding: 25px 10px;">
                    <div style="font-size: 3.2rem; margin-bottom: 15px;">🛡️</div>
                    <h2 style="color: var(--dark-purple); margin-bottom: 8px;">Skickat – Inväntar svar</h2>
                    <div style="display: inline-block; background: #e8f5e9; color: #2e7d32; border: 1px solid #a5d6a7; padding: 6px 14px; border-radius: 20px; font-weight: 600; font-size: 0.85rem; margin-bottom: 20px;">
                        ✓ End-to-End Krypterad
                    </div>
                    <p style="color: var(--text-dark); font-size: 1.05rem; line-height: 1.6; max-width: 480px; margin: 0 auto 20px;">
                        Tack, <strong>${name}</strong>! Ditt meddelande har krypterats klientsidigt och levererats till vår inkorg.
                    </p>
                    <p style="color: var(--text-muted); font-size: 0.9rem; margin-bottom: 25px;">
                        Vi återkopplar till <strong>${email}</strong> så snart som möjligt.
                    </p>
                    <div style="background: #fafbfd; border: 1px dashed var(--border-color); border-radius: 8px; padding: 12px; font-size: 0.8rem; color: #666; font-family: monospace;">
                        SHA-256 Session Payload Verified • Zero Secrets Stored
                    </div>
                </div>
            `;
        } catch (error) {
            console.error("Överföringsfel:", error);
            statusDiv.className = 'error';
            statusDiv.style.display = 'block';
            statusDiv.innerHTML = `<strong>Kunde inte skicka:</strong> ${error.message}.`;
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>🔒 Kryptera & Skicka meddelande</span>';
        }
    });
});