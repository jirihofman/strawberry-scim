/// <reference types="cypress" />

context('Connection test', () => {
    beforeEach(() => {
        cy.visit('');
        cy.intercept('POST', '/api/scim/test', { statusCode: 200 }).as('test-post');
    });

    it('should test connection', () => {
        cy.get('#test-url').type('https://example.com/api/v1/scim');
        cy.get('#secret-token').type('foobar');
        cy.get('#test button[type="submit"]').click();
        cy.wait('@test-post').its('response.statusCode').should('eq', 200);
    });
});
