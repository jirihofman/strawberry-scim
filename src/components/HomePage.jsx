import { ToastProvider } from '../components/toast-manager';

import { Tabs, Tab } from 'react-bootstrap';
import Header from '../components/header';
import Connection from '../components/connection';
import Groups from '../components/groups';
import Users from '../components/users';
import Advanced from '../components/advanced';

export default function Home({ packageInfo }) {
    return (
        <ToastProvider>
            <div className='container'>
                <Header packageInfo={packageInfo} />
                <Connection />

                <Tabs
                    defaultActiveKey="users"
                    id="fill-tab-example"
                    className="mb-0"
                    justify
                >
                    <Tab eventKey="users" title={<code style={{ fontSize: '14px' }}>👤 /Users</code>} className='pt-3 border-start border-end'>
                        <Users />
                    </Tab>
                    <Tab eventKey="groups" title={<code style={{ fontSize: '14px' }}>👥 /Groups</code>} className='pt-3 border-start border-end'>
                        <Groups />
                    </Tab>
                    <Tab eventKey="advanced" title={<span style={{ fontSize: '14px' }}>🧪 Advanced</span>} className='pt-3 border-start border-end'>
                        <Advanced />
                    </Tab>
                </Tabs>
            </div>
        </ToastProvider>
    );
}