/// <reference types="cypress" />

context('Connection test', () => {

    it('should fail without secret token or SCIM endpoint', () => {
        cy.request({
            url: '/api/scim/test', method: 'POST', failOnStatusCode: false
        }).should((response) => {
            expect(response.status).to.eq(400);
        });

        cy.request({
            url: '/api/scim/test', method: 'POST', failOnStatusCode: false,
            body: {
                secretToken: 'foo'
            },
        }).should((response) => {
            expect(response.status).to.eq(400);
        });

        cy.request({
            url: '/api/scim/test', method: 'POST', failOnStatusCode: false,
            body: {
                url: 'foo.bar'
            },
        }).should((response) => {
            expect(response.status).to.eq(400);
        });
    });
});
