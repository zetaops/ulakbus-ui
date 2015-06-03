#Zaerp User Interface

##Get Ready For Development
1. Get Repo `git clone git@github.com:zetaops/zaerp-ui.git`

    *if you are not familiar to git follow these guides:* 
    - https://git-scm.com/doc
    - https://try.github.io/levels/1/challenges/1

2. Download and Install nodejs:
    - https://nodejs.org/download/

3. Install Bower `npm install bower`

4. run `bower install` to install packages listed in bower.json 

5. run `npm install` to install packages listed in package.json

6. After getting all packages and installing all dependencies run this command to start http server:
    ```
        npm start
    ```
    *you can use any other http server to serve app*

##Development Cycle
Now that you have the repo, npm and bower installed, you may now start to develop.

Using extreme programming techniques, we demand you to follow this cycle of development showing on the first page of xp website: http://www.extremeprogramming.org/introduction.html
![extreme programming cycle]
(https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Extreme_Programming.svg/640px-Extreme_Programming.svg.png?1433328761062)

##Testing

*_test.js files are unit test files coded in Jasmine. to run tests run this command:

    npm test

this command will recognize test cases and printout the test result.

To run e2e tests, which is located under e2e-tests folder, we use protractor. Run this command to run e2e tests:

    protractor e2e-tests/protractor.conf.js

##Principles
###Git:
- Always work with branches
- **NEVER MESS WITH MASTER BRANCH!!**
- Commit by little changes

###Code:
- Use comments to explain what your code does
- Code clean and neat
- Name variables, objects with expository words

###Test:


##Must Reads:
- https://google-styleguide.googlecode.com/svn/trunk/angularjs-google-style.html
- https://github.com/angular/angular.js/wiki/Best-Practices
- https://angular.github.io/protractor/#/tutorial
- https://docs.angularjs.org/guide
- http://en.wikipedia.org/wiki/Iterative_and_incremental_development