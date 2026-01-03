document.addEventListener('DOMContentLoaded', () => {
    const dateStrip = document.getElementById('dateStrip');
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    // Generate 30 days
    // Starting from July 1st 2025 (Tuesday) as an example base
    // But to match the image where 10th is Wed, let's calculate backwards.
    // If 10th is Wed, then:
    // 9 Tue, 8 Mon, 7 Sun, 6 Sat, 5 Fri, 4 Thu, 3 Wed, 2 Tue, 1 Mon.
    // So July 1st 2025 is a Monday.
    
    let html = '';
    for (let i = 1; i <= 30; i++) {
        // Calculate day of week
        // 1st is Mon (index 1), so (i + offset) % 7
        // 1 % 7 = 1 (Mon)
        // 10 % 7 = 3 (Wed) -> Correct
        const dayIndex = i % 7; 
        const dayName = days[dayIndex];
        
        // Check if it's the "current" day (10th)
        const isToday = i === 10 ? 'today' : '';
        
        html += `
            <div class="date-item ${isToday}" data-date="${i}">
                <span class="day-name">${dayName}</span>
                <span class="day-num">${i}</span>
            </div>
        `;
    }
    
    dateStrip.innerHTML = html;

    // Scroll Scaling Effect
    const handleScroll = () => {
        const stripCenter = dateStrip.getBoundingClientRect().left + dateStrip.offsetWidth / 2;
        const items = document.querySelectorAll('.date-item');
        
        items.forEach(item => {
            const itemCenter = item.getBoundingClientRect().left + item.offsetWidth / 2;
            const distance = Math.abs(stripCenter - itemCenter);
            
            // Calculate scale based on distance
            // Max scale 1.3 at center, 1.0 at edges
            // Effect range: 150px
            const maxDistance = 150;
            let scale = 1;
            
            if (distance < maxDistance) {
                scale = 1 + (0.3 * (1 - distance / maxDistance));
            }
            
            item.style.transform = `scale(${scale})`;
            item.style.zIndex = scale > 1.1 ? 10 : 1; // Bring scaled items to front
        });
    };

    dateStrip.addEventListener('scroll', handleScroll);
    
    // Initial call to set scales
    // Scroll to the 10th day initially
    const todayItem = document.querySelector('.date-item.today');
    if (todayItem) {
        const scrollPos = todayItem.offsetLeft - (dateStrip.offsetWidth / 2) + (todayItem.offsetWidth / 2);
        dateStrip.scrollLeft = scrollPos;
    }
    
    // Trigger scroll handler once to set initial scales
    handleScroll();
});