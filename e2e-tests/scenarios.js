'use strict';

/* https://github.com/angular/protractor/blob/master/docs/toc.md */

describe('my app', function() {

  browser.get('index.html');

  it('should automatically redirect to /dashboard when location hash/fragment is empty', function() {
    expect(browser.getLocationAbsUrl()).toMatch("/login");
  });


  describe('dashboard', function() {

    beforeEach(function() {
      browser.get('index.html#/dashboard');
    });


    it('should redirect to login page if not logged in', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).
        toMatch(/Zaerp Login Form/);
    });

  });


  describe('login', function() {

    beforeEach(function() {
      browser.get('index.html#/login');
    });


    it('should render view2 when user navigates to /view2', function() {
      expect(element.all(by.css('[ng-view] h1')).first().getText()).
        toMatch(/Zaerp Login Form/);
    });

  });
});
