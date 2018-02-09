/**
     * HTTP GET "class" actions: Resource.action([parameters], [success], [error])
     * non-GET "class" actions: Resource.action([parameters], postData, [success], [error])
     * non-GET instance actions: instance.$action([parameters], [success], [error])
     *
     * Default actions:
     * {
     *   'get':    {method:'GET'},
     *   'save':   {method:'POST'},
     *   'query':  {method:'GET', isArray:true},
     *   'remove': {method:'DELETE'},
     *   'delete': {method:'DELETE'}
     * }
     */


export const cbApi = class couchbaseApi {
  constructor(){
    var _resources = {
      'Buckets': $resource('/cb-api/pools/default/buckets/:bucketName'),
      'Documents': $resource('/cb-api/pools/default/buckets/:bucketName/docs/:documentKey', {}, {
        'update': {
          method: 'POST',
          isArray: true
        },
        'remove': {
          method: 'DELETE',
          isArray: true
        }
      })
    };   
  }
  retrieveBuckets(successCallback, errorCallback){
    if(typeof(successCallback) !== 'undefined' && typeof(successCallback) !== 'function'){
      throw new TypeError('successCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    if(typeof(errorCallback) !== 'undefined' && typeof(errorCallback) !== 'function'){
      throw new TypeError('errorCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    return _resources.Buckets.query(successCallback, errorCallback);
  }
  retrieveBucket(bucketName, successCallback, errorCallback){
    if(typeof(bucketName) !== 'string'){
      throw new TypeError('bucketName must be a string', 'couchbase-api.service.js');
    }
    if(typeof(successCallback) !== 'undefined' && typeof(successCallback) !== 'function'){
      throw new TypeError('successCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    if(typeof(errorCallback) !== 'undefined' && typeof(errorCallback) !== 'function'){
      throw new TypeError('errorCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    return _resources.Buckets.get({bucketName: bucketName}, successCallback, errorCallback);
  }

  createBucket(){
    throw new Error('method "createBucket" not implemented yet');
  }

  deleteBucket(){
    throw new Error('method "deleteBucket" not implemented yet');
  }

  retrieveDocuments(bucketName, skipDocs, limitDocs, startKey, endKey, successCallback, errorCallback){
    if(typeof(bucketName) !== 'string'){
      throw new TypeError('bucketName must be a string', 'couchbase-api.service.js');
    }
    if(typeof(skipDocs) !== 'number'){
      throw new TypeError('skipDocs must be a number', 'couchbase-api.service.js');
    }
    if(typeof(limitDocs) !== 'number'){
      throw new TypeError('limitDocs must be a number', 'couchbase-api.service.js');
    }
    if(typeof(successCallback) !== 'undefined' && typeof(successCallback) !== 'function'){
      throw new TypeError('successCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    if(typeof(errorCallback) !== 'undefined' && typeof(errorCallback) !== 'function'){
      throw new TypeError('errorCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    var invalidStartKey = typeof(startKey) !== 'undefined' && (typeof(startKey) !== 'string' || !startKey);
    if(invalidStartKey){
      throw new TypeError('startKey, if provided, must be a valid string', 'couchbase-api.service.js');
    }
    var invalidEndKey = typeof(endKey) !== 'string' || !endKey;
    if(!invalidStartKey && startKey && invalidEndKey){
      throw new TypeError('endKey, if provided, must be a valid string', 'couchbase-api.service.js');
    }

    var queryParams = {
      bucketName: bucketName,
      include_docs: true,
      skip: skipDocs,
      limit: limitDocs,
      inclusive_end:false
    };

    if(!invalidStartKey && !invalidEndKey){
      queryParams.startkey = '"'+startKey+'"';
      queryParams.endkey = '"'+endKey+'"';
    }

    return _resources.Documents.get(queryParams, successCallback, errorCallback);
  }
  validateArguments() {

  }
  retrieveDocument(bucketName, documentKey, successCallback, errorCallback){
    if(typeof(bucketName) !== 'string'){
      throw new TypeError('bucketName must be a string', 'couchbase-api.service.js');
    }
    if(typeof(documentKey) !== 'string'){
      throw new TypeError('documentKey must be a string', 'couchbase-api.service.js');
    }
    if(typeof(successCallback) !== 'undefined' && typeof(successCallback) !== 'function'){
      throw new TypeError('successCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    if(typeof(errorCallback) !== 'undefined' && typeof(errorCallback) !== 'function'){
      throw new TypeError('errorCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    return _resources.Documents.get({ bucketName, documentKey }, successCallback, errorCallback);
  }

  createDocument(bucketName, documentKey, content, successCallback, errorCallback){
    if(typeof(bucketName) !== 'string'){
      throw new TypeError('bucketName must be a string', 'couchbase-api.service.js');
    }
    if(typeof(documentKey) !== 'string'){
      throw new TypeError('documentKey must be a string', 'couchbase-api.service.js');
    }
    if(!content || typeof(content) !== 'object' || typeof(content.length) !== 'undefined'){
      throw new TypeError('content must be a valid object literal', 'couchbase-api.service.js');
    }
    if(typeof(successCallback) !== 'undefined' && typeof(successCallback) !== 'function'){
      throw new TypeError('successCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    if(typeof(errorCallback) !== 'undefined' && typeof(errorCallback) !== 'function'){
      throw new TypeError('errorCallback, if provided, must be a function', 'couchbase-api.service.js');
    }

    var deferred = $q.defer();
    retrieveDocument(bucketName, documentKey).$promise.then(success, fail);

    success(document){
      errorCallback(true);
      return deferred.reject({ $promise: $q.reject(true) });
    }

    function fail(error){
      if(error.status === 404){
        var aux = _resources.Documents.update({bucketName: bucketName, documentKey: documentKey}, content, function(response){
          successCallback(response);
        }, errorCallback);
        return deferred.resolve(aux);
      }
      else{
        errorCallback(false);
        return deferred.reject({ $promise: $q.reject(true) });
      }
    }

    return deferred.promise;
  }

  deleteDocument(bucketName, documentKey, successCallback, errorCallback){
    if(typeof(bucketName) !== 'string'){
      throw new TypeError('bucketName must be a string', 'couchbase-api.service.js');
    }
    if(typeof(documentKey) !== 'string'){
      throw new TypeError('documentKey must be a string', 'couchbase-api.service.js');
    }
    if(typeof(successCallback) !== 'undefined' && typeof(successCallback) !== 'function'){
      throw new TypeError('successCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    if(typeof(errorCallback) !== 'undefined' && typeof(errorCallback) !== 'function'){
      throw new TypeError('errorCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    return _resources.Documents.remove({bucketName: bucketName, documentKey: documentKey}, successCallback, errorCallback);
  }

  updateDocument(bucketName, documentKey, content, successCallback, errorCallback){
    if(typeof(bucketName) !== 'string'){
      throw new TypeError('bucketName must be a string', 'couchbase-api.service.js');
    }
    if(typeof(documentKey) !== 'string'){
      throw new TypeError('documentKey must be a string', 'couchbase-api.service.js');
    }
    if(!content || typeof(content) !== 'object' || typeof(content.length) !== 'undefined'){
      throw new TypeError('content must be a valid object literal', 'couchbase-api.service.js');
    }
    if(typeof(successCallback) !== 'undefined' && typeof(successCallback) !== 'function'){
      throw new TypeError('successCallback, if provided, must be a function', 'couchbase-api.service.js');
    }
    if(typeof(errorCallback) !== 'undefined' && typeof(errorCallback) !== 'function'){
      throw new TypeError('errorCallback, if provided, must be a function', 'couchbase-api.service.js');
    }

    return _resources.Documents.update({bucketName: bucketName, documentKey: documentKey}, content, successCallback, errorCallback);
  }
};

export default cbApi;