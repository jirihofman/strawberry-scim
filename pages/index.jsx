import { Tabs, Tab } from 'react-bootstrap';
import Header from '../components/header';
import Connection from '../components/connection';
import Groups from '../components/groups';
import Users from '../components/users';

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
                <Tab eventKey="advanced" title="Advanced" disabled className='pt-3 border-start border-end'>
                    <p>
                        TODO TEST SUITE
                    </p>
                    <p>
                        Number of groups: 1
                        Number of users: <input type={'range'} />
                    </p>
                    <p>
                        Actions: create!, update?, delete!
                    </p>
                    <span>curl commands available in modal</span>
                    <span>statistics: total time, number of requests, avg time, number of errors?</span>
                    <ul>
                        <li>✅ Create group</li>
                        <li>🔄 Create x users</li>
                        <li>❌ Update x users</li>
                        <li>⏸ Delete x users</li>
                        <li>⏸ Delete group</li>
                    </ul>
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
