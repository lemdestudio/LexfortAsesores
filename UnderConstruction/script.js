const escenario = document.getElementById('escenario');
const reflector = document.getElementById('reflector');

escenario.addEventListener('mousemove', (e) => {
    actualizarLuz(e.clientX, e.clientY);
});

escenario.addEventListener('mouseleave', () => {
    resetearLuz();
});

escenario.addEventListener('touchmove', (e) => {
    if (e.cancelable) {
        e.preventDefault(); 
    }
    const touch = e.touches[0];
    actualizarLuz(touch.clientX, touch.clientY);
}, { passive: false }); 

escenario.addEventListener('touchend', () => {
    resetearLuz();
});

function actualizarLuz(clienteX, clienteY) {
    const x = (clienteX / window.innerWidth) * 100;
    const y = (clienteY / window.innerHeight) * 100;

    reflector.style.background = `radial-gradient(
        circle at ${x}% ${y}%, 
        rgba(255, 255, 255, 0.15) 0%, 
        rgba(0, 0, 0, 0.75) 35%, 
        rgba(0, 0, 0, 0.98) 50%
    )`;
}

function resetearLuz() {
    reflector.style.background = `radial-gradient(
        circle at 50% 50%, 
        rgba(0, 0, 0, 0.1) 0%, 
        rgba(0, 0, 0, 0.85) 60%, 
        rgba(0, 0, 0, 0.98) 100%
    )`;
}