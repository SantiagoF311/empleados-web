async function cargarCargos() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/cargos', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!response.ok) {
      alert('No autorizado. Inicia sesión de nuevo.');
      window.location.href = 'index.html';
      return;
    }

    const cargos = await response.json();
    const container = document.getElementById('cargo-list');
    container.innerHTML = '';

    cargos.forEach(cargo => {
      // Aquí asignamos la clase de color o 'green' por defecto
      const colorClass = ['green', 'red', 'blue', 'yellow'].includes(cargo.color) ? cargo.color : 'green';

      const card = document.createElement('div');
      card.className = `main-card ${colorClass} cargo`;
      card.innerHTML = `
        <div class="logo-circle-container">
          <div class="title">${cargo.nombre}</div>
          <div class="logo-circle">🍳</div>
        </div>
        <p class="description">${cargo.descripcion}</p>
        <div class="extra-info">
          <span>Empleados: ${cargo.empleados.length}</span>
          <button class="mini-btn">Ver más</button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error al cargar cargos:', error);
    document.getElementById('cargo-list').innerHTML =
      '<p>Error al cargar los cargos.</p>';
  }
}
