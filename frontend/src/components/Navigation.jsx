import { Link } from 'react-router-dom';
import { resetDB } from '../api/ResetApi';

function Navigation() {
    const handleReset = async () => {
        if (!window.confirm('Are you sure you want to reset the database?')) return;
        const response = await resetDB();
        if (response.ok) {
            alert('Database reset successfully.');
        } else {
            alert('Failed to reset database.');
        }
    };

    return (
        <nav>
            Navigation:
            <Link to='/'>Home</Link>
            <Link to='/players'>Players</Link>
            <Link to='/games'>Games</Link>
            <Link to='/teams'>Teams</Link>
            <Link to='/playerrecords'>Player Records</Link>
            <Link to='/ranks'>Ranks</Link>
            <button onClick={handleReset} style={{ marginLeft: '15px' }}>
                Reset Database
            </button>
        </nav>
    )
}

export default Navigation;

