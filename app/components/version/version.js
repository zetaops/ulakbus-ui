'use strict';

angular.module('zaerp.version', [
  'zaerp.version.interpolate-filter',
  'zaerp.version.version-directive'
])

.value('version', '0.1');
