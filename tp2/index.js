document.querySelector('#darkModeToggle').onclick = function() {
    document.body.classList.toggle('dark-mode');
    
    // Actualizar el texto del botón
    if (document.body.classList.contains('dark-mode')) {
        this.textContent = 'Modo Claro';
        
    } else {
        this.textContent = 'Modo Oscuro';
    }
};
