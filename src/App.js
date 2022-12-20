import './App.css';
import { StyledEngineProvider } from '@mui/material/styles';
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
