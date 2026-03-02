(function titleScroller(text) {
    document.title = text;
    setTimeout(function () {
        titleScroller(text.substr(1) + text.substr(0, 1));
    }, 500);
}(" -⎽__⎽-⎻⎺⎺⎻-⎽__⎽⸝⎻ᐠ⸜ˎ_ˏ⸝^⸜ˎ_ˏ⸝^⸜ˎ_ˏ⸝ᐟ "));

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