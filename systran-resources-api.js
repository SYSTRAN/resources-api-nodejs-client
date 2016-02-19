// Copyright (c) 2016 SYSTRAN S.A.

/*jshint -W069 */
/**
 * ### Introduction

REST API to manage SYSTRAN resources used in translation: corpora and dictionaries.

### Cross Domain

Resource API supports cross-domain requests through the JSONP or the CORS mechanism.

Resource API also supports the Silverlight client access policy file (clientaccesspolicy.xml) and the Adobe Flash cross-domain policy file (crossdomain.xml) that handles cross-domain requests.

#### JSONP Support

Resource API supports JSONP by providing the name of the callback function as a parameter. The response body will be contained in the parentheses:

```javascript
callbackFunctionName(/* response body as defined in each API section *\/);
```
#### CORS

Resource API supports the CORS mechanism to handle cross-domain requests. The server will correctly handle the OPTIONS requests used by CORS.

The following headers are set as follows:

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Headers: X-Requested-With,Content-Type,X-HTTP-METHOD-OVERRIDE
```

### Langage Code Values

The language codes to be used are the two-letter codes defined by the ISO 639-1:2002, Codes for the representation of names of languages - Part 1: Alpha-2 code standard.

Refer to the column 'ISO 639-1 code' of this list: http://www.loc.gov/standards/iso639-2/php/code_list.php.

In addition to this list, the following codes are used:

Language Code |	Language
--------------|---------
auto | Language Detection
tj | Tajik (cyrillic script)
zh-Hans | Chinese (Simplified)
zh-Hant |	Chinese (Traditional)


### Escaping of the input text

The input text passed as a URL parameter will be escaped with an equivalent of the javascript 'encodeURIComponent' function.

### Encoding of the input text

The input text must be encoded in UTF-8.

### Encoding of the output text

The output text (translated text, error and warning strings) will be encoded in UTF-8.

### Mobile API keys

** iOS **: If you use an iOS API key, you need to add the following parameter to each request:
* `bundleId`: Your application bundle ID

<br />

** Android **: If you use an Android API key, you need to add the following parameters to each request:
* `packageName`: Your application package name
* `certFingerprint`: Your application certificate fingerprint

 * @class SystranResourcesApi
 * @param {(string|object)} [domainOrOptions] - The project domain or options object. If object, see the object's optional properties.
 * @param {string} [domainOrOptions.domain] - The project domain
 * @param {object} [domainOrOptions.token] - auth token - object with value property and optional headerOrQueryName and isQuery properties
 */
