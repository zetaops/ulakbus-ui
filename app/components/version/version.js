'use strict';

angular.module('ulakbus.version', [
  'ulakbus.version.interpolate-filter',
  'ulakbus.version.version-directive'
])

.value('version', '1.2.1');
