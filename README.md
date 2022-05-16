# web3 near graph transaction viewer

An app to scroll through blockchain transactions using a near graph api call to fetch data at start and also fetch at an ongoing polling interval. 

Built using react, typescript, styled-components, jest and react-testing-library.

Scaffolded using Create React App.

## scripts

### install
`nvm use`   

`yarn`

### run
`yarn start`

Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### run tests
`yarn test`


### build 
`yarn build`

Builds the app for production to the `build` folder. See CRA docs for more.


## Design Decisions for this App
- I made decisions based on the api data available to me (which I know is limited) and requirements.
- I do not filter and sort the transaction data as part of the main fetch because I consider that particular to the view, the TransactionList component e.g. maybe a control would be added to that view to sort differently newest first. There may also in the future be other views which would list all transactions with actions that are function calls. So I prefer to keep the raw transaction list as it was fetched and let consumers filter etc. 
- I used react context as container to fetch and share transactions state. I could also have used a hook but I think context and provider allow sharing common data and logic for this and future views.
- if I had more time I would refactor the context to use a reducer and dispatch actions instead of multiple useStates. 
- I defined a base type for all Actions which has data and type properties. Then subtypes for Transfer, AddKey and FunctionCall. Action types are discriminated unions so typescript can enforce type checking based on action.type property. Based on the data in the api this made most sense to me.
- errors
  - handle fetch api errors (status not ok and 4/5xx converted to exceptions)
  - message for no transactions displayed
  - async operations wrapped in try catches
  - added an error threshold for polling so that some polling errors are ignored but if enough occur in sequence then the error state is toggled on and error displayed in the ui
- sorting of Dates, I create new Date instances as part of sort because for 100 transactions that is not a performance concern (though I do memoize the result). If there were a lot more transactions I would measure performance and consider optimizing.
- I did not use a union for method_name in transactions actions (many possible values, probably some dynamic)
- Next and Previous buttons are displayed but disabled when appropriate
- I created a simple theme for sharing across components
- I used a css reset styled-normalize
- I used my own npm library https://www.npmjs.com/package/fwap for fetching data and converting 4/5xx errors to exceptions. Imo for a take home exercise like this it's fine, but for Production code I would review with teams standards and consider alternatives.
- I used https://github.com/MikeMcl/bignumber.js (over 5.5k stars) to handle scaling deposit to factor 24 and avoid loss of precision (https://mikemcl.github.io/bignumber.js/) because a javascript number only keeps about 17 decimal places of precision and arithmetic is subject to rounding.
- polling happens every 20 seconds but state in context is only updated if there are new transactions (thus avoiding unnecessary rerenders). For that check I simply check lists lengths, but would do something more complete in a real case (such as comparing most recent transactions). As mentioned added error threshold for polling.
