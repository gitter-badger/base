'use strict'

module.exports = function(){
  console.log('\nCURRENT NODE_ENV: ' + process.env.NODE_ENV + '\n');
  switch(process.env.NODE_ENV){

        case 'development':
            return {
              connectionString: 'postgres://postgres:postgres@localhost:5432/base',
              auth: {
                clientID: '',
                clientSecret: '',
                callbackURL: ''
              }
            };

        case 'test':
            return {
              connectionString: 'postgres://postgres:postgres@localhost:5432/base-test',
              auth: {
                clientID: '',
                clientSecret: '',
                callbackURL: ''
              }
            };

        case 'production':
            return {
              connectionString: 'postgres://postgres:postgres@productionhost.com:5432/base',
              auth: {
                clientID: '',
                clientSecret: '',
                callbackURL: ''
              }
            };

        default:
            return {
              connectionString: 'postgres://postgres:postgres@localhost:5432/base',
              auth: {
                clientID: '',
                clientSecret: '',
                callbackURL: ''
              }
            };
    }

};
