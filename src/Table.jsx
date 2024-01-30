import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useTable, useBlockLayout, useResizeColumns, useSortBy } from 'react-table';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import Cell from './cells/Cell';
import Header from './header/Header';
import PlusIcon from './img/Plus';
import { ActionTypes } from './utils';
import { FixedSizeList } from 'react-window';
import scrollbarWidth from './scrollbarWidth';
import clsx from 'clsx';

const defaultColumn = {
  minWidth: 50,
  width: 150,
  maxWidth: 400,
  Cell: Cell,
  Header: Header,
  sortType: 'alphanumericFalsyLast',
};

export default function Table({ columns, data, dispatch: dataDispatch = () => {}, skipReset }) {

  // console.log('Columns:', columns);
  // console.log('Data:', data);
  const sortTypes = useMemo(
    () => ({
      alphanumericFalsyLast(rowA, rowB, columnId, desc) {
        if (!rowA.values[columnId] && !rowB.values[columnId]) {
          return 0;
        }

        if (!rowA.values[columnId]) {
          return desc ? -1 : 1;
        }

        if (!rowB.values[columnId]) {
          return desc ? 1 : -1;
        }

        return isNaN(rowA.values[columnId])
          ? rowA.values[columnId].localeCompare(rowB.values[columnId])
          : rowA.values[columnId] - rowB.values[columnId];
      },
    }),
    []
  );

  // const [columnOrder, setColumnOrder] = useState(columns.map((col) => col.accessor));

  const [columnOrder, setColumnOrder] = useState(
    columns ? columns.map((col) => col.accessor) : []
  );

 
// const moveColumn = useCallback((dragIndex, hoverIndex) => {
//   setColumnOrder((prevOrder) =>
//     update(prevOrder, {
//       $splice: [
//         [dragIndex, 1],
//         [hoverIndex, 0, prevOrder[dragIndex]],
//       ],
//     })
//   );
// }, []);

const moveColumn = useCallback((dragIndex, hoverIndex) => {
  const newOrder = [...columnOrder];
  const [dragged] = newOrder.splice(dragIndex, 1);
  newOrder.splice(hoverIndex, 0, dragged);
  setColumnOrder(newOrder);
  fetch('https://highperformer-server.vercel.app/companies/column-order', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ columnOrder: newOrder.filter(col => col !== undefined) }),
  })
  .then(response => response.json())
  .then(data => {
    console.log('Column order updated on server:', data);
  })
  .catch(error => {
    console.error('Failed to update column order on server:', error);
  });
}, [columnOrder]);

const reorderedColumns = useMemo(() => {
  if (!columns) return []; 

  const orderedColumns = [...columns].sort(
    (a, b) => columnOrder.indexOf(a.accessor) - columnOrder.indexOf(b.accessor)
  );
  return orderedColumns;
}, [columns, columnOrder]);


  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    totalColumnsWidth,
  } = useTable(
    {
      columns: reorderedColumns,
      data,
      defaultColumn,
      dataDispatch,
      autoResetSortBy: !skipReset,
      autoResetFilters: !skipReset,
      autoResetRowState: !skipReset,
      sortTypes,
    },
    useBlockLayout,
    useResizeColumns,
    useSortBy
  );

  const RenderRow = React.useCallback(
    ({ index, style }) => {
      const row = rows[index];
      prepareRow(row);
      return (
        <div {...row.getRowProps({ style })} className="tr">
          {row.cells.map(cell => (
            <div {...cell.getCellProps()} className="td">
              {cell.render('Cell')}
            </div>
          ))}
        </div>
      );
    },
    [prepareRow, rows]
  );

  // const handleColumnOrderChange = (newOrder) => {
  //   // Update state if necessary
  //   setColumnOrder(newOrder);
  
  //   // API call to update column order on server
  //   fetch('/api/updateColumnOrder', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({ columnOrder: newOrder }),
  //   })
  //   .then(response => response.json())
  //   .then(data => {
  //     console.log('Column order updated:', data.message);
  //     // Optionally refetch data to reflect new order
  //   })
  //   .catch(error => {
  //     console.error('Error updating column order:', error);
  //   });
  // };


  function isTableResizing() {
    for (let headerGroup of headerGroups) {
      for (let column of headerGroup.headers) {
        if (column.isResizing) {
          return true;
        }
      }
    }

    return false;
  }
  return (
    <DndProvider backend={HTML5Backend}>
      <div>
        <div style={{ maxWidth: '100vw', overflow: 'auto' }}>
          {columns ? (
            <div {...getTableProps()} className={clsx('table', isTableResizing() && 'noselect')}>
              {headerGroups.map((headerGroup, headerIndex) => (
                <div {...headerGroup.getHeaderGroupProps()} className="tr">
                  {headerGroup.headers.map((column, columnIndex) => (
                    <Header
                      column={column}
                      index={columnIndex}
                      moveColumn={moveColumn}
                    />
                  ))}
                </div>
              ))}
              <div {...getTableBodyProps()}>
                <FixedSizeList
                  height={560}
                  itemCount={rows.length}
                  itemSize={40}
                  width={totalColumnsWidth + scrollbarWidth}
                >
                  {RenderRow}
                </FixedSizeList>
              </div>
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </div>
      </div>
    </DndProvider>
  );
  
  
}
