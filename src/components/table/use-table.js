import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

export default function useTable(props) {
  const [dense, setDense] = useState(!!props?.defaultDense);

  const [page, setPage] = useState(props?.defaultCurrentPage || 0);

  const [rowsPerPage, setRowsPerPage] = useState(props?.defaultRowsPerPage || 20);

  const onChangeRowsPerPage = useCallback(event => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const onChangeDense = useCallback(event => {
    setDense(event.target.checked);
  }, []);

  const onChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  return {
    dense,
    page,
    rowsPerPage,
    //
    //
    onChangePage,
    onChangeDense,
    onResetPage,
    onChangeRowsPerPage,
    //
    setPage,
    setDense,
    setRowsPerPage,
  };
}
