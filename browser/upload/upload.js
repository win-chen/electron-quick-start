app.config(function($stateProvider) {
  $stateProvider.state('upload', {
    url: '/upload',
    templateUrl: 'browser/upload/upload.html',
    controller: 'UploadCtrl'
  })
})
app.controller('UploadCtrl', function($scope, TrainerFactory, $state) {

  // VARIABLES
  $scope.headers = [];
  $scope.data = [];
  $scope.outputIndex;
  $scope.columnTracker = [];
  $scope.columnClass = "";
  //nghide if

  // EVENT LISTENERS
  var fReader = new FileReader();
  var fileInput = document.getElementById('files');
  fileInput.addEventListener('change', function(event){
    var file = event.target.files[0];
    fReader.addEventListener("loadend", function(event) {
      var textFile = event.target.result;
      //console.log(textFile);
      $scope.upload.file = textFile;
    })
    fReader.readAsText(file); //emits loadended event
  })

  // FUNCTIONS
  $scope.uploadData = function() {
    var uploaded = $scope.upload;
    convertToArr(uploaded.file, uploaded.delimiter);
    $scope.showData = true;
  }

  function convertToArr(str, delimiter){
    if(delimiter == "Space") delimiter = " ";
    var newArr = str.split("\n").map(row=>{
      return row.split(delimiter)
    })
    if($scope.upload.headers==='yes') {
      $scope.headers = newArr[0].slice();
      newArr.splice(0, 1);
    }
    else {
      for(var i = 1; i <= newArr[0].length; i++) {
        $scope.headers.push("Column " + i)
      }
    }
    var transposed = transpose(newArr);
    $scope.data = transposed;
    initColumns();
  }

  function initColumns() {
    var numColumns = $scope.headers.length
    for(var i = 0; i < numColumns; i++) {
      $scope.columnTracker.push(1);
    }
    $scope.outputIndex = numColumns - 1;
    $scope.columnTracker[$scope.outputIndex] = 0;
  }

  function transpose(array) {
    if(!array.length) return [];
    var newArr = []
    for(var i = 0; i < array[0].length; i++) {
        newArr.push([]);
        for(var j = 0; j < array.length; j++) {
            newArr[i].push(array[j][i]);
        }
    }
    return newArr;
  }

  $scope.toggleInputCol = function(index) {
    if(!$scope.outputIndex) {
      $scope.outputIndex = index;
      $scope.columnTracker[index] = 0;
    }
    else {
      $scope.columnTracker[index] *= -1;
    }
  }
  $scope.toggleOutputCol = function() {
    $scope.columnTracker[$scope.outputIndex] = 1;
    $scope.outputIndex = null;
  }

  $scope.sendToBuilder = function() {
    var inputArr = [];
    var outputArr = [];
    var headerReference = {};
    var header;
    $scope.columnTracker.forEach(function(ele, index) {
      header = $scope.headers[index];
      if(ele == 1) {
        inputArr.push($scope.data[index]);
        headerReference[inputArr.length - 1] = header;
      }
      if(ele == 0) {
        outputArr.push($scope.data[index]);
        headerReference.output = header;
      }
    })
    // console.log("inputArr", inputArr);
    // console.log("outputArr", outputArr);
    // console.log("headerReference", headerReference);

    var obj = {
      classType: $scope.upload.problemType,
      inputArr: inputArr,
      outputArr: outputArr,
      headerReference: headerReference
    }
    TrainerFactory.setData(obj);
    //console.log(obj);
    // console.log("INPUTARR", TrainerFactory);
    $state.go('state2')
  }

})
