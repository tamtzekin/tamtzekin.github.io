(function titleScroller(text) {
    document.title = text;
    setTimeout(function () {
        titleScroller(text.substr(1) + text.substr(0, 1));
    }, 500);
}(" -⎽__⎽-⎻⎺⎺⎻-⎽__⎽⸝⎻ᐠ⸜ˎ_ˏ⸝^⸜ˎ_ˏ⸝^⸜ˎ_ˏ⸝ᐟ "));

// Idle/wake effect for timer and tab switching
document.addEventListener('DOMContentLoaded', function() {
    let idleTimer;
    const idleTime = 60000; // 1 minute in milliseconds
    let isIdle = false;
    let isTabHidden = false;
    
    function setIdle() {
        if (!isIdle) {
            document.body.classList.add('page-idle');
            isIdle = true;
        }
    }
    
    function wakeUp() {
        if (isIdle) {
            document.body.classList.remove('page-idle');
            document.body.classList.add('page-wake');
            isIdle = false;
            
            // Remove wake class after animation
            setTimeout(() => {
                document.body.classList.remove('page-wake');
            }, 500);
        }
        resetIdleTimer();
    }
    
    function resetIdleTimer() {
        clearTimeout(idleTimer);
        idleTimer = setTimeout(setIdle, idleTime);
    }
    
    // Handle tab visibility changes
    document.addEventListener('visibilitychange', function() {
        if (document.hidden) {
            // Tab switched away - go to sleep
            isTabHidden = true;
            setIdle();
        } else {
            // Tab is back - but stay asleep until mouse moves
            // Just update the flag, don't wake up yet
            // wakeUp will be triggered by mouse movement
        }
    });
    
    // Start the timer
    resetIdleTimer();
    
    // Listen for mouse activity
    function handleActivity() {
        // Wake up if idle (either from timer or tab switch)
        if (isIdle) {
            if (isTabHidden) {
                isTabHidden = false; // Reset tab hidden flag
            }
            wakeUp();
        }
    }
    
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('mousedown', handleActivity);
    document.addEventListener('click', handleActivity);
    document.addEventListener('scroll', handleActivity);
    document.addEventListener('keypress', handleActivity);
});

// Simple weather display
document.addEventListener('DOMContentLoaded', function() {
    const tempElement = document.getElementById('temp');
    const seasonElement = document.getElementById('season');
    const sunriseElement = document.getElementById('sunrise');
    const sunsetElement = document.getElementById('sunset');
    
    // Get current season
    function getSeasonalInfo() {
        const now = new Date();
        const month = now.getMonth();
        const day = now.getDate();
        
        if ((month === 11 && day >= 21) || month === 0 || month === 1 || (month === 2 && day < 20)) {
            if (month === 11 && day === 21) return 'winter solstice';
            return 'winter';
        } else if ((month === 2 && day >= 20) || month === 3 || month === 4 || (month === 5 && day < 21)) {
            if (month === 2 && day === 20) return 'spring equinox';
            return 'spring';
        } else if ((month === 5 && day >= 21) || month === 6 || month === 7 || (month === 8 && day < 23)) {
            if (month === 5 && day === 21) return 'summer solstice';
            return 'summer';
        } else {
            if (month === 8 && day === 23) return 'autumn equinox';
            return 'autumn';
        }
    }
    
    // Simple sunrise/sunset calculation based on season
    function getSunTimes() {
        const now = new Date();
        const month = now.getMonth();
        
        // Rough sunrise/sunset times by month (for mid-latitudes)
        const sunTimes = {
            0: { sunrise: '07:30', sunset: '17:30' },
            1: { sunrise: '07:15', sunset: '18:00' },
            2: { sunrise: '06:45', sunset: '18:30' },
            3: { sunrise: '06:00', sunset: '19:00' },
            4: { sunrise: '05:30', sunset: '19:30' },
            5: { sunrise: '05:15', sunset: '20:00' },
            6: { sunrise: '05:30', sunset: '20:15' },
            7: { sunrise: '06:00', sunset: '19:45' },
            8: { sunrise: '06:30', sunset: '19:00' },
            9: { sunrise: '07:00', sunset: '18:15' },
            10: { sunrise: '07:30', sunset: '17:30' },
            11: { sunrise: '07:45', sunset: '17:00' }
        };
        return sunTimes[month];
    }
    
    // Generate temperature based on date (same temp all day)
    function getDailyTemp() {
        const today = new Date();
        const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
        const seed = dayOfYear * 9301 + 49297; // Simple pseudo-random based on day
        const random = (seed % 233280) / 233280;
        return Math.round(12 + random * 16); // 12-28°C
    }
    
    // Show season, temperature, sunrise and sunset
    const sunTimes = getSunTimes();
    seasonElement.textContent = getSeasonalInfo();
    tempElement.textContent = getDailyTemp() + '°';
    sunriseElement.textContent = `sunrise: ${sunTimes.sunrise}`;
    sunsetElement.textContent = `sunset: ${sunTimes.sunset}`;
});

// Sticky header scroll effect with gradient text blur
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    const transitionZone = 20; // pixels for smooth transition
    
    // Create morphed header element
    const morphedHeader = document.createElement('div');
    morphedHeader.className = 'header-morphed';
    morphedHeader.innerHTML = header.innerHTML;
    document.body.appendChild(morphedHeader);
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const startPoint = headerHeight - transitionZone;
        const endPoint = headerHeight;
        
        // Update all text elements with gradient blur based on scroll position
        const textElements = document.querySelectorAll('.page > span, .page > h3, .page > li, .page > p');
        
        textElements.forEach((element, index) => {
            const elementTop = element.offsetTop;
            const distanceBehindHeader = scrollY - elementTop + headerHeight;
            
            if (scrollY >= headerHeight && distanceBehindHeader > 0) {
                // Calculate blur intensity - max blur when element reaches top of viewport
                const blurIntensity = Math.min(distanceBehindHeader / 50, 4.5); // Max 4.5px blur, faster progression
                element.style.filter = `blur(${blurIntensity}px)`;
            } else {
                element.style.filter = 'blur(0px)';
            }
        });
        
        // Handle header dissolve effect with smooth scroll-aligned transitions
        const progress = Math.max(0, Math.min(1, (scrollY - startPoint) / transitionZone));
        
        // Original header fades out as you scroll
        header.style.opacity = Math.max(0, 1 - (scrollY / headerHeight));
        
        // Morphed header fades in as you scroll (delayed start)
        const morphedProgress = Math.max(0, Math.min(1, (scrollY - headerHeight * 0.5) / (headerHeight * 0.8)));
        morphedHeader.style.opacity = morphedProgress * 0.8;
    });
});

load = (page) => {
    parent.parent.location.hash = page;
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        var mainpage = parent.frames["main"];
        mainpage.location.href=page;
        return;
    } else {
        parent.document.getElementById('frameSet1').cols = "20%,*,20%"; 
        parent.document.getElementById('frameSet3').rows = "65%,*";
        var mainpage = parent.frames["related"];
        mainpage.location.href="related.html";
        var mainpage = parent.frames["main"];
        mainpage.location.href=page;
    }
}