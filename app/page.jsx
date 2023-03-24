'use client';
import { ToastProvider } from '../components/toast-manager';

import { Tabs, Tab } from 'react-bootstrap';
import Header from '../components/header';
import Connection from '../components/connection';
import Groups from '../components/groups';
import Users from '../components/users';
import Advanced from '../components/advanced';

import pjson from '../package.json';

export default function Home() {
    return (
        <ToastProvider>
            <meta name="description" content={pjson.description} />
            <title>{[pjson.displayName].join(' - ')}</title>
            <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-eOJMYsd53ii+scO/bJGFsiCZc+5NDVN2yr8+0RDqr0Ql0h+rP48ckxlpbzKgwra6' crossOrigin='anonymous' />
            <script src='https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta3/dist/js/bootstrap.bundle.min.js' integrity='sha384-JEW9xMcG8R+pH31jmWH6WWP0WintQrMb4s7ZOdauHnUtxwoG2vI5DkLtS3qm9Ekf' crossOrigin='anonymous' />

            <div className='container'>
                <Header />
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
