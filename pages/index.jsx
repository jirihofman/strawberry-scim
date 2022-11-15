import Header from '../components/header';
import Connection from '../components/connection';
import Groups from '../components/groups';
import Users from '../components/users';
//import Scenario1 from '../components/scenario-1';

export default function Home() {
    return (
        <div className='container'>
            <Header />
            <Connection />

            <div className='accordion mb-2 px-1' id='demo'>
                <div className='accordion-item'>
                    <span className='accordion-header' id='headingUsers'>
                        <button className='accordion-button collapsed' type='button' data-bs-toggle='collapse' data-bs-target='#collapseUsers' aria-expanded='false' aria-controls='collapseUsers'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16" style={{ marginRight: '10px' }}>
                                <path d="M3 14s-1 0-1-1 1-4 6-4 6 3 6 4-1 1-1 1H3Zm5-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                            </svg> Users
                        </button>
                    </span>
                    <div id='collapseUsers' className='accordion-collapse collapse p-3' aria-labelledby='headingUsers' data-bs-parent='#demo'>
                        <Users />
                    </div>
                </div>
                <div className='accordion-item'>
                    <span className='accordion-header' id='headingOne'>
                        <button className='accordion-button' type='button' data-bs-toggle='collapse' data-bs-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-people-fill" viewBox="0 0 16 16" style={{ marginRight: '10px' }}>
                                <path d="M7 14s-1 0-1-1 1-4 5-4 5 3 5 4-1 1-1 1H7Zm4-6a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm-5.784 6A2.238 2.238 0 0 1 5 13c0-1.355.68-2.75 1.936-3.72A6.325 6.325 0 0 0 5 9c-4 0-5 3-5 4s1 1 1 1h4.216ZM4.5 8a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" />
                            </svg> Groups
                        </button>
                    </span>
                    <div id='collapseOne' className='accordion-collapse collapse p-3 show' aria-labelledby='headingOne' data-bs-parent='#demo'>
                        <Groups />
                    </div>
                </div>
            </div>

            {/* <Scenario1 /> */}
        </div>
    );
}

export async function getStaticProps() {
    return {
        props: {}
    };
}
