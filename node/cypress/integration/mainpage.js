
describe('Tests main page', () => {
    const title = "Test";
    const titleedit = "Edited";
    beforeEach(() => {
        //cy.viewport('iphone-x');
        //cy.viewport('samsung-s10');
        cy.viewport('macbook-16');
       // cy.viewport('iphone-6+');
      })
    it('Tests the login', function () {
        const login = "testowekonto"
        const password = "12345678"
        cy.request('POST', '192.168.1.12:3000/api/accounts/login',{
            login,
            password
        }).as('respond')
        cy.get('@respond').should((response) => {

            localStorage.setItem('jwt', response.body.token);

            localStorage.setItem('user', response.body.login);
            
        })
        cy.visit('/')
        cy.get('[data-cy=navbar-username]').should('contain', 'testowekonto')
    })

    it('Tests reviews adding', function () {

        cy.get('[data-cy=post-create]').should('be.visible');
        cy.get('[data-cy=post-create-title]').type(title);
        cy.get('[data-cy=post-create-text]').type(title);
        cy.get('[data-cy=post-create-category]').type(title);
        cy.get('[data-cy=post-create-publish]').contains('Publish').click();
        cy.get('[data-cy=post-global]').click();
        cy.get('[data-cy=post-title]').contains(title).should('be.visible');
    })

    it('Tests reviews editing', function () {

        cy.get('[data-cy='+title+'-options]').should('be.visible').click();
        cy.get('[data-cy='+title+'-edit]').should('be.visible').click();
        cy.get('[data-cy='+title+'-title]').type(titleedit);
        cy.get('[data-cy='+title+'-text]').type(titleedit);
        cy.get('[data-cy='+title+'-category]').type(titleedit);
        cy.get('[data-cy='+title+'-submit]').click();
        cy.get('[data-cy=post-global]').click();
        cy.get('[data-cy=post-title]').contains(title+titleedit).should('be.visible');

    })

    it('Tests reviews deleting', function () {

        cy.get('[data-cy='+title+titleedit+'-options]').should('be.visible').click();
        cy.get('[data-cy='+title+titleedit+'-delete]').should('be.visible').click();
        cy.get('[data-cy=post-global]').click();

    })
})