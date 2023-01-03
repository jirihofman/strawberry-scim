/// <reference types="cypress" />

context('Advanced', () => {
    beforeEach(() => {
        cy.visit('');
        cy.intercept('POST', '/api/scim/test', { statusCode: 200 }).as('test-post');
        cy.get('#fill-tab-example-tab-advanced').click();
        localStorage.setItem('activeConnection', 'https://example.com/api/v1/scim|foobar');
    });

    it('should run advanced test', () => {

        cy.intercept('POST', '/api/scim/Groups', { statusCode: 200, body: {}}).as('groups-post');
        cy.intercept('POST', '/api/scim/Users', { statusCode: 200, body: {}}).as('users-post');

        cy.log('Checking defaults');
        cy.get('#advanced .input-group-text').should('contain.text', 'Number of users: 02');
        cy.get('#user-update').should('be.checked');
        cy.get('#user-assign').should('be.checked');
        
        cy.log('Running scenario');
        cy.get('#advanced button[type="submit"]').click();
        cy.wait('@groups-post'); // create group
        cy.wait('@users-post'); // create user 2x
        cy.wait('@users-post');
        cy.wait('@groups-post'); // add user 2x
        cy.wait('@groups-post');
        cy.wait('@users-post'); // modify user 2x
        cy.wait('@users-post');
        cy.wait('@users-post'); // delete user 2x
        cy.wait('@users-post');
        cy.wait('@groups-post'); // delete group
    });
});
