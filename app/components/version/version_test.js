'use strict';

describe('zaerp.version module', function() {
  beforeEach(module('zaerp.version'));

  describe('version service', function() {
    it('should return current version', inject(function(version) {
      expect(version).toEqual('0.1');
    }));
  });
});
