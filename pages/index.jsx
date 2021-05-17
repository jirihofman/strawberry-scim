import Header from '../components/header';
import Connection from '../components/connection';
import Groups from '../components/groups';
//import Scenario1 from '../components/scenario-1';

export default function Home() {
    return (
        <div className='container'>
            <Header />
            <Connection />

            <div className='accordion mb-2 px-1' id='demo'>
                <div className='accordion-item'>
                    <span className='accordion-header' id='headingOne'>
                        <button className='accordion-button' type='button' data-bs-toggle='collapse' data-bs-target='#collapseOne' aria-expanded='true' aria-controls='collapseOne'>
                            Groups
                        </button>
                    </span>
                    <div id='collapseOne' className='accordion-collapse collapse show p-3' aria-labelledby='headingOne' data-bs-parent='#demo'>
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
