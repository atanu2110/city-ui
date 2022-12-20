import React,  { useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { DataGrid, GridCellModes } from '@mui/x-data-grid';
import axios from 'axios';
import TextField from '@mui/material/TextField';

function EditToolbar(props) {
  const { selectedCellParams, cellMode, cellModesModel, setCellModesModel } = props;
  

  const handleSaveOrEdit = () => {
    debugger;
    if (!selectedCellParams) {
      return;
    }
    const { id, field } = selectedCellParams;
    if (cellMode === 'edit') {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.View } },
      });
    } else {
      setCellModesModel({
        ...cellModesModel,
        [id]: { ...cellModesModel[id], [field]: { mode: GridCellModes.Edit } },
      });
    }
  };

  const handleCancel = () => {
    if (!selectedCellParams) {
      return;
    }
    const { id, field } = selectedCellParams;
    setCellModesModel({
      ...cellModesModel,
      [id]: {
        ...cellModesModel[id],
        [field]: { mode: GridCellModes.View, ignoreModifications: true },
      },
    });
  };

  const handleMouseDown = (event) => {
    // Keep the focus in the cell
    event.preventDefault();
  };

  return (
    <Box
      sx={{
        borderBottom: 1,
        borderColor: 'divider',
        p: 1,
      }}
    >
      <Button
        onClick={handleSaveOrEdit}
        onMouseDown={handleMouseDown}
        disabled={!selectedCellParams}
        variant="outlined"
      >
        {cellMode === 'edit' ? 'Save' : 'Edit'}
      </Button>
      <Button
        onClick={handleCancel}
        onMouseDown={handleMouseDown}
        disabled={cellMode === 'view'}
        variant="outlined"
        sx={{ ml: 1 }}
      >
        Cancel
      </Button>
    </Box>
  );
}

EditToolbar.propTypes = {
  cellMode: PropTypes.oneOf(['edit', 'view']).isRequired,
  cellModesModel: PropTypes.object.isRequired,
  selectedCellParams: PropTypes.shape({
    field: PropTypes.string.isRequired,
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  }),
  setCellModesModel: PropTypes.func.isRequired,
};

export default function StartEditButtonGrid() {
  const [selectedCellParams, setSelectedCellParams] = React.useState(null);
  const [cellModesModel, setCellModesModel] = React.useState({});
  const columns = [
    { field: 'name', headerName: 'Name', width: 280, editable: true },
    {
        field: 'photoURL',
        headerName: 'Image',
        width: 250,
        editable: true,
        renderCell: (params) => <img src={params.value} />, // renderCell will render the component
      }
  ];
  const [rows, setRows] = React.useState([])
  const [searched, setSearched] = React.useState("");
  const [searchedVal, setSearchedVal] = React.useState('');
  
  useEffect(() => {
    axios
      .get("http://localhost:8085/api/v1/cities")
      .then((res) => {
        setRows(res.data)
      })
  }, []);

  const requestSearch = (event) => {
    if(event.target.value === '') {
      getCity();
    } else {
      const filteredRows = rows.filter((row) => {
        return row.name.toLowerCase().includes(event.target.value.toLowerCase());
      });
      setRows(filteredRows);
    }  
  };
  

  const getCity = () => {
    axios
      .get("http://localhost:8085/api/v1/cities")
      .then((res) => {
        setRows(res.data)
      })
  };

  const handleCellFocus = React.useCallback((event) => {
    const row = event.currentTarget.parentElement;
    const id = row.dataset.id;
    const field = event.currentTarget.dataset.field;
    setSelectedCellParams({ id, field });
  }, []);

  const cellMode = React.useMemo(() => {
    if (!selectedCellParams) {
      return 'view';
    }
    const { id, field } = selectedCellParams;
    return cellModesModel[id]?.[field]?.mode || 'view';
  }, [cellModesModel, selectedCellParams]);

  const handleCellKeyDown = React.useCallback(
    (params, event) => {
      if (cellMode === 'edit') {
        // Prevents calling event.preventDefault() if Tab is pressed on a cell in edit mode
        event.defaultMuiPrevented = true;
      }
    },
    [cellMode],
  );

  return (
    <div style={{ height: 650, width: '100%' }}>
        <TextField id="outlined-search" label="Search City" type="search" 
      // value={searchedVal}
      onChange={requestSearch}/>
      <DataGrid
        rows={rows}
        columns={columns}
        onCellKeyDown={handleCellKeyDown}
        cellModesModel={cellModesModel}
        onCellModesModelChange={(model) => setCellModesModel(model)}
        components={{
          Toolbar: EditToolbar,
        }}
        componentsProps={{
          toolbar: {
            cellMode,
            selectedCellParams,
            setSelectedCellParams,
            cellModesModel,
            setCellModesModel,
          },
          cell: {
            onFocus: handleCellFocus,
          },
        }}
        experimentalFeatures={{ newEditingApi: true }}
      />
    </div>
  );
}


