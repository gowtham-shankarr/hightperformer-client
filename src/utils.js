export function shortId() {
  return '_' + Math.random().toString(36).substr(2, 9);
}

export function randomColor() {
  return `hsl(${Math.floor(Math.random() * 360)}, 95%, 90%)`;
}

export function makeData(companies) {
  // let data = [];
  // let options = [];

  // companies.forEach((company) => {
  //   let row = {
  //     ID: company.id, // Replace with actual ID if available
  //     firstName: company.firstName, // Adjust these as per your actual data
  //     lastName: company.lastName,
  //     email: company.email,
  //     age: company.age, // Assuming age is part of your company data
  //     music: company.music, // Replace with actual field if available
  //   };
  //   options.push({ label: row.music, backgroundColor: randomColor() });

  //   data.push(row);
  // });

  const data = companies.map(company => ({
    ID: company.id,
    company_name: company.company_name,
    description: company.description,
    linkedin: company.linkedin,
    domains: company.domains,
    twitter: company.twitter,
    categories: company.categories,
    twitter_follower: company.twitter_follower,
  }));
  

  // options = options.filter(
  //   (a, i, self) => self.findIndex(b => b.label === a.label) === i
  // );

  let columns = [
    {
      id: 'company_name',
      label: 'Company Name',
      accessor: 'company_name',
      minWidth: 150,
      dataType: DataTypes.TEXT,
      options: [],
    },
    {
      id: 'description',
      label: 'Description',
      accessor: 'description',
      minWidth: 200,
      dataType: DataTypes.TEXT,
      options: [],
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      accessor: 'linkedin',
      minWidth: 150,
      dataType: DataTypes.TEXT,
      options: [],
    },
    {
      id: 'domains',
      label: 'Domains',
      accessor: 'domains',
      minWidth: 150,
      dataType: DataTypes.TEXT,
      options: [],
    },
    {
      id: 'twitter',
      label: 'Twitter',
      accessor: 'twitter',
      minWidth: 150,
      dataType: DataTypes.TEXT,
      options: [],
    },
    {
      id: 'categories',
      label: 'Categories',
      accessor: 'categories',
      minWidth: 150,
      dataType: DataTypes.TEXT,
      options: [],
    },
    {
      id: 'twitter_follower',
      label: 'Twitter Followers',
      accessor: 'twitter_follower',
      minWidth: 150,
      dataType: DataTypes.NUMBER,
      options: [],
    },
  ];
  return { columns: columns, data: data, skipReset: false };
}

export const ActionTypes = Object.freeze({
  ADD_OPTION_TO_COLUMN: 'add_option_to_column',
  ADD_ROW: 'add_row',
  UPDATE_COLUMN_TYPE: 'update_column_type',
  UPDATE_COLUMN_HEADER: 'update_column_header',
  UPDATE_CELL: 'update_cell',
  ADD_COLUMN_TO_LEFT: 'add_column_to_left',
  ADD_COLUMN_TO_RIGHT: 'add_column_to_right',
  DELETE_COLUMN: 'delete_column',
  ENABLE_RESET: 'enable_reset',
});

export const DataTypes = Object.freeze({
  NUMBER: 'number',
  TEXT: 'text',
  SELECT: 'select',
});

export const Constants = Object.freeze({
  ADD_COLUMN_ID: 999999,
});
