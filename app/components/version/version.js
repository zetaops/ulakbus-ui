'use strict';

angular.module('ulakbus.version', [
  'ulakbus.version.interpolate-filter',
  'ulakbus.version.version-directive'
])

.value('version', '0.6.5');
