describe('BY SELLENS en contenedores y modo MOCK', () => {
  it('registra una venta y muestra el stock actualizado desde otro portal', () => {
    cy.clearLocalStorage();
    cy.visit('/');
    cy.get('#email').type('admin@bysellens.com');
    cy.get('#password').type('demo123');
    cy.get('form').submit();
    cy.contains('.sidebar-item', 'Ventas').click();
    cy.contains('button', 'Nueva venta').first().click();
    cy.get('.venta-modal-panel select').first().select('1');
    cy.get('.venta-product-select select').select('1');
    cy.get('.venta-quantity input').type('{selectall}2').should('have.value', '2');
    cy.contains('.venta-modal-panel button', 'Registrar venta').click();
    cy.get('.venta-modal-panel').should('not.exist');
    cy.window().then(ventana => {
      const datos = JSON.parse(ventana.localStorage.getItem('bysellens_mock_v1')!);
      expect(datos.productos[0].stock).to.eq(18);
      expect(datos.ventas[datos.ventas.length - 1].total).to.eq(36000);
    });
    cy.contains('.sidebar-item', 'Productos').click();
    cy.get('tbody').should('contain', '18');
  });
  for (const [puerto, ruta, texto] of [
    [5174, '/clientes', 'Ana Demo'],
    [5175, '/inventario', 'Labial rosa'],
    [5176, '/productos', 'Labial rosa'],
    [5177, '/ventas', 'Ana Demo'],
  ] as const) {
    it(`abre el portal independiente en ${puerto}`, () => {
      cy.visit(`http://localhost:${puerto}${ruta}`);
      cy.get('#email').type('admin@bysellens.com');
      cy.get('#password').type('demo123');
      cy.get('form').submit();
      cy.location('pathname').should('eq', ruta);
      cy.contains(texto).scrollIntoView().should('be.visible');
    });
  }
  it('protege rutas, inicia sesión y conserva la sesión al navegar entre portales', () => {
    cy.clearLocalStorage();
    cy.visit('/')
    cy.get('#email').type('admin@bysellens.com');
    cy.get('#password').type('demo123');
    cy.get('form').submit();
    cy.location('pathname').should('eq', '/productos');
    cy.contains('Labial rosa').scrollIntoView().should('be.visible');
    cy.get('ion-app').should('exist');
    cy.screenshot('stock-escritorio');
    cy.contains('.sidebar-item', 'Clientes').click();
    cy.location('pathname').should('eq', '/clientes');
    cy.contains('Ana Demo').scrollIntoView().should('be.visible');
    cy.viewport(390, 844);
    cy.screenshot('clientes-movil');
    cy.viewport(1280, 800);
    cy.contains('button', 'Nuevo cliente').click();
    cy.get('.cliente-modal-panel').should('be.visible');
    const alerta = cy.stub();
    cy.on('window:alert', alerta);
    cy.contains('.cliente-modal-panel button', 'Registrar cliente').click();
    cy.then(() => expect(alerta).to.have.been.calledWith('El nombre completo es obligatorio'));
    cy.get('input[placeholder="Ej. María López"]').type('Cliente Cypress');
    cy.get('input[placeholder="Ej. 300 123 4567"]').type('3009876543');
    cy.get('input[placeholder="Ej. cliente@gmail.com"]').type('cypress@example.com');
    cy.get('input[placeholder="Ej. Calle 10 # 15-20"]').type('Calle 20 # 3-10');
    cy.contains('.cliente-modal-panel button', 'Registrar cliente').click();
    cy.get('.cliente-modal-panel').should('not.exist');
    cy.get('input[placeholder="Buscar por nombre, teléfono o correo..."]').type('Cliente Cypress');
    cy.contains('Cliente Cypress').should('be.visible');
    cy.contains('Ana Demo').should('not.exist');
    cy.contains('.sidebar-item', 'Inventario').click();
    cy.location('pathname').should('eq', '/inventario');
    cy.contains('Labial rosa').scrollIntoView().should('be.visible');
    cy.contains('.sidebar-item', 'Ventas').click();
    cy.location('pathname').should('eq', '/ventas');
    cy.get('.sidebar').should('be.visible');
    cy.reload();
    cy.get('.sidebar').should('be.visible');
    cy.contains('button', 'Cerrar sesión').click();
    cy.location('pathname').should('eq', '/login');
    cy.visit('/clientes');
    cy.location('pathname').should('eq', '/login');
  })
})
