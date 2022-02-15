describe('Login', () => {
    beforeEach(() => {
        //cy.viewport('iphone-x');
        //cy.viewport('samsung-s10');
        cy.viewport('macbook-16');
       // cy.viewport('iphone-6+');
    })
    it('Tests the login', function () {
        const username = "testowekonto"
        const password = "12345678"
        cy.visit('/#/login')
        cy.confirmCaptcha()
        cy.get('input[name=username]').type(username)
        cy.get('input[name=password]').type(`${password}`)
        cy.get('#login-form').submit()
        cy.url().should('include', '/#/')
        cy.get('[data-cy=navbar-username]').contains(username);
        cy.get('[data-cy=navbar-settings]').should('be.visible');
        cy.get('[data-cy=navbar-logout]').should('be.visible');
    })
})

