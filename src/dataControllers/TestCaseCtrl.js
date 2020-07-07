// Step Controller
export const TestCaseCtrl = (function(){
    // Step Constructor
    const Step = function(description, setUp, expResult){
      this.description = description;
      this.setUp = setUp;
      this.expResult = expResult;
    }
  
    // Data Structure / State
    const data = {
      creator: "",
      priority: "",
      type: "",
      status: "Open",
      version: 0,
      steps: [
        
      ],
    }
    const dataHistory = {
      title: "",
      versions: [],
    }

    function getVersionsOrdered (){
      let versionsArray = [];
      console.log(dataHistory.versions);
      dataHistory.versions.forEach((testCase)=>{
        versionsArray.push(Number(testCase.version));
      })
      return versionsArray.sort();
    }


    function setData(input) {
       //set method 
       console.log("setData()");
       data.creator = input.creator;
       data.priority = input.priority;
       data.type = input.type;
       data.status = input.status;
       data.version = input.version;
       data.steps = JSON.parse( JSON.stringify(input.steps) );
       console.log(data.steps);
    }
 
    // Public methods
    return {
      getSteps: function(){
        return data.steps;
      },
      getTitle: function() {
        return dataHistory.title;
      },
      getVersion: function() {
        return data.version;
      },
      getDataHistory: function() {
        if(dataHistory === undefined) {
          console.log("no history");
        }
        return dataHistory;
      },
      createZeroVersion: function() {
        // new TC case
          // add zero version to history
          dataHistory.versions.push(data);
      },
      isThereChange() {
        console.log("is there change?");
        let curTestCase = data;
        let oldTestCase = dataHistory.versions.find(element=>element.version === curTestCase.version);
        console.log(curTestCase.steps);
        console.log(oldTestCase);
        if (JSON.stringify(curTestCase)===JSON.stringify(oldTestCase)){
          console.log("They are same");
          return false;
        }
        else{
          console.log("They are different");
          return true;
        }
      },
      applyChanges() {
        //apply changes to storage
        let curTestCase = data;
        // let indexOfOldVersion = dataHistory.versions.findIndex(element=>element.version === curTestCase.version);
        // dataHistory.versions[indexOfOldVersion] = curTestCase;
        curTestCase.version = String(Number(TestCaseCtrl.getLatestVersion().version)+1);
        dataHistory.versions.push(curTestCase);
      },
      getCurTestCase: function() {
        return data;
      },
      getLengthSteps: function() {
        return data.steps.length;
      },
      getLatestVersion: function() {
        let latestVersion = data;
        console.log(latestVersion);
        dataHistory.versions.forEach((testcase_v) => {
          if(latestVersion.version<= testcase_v.version){
            latestVersion = testcase_v;
          }
        });
        return latestVersion;
      }
      ,
      addStep: function(description, setUp,expResult){
        // Create new step
        let newStep= new Step(description, setUp,expResult);
        console.log(newStep);
        // Add to steps array
        data.steps.push(newStep);
        console.log("addedStep should not change the down");
        console.log(dataHistory);
        return newStep;
      },
      setTestcaseInfo: function(title = "", status="0", creator = "",priority = "",type = "", version = "0") {
        dataHistory.title = title;
        data.status = status;
        data.creator = creator;
        data.priority = priority;
        data.type = type;
        data.version = version;
      },
      getTestcaseInfo: function() {
        //called by UI controller
        return {
          title: dataHistory.title,
          creator: data.creator,
          status: data.status,
          priority:data.priority,
          type: data.type,
          version: getVersionsOrdered(),
        }
      },
      setTestCaseVersionBaseOnSelect: function(version) {
        let testCaseVersion = dataHistory.versions.find(element=>element.version === version)
        setData(testCaseVersion);
        console.log(testCaseVersion);
        console.log(data);
      },
      setTestCaseVersionsAndTitle: function(testcase) {
        dataHistory.versions = testcase.versions;
        dataHistory.title = testcase.title;
        console.log("setTestCaseVersions log ");
        console.log(dataHistory.versions);
      },
      setFetchedData: function() {
        //set method for loading testcase
        let latestVersion = TestCaseCtrl.getLatestVersion();
        setData(latestVersion);
      },
      logData: function(){
        console.log(data);
        
      },
      removeStep:function(index) {
          const removedElement = data.steps.splice(index-1,1);
      },
      modifyStep:function(index,description, setUp,expResult) {
        const newStep = new Step(description, setUp,expResult);
        const changedElement = data.steps.splice(index-1,1,newStep);
      }
    }
  })();