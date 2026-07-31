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

// Weather, horoscope and tide display
document.addEventListener('DOMContentLoaded', function() {
    const tempElement = document.getElementById('temp');
    const seasonElement = document.getElementById('season');
    const sunriseElement = document.getElementById('sunrise');
    const sunsetElement = document.getElementById('sunset');
    const luckyNumberElement = document.getElementById('lucky-number');
    const luckyColorElement = document.getElementById('lucky-color');
    const tideLevelElement = document.getElementById('tide-level');

    // Wrap the readings in a track and keep a duplicate alongside it, so the
    // mobile marquee can loop without a visible seam
    const weatherElement = document.getElementById('weather');
    const weatherTrack = document.createElement('div');
    weatherTrack.className = 'weather-track';
    while (weatherElement.firstChild) {
        weatherTrack.appendChild(weatherElement.firstChild);
    }
    weatherElement.appendChild(weatherTrack);

    const weatherTrackClone = document.createElement('div');
    weatherTrackClone.className = 'weather-track weather-track--clone';
    weatherTrackClone.setAttribute('aria-hidden', 'true');
    weatherElement.appendChild(weatherTrackClone);

    function syncMarquee() {
        weatherTrackClone.innerHTML = weatherTrack.innerHTML;
        weatherTrackClone.querySelectorAll('[id]').forEach(function(node) {
            node.removeAttribute('id');
        });
    }

    syncMarquee();

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
    
    // Get horoscope data from Aztro API
    async function getHoroscope() {
        try {
            // Using a default sign (leo) - could be made configurable
            const response = await fetch('https://aztro.sameerkumar.website/?sign=leo&day=today', {
                method: 'POST'
            });
            const data = await response.json();
            return {
                luckyNumber: data.lucky_number,
                luckyColor: data.color
            };
        } catch (error) {
            console.log('Horoscope API unavailable');
            return {
                luckyNumber: Math.floor(Math.random() * 100) + 1,
                luckyColor: ['blue', 'green', 'purple', 'gold', 'silver'][Math.floor(Math.random() * 5)]
            };
        }
    }
    
    // Get tide data (simplified - using London coordinates)
    async function getTideLevel() {
        try {
            // Note: This is a placeholder - WorldTides API requires a key
            // For now, generate a simulated tide level
            const now = new Date();
            const hours = now.getHours();
            const tideHeight = Math.sin((hours / 24) * Math.PI * 2) * 3 + 4; // Simulate 0-7m tide
            return `${tideHeight.toFixed(1)}m`;
        } catch (error) {
            return '--m';
        }
    }
    
    // Initialize display
    async function initializeDisplay() {
        const sunTimes = getSunTimes();
        seasonElement.textContent = getSeasonalInfo();
        tempElement.textContent = getDailyTemp() + '°';
        sunriseElement.textContent = `sunrise: ${sunTimes.sunrise}`;
        sunsetElement.textContent = `sunset: ${sunTimes.sunset}`;
        syncMarquee();

        // Load horoscope data
        const horoscope = await getHoroscope();
        luckyNumberElement.textContent = `lucky: ${horoscope.luckyNumber}`;
        luckyColorElement.textContent = `color: ${horoscope.luckyColor}`;
        
        // Load tide data
        const tideLevel = await getTideLevel();
        tideLevelElement.textContent = `tide: ${tideLevel}`;
        syncMarquee();
    }
    
    initializeDisplay();
});

// Gradient text blur on scroll
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;

    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;

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