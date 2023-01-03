import { Tabs, Tab } from 'react-bootstrap';
import Header from '../components/header';
import Connection from '../components/connection';
import Groups from '../components/groups';
import Users from '../components/users';
import Advanced from '../components/advanced';

export default function Home() {
    return (
        <div className='container'>
            <Header />
            <Connection />

            <Tabs
                defaultActiveKey="users"
                id="fill-tab-example"
                className="mb-0"
                justify
            >
                <Tab eventKey="users" title="/Users" className='pt-3 border-start border-end'>
                    <Users />
                </Tab>
                <Tab eventKey="groups" title="/Groups" className='pt-3 border-start border-end'>
                    <Groups />
                </Tab>
                <Tab eventKey="advanced" title="Advanced" className='pt-3 border-start border-end'>
                    <Advanced />
                </Tab>
            </Tabs>
        </div>
    );
}

export async function getStaticProps() {
    return {
        props: {}
    };
}
