# web3 near graph transaction viewer

An app to scroll through blockchain transactions using a near graph api call to fetch data at start and also fetch at an ongoing polling interval. 

Built using react, typescript, styled-components, jest and react-testing-library.

Scaffolded using Create React App.

## scripts

### install
`nvm use`   
`yarn`
`yarn start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### run tests
`yarn test`


### build 
`yarn build`

Builds the app for production to the `build` folder. See CRA docs for more.


## Design Decisions
- I do not filter and sort the transaction data as part of the main fetch because I consider that particular to the view, the TransactionList component e.g. maybe a control would be added to the view to sort differently newest first. There may also in the future be other views which would list all transactions with actions that are function calls. So I prefer to keep the raw transaction list as it was fetched and let consumers filter etc. based on what I know now.
- use of context as data store
- I defined a base type for all Actions which has data and type properties. Then subtypes for Transfer, AddKey and FunctionCall. Action types are discriminated unions so typescript can enforce type checking based on action.type. Based on the data in the api this made most sense to me.
- I made decisions based on the api data available to me which I know is limited.
- errors
  - handle fetch api errors (4/5xx converted to exceptions)
  - message for no transactions displayed
  - 
- sorting of Dates, I create new Date instances as part of sort because for 100 transactions that is not a performance concern. If there were a lot more I would measure performance and consider optimizing.

- not use an enum for method_name in transactions actions (many possible values)
