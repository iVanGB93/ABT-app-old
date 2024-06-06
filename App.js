import Router from "./Router";
import { Provider } from "react-redux";
import { store, persistor } from "./store/store";
import { PersistGate } from 'redux-persist/integration/react';
import * as Sentry from '@sentry/react-native';


Sentry.init({
  dsn: 'https://0465f2b302fe96ed7d78c54fcbfdba64@o4507382623109120.ingest.us.sentry.io/4507382639165440',
  debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
});

function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router />
      </PersistGate>
    </Provider>
  );
}

export default Sentry.wrap(App);