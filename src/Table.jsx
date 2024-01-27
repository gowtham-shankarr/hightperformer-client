import React, { useMemo, useState, useCallback } from 'react';
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
import SortMenu from './components/SortMenu';
import FilterMenu from './components/FilterMenu';
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

  const [columnOrder, setColumnOrder] = useState(columns.map((col) => col.accessor));

 
const moveColumn = useCallback((dragIndex, hoverIndex) => {
  setColumnOrder((prevOrder) =>
    update(prevOrder, {
      $splice: [
        [dragIndex, 1],
        [hoverIndex, 0, prevOrder[dragIndex]],
      ],
    })
  );
}, []);

  const reorderedColumns = useMemo(() => {
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

  function handleSortChange (sortOption) {
    console.log(sortOption)
  }

  function handleFilterChange(searchTerm) {
    console.log(searchTerm)
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div>
      <div className="flex flex-row p-4">
      <SortMenu onSortChange={handleSortChange} ></SortMenu>
      <div className="pipe-symbol"></div>
      <FilterMenu onFilterChange={handleFilterChange}></FilterMenu>
      </div>
        <div style={{ maxWidth: '100vw', overflow: 'auto' }}>
          <div {...getTableProps()}
        className={clsx('table', isTableResizing() && 'noselect')}>
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
            height={480}
            itemCount={rows.length}
            itemSize={40}
            width={totalColumnsWidth + scrollbarWidth}
          >
            {RenderRow}
          </FixedSizeList>
          <div
            className="tr add-row"
            onClick={() => dataDispatch({ type: ActionTypes.ADD_ROW })}
          >
            <span className="svg-icon svg-gray icon-margin">
              <PlusIcon />
            </span>
            New
          </div>
        </div>
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
