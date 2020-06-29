// Step Controller
export const SummaryCtrl = (function(){
    // TestCase Constructor
    const TestCase = function(name, version, status = 0,lastRun = new Date("2020") ){
      this.name = name;
      this.version = version;
      this.status = status;
      this.lastRun = lastRun;
    }
  
    // Data Structure / State
    const summary = [];
    //testing
    const test =  {
        "title": "DefaultTest",
        "versions": [
            {
            "status": "2",
            "creator": "Erik Gadireddi",
            "type": "2",
            "version": "1",
            "priority":"3",
            "steps": [
            {
                "description":"open app",
                "setUp":"android",
                "expResult":"opened app"
            },
            {
                "description":"go  to settings",
                "setUp":"no internet connection",
                "expResult":"setting not loaded, error shown"
            }
            ]
            },
            {
              "status": "2",
              "creator": "Erik Gadireddi",
              "type": "2",
              "version": "0",
              "priority":"2",
              "steps": [
              {
                  "description":"start Windows",
                  "setUp":"not updated",
                  "expResult":"Windows make you wait"
              },
              {
                  "description":"Restart windows",
                  "setUp":"",
                  "expResult":"fixs problem"
              }
              ]
              },
              {
                "status": "1",
                "creator": "Erik Gadireddi",
                "type": "3",
                "version": "5",
                "priority":"1",
                "steps": [
                {
                    "description":"open app",
                    "setUp":"ios",
                    "expResult":"app opened"
                },
                {
                    "description":"go to settings",
                    "setUp":"wifi connection active",
                    "expResult":"settings loaded"
                }
                ]
                }
      ]
      };

    function returnLatestVersionAndStatus (testCase){
      let attributesArrayPairs = [];
      testCase.versions.forEach((t)=>{
        let attributePair = [t.version,t.status]
        attributesArrayPairs.push(attributePair);
      })
      return attributesArrayPairs.sort((a,b) => { return b[0]-a[0]})[0];
    }

    function setData(input) {
      input.forEach(((t) => {
        let [version,status] = returnLatestVersionAndStatus(t);
        console.log(t.title);
        console.log(version);
        let testCase = new TestCase(name = t.title,version = version,status = status);
        summary.push(testCase);
      }))
    }
 
    // Public methods
    return {
      setFetchedData: function(input) {
        setData(input);
      },
      getSummary: function(){
        return summary;
      },
    //   getCurTestCase: function() {
    //     return data;
    //   },
    //   getLengthSteps: function() {
    //     return data.steps.length;
    //   },
    //   getLatestVersion: function() {
    //     let latestVersion = data;
    //     console.log(latestVersion);
    //     dataHistory.versions.forEach((testcase_v) => {
    //       if(latestVersion.version<= testcase_v.version){
    //         latestVersion = testcase_v;
    //       }
    //     });
    //     return latestVersion;
    //   }
    //   ,
    //   addStep: function(description, setUp,expResult){
    //     // Create new step
    //     let newStep= new Step(description, setUp,expResult);
    //     console.log(newStep);
    //     // Add to steps array
    //     data.steps.push(newStep);
    //     console.log(data.steps);
    //     console.log(typeof(data.steps));
    //     return newStep;
    //   },
    //   setTestcaseInfo: function(title = "", status="Open", creator = "",priority = "",type = "", version = 0) {
    //     dataHistory.title = title;
    //     data.status = status;
    //     data.creator = creator;
    //     data.priority = priority;
    //     data.type = type;
    //     data.version = version;
    //   },
    //   getTestcaseInfo: function() {
    //     //called by UI controller
    //     return {
    //       title: dataHistory.title,
    //       creator: data.creator,
    //       status: data.status,
    //       priority:data.priority,
    //       type: data.type,
    //       version: getVersionsOrdered(),
    //     }
    //   },
    //   setTestCaseVersionBaseOnSelect: function(version) {
    //     let testCaseVersion = dataHistory.versions.find(element=>element.version === version)
    //     setData(testCaseVersion);
    //     console.log(testCaseVersion);
    //     console.log(data);
    //   },
    //   setTestCaseVersionsAndTitle: function(testcase) {
    //     dataHistory.versions = testcase.versions;
    //     dataHistory.title = testcase.title;
    //     console.log("setTestCaseVersions log ");
    //     console.log(dataHistory.versions);
    //   },
    //   setFetchedData: function() {
    //     //set method for loading testcase
    //     let latestVersion = TestCaseCtrl.getLatestVersion();
    //     setData(latestVersion);
    //   },
    //   logData: function(){
    //     console.log(data);
        
    //   },
    //   removeStep:function(index) {
    //       const removedElement = data.steps.splice(index-1,1);
    //   },
    //   modifyStep:function(index,description, setUp,expResult) {
    //     const newStep = new Step(description, setUp,expResult);
    //     const changedElement = data.steps.splice(index-1,1,newStep);
    //   }
    }
  })();