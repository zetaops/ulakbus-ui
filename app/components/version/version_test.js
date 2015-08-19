'use strict';

describe('ulakbus.version module', function() {
  beforeEach(module('ulakbus.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
