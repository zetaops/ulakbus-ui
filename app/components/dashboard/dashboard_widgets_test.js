describe('dashboard controller widgets', function () {

    beforeEach(module('ulakbus'));
    beforeEach(module('ulakbus.dashboard'));
    beforeEach(module('ui.grid'));
    beforeEach(module('ui.grid.infiniteScroll'));

    var grid, $scope, rows, columns, rowSearcher, uiGridConstants, filter;

    beforeEach(inject(function ($rootScope, _rowSearcher_, Grid, GridRow, GridColumn, _uiGridConstants_) {
        $scope = $rootScope;
        rowSearcher = _rowSearcher_;
        uiGridConstants = _uiGridConstants_;

        grid = new Grid({
            id: 1,
            enableFiltering: true,
            enableSorting: true
        });

        rows = grid.rows = [
            new GridRow({
                name: 'Bill',
                company: 'Gruber, Inc.',
                age: 25,
                isActive: true,
                date: new Date('2015-07-01T13:25:00+00:00')
            }, 0, grid),
            new GridRow({
                name: 'Frank',
                company: 'Foo Co',
                age: 45,
                isActive: false,
                date: new Date('2015-06-24T13:25:00+00:00')
            }, 1, grid),
            new GridRow({
                name: 'Joe',
                company: 'Movers, Inc.',
                age: 0,
                isActive: false,
                date: new Date('2015-06-29T13:25:00+00:00')
            }, 2, grid)
        ];

        columns = grid.columns = [
            new GridColumn({name: 'name'}, 0, grid),
            new GridColumn({name: 'company'}, 1, grid),
            new GridColumn({name: 'age'}, 2, grid),
            new GridColumn({name: 'isActive'}, 3, grid),
            new GridColumn({name: 'date'}, 4, grid)
        ];

        filter = null;
    }));

    function setFilter(column, term, condition) {
        column.filters = [];
        column.filters.push({
            term: term,
            condition: condition
        });
    }

    afterEach(function () {
        // angular.element(grid).remove();
        grid = null;
    });

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
        it('should have a grid controller zeta grid', inject(function () {
            expect('ulakbus.dashboard.zetaGrid').toBeDefined();
        }));

        describe('service', function () {
            it('should return methods', inject(function () {
            }))
        });

        describe('single task', function () {
            it('should show task', inject(function () {
            }))
        });
    });

    describe('with report grid',function () {
        describe('having one column filtered', function () {
            it('should show the row', function () {
                setFilter(columns[0], 'il', uiGridConstants.filter.CONTAINS);

                var ret = rowSearcher.search(grid, rows, columns).filter(function(row){ return row.visible; });

                expect(ret.length).toEqual(1);
            });
        });

        describe('having two column filtered with different conditions', function () {
            it('should show the row', function () {
                setFilter(columns[0], 'il', uiGridConstants.filter.CONTAINS);
                setFilter(columns[1], 'Gruber, Inc.', uiGridConstants.filter.EXACT);

                var ret = rowSearcher.search(grid, rows, columns).filter(function(row){ return row.visible; });

                expect(ret.length).toEqual(1);
            });
        });

        describe('with one matching term and one failing term set on both columns', function() {
            it('should not show the row', function () {
                setFilter(columns[0], 'Bil');
                setFilter(columns[1], 'blargle');
                rows.splice(1);
                var ret = rowSearcher.search(grid, rows, columns).filter(function(row){ return row.visible; });
                expect(ret.length).toEqual(0);
            });
        });

        describe('with external filtering', function () {
            it('should filter one column', function () {
                grid.options.useExternalFiltering = true;
                setFilter(columns[0], 'Bill');

                var ret = rowSearcher.search(grid, rows, columns).filter(function(row){ return row.visible; });

                expect(ret.length).toEqual(3);
            });
        });
    });

    describe('with sort', function() {
        var grid, rows, cols, rowSorter, uiGridConstants;

        beforeEach(inject(function ($rootScope, _rowSearcher_, Grid, GridRow, GridColumn,  _rowSorter_,_uiGridConstants_) {
            rowSorter = _rowSorter_;
            uiGridConstants = _uiGridConstants_;
            grid = new Grid({ id: 123 });

            var e1 = { name: 'Bob' };
            var e2 = { name: 'Jim' };

            rows = [
                new GridRow(e1, 0, grid),
                new GridRow(e2, 1, grid)
            ];

            cols = [
                new GridColumn({
                    name: 'name',
                    type: 'string',
                    sort: {
                        direction: uiGridConstants.ASC,
                        priority: 0
                    }
                }, 0, grid)
            ];
        }));

        it('should sort this ascending', function() {
            var ret = rowSorter.sort(grid, rows, cols);
            expect(ret[0].entity.name).toEqual('Bob');
        });

        it('should sort things descending', function() {
            cols[0].sort.direction = uiGridConstants.DESC;
            var ret = rowSorter.sort(grid, rows, cols);
            expect(ret[0].entity.name).toEqual('Jim');
        });

        it('should not sort if useExternalSorting is not set', function() {
            cols[0].sort.direction = uiGridConstants.DESC;
            grid.options.useExternalSorting = false;

            var ret = rowSorter.sort(grid, rows, cols);

            expect(ret[0].entity.name).not.toEqual('Bob');
        });

    });

    describe('with sort by date column', function() {
        var grid, rows, cols, rowSorter,uiGridConstants;

        beforeEach(inject(function ($rootScope, _rowSearcher_, Grid, GridRow, GridColumn,  _rowSorter_, _uiGridConstants_) {
            rowSorter = _rowSorter_;
            uiGridConstants = _uiGridConstants_;
            grid = new Grid({id: 123});
            var e1 = { name: 'Bob', date: new Date('2015-07-01T13:25:00+00:00') };
            var e2 = { name: 'Jim', date: new Date('2015-06-29T13:25:00+00:00') };
            var e3 = { name: 'Bill', date: new Date('2015-07-03T13:25:00+00:00') };

            rows = [
                new GridRow(e1, 0, grid),
                new GridRow(e2, 1, grid),
                new GridRow(e3, 1, grid)
            ];

            cols = [
                new GridColumn({
                    name: 'name',
                    type: 'string'
                }, 0, grid),
                new GridColumn({
                    name: 'date',
                    type: 'date',
                    cellFilter: 'date:"EEEE"',
                    sort: {
                        direction: uiGridConstants.ASC,
                        priority: 0
                    }
                }, 1, grid)
            ];

        }));

        it('should sort by the actual date', function(){
            var ret = rowSorter.sort(grid, rows, cols);

            expect(ret[0].entity.name).toEqual('Jim');
        });

        it('should sort by the day of week string', function(){
            cols[1].sortCellFiltered = true;

            var ret = rowSorter.sort(grid, rows, cols);

            expect(ret[0].entity.name).toEqual('Bill');
        });

        it('should sort by the name when a sort is applied', function(){
            cols[0].sort.direction = uiGridConstants.ASC;
            var ret = rowSorter.sort(grid, rows, cols);
            expect(ret[0].entity.name).toEqual('Jim');
        });

    });

});