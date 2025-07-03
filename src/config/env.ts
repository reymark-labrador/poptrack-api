import * as dotenv from 'dotenv';
import { existsSync } from 'fs';
import path from 'path';

const nodeEnv = process.env.NODE_ENV || 'development';
const envPath = path.resolve(process.cwd(), `.env.${nodeEnv}`);

if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
  console.log(`✅ Loaded environment: ${envPath}`);
} else {
  dotenv.config();
  console.warn(`⚠️ ${envPath} not found. Loaded default .env instead.`);
}