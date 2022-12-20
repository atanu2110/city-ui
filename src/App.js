import logo from './logo.svg';
import './App.css';
import CityTable from './components/CityTable'
import { StyledEngineProvider } from '@mui/material/styles';
import CityTableV2 from './components/CityTableV2';
import CityDataTable from './components/CityDataTable';

function App() {
  return (
    <div className="App">
     <StyledEngineProvider injectFirst>
      <CityDataTable />
    </StyledEngineProvider>
    </div>
  );
}

export default App;
