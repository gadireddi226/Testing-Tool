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

    function returnLatestVersionAndStatus (testCase){
      let attributesArrayPairs = [];
      testCase.versions.forEach((t)=>{
        let attributePair = [t.version,t.status]
        attributesArrayPairs.push(attributePair);
      })
      return attributesArrayPairs.sort((a,b) => { return b[0]-a[0]})[0];
    }
    function transformCodesToDescription (status_code) {
      let status;
      
      switch(Number(status_code)) {
        case 0:
          status = "Open";
          break;
        case 1:
          status = "In progress";
          break;
        case 2:
          status = "Ready to test";
          break;
        case 3:
          status = "Testing";
          break;
        case 4:
          status = "Test passed";
          break;
        case 5:
          status = "Test failed";
          break;
        case 6:
          status = "Blocked";
          break;
        default:
          console.log("unrecognized");
          status = "Error";
      }
     return status;
    }

    function setData(input) {
      input.forEach(((t) => {
        let [version,status] = returnLatestVersionAndStatus(t);
        status =transformCodesToDescription(status);
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
      }
    }
  })();