## Install dependencies

```
npm install
```

## Set environment variables

```
set mysql url at DATABASE_URL={mysql_url} in .env file
```

Example:

```
mysql://{username}:{password}@url/database?useUnicode=true&characterEncoding=utf8&useSSL=false&useLegacyDatetimeCode=false&serverTimezone=UTC&createDatabaseIfNotExist=true
```

## Run project

```
npm run db:push
npm run db:migrate
npm run dev
```
