'use strict'
import winston from 'winston';
import Chai from 'chai';
var assert = Chai.assert;
import appRoot from 'app-root-path';

var UserRepository = require(appRoot + '/src/server/repos/user-repository.js');
var RandomizerService = require(appRoot + '/src/server/services/randomizer-service.js');
var ProviderLookup = require(appRoot + '/src/server/auth/provider-lookup.js');
var config = require(appRoot + '/src/server/config.js');

describe('user repository', function(){

  before(function(done){
    global.Config = new config();
    winston.level = 'debug';
    done();
  });

  describe('getUser', function(){
    it('should get no user', function(done){

      var randomizer = new RandomizerService();
      var test_token = randomizer.getRandomUUIDv4();
      var userRepo = new UserRepository();
      userRepo.getUser(ProviderLookup.Google, test_token)
      .then(function(user){
          assert.isNull(user, 'user is null');
          done();
      }).catch(function(err){
        done(err);
      });
    })
  });

  describe('createUser', function(){
    it('should return newly inserted user row or an existing user row', function(done){

      var randomizer = new RandomizerService();
      var mockProviderId = randomizer.getRandomUUIDv4();
      var userRepo = new UserRepository();
      userRepo.createUser(ProviderLookup.Google, mockProviderId)
        .then(function(createdUser){
            winston.log('debug', JSON.stringify(createdUser));
            assert.isDefined(createdUser, 'there was a user created');
            done();
        }).catch(function(err){
          done(err);
        });
    })
  });


  describe('updateUser', function(){
    it('should update user, and return the updated user', function(done){

      var randomizer = new RandomizerService();
      var mockProviderId = randomizer.getRandomUUIDv4();
      var userRepo = new UserRepository();

      var mockEmail = randomizer.getRandomUUIDv4();
      var mockFirstName = randomizer.getRandomUUIDv4();
      var mockLastName = randomizer.getRandomUUIDv4();

      userRepo.createUser(ProviderLookup.Google, mockProviderId)
        .then(function(users){
            return userRepo.updateUser(mockEmail, mockFirstName, mockLastName, ProviderLookup.Google, mockProviderId);
        }).then(function(updateduser){
            winston.log('debug', JSON.stringify(updateduser));
            assert.equal(mockEmail, updateduser.emailAddress);
            assert.equal(mockFirstName, updateduser.firstName);
            assert.equal(mockLastName, updateduser.lastName);
            done();
        }).catch(function(err){
          done(err);
        });
    })
  });
});
