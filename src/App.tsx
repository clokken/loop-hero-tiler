import './App.scss';
import TilerManager from './components/TilerManager';

function App() {
    return (
        <div className="App">
            <TilerManager
                mapWidth={21}
                mapHeight={12}
            />
        </div>
    );
}

export default App;
