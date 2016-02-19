// Copyright (c) 2016 SYSTRAN S.A.

var fs = require('fs');
var path = require('path');
var setup = require('../setup');

var corpusId;
function getCorpusId(cb) {
  if (corpusId) {
    cb(null, corpusId);
    return;
  }

  var prefix = 'nodejsClientTest';
  var result = setup.resourcesClient.getResourcesCorpusList({prefix: prefix});
  setup.parseResponse(result, function(err, res, body) {
    if (err) {
      cb(err);
      return;
    }

    if (!body || !body.files || !body.files.length) {
      cb();
      return;
    }

    corpusId = body.files[0].id;
    cb(null, corpusId);
  });
}

function cleanup(done) {
  // delete test corpus
  var prefix = 'nodejsClientTest';
  var result = setup.resourcesClient.getResourcesCorpusList({prefix: prefix});
  setup.parseResponse(result, function(err, res, body) {
    if (err) {
      console.error('Unable to get the list of corpus');
      done(err);
      return;
    }

    var corpusIds = [];
    if (body && body.files && body.files.length) {
      body.files.forEach(function(corpus) {
        if (corpus && corpus.id)
          corpusIds.push(corpus.id);
      });
    }

    if (!corpusIds.length) {
      console.log('Fresh environment!');
      done();
      return;
    }

    var result = setup.resourcesClient.postResourcesCorpusDelete({corpusId: corpusIds});
    setup.parseResponse(result, function(err) {
      if (err) {
        console.error('Unable to delete corpus', corpusIds);
        done(err);
      }
      else {
        console.log('Clean up successfully');
        done();
      }
    });
  });
}

