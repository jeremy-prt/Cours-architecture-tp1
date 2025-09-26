import { config } from 'dotenv';
import cqrsApp from './cqrsApp';

config();

const PORT = process.env.PORT || 3000;

cqrsApp.listen(PORT, () => {
  console.log(`CQRS Architecture Server running on port ${PORT}`);
});