/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-restricted-syntax */
import { TablePagination } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import React from 'react';

function DataTable({
  rows,
  columns,
  checkboxSelection,
  controller,
  setController,
  paginationData,
  rowHeight,
}) {
  const handleChangeRowsPerPage = event => {
    setController({
      ...controller,
      rowsPerPage: parseInt(event.target.value, 10),
    });
  };
  // links.next
  const handleNext = () => {
    const url = paginationData.links.next;
    const parsedUrl = new URL(url);
    const cursorValue = parsedUrl.searchParams.get('cursor');
    setController(prevState => {
      return { ...prevState, cursor: cursorValue };
    });
  };
  const handlePrev = () => {
    const url = paginationData.links.previous;
    const parsedUrl = new URL(url);
    const cursorValue = parsedUrl.searchParams.get('cursor');
    setController(prevState => {
      return { ...prevState, cursor: cursorValue };
    });
  };

  return (
    <>
      <DataGrid
        rows={rows}
        columns={columns}
        disableColumnSelector
        disableRowSelectionOnClick
        hideFooterPagination
        checkboxSelection={checkboxSelection}
        rowHeight={rowHeight || 60}
        sx={{
          '&, [class^=MuiDataGrid]': {
            border: 'none',
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: 'transparent',
            color: '#737791',
            textTransform: 'uppercase',
            fontSize: '14px',
            borderBottom: '1px solid #F1F1F2',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            fontWeight: '600',
          },
          '& .MuiDataGrid-footerContainer': {
            display: 'none',
          },
          '& .MuiDataGrid-row': {
            borderBottom: '1px solid #F1F1F2',
            '&:last-child': {
              borderBottom: 'none',
            },
          },
          '& .MuiDataGrid-cell': {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px',
            fontSize: '14px',
            fontWeight: 500,
            color: '#1A202C',
            border: 'none',
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none !important',
          },
          '& .MuiDataGrid-cell:last-child': {
            justifyContent: 'center',
          },
        }}
      />
      {paginationData && (
        <TablePagination
          sx={{
            borderTop: '1px solid #F1F1F2',
            '& .MuiTablePagination-spacer': {
              display: 'none',
            },
            '& .MuiTablePagination-toolbar': {
              pt: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
            },
            '& .MuiTablePagination-actions': {
              marginLeft: 'auto',
            },
            '& .MuiTablePagination-input ': {
              marginRight: 'auto !important',
            },
          }}
          rowsPerPageOptions={[10, 20, 30]}
          component='div'
          page={controller.page}
          count={-1}
          rowsPerPage={controller.rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          nextIconButtonProps={{
            disabled: !paginationData?.links?.next,
            onClick: handleNext,
          }}
          backIconButtonProps={{
            disabled: !paginationData?.links?.previous,
            onClick: handlePrev,
          }}
        />
      )}
    </>
  );
}

export default DataTable;
