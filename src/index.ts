import app from './app';
import { appConfig } from './config/config';

const port = appConfig.port;

const server = app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

