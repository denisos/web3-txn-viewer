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
- use of context as data store
- not use an enum for method_name in transactions actions (many possible values)
- I assumed data actions always has a deposit value and a type value but other fields are optional
- errors
  - handle fetch api errors (4/5xx converted to exceptions)
  - message for no transactions displayed
  - 
- 
