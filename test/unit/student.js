/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect = require('chai').expect;
var Student = require('../../app/models/student');
var dbConnect = require('../../app/lib/mongodb');
var Mongo = require('mongodb');
var s1;

describe('Student', function(){
  before(function(done){
    dbConnect('grader-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Student.collection.remove(function(){
      var o = {name:'Sara', color:'purple'};
      s1 = new Student(o);
      s1.insert(function(){
        done();
      });
    });
  });

  describe('constructor', function(){
    it('should create a new Student object', function(){
      var o = {name:'Bob', color:'pink'};
      var bob = new Student(o);

      expect(bob).to.be.instanceof(Student);
      expect(bob.name).to.equal('Bob');
      expect(bob.color).to.equal('pink');
      expect(bob.tests).to.have.length(0);
    });
  });

  describe('#insert', function(){
    it('should insert a student', function(done){
      var o = {name:'Bob', color:'pink'};
      var bob = new Student(o);
      bob.insert(function(){
        expect(bob._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('#addTest', function(){
    it('should add a test to a student', function(done){
      var o = {name:'Bob', color:'pink'};
      var bob = new Student(o);
      bob.insert(function(){
        bob.addTest(89, function(){
          expect(bob.tests).to.have.length(1);
          done();
        });
      });
    });
  });

  describe('-#average', function(){
    it('should compute average', function(){
      var o = {name:'Bob', color:'pink'};
      var bob = new Student(o);
      bob.tests.push(55, 89, 101, 34, 75);
      expect(bob.average).to.be.closeTo(70.8, 0.1);
    });
  });

  describe('-#letter', function(){
    it('should compute letter', function(){
      var o = {name:'Bob', color:'pink'};
      var bob = new Student(o);
      bob.tests.push(55, 89, 101, 34, 75);
      expect(bob.letter).to.equal('C');
    });
  });

  describe('-#isSuspended', function(){
    it('should not be suspended', function(){
      var o = {name:'Bob', color:'pink'};
      var bob = new Student(o);
      bob.tests.push(55, 89, 101, 34, 75);
      expect(bob.isSuspended).to.be.false;
    });

    it('should be suspended', function(){
      var o = {name:'Bob', color:'pink'};
      var bob = new Student(o);
      bob.tests.push(55, 40, 101, 34, 75);
      expect(bob.isSuspended).to.be.true;
    });
  });

  describe('-#isHonorRoll', function(){
    it('should not be on honor roll', function(){
      var o = {name:'Bob', color:'pink'};
      var bob = new Student(o);
      bob.tests.push(55, 40, 101, 34, 75);
      expect(bob.isHonorRoll).to.be.false;
    });

    it('should be on honor roll', function(){
      var o = {name:'Bob', color:'pink'};
      var bob = new Student(o);
      bob.tests.push(95, 89, 101, 94, 97);
      expect(bob.isHonorRoll).to.be.true;
    });
  });

  describe('.all', function(){
    it('should get all students from database', function(done){
      Student.all(function(students){
        expect(students).to.have.length(1);
        expect(students[0]).to.be.instanceof(Student);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a student by its id', function(done){
      Student.findById(s1._id.toString(), function(student){
        expect(student.name).to.equal('Sara');
        expect(student).to.be.instanceof(Student);
        done();
      });
    });
  });
});

