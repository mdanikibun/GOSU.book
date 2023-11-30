function spawnStars() {
    for (let i = 1; i <= 50; i++) {
        let stars = document.createElement('div');
        stars.classList.add('star');
        let size = Math.random() * 20;
        stars.style.fontSize = 10 + size + 'px';
        stars.style.left = Math.random() * +innerWidth + 'px';
        stars.style.top = Math.random() * +innerHeight + 'px';
        stars.style.filter = `hue-rotate(${i * 50}deg)`;
        document.querySelector('#sec-main-bg').appendChild(stars);
        setTimeout(() => {
            stars.classList.add('opacity-10');
        }, 250);
    }
}

function animateStars() {
    let allStars = document.querySelectorAll('.star');
    let num = Math.floor(Math.random() * allStars.length);
    allStars[num].classList.toggle('animate');
}

spawnStars();
setInterval(animateStars, 50);
setInterval(() => {
    document.querySelectorAll('.star').forEach((e) => {
        e.classList.remove('opacity-10');
        e.classList.add('old-star');
    });
    setTimeout(() => {
        spawnStars();
        document.querySelectorAll('.old-star').forEach(e => e.remove());
    }, 500);
}, 30000);