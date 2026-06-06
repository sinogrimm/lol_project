/**
 * Names: Hunter Shipman, Rebecca Wang
 * Group: 40
 * Assignment: Project Step 5
 * Description: Text for Home page

 * This react page is our own work.
*/

function Home() {
    return (
        <>
            <h1>Home</h1>
            <div className="homepageDescription">
                <h2>Developer Information</h2>
                <p>Team Members: Hunter Shipman, Rebecca Wang</p>
                <p>Group: 40</p>
                <p>Our site has the following functionalities implemented:</p>
                <ul>
                    <li>reset database</li>
                    <li>create player (M:M Entity Row CREATE)</li>
                    <li>update player (M:M Entity Row UPDATE)</li>
                    <li>delete player (M:M Entity Row DELETE)</li>
                    <li>update playerrecord (M:M relationship/FK UPDATE)</li>
                    <li>create game (M:M CREATE)</li>
                    <ul>
                        <li>create teams (M:M CREATE via create game)</li>
                        <li>create playerrecords (intersection table CREATE via create game)</li>
                    </ul>
                    <li>delete game (M:M relationship Delete)</li>
                    <ul>
                        <li>delete teams (M:M relationship Delete via delete game)</li>
                        <li>delete playerrecords (M:M relationship Delete via delete game)</li>
                    </ul>
                    <li>ability to browse every table and its data</li>
                </ul>
                <hr />

                <h2>Index</h2>
                <ul>
                    <li>Home: Navigation</li>
                    <li>Players: Navigation</li>
                    <li>ViewPlayer: Navigation - Players - View</li>
                    <li>UpdatePlayer: Navigation - Players - Edit</li>
                    <li>Games: Navigation</li>
                    <li>CreateGame: Navigation - Games - Add New Game</li>
                    <li>ViewGame: Navigation - Games - View</li>
                    <li>Teams: Navigation</li>
                    <li>PlayerRecords: Navigation</li>
                    <li>UpdatePlayerRecords: Navigation - PlayerRecords - Edit</li>
                    <li>Ranks: Navigation</li>                  
                </ul>
                
            </div>
        </>
    )
} export default Home;