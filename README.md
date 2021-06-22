
## Installation

Install with npm

```
npm i -g git+https://github.com/bluevariant/private.heroku_hasura_db_config.git
```
## Usage/Examples

First, you need to config 'heroku' and 'ngrok' cli

```
heroku authorizations:create
```

```
ngrok authtoken yourngrok'sauthtoken
```

and then

```
herokuhasuradbconfig config
```

finally

```
herokuhasuradbconfig
```

or

```
pm2 start "herokuhasuradbconfig" --name AutoHasuraDBConfig
```
## License

[MIT](https://choosealicense.com/licenses/mit/)