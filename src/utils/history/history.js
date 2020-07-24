import { createBrowserHistory } from 'history';

const config = { urlBasename: 'localhost' };

export default createBrowserHistory({
  basename: config.urlBasename || '',
});
