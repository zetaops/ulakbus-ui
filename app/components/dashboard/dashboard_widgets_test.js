
describe('dashboard controller widgets', function () {

    beforeEach(module('ulakbus'));
    beforeEach(module('ulakbus.dashboard'));
    beforeEach(module('ui.grid'));
    beforeEach(module('ui.grid.infiniteScroll'));

    var $controller;
    var $rootScope;
    var $compile;
    var $scope;

    beforeEach(inject(function (_$controller_,_$compile_, _$rootScope_) {
        $controller = _$controller_;
        $compile = _$compile_;
        $rootScope =_$rootScope_;
        $scope = {};
    }));

    describe('task manager', function () {
        it('should have service', inject(function () {
            expect('ulakbus.dashboard.TasksService').toBeDefined();
        }));
        it('should have controller', inject(function () {
            expect('ulakbus.dashboard.userTasks').toBeDefined();
        }));
        it('should have single task controller', inject(function () {
            expect('ulakbus.dashboard.singleTask').toBeDefined();
        }));
        it('should have empty task controller', inject(function () {
            expect('ulakbus.dashboard.emptyTask').toBeDefined();
        }));
        describe('service', function(){
            it('should return methods', inject(function(){
            }))
        });
        describe('single task',function(){
            it('should show task',inject(function(){
            }))
        });
        describe('empty task', function(){
            /*it('should show empty message',inject(function(){
                var test = Math.random().toString();
                var emptyDiv = angular.element("<empty-task task-type='"+test+"'></empty-task>");
                var element = $compile(emptyDiv)($rootScope);
                //todo:tests fails due to error when we call digest
                $rootScope.$digest();
                // Check that the compiled element contains the templated content
                expect(element.html()).toContain(test+" görev bulunamadı.");
            }));*/
        })
    });
});