import { config } from 'dotenv';
import cleanApp from './cleanApp';

config();

const PORT = process.env.PORT || 3000;

cleanApp.listen(PORT, () => {
  console.log(`Clean Architecture Server running on port ${PORT}`);
});