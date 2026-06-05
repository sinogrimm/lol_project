

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
                    <li>create player (M:M Create)</li>
                    <li>update player(M:M Update)</li>
                    <li>delete player (M:M Delete)</li>
                    <li>update playerrecord (M:M relationship/FK Update)</li>
                    <li>delete game (M:M relationship Delete)</li>
                    <li>ability to see every table and its data</li>
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