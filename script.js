// LicitaÁgil Chat Simulator & Lead Capture Logic

document.addEventListener('DOMContentLoaded', () => {
    // 1. WhatsApp Chat Simulator
    const chatContainer = document.getElementById('chat-container');
    
    const chatSequence = [
        { sender: 'bot', text: '¡Hola Carlos! 🤖 Aquí tienes las nuevas oportunidades en <strong>Compra Ágil</strong> de hoy para tu rubro:', delay: 1000 },
        { sender: 'bot', text: '📂 <strong>Filtro: Soporte TI & Redes</strong><br>💼 <strong>Licitación:</strong> Mantención de Computadores y Puntos de Red<br>🏢 <strong>Organismo:</strong> Municipalidad de Providencia<br>💰 <strong>Monto Estimado:</strong> $4.500.000 CLP<br>⏰ <strong>Cierre:</strong> Mañana a las 15:00 (Faltan 19 horas).<br><a href="#" class="bubble-link" onclick="event.preventDefault();">Ver Ficha Oficial</a>', delay: 2000 },
        { sender: 'user', text: '¡Excelente! ¿Puedes recordarme 2 horas antes de que cierre para subir mi oferta?', delay: 2000 },
        { sender: 'bot', text: '¡Programado! ⏰ Te enviaré un WhatsApp mañana a las 13:00 con el enlace directo y los documentos mínimos para postular.', delay: 1500 }
    ];

    let sequenceIndex = 0;

    function renderNextMessage() {
        if (sequenceIndex >= chatSequence.length) {
            // Reset chat after a delay to loop the demo
            setTimeout(() => {
                chatContainer.innerHTML = '';
                sequenceIndex = 0;
                renderNextMessage();
            }, 6000);
            return;
        }

        const msgData = chatSequence[sequenceIndex];
        
        // Create bubble element
        const bubble = document.createElement('div');
        bubble.className = `bubble ${msgData.sender}`;
        bubble.innerHTML = msgData.text;

        // Add timestamp
        const time = document.createElement('span');
        time.className = 'bubble-time';
        const now = new Date();
        time.textContent = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        bubble.appendChild(time);

        // Append and scroll to bottom
        setTimeout(() => {
            chatContainer.appendChild(bubble);
            chatContainer.scrollTop = chatContainer.scrollHeight;
            sequenceIndex++;
            renderNextMessage();
        }, msgData.delay);
    }

    // Start simulation
    renderNextMessage();

    // 2. Lead Capture Submission
    const leadForm = document.getElementById('lead-form');
    const successMessage = document.getElementById('success-message');
    const queueNumberSpan = document.getElementById('queue-number');

    leadForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get form values
        const name = document.getElementById('name').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const company = document.getElementById('company').value;
        const keywords = document.getElementById('keywords').value;

        // Create lead object
        const newLead = {
            name,
            whatsapp,
            company,
            keywords,
            timestamp: new Date().toISOString()
        };

        // Retrieve existing leads or create empty list
        let leads = JSON.parse(localStorage.getItem('licita_agil_leads')) || [];
        leads.push(newLead);
        
        // Save back to localStorage
        localStorage.setItem('licita_agil_leads', JSON.stringify(leads));

        // Send lead to backend reverse-proxied to n8n without exposing its internal URL
        fetch('/webhook/licita-agil-leads', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newLead)
        })
        .then(response => {
            if (!response.ok) {
                console.warn('Error al enviar el lead al webhook. Guardado localmente como respaldo.');
            } else {
                console.log('Lead enviado con éxito al webhook centralizado.');
            }
        })
        .catch(err => {
            console.error('Error de red al enviar el lead:', err);
        });

        // UI transitions
        leadForm.classList.add('hidden');
        successMessage.classList.remove('hidden');

        // Display queue details
        const randomQueuePos = Math.floor(Math.random() * 20) + 12; // Between 12 and 32
        queueNumberSpan.textContent = `#${randomQueuePos}`;

        // Scroll to success message
        document.getElementById('register-section').scrollIntoView({ behavior: 'smooth' });

        console.log('Nuevo lead registrado en LocalStorage:', newLead);
    });
});
