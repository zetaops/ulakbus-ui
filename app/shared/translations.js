angular.module('gettext').run(['gettextCatalog', function (gettextCatalog) {
/* jshint -W100 */
    gettextCatalog.setStrings('tr', {"Dashboard":"Panel","Login":"Giriş","Logout":"Çıkış","New Staff":"Yeni Personel","Staffs":"Personeller"});
/* jshint +W100 */
}]);