import Header from './header';
import pjson from '../package.json';

describe('<Header />', { viewportWidth: 1024 }, () => {
    it('renders', () => {
        cy.mount(<Header />);
        cy.contains('GitHub');
        cy.contains('About').click();
        cy.contains(pjson.description);
        cy.contains(pjson.version);
        cy.contains(pjson.author.name);
    });
});
