/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:8AdKDmCkXt7q@ep-lively-frog-a5kz967t.us-east-2.aws.neon.tech/AI-interview-mocker?sslmode=require',
    }
  };