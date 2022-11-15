import pjson from '../package.json';
import Link from 'next/link';

export default function Header({ children }) {
    return (
        <header>
            <nav className='navbar navbar-expand-lg navbar-light bg-light'>
                <div className='container-fluid'>
                    <a className='navbar-brand' href='#'>🍓 SCIM client</a>
                    <button className='navbar-toggler' type='button' data-bs-toggle='collapse' data-bs-target='#navbarSupportedContent' aria-controls='navbarSupportedContent' aria-expanded='false' aria-label='Toggle navigation'>
                        <span className='navbar-toggler-icon' />
                    </button>
                    <div className='collapse navbar-collapse' id='navbarSupportedContent'>
                        <ul className='navbar-nav me-auto mb-2 mb-lg-0'>
                            <li className='nav-item'><Link href='https://github.com/jirihofman/strawberry-scim'><a className='nav-link' title='GitHub' target='_blank'>GitHub</a></Link></li>
                            <li className='nav-item'><a className='nav-link' title='About' role='button' data-bs-toggle='modal' data-bs-target='#exampleModal'>About</a></li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className='modal fade' id='exampleModal' tabIndex='-1' aria-labelledby='exampleModalLabel' aria-hidden='true'>
                <div className='modal-dialog'>
                    <div className='modal-content'>
                        <div className='modal-header'>
                            <h5 className='modal-title' id='exampleModalLabel'>About 🍓 <code>strawberry-scim</code> client</h5>
                            <button type='button' className='btn-close' data-bs-dismiss='modal' aria-label='Close' />
                        </div>
                        <div className='modal-body'>
                            <section className='px-1'>
                                <h3>Lightweight SCIM client</h3>
                                <p>{pjson.description}</p>
                            </section>
                            <table>
                                <tbody>
                                    <tr>
                                        <th>Version</th>
                                        <td>{pjson.version}</td>
                                    </tr>
                                    <tr>
                                        <th>Author</th>
                                        <td>{pjson.author.name}</td>
                                    </tr>
                                    <tr>
                                        <th>Questions / bugs</th>
                                        <td><a href={pjson.repository.url + '/issues'} target='_blank' rel='noreferrer'>{pjson.name}</a></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className='modal-footer'>
                            <iframe src='https://ghbtns.com/github-btn.html?user=jirihofman&repo=strawberry-scim&type=star&count=true&size=large&v=2' frameBorder='0' scrolling='0' width='170' height='30' title='GitHub' />
                            <iframe src='https://github.com/sponsors/jirihofman/button' title='Sponsor jirihofman' height='35' width='116' style={{ border: 0 }} />
                        </div>
                    </div>
                </div>
            </div>
            {children}
        </header>
    );
}
