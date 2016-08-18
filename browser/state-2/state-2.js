'use strict';

app.config(function($stateProvider) {

    $stateProvider.state('state2', {
        url: '/train',
        templateUrl: '/state-2/template.html',
        controller: 'State2Ctrl',
        resolve: {
            inputArr: function(TrainerFactory) {
                return TrainerFactory.inputArr;
            }
        }
    });
});

app.controller('State2Ctrl', function($scope, TrainerFactory, inputArr, $state) {
    //console.log("STATE2 INPUTLENGTH ",inputArr.length);
    $scope.numInputs = inputArr.length;
    $scope.inputLayer = {};
    $scope.inputLayer.neurons = [];
    for (var i = 0; i < $scope.numInputs; i++) {
        $scope.inputLayer.neurons.push(new Neuron(i));
        $scope.inputLayer.neurons[i].layerType = "i";
    }

    let defaultNumNeurons = $scope.numInputs;
    $scope.hiddenLayers = [new HiddenLayer()];

    $scope.outputLayer = {};
    $scope.outputLayer.neurons = [];
    $scope.outputLayer.neurons.push(new Neuron(i));
    $scope.outputLayer.neurons[0].layerType = "o";

    let allLayers = [];


    function Neuron(id) {
        this.id = id;
        this.x = null;
        this.y = null;
        this.layerType = "h";
    }

    function HiddenLayer() {
        this.neurons = [];
        //console.log(defaultNumNeurons);
        for (var i = 0; i < defaultNumNeurons; i++) { //default of 5 neurons
            this.neurons.push(new Neuron(i));
        }
    }

    HiddenLayer.prototype.addToNeurons = function() {
        this.neurons.push(new Neuron(this.neurons.length + 1));
    };

    HiddenLayer.prototype.removeFromNeurons = function() {
        this.neurons.pop();
    };


    $scope.trainNetwork = function(){
      console.log("clicked train");
      TrainerFactory.hiddenLayersArr = [];
      $scope.hiddenLayers.forEach(layer =>{
        TrainerFactory.hiddenLayersArr.push(layer.neurons.length);
      })
      $state.go('results');
      //console.log("TrainerFactory", TrainerFactory);
    };

    $scope.addLayers = function() {
      if($scope.hiddenLayers.length > 2) return; //No more than 3 layers
        $scope.hiddenLayers.push(new HiddenLayer());
        drawNetwork(false);
    };

    $scope.removeLayers = function() {
        if ($scope.hiddenLayers.length > 1) { //No less than 1 layer
            $scope.hiddenLayers.pop();
        }
        drawNetwork(false);
    };

    $scope.addNeurons = function(index) {

        $scope.hiddenLayers[index].addToNeurons();
        //console.log("added neurons", $scope.hiddenLayers[index]);
        drawNetwork(false);
    };

    $scope.removeNeurons = function(index) {
      if($scope.hiddenLayers[index].neurons.length <= 1) return;
        $scope.hiddenLayers[index].removeFromNeurons();
        //console.log("removed neurons", $scope.hiddenLayers[index]);
        drawNetwork(false);
    };



    function getAllLayers() {
        allLayers = [];
        allLayers.push($scope.inputLayer);
        $scope.hiddenLayers.forEach(layer => {
            allLayers.push(layer);
        })
        allLayers.push($scope.outputLayer);
        return allLayers;
    }

    function drawNetwork(initial) {
        if (!initial) d3.select("svg").remove();

        let width = 700,
            height = 1000,
            radius = 10,
            links = [],
            neuronsArr = [],
            X;


        allLayers = getAllLayers();
        let domainArr = Array.apply(null, Array(allLayers.length))
            .map((d, i) => i);
        X = d3.scalePoint().domain(domainArr).range([0, width]).padding(0.10);
        allLayers.forEach(function(layer, indexLayer) {
            layer.neurons.forEach(function(neuron, index) {
                neuron.x = X(indexLayer);
                neuron.y = (index * 40) + 10;
                neuronsArr.push(neuron);
            });
        });

        for (let l = 0; l < allLayers.length; l++) {
            let sourceLayer;
            let destLayer;
            //console.log("i'm layer ", allLayers[l]);
            if (l < allLayers.length - 1) {
                sourceLayer = allLayers[l];
                destLayer = allLayers[l + 1];
                sourceLayer.neurons.forEach(sn => {
                    destLayer.neurons.forEach(dn => {
                        links.push({ source: sn, target: dn });
                    })
                })
            }
        }

        let svg = d3.select("#network").append("svg")
            .attr("width", width)
            .attr("height", height)
            .append("g");

        let circle = svg.selectAll(".circle")
            .data(neuronsArr)
            .enter()
            .append("g")
            .style("fill", function(d,i){
              //console.log("H",d.layerType);
              if(d.layerType === 'i') return "43FF00";
              if(d.layerType === 'h') return "00F1FF";
              else return "FD1F82";
            });

        let el = circle.append("circle")
            .attr("cx", function(d) {
                return d.x
            })
            .attr("cy", function(d) {
                return d.y
            })
            .attr("r", radius)



        let link = svg.selectAll(".line")
            .data(links)
            .enter()
            .append("line")
            .attr("class", "link")
            .attr("x1", function(d) {
                return d.source.x + 10
            })
            .attr("y1", function(d) {
                return d.source.y
            })
            .attr("x2", function(d) {
                return d.target.x - 10
            })
            .attr("y2", function(d) {
                return d.target.y
            });

    }

    //initializing
    allLayers = getAllLayers();
    drawNetwork(true);


});