describe('Corpus', function() {
  this.timeout(10000);

  before(cleanup);
  after(cleanup);

  describe('Get api version', function() {
    it('should get api version without error', function(done) {
      var result = setup.resourcesClient.getResourcesApiVersion();
      setup.parseResponse(result, done);
    });
  });

  describe('Add a new empty corpus', function() {
    it('should add a new empty corpus', function(done) {
      var lang = 'en';
      var name = 'nodejsClientTestAddCorpus';
      var result = setup.resourcesClient.postResourcesCorpusAdd({lang: lang, name: name});
      setup.parseResponse(result, function(err, res, body) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!body || !body.corpus || !body.corpus.id) {
          done(new Error('Unexpected response'));
          return;
        }

        corpusId = body.corpus.id;
        done();
      });
    });
  });

  describe('Import a corpus', function() {
    it('should add a new corpus from an existing corpus by input string', function(done) {
      var name = 'nodejsClientTestImportCorpus';
      var input = '#TM\n' +
        '#EN\tFR\n' +
        'This is a test \t Ceci est un test';
      var format = 'text/bitext';
      var result = setup.resourcesClient.postResourcesCorpusImport({name: name, input: input, format: format});
      setup.parseResponse(result, done);
    });

    it('should add a new corpus from an existing corpus by input file', function(done) {
      var name = 'nodejsClientTestFileImport';
      var inputFile = fs.createReadStream(path.join(__dirname, 'corpus.txt'));
      var format = 'text/bitext';
      var result = setup.resourcesClient.postResourcesCorpusImport({name: name, inputFile: inputFile, format: format});
      setup.parseResponse(result, done);
    });
  });

  describe('List corpus', function() {
    it('should get the list of available corpus', function(done) {
      var result = setup.resourcesClient.getResourcesCorpusList();
      setup.parseResponse(result, done);
    });

    it('should get the list of corpus with specific prefix', function(done) {
      var prefix = 'nodejsClientTest';
      var result = setup.resourcesClient.getResourcesCorpusList({prefix: prefix});
      setup.parseResponse(result, done);
    });
  });

  describe('Corpus exists', function() {
    it('should verify if an corpus exists without error', function(done) {
      var name = 'nodejsClientTestAddCorpus';
      var result = setup.resourcesClient.getResourcesCorpusExists({name: name});
      setup.parseResponse(result, done);
    });
  });

  describe('Detail Corpus', function() {
    it('should get information about a specific corpus', function(done) {
      getCorpusId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No corpus found to get detail information');
          done();
          return;
        }

        var result = setup.resourcesClient.getResourcesCorpusDetails({corpusId: id});
        setup.parseResponse(result, done);
      });
    });
  });

  describe('Update Corpus', function() {
    it('should update a corpus without error', function(done) {
      getCorpusId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No corpus found to update');
          done();
          return;
        }

        var name = 'nodejsClientTestUpdatedName';
        var result = setup.resourcesClient.postResourcesCorpusUpdate({corpusId: id, name: name});
        setup.parseResponse(result, done);
      });
    });
  });

  describe('Export Corpus', function() {
    it('should get corpus content and then save to a file', function(done) {
      getCorpusId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No corpus found to export');
          done();
          return;
        }

        var result = setup.resourcesClient.getResourcesCorpusExport({corpusId: id});
        var rawData = true;
        setup.parseResponse(result, rawData, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          fs.writeFile(path.join(__dirname, 'exportedCorpus.xml'), body, function(err) {
            if (err) {
              done(new Error(err));
              return;
            }

            console.log('Exported Corpus content saved in :', path.join(__dirname, 'exportedCorpus.xml'));
            done();
          });
        });
      });
    });

    it('should export corpus content with expected format', function(done) {
      getCorpusId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No corpus found to export');
          done();
          return;
        }

        var format = 'text/bitext';
        var result = setup.resourcesClient.getResourcesCorpusExport({corpusId: id ,format: format});
        var rawData = true;
        setup.parseResponse(result, rawData, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          fs.writeFile(path.join(__dirname, 'exportedCorpus.txt'), body, function(err) {
            if (err) {
              done(new Error(err));
              return;
            }

            console.log('Exported Corpus content saved in :', path.join(__dirname, 'exportedCorpus.txt'));
            done();
          });
        });
      });
    });
  });

  describe('Corpus Match', function() {
    it('should match some inputs with a list of corpus', function(done) {
      var prefix = 'nodejsClientTest';
      var source = 'en';
      var target = 'fr';
      var result = setup.resourcesClient.getResourcesCorpusList({prefix: prefix, sourceLang: source, targetLang: target});
      setup.parseResponse(result, function(err, res, body) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!body || !body.files || !body.files.length || !body.files[0]) {
          console.warn('No corresponding corpus found for match operation');
          done();
          return;
        }

        var id = body.files[0].id;
        var inputs = ['This is a test', 'This is a beautiful house'];
        var result = setup.resourcesClient.getResourcesCorpusMatch({corpusId: [id], sourceLang: source, targetLang: target, input: inputs});
        setup.parseResponse(result, done);
      });
    });
  });

  describe('Add Corpus segments', function() {
    it('should add segments in a specific corpus', function(done) {
      getCorpusId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No corpus found to add segments');
          done();
          return;
        }

        var body = {
          corpusId: id,
          segments: [
            {
              lang: 'en',
              source: 'This is a beautiful house',
              targets: [
                {
                  lang: 'fr',
                  target: 'C\'est une belle maison'
                }
              ]
            }
          ]
        };
        var result = setup.resourcesClient.postResourcesCorpusSegmentAdd({body: body});
        setup.parseResponse(result, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          if (!body || !body.segments || !body.segments.length || !body.segments[0]) {
            done(new Error('Unexpected response'));
            return;
          }

          done();
        });
      });
    });
  });

  describe('List Corpus segments', function() {
    it('should get the list of segments in a specific corpus', function(done) {
      getCorpusId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No corpus found to list segments');
          done();
          return;
        }

        var result = setup.resourcesClient.getResourcesCorpusSegmentList({corpusId: id});
        setup.parseResponse(result, done);
      });
    });
  });

  describe('Update Corpus segments', function() {
    it('should update the source of a specific segment', function(done) {
      getCorpusId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No corpus found to update segment');
          done();
          return;
        }

        var result = setup.resourcesClient.getResourcesCorpusSegmentList({corpusId: id});
        setup.parseResponse(result, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          if (!body || !body.segments || !body.segments.length || !body.segments[0]) {
            console.warn('No segment found to update');
            done();
            return;
          }

          var segment = body.segments[0];
          var segId = segment.id;
          var source = 'This is a very beautiful house';
          var result = setup.resourcesClient.postResourcesCorpusSegmentUpdate({corpusId: id, segId: segId, source: source});
          setup.parseResponse(result, done);
        });
      });
    });

    it('should update a target of a specific segment', function(done) {
      getCorpusId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No corpus found to update segment');
          done();
          return;
        }

        var result = setup.resourcesClient.getResourcesCorpusSegmentList({corpusId: id});
        setup.parseResponse(result, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          if (!body || !body.segments || !body.segments.length || !body.segments[0]) {
            console.warn('No segment found to update target');
            done();
            return;
          }

          var segment = body.segments[0];
          if (!segment.targets || !segment.targets.length || !segment.targets[0]) {
            console.warn('No target found to update');
            done();
            return;
          }

          var segId = segment.id;
          var targetId = segment.targets[0].id;
          var target = 'Ceci est une très belle maison';
          var result = setup.resourcesClient.postResourcesCorpusSegmentUpdate({corpusId: id, segId: segId, targetId: targetId, target: target});
          setup.parseResponse(result, done);
        });
      });
    });
  });

  describe('Add Corpus segment targets', function() {
    it('should add a target to a specific segment', function(done) {
      getCorpusId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No corpus found to update segment');
          done();
          return;
        }

        var result = setup.resourcesClient.getResourcesCorpusSegmentList({corpusId: id});
        setup.parseResponse(result, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          if (!body || !body.segments || !body.segments.length || !body.segments[0]) {
            console.warn('No segment found to add target');
            done();
            return;
          }

          var segment = body.segments[0];
          var reqBody = {
            corpusId: id,
            segId: segment.id,
            targets: [
              {
                lang: 'fr',
                target: 'Ceci est une magnifique maison'
              }
            ]
          };

          var result = setup.resourcesClient.postResourcesCorpusSegmentTargetAdd({body: reqBody});
          setup.parseResponse(result, done);
        });
      });
    });
  });

  describe('Delete Corpus segment targets', function() {
    it('should delete a target in a specific segment', function(done) {
      getCorpusId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No corpus found to delete segment target');
          done();
          return;
        }

        var result = setup.resourcesClient.getResourcesCorpusSegmentList({corpusId: id});
        setup.parseResponse(result, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          if (!body || !body.segments || !body.segments.length || !body.segments[0]) {
            console.warn('No segment found to delete target');
            done();
            return;
          }

          var segment = body.segments[0];
          if (!segment.targets || !segment.targets.length || !segment.targets[0]) {
            console.warn('No target found to delete');
            done();
            return;
          }

          var segId = segment.id;
          var targetId = segment.targets[0].id;
          var result = setup.resourcesClient.postResourcesCorpusSegmentTargetDelete({corpusId: id, segId: segId, targetId: targetId});
          setup.parseResponse(result, done);
        });
      });
    });
  });

  describe('Delete Corpus segments', function() {
    it('should delete a segment in a specific corpus', function(done) {
      getCorpusId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No corpus found to delete segment');
          done();
          return;
        }

        var result = setup.resourcesClient.getResourcesCorpusSegmentList({corpusId: id});
        setup.parseResponse(result, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          if (!body || !body.segments || !body.segments.length || !body.segments[0]) {
            console.warn('No segment found to delete');
            done();
            return;
          }

          var segId = body.segments[0].id;
          var result = setup.resourcesClient.postResourcesCorpusSegmentDelete({corpusId: id, segId: segId});
          setup.parseResponse(result, done);
        });
      });
    });
  });

  describe('Delete corpus', function() {
    it('should delete a list of corpus', function(done) {
      var prefix = 'nodejsClientTest';
      var result = setup.resourcesClient.getResourcesCorpusList({prefix: prefix});
      setup.parseResponse(result, function(err, res, body) {
        if (err) {
          done(new Error('Unable to get the list of corpus'));
          return;
        }

        var corpusIds = [];

        if (body && body.files && body.files.length) {
          body.files.forEach(function(corpus) {
            if (corpus && corpus.id)
              corpusIds.push(corpus.id);
          });
        }

        if (!corpusIds.length) {
          console.warn('No corpus found to delete');
          done();
          return;
        }

        var result = setup.resourcesClient.postResourcesCorpusDelete({corpusId: corpusIds});
        setup.parseResponse(result, done);
      });
    });
  });
});