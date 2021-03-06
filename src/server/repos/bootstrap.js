var pg = require('pg');
var config = new require('../config.js')();

var client = new pg.Client(config.connectionString);
client.connect();

var createUsers = 'CREATE TABLE IF NOT EXISTS ' +
  'users(' +
    'id SERIAL PRIMARY KEY, ' +
    'auth_provider_lookup_id_fkey integer not null references auth_providers_lookup(id), ' +
    'auth_provider_user_id VARCHAR(255) not null, ' + //user designation from auth proivder
    'email_address VARCHAR(255) UNIQUE null, ' +
    'first_name VARCHAR(255) null, ' +
    'last_name VARCHAR(255) null, ' +
    'bio VARCHAR(1024) null, ' +
    'created timestamp default current_timestamp)';

var createAuthProvidersLookup = 'CREATE TABLE IF NOT EXISTS ' +
    'auth_providers_lookup(' +
    'id SERIAL PRIMARY KEY, ' +
    'name VARCHAR(255) UNIQUE not null)'; //ie google, twitter, facebook

var createSessions = 'CREATE TABLE IF NOT EXISTS ' +
  'sessions(' +
    'id SERIAL PRIMARY KEY, ' +
    'user_id_fkey integer references users(id), ' +
    'email_address VARCHAR(255) null, ' +
    'base_access_token VARCHAR(255) UNIQUE not null,' +
    'auth_provider_access_token VARCHAR(255) UNIQUE not null,' +
    'auth_provider_name VARCHAR(255) null,' +
    'auth_provider_user_id VARCHAR(255) null,' +
    'created timestamp default current_timestamp)';

//pull from provider lookup class
var insertAuthProviders = 'insert into auth_providers_lookup (name) VALUES (\'google\')';

var dropAuthProvidersLookup = 'DROP TABLE IF EXISTS auth_providers_lookup';
var dropSessions = 'DROP TABLE IF EXISTS sessions';
var dropUsers = 'DROP TABLE IF EXISTS users';

//execute data bootstrap

//drop tables
client.query(dropSessions);
client.query(dropUsers);
client.query(dropAuthProvidersLookup);

//create and bootstrap tables
client.query(createAuthProvidersLookup);
client.query(createUsers);
client.query(insertAuthProviders);
client.query(createSessions)
  .on('end', function() {
    client.end();
  });
