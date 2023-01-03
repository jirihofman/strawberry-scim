import React from 'react';
import Test from './connection';

describe('<Test />', () => {
    it('renders', () => {
        cy.mount(<Test />);
    });
});
