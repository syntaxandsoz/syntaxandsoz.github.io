document.addEventListener("DOMContentLoaded", () => {
    const grid = document.getElementById("newsGrid");
    
    // Fetch Data (Cache busting added to get fresh data)
fetch('data.json?t=' + new Date().getTime()) 
    .then(response => response.json())
        .then(data => {
            grid.innerHTML = ""; // Clear loading text
            
            data.forEach((item, index) => {
                // Create Card
                const card = document.createElement("div");
                card.classList.add("card");
                
                // Clickable Link
                card.onclick = () => window.open(item.link || "#", "_blank");

                // HTML Structure
                card.innerHTML = `
                    <span class="tag">${item.category || 'General'}</span>
                    <h3>${item.title}</h3>
                    <div class="meta">
                        <span>${item.source}</span>
                        <span>${item.time}</span>
                    </div>
                `;
                
                // Staggered Animation (Ek ke baad ek aayenge)
                card.style.opacity = "0";
                card.style.animation = `fadeIn 0.5s forwards ${index * 0.1}s`;
                
                grid.appendChild(card);
            });
        })
        .catch(error => {
            console.error(error);
            grid.innerHTML = `<p style="color:#ff5f56;">>> Error: Data Stream Offline.</p>`;
        });
});

// Add FadeIn Keyframe dynamically
const style = document.createElement('style');
style.innerHTML = `
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);