# NNPTUDM_CUOIKY

## MySQL (Laragon) schema/seed

- Import schema + base seed: `mysql -h 127.0.0.1 -P 3306 -u root apt < db/mysql/apt_schema.sql`
- Import extra seed: `mysql -h 127.0.0.1 -P 3306 -u root apt < db/mysql/apt_seed_extra.sql`

## MongoDB seed (Mongoose)

- Ensure collections + indexes: `npm run db:init`
- Seed sample data: `npm run db:seed`
