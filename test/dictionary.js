// Copyright (c) 2016 SYSTRAN S.A.

var async = require('async');
var setup = require('../setup');

var dictionaryId;
function getDictionaryId(cb) {
  if (dictionaryId) {
    cb(null, dictionaryId);
    return;
  }

  var filters = {
    match: {
      regexName: 'nodejsClientTest'
    }
  };
  var result = setup.resourcesClient.postResourcesDictionaryList({filters: filters});
  setup.parseResponse(result, function(err, res, body) {
    if (err) {
      cb(err);
      return;
    }

    if (!body || !body.dictionaries || !body.dictionaries.length || !body.dictionaries[0]) {
      cb();
      return;
    }

    dictionaryId = body.dictionaries[0].id;
    cb(null, dictionaryId);
  });
}

function cleanup(done) {
  // delete test dictionaries
  var filters = {
    match: {
      regexName: 'nodejsClientTest'
    }
  };
  var result = setup.resourcesClient.postResourcesDictionaryList({filters: filters});
  setup.parseResponse(result, function(err, res, body) {
    if (err) {
      done(new Error(err));
      return;
    }

    if (!body || !body.dictionaries || !body.dictionaries.length) {
      console.log('Fresh environment!');
      done();
      return;
    }

    async.each(body.dictionaries, function(dict, cb) {
      if (!dict || !dict.id) {
        cb();
        return;
      }
      var result = setup.resourcesClient.postResourcesDictionaryDelete({dictionaryId: id});
      setup.parseResponse(result, cb);
    }, function(err) {
      if (err)
        done(new Error(err));
      else
        done();
    });
  });
}

