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

// Sticky header scroll effect with gradient text blur
document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    const headerHeight = header.offsetHeight;
    const transitionZone = 20; // pixels for smooth transition
    
    window.addEventListener('scroll', function() {
        const scrollY = window.scrollY;
        const startPoint = headerHeight - transitionZone;
        const endPoint = headerHeight;
        
        // Update all text elements with gradient blur based on scroll position
        const textElements = document.querySelectorAll('.page > span, .page > h3, .page > li');
        
        textElements.forEach((element, index) => {
            const elementTop = element.offsetTop;
            const distanceBehindHeader = scrollY - elementTop + headerHeight;
            
            if (scrollY >= headerHeight && distanceBehindHeader > 0) {
                // Calculate blur intensity based on how far behind header the element is
                const blurIntensity = Math.min(distanceBehindHeader / 100, 3); // Max 3px blur
                element.style.filter = `blur(${blurIntensity}px)`;
            } else {
                element.style.filter = 'blur(0px)';
            }
        });
        
        // Handle header color change
        if (scrollY <= startPoint) {
            header.classList.remove('scrolled');
        } else if (scrollY >= endPoint) {
            header.classList.add('scrolled');
        } else {
            const progress = (scrollY - startPoint) / transitionZone;
            const easedProgress = 1 - Math.pow(1 - progress, 3);
            
            if (easedProgress > 0.5) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
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