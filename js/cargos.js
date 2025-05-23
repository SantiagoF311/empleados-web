document.addEventListener('DOMContentLoaded', () => {
  cargarCargos();
  const logoutBtn = document.querySelector('.logout');
  if (logoutBtn) logoutBtn.addEventListener('click', logout);

  // Modal functionality
  const modal = document.getElementById('cargoModal');
  const btn = document.getElementById('nuevoCargoBtn');
  const span = document.querySelector('#cargoModal .close');

  btn.onclick = () => modal.style.display = 'block';
  span.onclick = () => modal.style.display = 'none';

  window.onclick = (event) => {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  };

  // Form submission
  document.getElementById('cargoForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const cargoData = {
      nombre: document.getElementById('nombreCargo').value,
      color: document.getElementById('colorCargo').value,
      descripcion: document.getElementById('descripcionCargo').value
    };

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/cargos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(cargoData)
      });

      if (!response.ok) throw new Error('Error al crear cargo');
      
      modal.style.display = 'none';
      document.getElementById('cargoForm').reset();
      cargarCargos();
    } catch (error) {
      console.error('Error:', error);
      alert('Error al crear el cargo');
    }
  });
});

async function cargarCargos() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No autorizado. Por favor inicia sesión.');
      window.location.href = 'index.html';
      return;
    }

    const response = await fetch('http://localhost:5000/cargos', {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) {
      alert('No autorizado. Inicia sesión de nuevo.');
      localStorage.clear();
      window.location.href = 'index.html';
      return;
    }

    const cargos = await response.json();
    const container = document.getElementById('cargo-list');
    container.innerHTML = '';

    cargos.forEach(cargo => {
      const colorClass = ['green', 'red', 'blue', 'yellow'].includes(cargo.color) ? cargo.color : 'green';

      const card = document.createElement('div');
      card.className = `main-card ${colorClass} cargo`;
      card.innerHTML = `
        <button class="delete-btn" onclick="eliminarCargo('${cargo.id}')">×</button>
        <div class="logo-circle-container">
          <div class="title">${cargo.nombre}</div>
          <div class="logo-circle">🍳</div>
        </div>
        <p class="description">${cargo.descripcion}</p>
        <div class="extra-info">
          <span>Empleados: ${Array.isArray(cargo.Empleados) ? cargo.Empleados.length : 0}</span>
          <button class="mini-btn">Ver más</button>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error('Error al cargar cargos:', error);
    document.getElementById('cargo-list').innerHTML = '<p>Error al cargar los cargos.</p>';
  }
}

async function eliminarCargo(id) {
  if (!confirm('¿Estás seguro de eliminar este cargo?')) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/cargos/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!response.ok) throw new Error('No se pudo eliminar el cargo');
    cargarCargos();
  } catch (error) {
    console.error('Error al eliminar cargo:', error);
    alert('Ocurrió un error al eliminar el cargo.');
  }
}

function logout(event) {
  event.preventDefault();
  localStorage.clear();
  window.location.href = 'index.html';
}