describe('Dictionary', function() {
  this.timeout(10000);

  before(cleanup);
  after(cleanup);

  describe('Supported languages', function() {
    it('should get the list of supported languages by dictionaries', function(done) {
      var result = setup.resourcesClient.getResourcesDictionarySupportedLanguages();
      setup.parseResponse(result, done);
    });
  });

  describe('Lookup supported languages', function() {
    it('should get the list of language pairs in which lookup is supported', function(done) {
      var result = setup.resourcesClient.getResourcesDictionaryLookupSupportedLanguages();
      setup.parseResponse(result, done);
    });
  });

  describe('Lookup words', function() {
    it('should lookup words from a source language to a target language', function(done) {
      var source = 'en';
      var target = 'fr';
      var input = ['test', 'work'];
      var result = setup.resourcesClient.getResourcesDictionaryLookup({source: source, target: target, input: input});
      setup.parseResponse(result, done);
    });

    it('should lookup words with autoComplete option', function(done) {
      var source = 'en';
      var target = 'fr';
      var input = ['workaroun'];
      var autoComplete = true;
      var result = setup.resourcesClient.getResourcesDictionaryLookup({source: source, target: target, input: input, autocomplete: autoComplete});
      setup.parseResponse(result, done);
    });
  });

  describe('Add dictionary', function() {
    it('should add a new dictionary', function(done) {
      var input = {
        dictionary: {
          name: 'nodejsClientTest',
          sourceLang: 'en',
          targetLangs: 'fr',
          type: 'UD',
          comments: 'This is a dictionary created for nodejs client testing purposes'
        }
      };

      var result = setup.resourcesClient.postResourcesDictionaryAdd({input: input});
      setup.parseResponse(result, function(err, res, body) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!body || !body.added || !body.added.id) {
          done(new Error('Unexpected response'));
          return;
        }

        dictionaryId = body.added.id;
        done();
      });
    });
  });

  describe('List dictionaries', function() {
    it('should list dictionaries', function(done) {
      var result = setup.resourcesClient.postResourcesDictionaryList();
      setup.parseResponse(result, done);
    });

    it('should list dictionaries with match filter', function(done) {
      var filters = {
        match: {
          regexName: 'nodejsClientTest'
        }
      };
      var result = setup.resourcesClient.postResourcesDictionaryList({filters: filters});
      setup.parseResponse(result, done);
    });

    it('should list dictionaries with sort filter', function(done) {
      var filters = {
        sort: {
          name: 1
        }
      };
      var result = setup.resourcesClient.postResourcesDictionaryList({filters: filters});
      setup.parseResponse(result, done);
    });
  });

  describe('Update dictionary', function() {
    it('should update an existing dictionary', function(done) {
      getDictionaryId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No dictionary found to update');
          done();
          return;
        }

        var input = {
          dictionary: {
            name: 'nodejsClientTestUpdatedName',
            comments: 'This dictionary has been updated for nodejs client test'
          }
        };

        var result = setup.resourcesClient.postResourcesDictionaryUpdate({dictionaryId: id, input: input});
        setup.parseResponse(result, done);
      });
    });
  });

  describe('Add an entry', function() {
    it('should add a new entry to an existing dictionary', function(done) {
      getDictionaryId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No dictionary found to add entry');
          done();
          return;
        }

        var input = {
          entry: {
            sourceLang: 'en',
            targetLang: 'fr',
            source: 'house',
            target: 'maison'
          }
        };

        var result = setup.resourcesClient.postResourcesDictionaryEntryAdd({dictionaryId: id, input: input});
        setup.parseResponse(result, done);
      });
    });
  });

  describe('List entries', function() {
    it('should get the list of entries for a specific dictionary', function(done) {
      getDictionaryId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No dictionary found to list entries');
          done();
          return;
        }

        var result = setup.resourcesClient.postResourcesDictionaryEntryList({dictionaryId: id});
        setup.parseResponse(result, done);
      });
    });

    it('should get the list of entries with filter', function(done) {
      getDictionaryId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No dictionary found to list entries');
          done();
          return;
        }

        var filters = {
          sort: {
            target: 1
          },
          match: {
            inTargetLang: ['fr']
          }
        };

        var result = setup.resourcesClient.postResourcesDictionaryEntryList({dictionaryId: id, filters: filters});
        setup.parseResponse(result, done);
      });
    });
  });

  describe('Update an entry', function() {
    it('should update source for an entry in a specific dictionary', function(done) {
      getDictionaryId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No dictionary found to update entry');
          done();
          return;
        }

        var result = setup.resourcesClient.postResourcesDictionaryEntryList({dictionaryId: id});
        setup.parseResponse(result, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          if (!body || !body.entries || !body.entries.length || !body.entries[0]) {
            console.warn('No entry found to update');
            done();
            return;
          }

          var entry = body.entries[0];

          if (!entry.sourceId || !entry.targetId) {
            console.warn('No source or target found to update');
            done();
            return;
          }

          var input = {
            sourceId: entry.sourceId,
            update: {
              sourceLang: 'en',
              targetLang: 'fr',
              source: 'home'
            }
          };
          var result = setup.resourcesClient.postResourcesDictionaryEntryUpdate({dictionaryId: id, input: input});
          setup.parseResponse(result, done);
        });
      });
    });

    it('should update target for an entry in a specific dictionary', function(done) {
      getDictionaryId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No dictionary found to update entry');
          done();
          return;
        }

        var result = setup.resourcesClient.postResourcesDictionaryEntryList({dictionaryId: id});
        setup.parseResponse(result, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          if (!body || !body.entries || !body.entries.length || !body.entries[0]) {
            console.warn('No entry found to update');
            done();
            return;
          }

          var entry = body.entries[0];

          if (!entry.sourceId || !entry.targetId) {
            console.warn('No source or target found to update');
            done();
            return;
          }

          var input = {
            sourceId: entry.sourceId,
            targetId: entry.targetId,
            update: {
              sourceLang: 'en',
              targetLang: 'fr',
              target: 'batiment'
            }
          };
          var result = setup.resourcesClient.postResourcesDictionaryEntryUpdate({dictionaryId: id, input: input});
          setup.parseResponse(result, done);
        });
      });
    });

    it('should update source and target for an entry in a specific dictionary', function(done) {
      getDictionaryId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No dictionary found to update entry');
          done();
          return;
        }

        var result = setup.resourcesClient.postResourcesDictionaryEntryList({dictionaryId: id});
        setup.parseResponse(result, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          if (!body || !body.entries || !body.entries.length || !body.entries[0]) {
            console.warn('No entry found to update');
            done();
            return;
          }

          var entry = body.entries[0];

          if (!entry.sourceId || !entry.targetId) {
            console.warn('No source or target found to update');
            done();
            return;
          }

          var input = {
            sourceId: entry.sourceId,
            targetId: entry.targetId,
            update: {
              sourceLang: 'en',
              targetLang: 'fr',
              source: 'house',
              target: 'maison'
            }
          };
          var result = setup.resourcesClient.postResourcesDictionaryEntryUpdate({dictionaryId: id, input: input});
          setup.parseResponse(result, done);
        });
      });
    });
  });

  describe('Delete an entry', function() {
    it('should delete an entry in a specific dictionary', function(done) {
      getDictionaryId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No dictionary found to delete entry');
          done();
          return;
        }

        var result = setup.resourcesClient.postResourcesDictionaryEntryList({dictionaryId: id});
        setup.parseResponse(result, function(err, res, body) {
          if (err) {
            done(new Error(err));
            return;
          }

          if (!body || !body.entries || !body.entries.length || !body.entries[0]) {
            console.warn('No entry found to delete');
            done();
            return;
          }

          var entry = body.entries[0];

          if (!entry.sourceId || !entry.targetId) {
            console.warn('No source or target found to delete this entry');
            done();
            return;
          }

          var input = {
            entry: {
              sourceId: entry.sourceId,
              targetId: entry.targetId
            }
          };
          var result = setup.resourcesClient.postResourcesDictionaryEntryDelete({dictionaryId: id, input: input});
          setup.parseResponse(result, done);
        });
      });
    });
  });

  describe('Delete dictionary', function() {
    it('should delete a specific dictionary', function(done) {
      getDictionaryId(function(err, id) {
        if (err) {
          done(new Error(err));
          return;
        }

        if (!id) {
          console.warn('No dictionary found to delete');
          done();
          return;
        }

        console.log('Prepare to delete dictionary', id);
        var result = setup.resourcesClient.postResourcesDictionaryDelete({dictionaryId: id});
        setup.parseResponse(result, done);
      });
    });
  });
});