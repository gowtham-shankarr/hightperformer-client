import React, { useEffect, useReducer, useState } from 'react';
import './style.css';
import Table from './Table';
import {
  randomColor,
  shortId,
  makeData,
  ActionTypes,
  DataTypes,
} from './utils';
import update from 'immutability-helper';
import Sidebar from './layout/Sidebar';
import Header from './layout/Header';
import SubHeader from './layout/SubHeader';
import MainContent from './layout/MainContent';
import SortMenu from './components/SortMenu';
import FilterMenu from './components/FilterMenu';
import { Circles } from 'react-loader-spinner';
function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_OPTION_TO_COLUMN:
      const optionIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      return update(state, {
        skipReset: { $set: true },
        columns: {
          [optionIndex]: {
            options: {
              $push: [
                {
                  label: action.option,
                  backgroundColor: action.backgroundColor,
                },
              ],
            },
          },
        },
      });
    case ActionTypes.ADD_ROW:
      return update(state, {
        skipReset: { $set: true },
        data: { $push: [{}] },
      });
    case ActionTypes.UPDATE_COLUMN_TYPE:
      const typeIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      switch (action.dataType) {
        case DataTypes.NUMBER:
          if (state.columns[typeIndex].dataType === DataTypes.NUMBER) {
            return state;
          } else {
            return update(state, {
              skipReset: { $set: true },
              columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
              data: {
                $apply: data =>
                  data.map(row => ({
                    ...row,
                    [action.columnId]: isNaN(row[action.columnId])
                      ? ''
                      : Number.parseInt(row[action.columnId]),
                  })),
              },
            });
          }
        case DataTypes.SELECT:
          if (state.columns[typeIndex].dataType === DataTypes.SELECT) {
            return state;
          } else {
            let options = [];
            state.data.forEach(row => {
              if (row[action.columnId]) {
                options.push({
                  label: row[action.columnId],
                  backgroundColor: randomColor(),
                });
              }
            });
            return update(state, {
              skipReset: { $set: true },
              columns: {
                [typeIndex]: {
                  dataType: { $set: action.dataType },
                  options: { $push: options },
                },
              },
            });
          }
        case DataTypes.TEXT:
          if (state.columns[typeIndex].dataType === DataTypes.TEXT) {
            return state;
          } else if (state.columns[typeIndex].dataType === DataTypes.SELECT) {
            return update(state, {
              skipReset: { $set: true },
              columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
            });
          } else {
            return update(state, {
              skipReset: { $set: true },
              columns: { [typeIndex]: { dataType: { $set: action.dataType } } },
              data: {
                $apply: data =>
                  data.map(row => ({
                    ...row,
                    [action.columnId]: row[action.columnId] + '',
                  })),
              },
            });
          }
          case 'SET_DATA':
      return {
        ...state,
        data: action.payload.data,
        columns: action.payload.columns,
        skipReset: action.payload.skipReset,
      };
        default:
          return state;
      }
    case ActionTypes.UPDATE_COLUMN_HEADER:
      const index = state.columns.findIndex(
        column => column.id === action.columnId
      );
      return update(state, {
        skipReset: { $set: true },
        columns: { [index]: { label: { $set: action.label } } },
      });
    case ActionTypes.UPDATE_CELL:
      return update(state, {
        skipReset: { $set: true },
        data: {
          [action.rowIndex]: { [action.columnId]: { $set: action.value } },
        },
      });
    case ActionTypes.ADD_COLUMN_TO_LEFT:
      const leftIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      let leftId = shortId();
      return update(state, {
        skipReset: { $set: true },
        columns: {
          $splice: [
            [
              leftIndex,
              0,
              {
                id: leftId,
                label: 'Column',
                accessor: leftId,
                dataType: DataTypes.TEXT,
                created: action.focus && true,
                options: [],
              },
            ],
          ],
        },
      });
    case ActionTypes.ADD_COLUMN_TO_RIGHT:
      const rightIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      const rightId = shortId();
      return update(state, {
        skipReset: { $set: true },
        columns: {
          $splice: [
            [
              rightIndex + 1,
              0,
              {
                id: rightId,
                label: 'Column',
                accessor: rightId,
                dataType: DataTypes.TEXT,
                created: action.focus && true,
                options: [],
              },
            ],
          ],
        },
      });
    case ActionTypes.DELETE_COLUMN:
      const deleteIndex = state.columns.findIndex(
        column => column.id === action.columnId
      );
      return update(state, {
        skipReset: { $set: true },
        columns: { $splice: [[deleteIndex, 1]] },
      });
    case ActionTypes.ENABLE_RESET:
      return update(state, { skipReset: { $set: true } });
    default:
      return state;
  }
}
function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [state, dispatch] = useReducer(reducer, { data: [], columns: [], skipReset: false });
  const [darkTheme, setDarkTheme] = useState(true);

  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const [sortCriteria, setSortCriteria] = useState([]);
  const [filters, setFilters] = useState([]);

  const fetchData = async () => {
    setIsLoading(true); 
    let query = 'https://highperformer-server.vercel.app/companies';

    const queryParams = [];
    if (sortCriteria.length > 0) {
      const sortParam = encodeURIComponent(JSON.stringify(sortCriteria));
      queryParams.push(`sort=${sortParam}`);
    }
    if (filters.length > 0) {
      const filterParam = encodeURIComponent(JSON.stringify(filters));
      queryParams.push(`filters=${filterParam}`);
    }
    query += queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

    try {
      const response = await fetch(query);
      const apiData = await response.json();
      const transformedData = makeData(apiData.companies);
      setData(transformedData.data);
      setColumns(transformedData.columns);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sortCriteria, filters]);

  const toggleTheme = () => {
    setDarkTheme(!darkTheme);
  };

  const handleSortChange = newSortCriteria => {
    setSortCriteria(newSortCriteria);
  };

  const handleFilterChange = newFilters => {
    setFilters(newFilters);
  };

  const defaultColumnOrder = ['id', 'company_name', 'description', 'linkedin', 'domains', 'twitter', 'categories', 'twitter_follower'];

  const [columnOrders, setColumnOrders] = useState(defaultColumnOrder);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    fetchColumnOrderAndData();
  }, []);

  function fetchColumnOrderAndData() {
    fetch('https://highperformer-server.vercel.app/companies/column-order')
      .then(response => response.json())
      .then(data => {
        const initialColumnOrder = data.columnOrder || defaultColumnOrder;
        setColumnOrders(initialColumnOrder); 
        fetchDataBasedOnNewOrder(initialColumnOrder); 
      })
      .catch(error => {
        console.error('Failed to fetch initial column order:', error);
        fetchDataBasedOnNewOrder(defaultColumnOrder);
      });
  }

  function onColumnOrderUpdateSuccess(newColumnOrder) {
    setColumnOrders(newColumnOrder);
    fetchDataBasedOnNewOrder(newColumnOrder);
  }

  function fetchDataBasedOnNewOrder(columnOrder) {
    const apiUrl = `https://highperformer-server.vercel.app/companies?columnOrder=${encodeURIComponent(JSON.stringify(columnOrder))}`;
    fetch(apiUrl)
      .then(response => response.json())
      .then(data => {
        setTableData(data.companies);
      })
      .catch(error => {
        console.error('Failed to fetch data:', error);
      });
  }
  
  return (
    <div className={`flex overflow-hidden h-screen ${darkTheme ? 'dark' : ''}`}>
      <Sidebar toggleTheme={toggleTheme} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <SubHeader />
        <MainContent>
          <div className="flex flex-row p-4">
            <SortMenu onSortChange={handleSortChange} />
            <div className="pipe-symbol"></div>
            <FilterMenu onFilterChange={handleFilterChange} />
          </div>
          {isLoading ? (
             <div className="loader-container">
             <Circles
                  height="30"
                  width="30"
                  color="#4fa94d"
                  ariaLabel="circles-loading"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  />
           </div>
          ) : (
            <Table
              columns={columns}
              data={data}
              dispatch={dispatch}
              skipReset={state.skipReset}
            />
          )}
        </MainContent>
      </div>
      <div id="popper-portal"></div>
    </div>
  );
  
}

export default App;
