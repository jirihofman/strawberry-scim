import React from 'react';
import Test from './users';

describe('<Test />', () => {
    it('renders', () => {
    // see: https://on.cypress.io/mounting-react
        cy.mount(<Test />);
    });
});
