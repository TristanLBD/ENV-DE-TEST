describe('Account Creation', () => {
    const cypressUser = {
        name: 'Cypress User',
        email: `cypress.user-${Date.now()}@gmail.com`,
        password: 'Password123',
        confirmPassword: 'Password123'
    };

    const uniqueCypressTaskName = `Cypress task ${Date.now()}`;

    it('should show error when passwords do not match', () => {
        cy.visit('/register');

        cy.get('input[name="name"]').type('Wrong Pass');
        cy.get('input[name="email"]').type('wrong@pass.com');
        cy.get('input[name="password"]').type('Password123');
        cy.get('input[name="confirmPassword"]').type('Password321');

        cy.get('button[type="submit"]').click();

        cy.contains('Passwords do not match').should('be.visible');
    });

    it('should create a new account and redirect to dashboard', () => {
        cy.visit('/register');

        // cy.viewport()
        // cy.log('qsd')

        cy.get('h2').should('contain', 'Create your account');
        cy.get('input[name="name"]').type(cypressUser.name);
        cy.get('input[name="email"]').type(cypressUser.email);
        cy.get('input[name="password"]').type(cypressUser.password);
        cy.get('input[name="confirmPassword"]').type(cypressUser.confirmPassword);

        cy.get('button[type="submit"]').click();

        cy.url().should('include', '/dashboard');

        cy.contains('Dashboard').should('be.visible');
    })

    it('should create a new tag', () => {
        cy.login(cypressUser.email, cypressUser.password);

        cy.visit('/tags');
        cy.get('h1').should('contain', 'Tags');
        cy.get('input[name="tag-name"]').type('Cypress Tag');
        cy.get('button[type="submit"]').click();
        cy.contains('Cypress Tag').should('be.visible');
    })

    it('should create a new task', () => {
        cy.login(cypressUser.email, cypressUser.password);

        cy.visit('/dashboard');
        cy.get('button[data-testid="addTaskButton"]').click();

        cy.get('input[data-testid="task-title"]').type(uniqueCypressTaskName);
        cy.get('textarea[data-testid="task-description"]').type('Cypress Task Description');
        cy.get('input[data-testid="task-due-date"]').type('2025-12-31');
        cy.get('select[data-testid="task-priority"]').select('High');
        cy.get('button[type="submit"]').click();
        cy.contains(uniqueCypressTaskName).should("be.visible");
    })

    it("should edit a new task", () => {
        cy.login(cypressUser.email, cypressUser.password);

        cy.visit("/dashboard");

        cy.get('button[data-testid="EditTaskBtn"]').click();
        cy.get('input[data-testid="task-title"]').type(" new");
        cy.get('button[type="submit"]').click();
        cy.contains(uniqueCypressTaskName+" new").should("be.visible");

    });

    // it("should delete a new task", () => {
    //     cy.login(cypressUser.email, cypressUser.password);

    //     cy.visit("/dashboard");

    //     cy.get('button[data-testid="DeleteTaskBtn"]').click();
    //     cy.contains(uniqueCypressTaskName).should("not.be.visible");
    // });

});
