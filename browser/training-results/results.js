'use strict';

app.config(function ($stateProvider) {
  $stateProvider.state('results', {
    url: '/results',
    templateUrl: '/training-results/template.html',
    controller: 'ResultsCtrl'
  });
});

app.controller('ResultsCtrl', function ($scope, TrainerFactory) {

  // example:
  // $scope.accuracyGraph = [0.5, 0.80, 0.81, 0.85, 0.88, 0.90, 0.92, 0.93, 0.94, 0.95, 1.99];
  // TrainerFactory.resultObj...
  $scope.accuracyGraph = [];

  TrainerFactory.train(TrainerFactory)
  .then(function (resultObj) {
    $scope.accuracyGraph = [];
  });

  $scope.loading = function () {
    if ($scope.accuracyGraph.length > 0) {
      console.log("here",$scope.accuracyGraph.length);
      $scope.showResult = true;
    } else {
      $scope.showResult = false;
    }
  };

  $scope.loading();

  var margin = {
    top: 30,
    right: 20,
    bottom: 30,
    left: 50
  };

  var width = 600 - margin.left - margin.right; // 530
  var height = 350 - margin.top - margin.bottom; // 290

  // var parseDate = d3.time.format("%d-%b-%y").parse;

  var x = d3.scaleLinear().range([0, width]);
  var y = d3.scaleLinear().range([height, 0]);

  var svg = d3.select('graph')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

  var xAxis = d3.axisBottom().scale(x) // How frequent marks on x-axis
      .ticks(5);

  var yAxis = d3.axisLeft().scale(y) // How frequent marks on y-axis
      .ticks(5);

  var valueline = d3.line()
      .x(function (d) {
        return x(d.epoch);
      })
      .y(function (d) {
        return [y(d.accuracy)];
      });

  var data = [];

  function setData (dataArr) {
    for(var i = 0; i < dataArr.length; i++) {
      data.push({accuracy: dataArr[i], epoch: i * 5});
    }
  }

  setData($scope.accuracyGraph);

  // Scale the range of the data
  x.domain(d3.extent(data, function (d) {
    return d.epoch;
  }));
  y.domain([0, d3.max(data, function (d) {
    return d.accuracy;
  })]);

  svg.append('path') // Add the valueline path.
  .attr('d', valueline(data));

  svg.append('g') // Add the X Axis
  .attr('class', 'x axis')
  .attr('transform', 'translate(0,' + height + ')')
  .call(xAxis);

  svg.append('g') // Add the Y Axis
  .attr('class', 'y axis')
  .call(yAxis);

});