var SystranResourcesApi = (function() {
    'use strict';

    var request = require('request');
    var Q = require('q');

    function SystranResourcesApi(options) {
        var domain = (typeof options === 'object') ? options.domain : options;
        this.domain = domain ? domain : '';
        if (this.domain.length === 0) {
            throw new Error('Domain parameter must be specified as a string.');
        }
        this.token = (typeof options === 'object') ? (options.token ? options.token : {}) : {};
    }

    /**
     * Set Token
     * @method
     * @name SystranResourcesApi#setToken
     * @param {string} value - token's value
     * @param {string} headerOrQueryName - the header or query name to send the token at
     * @param {boolean} isQuery - true if send the token as query param, otherwise, send as header param
     *
     */
    SystranResourcesApi.prototype.setToken = function(value, headerOrQueryName, isQuery) {
        this.token.value = value;
        this.token.headerOrQueryName = headerOrQueryName;
        this.token.isQuery = isQuery;
    };

    /**
     * Get supported languages by dictionaries
     * @method
     * @name SystranResourcesApi#getResourcesDictionarySupportedLanguages
     * 
     */
    SystranResourcesApi.prototype.getResourcesDictionarySupportedLanguages = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/supportedLanguages';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Lookup words from a source language to a target language.
     * @method
     * @name SystranResourcesApi#getResourcesDictionaryLookup
     * @param {string} source - Language code of the source text

     * @param {string} target - Language code in which to lookup the source text

     * @param {array} input - Input word (the 'input' parameter can be repeated)

     * @param {boolean} autocomplete - With this option, if the input word is not found in the source language, it will be filled in with autocompletion to perform the lookup

    Default: false

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.getResourcesDictionaryLookup = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/lookup';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['source'] !== undefined) {
            queryParameters['source'] = parameters['source'];
        }

        if (parameters['source'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: source'));
            return deferred.promise;
        }

        if (parameters['target'] !== undefined) {
            queryParameters['target'] = parameters['target'];
        }

        if (parameters['target'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: target'));
            return deferred.promise;
        }

        if (parameters['input'] !== undefined) {
            queryParameters['input'] = parameters['input'];
        }

        if (parameters['input'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: input'));
            return deferred.promise;
        }

        if (parameters['autocomplete'] !== undefined) {
            queryParameters['autocomplete'] = parameters['autocomplete'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * List of language pairs in which lookup is supported. This list can be limited to a specific source language or target language.

     * @method
     * @name SystranResourcesApi#getResourcesDictionaryLookupSupportedLanguages
     * @param {string} source - Language code of the source text

     * @param {string} target - Language code into which to translate the source text

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.getResourcesDictionaryLookupSupportedLanguages = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/lookup/supportedLanguages';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['source'] !== undefined) {
            queryParameters['source'] = parameters['source'];
        }

        if (parameters['target'] !== undefined) {
            queryParameters['target'] = parameters['target'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add a new dictionary.
     * @method
     * @name SystranResourcesApi#postResourcesDictionaryAdd
     * @param {} input - Input with dictionary information
     * 
     */
    SystranResourcesApi.prototype.postResourcesDictionaryAdd = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/add';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['input'] !== undefined) {
            body = parameters['input'];
        }

        if (parameters['input'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: input'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete an existing dictionary.
     * @method
     * @name SystranResourcesApi#postResourcesDictionaryDelete
     * @param {string} dictionaryId - Dictionary Id
     * 
     */
    SystranResourcesApi.prototype.postResourcesDictionaryDelete = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/delete';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['dictionaryId'] !== undefined) {
            queryParameters['dictionaryId'] = parameters['dictionaryId'];
        }

        if (parameters['dictionaryId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: dictionaryId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Export an existing dictionary.
     * @method
     * @name SystranResourcesApi#postResourcesDictionaryExport
     * @param {string} dictionaryId - Dictionary Id
     * 
     */
    SystranResourcesApi.prototype.postResourcesDictionaryExport = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/export';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['dictionaryId'] !== undefined) {
            queryParameters['dictionaryId'] = parameters['dictionaryId'];
        }

        if (parameters['dictionaryId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: dictionaryId'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Update an existing dictionary.
     * @method
     * @name SystranResourcesApi#postResourcesDictionaryUpdate
     * @param {string} dictionaryId - Dictionary Id
     * @param {} input - Input with dictionary id
     * 
     */
    SystranResourcesApi.prototype.postResourcesDictionaryUpdate = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/update';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['dictionaryId'] !== undefined) {
            queryParameters['dictionaryId'] = parameters['dictionaryId'];
        }

        if (parameters['dictionaryId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: dictionaryId'));
            return deferred.promise;
        }

        if (parameters['input'] !== undefined) {
            body = parameters['input'];
        }

        if (parameters['input'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: input'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * List the dictionaries.
     * @method
     * @name SystranResourcesApi#postResourcesDictionaryList
     * @param {} filters - Different filters that can be applied to the list functionality (skip/limit/sort/match)
     * 
     */
    SystranResourcesApi.prototype.postResourcesDictionaryList = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/list';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['filters'] !== undefined) {
            body = parameters['filters'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add a new entry to an existing dictionary.
     * @method
     * @name SystranResourcesApi#postResourcesDictionaryEntryAdd
     * @param {string} dictionaryId - Dictionary Id
     * @param {} input - Input with dictionary id and entries information
     * 
     */
    SystranResourcesApi.prototype.postResourcesDictionaryEntryAdd = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/entry/add';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['dictionaryId'] !== undefined) {
            queryParameters['dictionaryId'] = parameters['dictionaryId'];
        }

        if (parameters['dictionaryId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: dictionaryId'));
            return deferred.promise;
        }

        if (parameters['input'] !== undefined) {
            body = parameters['input'];
        }

        if (parameters['input'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: input'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete an entry in an existing dictionary.
     * @method
     * @name SystranResourcesApi#postResourcesDictionaryEntryDelete
     * @param {string} dictionaryId - Dictionary Id
     * @param {} input - Input with dictionary id + entry id (src or tgt) to delete
     * 
     */
    SystranResourcesApi.prototype.postResourcesDictionaryEntryDelete = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/entry/delete';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['dictionaryId'] !== undefined) {
            queryParameters['dictionaryId'] = parameters['dictionaryId'];
        }

        if (parameters['dictionaryId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: dictionaryId'));
            return deferred.promise;
        }

        if (parameters['input'] !== undefined) {
            body = parameters['input'];
        }

        if (parameters['input'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: input'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Update an entry in an existing dictionary.
     * @method
     * @name SystranResourcesApi#postResourcesDictionaryEntryUpdate
     * @param {string} dictionaryId - Dictionary Id
     * @param {} input - Input with dictionary id + entry id (src or tgt) to delete
     * 
     */
    SystranResourcesApi.prototype.postResourcesDictionaryEntryUpdate = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/entry/update';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['dictionaryId'] !== undefined) {
            queryParameters['dictionaryId'] = parameters['dictionaryId'];
        }

        if (parameters['dictionaryId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: dictionaryId'));
            return deferred.promise;
        }

        if (parameters['input'] !== undefined) {
            body = parameters['input'];
        }

        if (parameters['input'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: input'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Import entries to an existing dictionary.
     * @method
     * @name SystranResourcesApi#postResourcesDictionaryEntryImport
     * @param {string} dictionaryId - Id of the dictionary where to import entries
     * @param {string} sourceLang - Source lang of the entries to import
     * @param {file} inputFile - File with entries to import
     * 
     */
    SystranResourcesApi.prototype.postResourcesDictionaryEntryImport = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/entry/import';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['dictionaryId'] !== undefined) {
            queryParameters['dictionaryId'] = parameters['dictionaryId'];
        }

        if (parameters['dictionaryId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: dictionaryId'));
            return deferred.promise;
        }

        if (parameters['sourceLang'] !== undefined) {
            queryParameters['sourceLang'] = parameters['sourceLang'];
        }

        if (parameters['sourceLang'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: sourceLang'));
            return deferred.promise;
        }

        if (parameters['inputFile'] !== undefined) {
            form['inputFile'] = parameters['inputFile'];
        }

        if (parameters['inputFile'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: inputFile'));
            return deferred.promise;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * List entries for a specific dictionary.
     * @method
     * @name SystranResourcesApi#postResourcesDictionaryEntryList
     * @param {string} dictionaryId - Dictionary Id
     * @param {} filters - Different filters that can be applied to the list functionality (skip/limit/sort/match)
     * 
     */
    SystranResourcesApi.prototype.postResourcesDictionaryEntryList = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/dictionary/entry/list';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['dictionaryId'] !== undefined) {
            queryParameters['dictionaryId'] = parameters['dictionaryId'];
        }

        if (parameters['dictionaryId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: dictionaryId'));
            return deferred.promise;
        }

        if (parameters['filters'] !== undefined) {
            body = parameters['filters'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * List available corpora. Parameters can be used to restrict the list of returned corpora.

     * @method
     * @name SystranResourcesApi#getResourcesCorpusList
     * @param {string} sourceLang - Source language code ([details](#description_langage_code_values))
     * @param {string} targetLang - Target language code ([details](#description_langage_code_values))
     * @param {boolean} withoutPending - Filter out corpora in "pending" status

     * @param {boolean} withoutError - Filter out corpora in "error" status

     * @param {string} prefix - Prefix of the corpus name

     * @param {string} directory - If specified, response will return the content of this directory, including corpora and directories. This list can also be filtered by the prefix parameter.

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.getResourcesCorpusList = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/list';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['sourceLang'] !== undefined) {
            queryParameters['sourceLang'] = parameters['sourceLang'];
        }

        if (parameters['targetLang'] !== undefined) {
            queryParameters['targetLang'] = parameters['targetLang'];
        }

        if (parameters['withoutPending'] !== undefined) {
            queryParameters['withoutPending'] = parameters['withoutPending'];
        }

        if (parameters['withoutError'] !== undefined) {
            queryParameters['withoutError'] = parameters['withoutError'];
        }

        if (parameters['prefix'] !== undefined) {
            queryParameters['prefix'] = parameters['prefix'];
        }

        if (parameters['directory'] !== undefined) {
            queryParameters['directory'] = parameters['directory'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add a new empty corpus.

     * @method
     * @name SystranResourcesApi#postResourcesCorpusAdd
     * @param {string} name - Corpus name. The name also contains the directories (ex: "/myproject/firstPass/PersonalCorpus")
     * @param {string} lang - Language code ([details](#description_langage_code_values))
     * @param {array} tag - Tag for the the corpus (this parameter can be repeated)
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.postResourcesCorpusAdd = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/add';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        if (parameters['name'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: name'));
            return deferred.promise;
        }

        if (parameters['lang'] !== undefined) {
            queryParameters['lang'] = parameters['lang'];
        }

        if (parameters['lang'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: lang'));
            return deferred.promise;
        }

        if (parameters['tag'] !== undefined) {
            queryParameters['tag'] = parameters['tag'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add a new corpus from an existing corpus.

     * @method
     * @name SystranResourcesApi#postResourcesCorpusImport
     * @param {string} name - Corpus name. The name also contains the directories (ex: "/myproject/firstPass/PersonalCorpus")
     * @param {string} format - Format of the input corpus.

     * @param {string} input - Content of the existing corpus

    **Either `input` or `inputFile` is required**

     * @param {file} inputFile - Content of the existing corpus

    **Either `input` or `inputFile` is required**

     * @param {array} tag - Tag for the the corpus (this parameter can be repeated)
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.postResourcesCorpusImport = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/import';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        if (parameters['name'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: name'));
            return deferred.promise;
        }

        if (parameters['format'] !== undefined) {
            queryParameters['format'] = parameters['format'];
        }

        if (parameters['format'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: format'));
            return deferred.promise;
        }

        if (parameters['input'] !== undefined) {
            queryParameters['input'] = parameters['input'];
        }

        if (parameters['inputFile'] !== undefined) {
            form['inputFile'] = parameters['inputFile'];
        }

        if (parameters['tag'] !== undefined) {
            queryParameters['tag'] = parameters['tag'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Check if a corpus exists

     * @method
     * @name SystranResourcesApi#getResourcesCorpusExists
     * @param {string} name - Corpus name. The name also contains the directories (ex: "/myproject/firstPass/PersonalCorpus")
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.getResourcesCorpusExists = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/exists';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        if (parameters['name'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: name'));
            return deferred.promise;
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get detailed information about a corpus.

     * @method
     * @name SystranResourcesApi#getResourcesCorpusDetails
     * @param {string} corpusId - Corpus identifier
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.getResourcesCorpusDetails = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/details';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['corpusId'] !== undefined) {
            queryParameters['corpusId'] = parameters['corpusId'];
        }

        if (parameters['corpusId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: corpusId'));
            return deferred.promise;
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Update properties of a corpus.

     * @method
     * @name SystranResourcesApi#postResourcesCorpusUpdate
     * @param {string} corpusId - Corpus identifier
     * @param {string} name - Corpus name. The name also contains the directories (ex: "/myproject/firstPass/PersonalCorpus")
     * @param {array} tag - Tag for the the corpus (this parameter can be repeated)
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.postResourcesCorpusUpdate = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/update';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['corpusId'] !== undefined) {
            queryParameters['corpusId'] = parameters['corpusId'];
        }

        if (parameters['corpusId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: corpusId'));
            return deferred.promise;
        }

        if (parameters['name'] !== undefined) {
            queryParameters['name'] = parameters['name'];
        }

        if (parameters['tag'] !== undefined) {
            queryParameters['tag'] = parameters['tag'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Download a corpus in an expected format.

     * @method
     * @name SystranResourcesApi#getResourcesCorpusExport
     * @param {string} corpusId - Corpus identifier
     * @param {string} format - The expected corpus format

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.getResourcesCorpusExport = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/export';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['corpusId'] !== undefined) {
            queryParameters['corpusId'] = parameters['corpusId'];
        }

        if (parameters['corpusId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: corpusId'));
            return deferred.promise;
        }

        if (parameters['format'] !== undefined) {
            queryParameters['format'] = parameters['format'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete a corpus.

     * @method
     * @name SystranResourcesApi#postResourcesCorpusDelete
     * @param {array} corpusId - Corpus identifier (this parameter can be repeated)
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.postResourcesCorpusDelete = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/delete';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['corpusId'] !== undefined) {
            queryParameters['corpusId'] = parameters['corpusId'];
        }

        if (parameters['corpusId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: corpusId'));
            return deferred.promise;
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Find sentences in the corpus that match the input text from a given threshold.

     * @method
     * @name SystranResourcesApi#getResourcesCorpusMatch
     * @param {array} corpusId - Corpus identifier (this parameter can be repeated)
     * @param {array} input - Text is used to perform the match operation (this parameter can be repeated)

     * @param {string} sourceLang - Source language code ([details](#description_langage_code_values))
     * @param {string} targetLang - Target language code ([details](#description_langage_code_values))
     * @param {number} threshold - The fuzzy match threshold from which a sentence will be considered as a match result

     * @param {integer} limit - Limit the number of returned matches. Only first matches within the "limit" will be returned

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.getResourcesCorpusMatch = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/match';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['corpusId'] !== undefined) {
            queryParameters['corpusId'] = parameters['corpusId'];
        }

        if (parameters['corpusId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: corpusId'));
            return deferred.promise;
        }

        if (parameters['input'] !== undefined) {
            queryParameters['input'] = parameters['input'];
        }

        if (parameters['input'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: input'));
            return deferred.promise;
        }

        if (parameters['sourceLang'] !== undefined) {
            queryParameters['sourceLang'] = parameters['sourceLang'];
        }

        if (parameters['sourceLang'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: sourceLang'));
            return deferred.promise;
        }

        if (parameters['targetLang'] !== undefined) {
            queryParameters['targetLang'] = parameters['targetLang'];
        }

        if (parameters['targetLang'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: targetLang'));
            return deferred.promise;
        }

        if (parameters['threshold'] !== undefined) {
            queryParameters['threshold'] = parameters['threshold'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * List segments in a corpus.

     * @method
     * @name SystranResourcesApi#getResourcesCorpusSegmentList
     * @param {string} corpusId - Corpus identifier
     * @param {integer} skip - Skip first found segments in the response

     * @param {integer} limit - Limit the number of returned segments

     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.getResourcesCorpusSegmentList = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/segment/list';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['corpusId'] !== undefined) {
            queryParameters['corpusId'] = parameters['corpusId'];
        }

        if (parameters['corpusId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: corpusId'));
            return deferred.promise;
        }

        if (parameters['skip'] !== undefined) {
            queryParameters['skip'] = parameters['skip'];
        }

        if (parameters['limit'] !== undefined) {
            queryParameters['limit'] = parameters['limit'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add segments in a corpus.

     * @method
     * @name SystranResourcesApi#postResourcesCorpusSegmentAdd
     * @param {} body - List of segments to add
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.postResourcesCorpusSegmentAdd = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/segment/add';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete segments in a corpus.

     * @method
     * @name SystranResourcesApi#postResourcesCorpusSegmentDelete
     * @param {string} corpusId - Corpus identifier
     * @param {array} segId - Segment Id (this parameter can be repeated)
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.postResourcesCorpusSegmentDelete = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/segment/delete';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['corpusId'] !== undefined) {
            queryParameters['corpusId'] = parameters['corpusId'];
        }

        if (parameters['corpusId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: corpusId'));
            return deferred.promise;
        }

        if (parameters['segId'] !== undefined) {
            queryParameters['segId'] = parameters['segId'];
        }

        if (parameters['segId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: segId'));
            return deferred.promise;
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Update a segment in a corpus.

     * @method
     * @name SystranResourcesApi#postResourcesCorpusSegmentUpdate
     * @param {string} corpusId - Corpus identifier
     * @param {string} segId - Segment Id
     * @param {string} source - Source text
     * @param {string} targetId - Target id
     * @param {string} target - Target text. `targetId` is required if `target` is specified.
     * @param {string} targetLang - Target language. `targetId` is required if `targetLang` is specified.
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.postResourcesCorpusSegmentUpdate = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/segment/update';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['corpusId'] !== undefined) {
            queryParameters['corpusId'] = parameters['corpusId'];
        }

        if (parameters['corpusId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: corpusId'));
            return deferred.promise;
        }

        if (parameters['segId'] !== undefined) {
            queryParameters['segId'] = parameters['segId'];
        }

        if (parameters['segId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: segId'));
            return deferred.promise;
        }

        if (parameters['source'] !== undefined) {
            queryParameters['source'] = parameters['source'];
        }

        if (parameters['targetId'] !== undefined) {
            queryParameters['targetId'] = parameters['targetId'];
        }

        if (parameters['target'] !== undefined) {
            queryParameters['target'] = parameters['target'];
        }

        if (parameters['targetLang'] !== undefined) {
            queryParameters['targetLang'] = parameters['targetLang'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Add targets to a segment in a corpus.

     * @method
     * @name SystranResourcesApi#postResourcesCorpusSegmentTargetAdd
     * @param {} body - List of targets to add
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.postResourcesCorpusSegmentTargetAdd = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/segment/target/add';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['body'] !== undefined) {
            body = parameters['body'];
        }

        if (parameters['body'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: body'));
            return deferred.promise;
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Delete segment targets in a corpus.

     * @method
     * @name SystranResourcesApi#postResourcesCorpusSegmentTargetDelete
     * @param {string} corpusId - Corpus identifier
     * @param {string} segId - Segment Id
     * @param {array} targetId - Target id (this parameter can be repeated)
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.postResourcesCorpusSegmentTargetDelete = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/corpus/segment/target/delete';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['corpusId'] !== undefined) {
            queryParameters['corpusId'] = parameters['corpusId'];
        }

        if (parameters['corpusId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: corpusId'));
            return deferred.promise;
        }

        if (parameters['segId'] !== undefined) {
            queryParameters['segId'] = parameters['segId'];
        }

        if (parameters['segId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: segId'));
            return deferred.promise;
        }

        if (parameters['targetId'] !== undefined) {
            queryParameters['targetId'] = parameters['targetId'];
        }

        if (parameters['targetId'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: targetId'));
            return deferred.promise;
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'POST',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get available categories in the phrasebook

     * @method
     * @name SystranResourcesApi#getResourcesPhrasebookCategories
     * @param {string} language - Language in which the category is localized
     * @param {integer} parentId - ID of the parent category
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.getResourcesPhrasebookCategories = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/phrasebook/categories';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['language'] !== undefined) {
            queryParameters['language'] = parameters['language'];
        }

        if (parameters['language'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: language'));
            return deferred.promise;
        }

        if (parameters['parentId'] !== undefined) {
            queryParameters['parentId'] = parameters['parentId'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get available phrases in the phrasebook

     * @method
     * @name SystranResourcesApi#getResourcesPhrasebookPhrases
     * @param {string} source - Source language
     * @param {string} target - Target language
     * @param {integer} categoryId - Category id
     * @param {integer} subCategoryId - Sub-category id
     * @param {boolean} phraseOfTheDay - Return phrases that are eligible to be selected as "phrase of the day"
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.getResourcesPhrasebookPhrases = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/phrasebook/phrases';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['source'] !== undefined) {
            queryParameters['source'] = parameters['source'];
        }

        if (parameters['source'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: source'));
            return deferred.promise;
        }

        if (parameters['target'] !== undefined) {
            queryParameters['target'] = parameters['target'];
        }

        if (parameters['target'] === undefined) {
            deferred.reject(new Error('Missing required  parameter: target'));
            return deferred.promise;
        }

        if (parameters['categoryId'] !== undefined) {
            queryParameters['categoryId'] = parameters['categoryId'];
        }

        if (parameters['subCategoryId'] !== undefined) {
            queryParameters['subCategoryId'] = parameters['subCategoryId'];
        }

        if (parameters['phraseOfTheDay'] !== undefined) {
            queryParameters['phraseOfTheDay'] = parameters['phraseOfTheDay'];
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Get phrasebook supported languages
     * @method
     * @name SystranResourcesApi#getResourcesPhrasebookSupportedLanguages
     * 
     */
    SystranResourcesApi.prototype.getResourcesPhrasebookSupportedLanguages = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/phrasebook/supportedLanguages';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };
    /**
     * Current version for resources apis

     * @method
     * @name SystranResourcesApi#getResourcesApiVersion
     * @param {string} callback - Javascript callback function name for JSONP Support

     * 
     */
    SystranResourcesApi.prototype.getResourcesApiVersion = function(parameters) {
        if (parameters === undefined) {
            parameters = {};
        }
        var deferred = Q.defer();

        var domain = this.domain;
        var path = '/resources/apiVersion';

        var body;
        var queryParameters = {};
        var headers = {};
        var form = {};

        if (this.token.isQuery) {
            queryParameters[this.token.headerOrQueryName] = this.token.value;
        } else if (this.token.headerOrQueryName) {
            headers[this.token.headerOrQueryName] = this.token.value;
        } else {
            headers['Authorization'] = 'Bearer ' + this.token.value;
        }

        if (parameters['callback'] !== undefined) {
            queryParameters['callback'] = parameters['callback'];
        }

        if (parameters.$queryParameters) {
            Object.keys(parameters.$queryParameters)
                .forEach(function(parameterName) {
                    var parameter = parameters.$queryParameters[parameterName];
                    queryParameters[parameterName] = parameter;
                });
        }

        var req = {
            method: 'GET',
            uri: domain + path,
            qs: queryParameters,
            headers: headers,
            body: body,
            encoding: null
        };
        if (Object.keys(form).length > 0) {
            req.formData = form;
        }
        if (typeof(body) === 'object' && !(body instanceof Buffer)) {
            req.json = true;
        }
        request(req, function(error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                if (/^application\/(.*\\+)?json/.test(response.headers['content-type'])) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {

                    }
                }
                if (response.statusCode === 204) {
                    deferred.resolve({
                        response: response
                    });
                } else if (response.statusCode >= 200 && response.statusCode <= 299) {
                    deferred.resolve({
                        response: response,
                        body: body
                    });
                } else {
                    deferred.reject({
                        response: response,
                        body: body
                    });
                }
            }
        });

        return deferred.promise;
    };

    return SystranResourcesApi;
})();

exports.SystranResourcesApi = SystranResourcesApi;