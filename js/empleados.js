document.addEventListener('DOMContentLoaded', () => {
    cargarEmpleados();
  });
  
  async function cargarEmpleados() {
    try {
      // Obtener el token guardado en localStorage
      const token = localStorage.getItem('token');
      console.log('🔐 Token en localStorage:', token);
  
      // Revisar si hay token, si no redirigir al login
      if (!token) {
        alert('No autorizado. Por favor inicia sesión.');
        window.location.href = 'index.html';
        return;
      }
  
      // Mostrar el header que se va a enviar
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      console.log('📤 Headers que se envían:', headers);
  
      // Hacer la petición con el header Authorization
      const response = await fetch('http://localhost:5000/empleados', {
        headers
      });
  
      console.log('📥 Respuesta del servidor:', response);
      console.log('📄 Código de estado:', response.status);
  
      // Si la respuesta es 401 o 403, redirigir al login
      if (response.status === 401 || response.status === 403) {
        alert('No autorizado. Inicia sesión de nuevo.');
        localStorage.clear();
        window.location.href = 'index.html';
        return;
      }
  
      // Procesar la respuesta
      const empleados = await response.json();
      console.log('👥 Datos empleados recibidos:', empleados);
  
      const contenedor = document.getElementById('empleados-list');
      contenedor.innerHTML = '';
  
      empleados.forEach(emp => {
        const card = document.createElement('div');
        card.className = 'main-card empleado';
        card.innerHTML = `
          <div class="status-indicators">
            <div class="status-indicator green ${emp.estado === 'activo' ? 'active' : ''}"></div>
            <div class="status-indicator yellow ${emp.estado === 'pendiente' ? 'active' : ''}"></div>
            <div class="status-indicator red ${emp.estado === 'inactivo' ? 'active' : ''}"></div>
          </div>
          <div class="logo-circle-container">
            <div class="title">${emp.nombre}</div>
            <div class="logo-circle">${emp.icono || '👤'}</div>
          </div>
          <p class="description">${emp.descripcion || 'Sin descripción'}</p>
          <div class="extra-info">
            <span>Área: ${emp.area}</span>
            <span>Turno: ${emp.turno}</span>
            <button class="mini-btn">Ver perfil</button>
          </div>
        `;
        contenedor.appendChild(card);
      });
    } catch (error) {
      console.error('❌ Error al cargar empleados:', error);
      document.getElementById('empleados-list').innerHTML =
        '<p>Error al cargar los empleados.</p>';
    }
  }
  
  function logout(event) {
    event.preventDefault();
    localStorage.clear();
    window.location.href = 'index.html';
  }
  