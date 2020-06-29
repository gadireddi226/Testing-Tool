import { http } from './http';
import { TestCaseCtrl } from './dataControllers/TestCaseCtrl';
import { UITestCaseCtrl } from './dataControllers/UITestCaseCtrl';
import {uiAlert} from "./alertsLogic/UIAlert";
import {SummaryCtrl} from './dataControllers/TestCasesSummary/SummaryCtrl';
import {UISummaryCtrl} from './dataControllers/TestCasesSummary/UISummaryCtrl';


const app = {
  baseURL: 'http://jsonplaceholder.typicode.com/',
  init: () => {
      document.addEventListener('DOMContentLoaded', app.load);
      console.log('HTML loaded');
  },
  load: () => {
    //load selectors
      var elems = document.querySelectorAll('select');
      var options = document.querySelectorAll('option');
      var instances = M.FormSelect.init(elems, options); 
     //
      console.log("load method triggerd");
      app.showLoading();
      app.getData();
  },
  showLoading: () => {
      let ul = document.querySelector('#data_table');
      let li = document.createElement('td');
      li.textContent = 'Loading...';
      li.className = 'loading-table';
      ul.insertBefore(li,ul.childNodes[0]);
  },
  getData: () => {
      //based on the current page...
      let page = document.body.id;
      switch (page) {
          case 'testCase':
              app.getTestCase();
              //add custom event listeners for posts page
              document.querySelector('.add').addEventListener('click',UITestCaseCtrl.addStep);
              document.querySelector('#wrapper').addEventListener('click',UITestCaseCtrl.deleteStep);
              document.querySelector('#wrapper').addEventListener('click',UITestCaseCtrl.editStep);
              document.querySelector('#wrapper').addEventListener('click',UITestCaseCtrl.saveStep);
              document.querySelector('#version').addEventListener('change',UITestCaseCtrl.changeTestCaseVersion);
              document.querySelector('#save-testCase').addEventListener('click',UITestCaseCtrl.saveTC);
              break;
          case 'testcases summary':
              console.log("testcases summary")
              app.getTestCasesSummary();
              document.querySelector('#wrapper').addEventListener('click',UISummaryCtrl.openTestCase);
              //add custom event listeners for users page
              break;
        //   case 'photos':
        //       // app.authorize();
        //       //app.getPhotos();
        //       //add other custom functions
          default:
              app.somethingElse();
      }
  },
  getTestCase: () => {
    let passedVar = localStorage.getItem("TestCaseRequest");
    if(passedVar === null) {
        passedVar = "DefaultTest";
    }
    http.get(`http://localhost:3000/testCases?title=${passedVar}`)
     .then(data => { 
         // take first result
         if (data[0] != null){
            let testcase = data[0];
            // setup TestCaseCtrl storage
            TestCaseCtrl.setTestCaseVersionsAndTitle(testcase);
            TestCaseCtrl.setFetchedData();

            // remove the loading part
            let ul = document.querySelector('.loading-table');
            ul.outerHTML = '';
            // create UI based on testcase storage
            UITestCaseCtrl.createUIelements();
            console.log(TestCaseCtrl.getTestcaseInfo());
            
            //reload selectors
            var elems = document.querySelectorAll('select');
            var options = document.querySelectorAll('option');
            var instances = M.FormSelect.init(elems, options); 
            //
            console.log(TestCaseCtrl.getCurTestCase());
        }
        var steps = Number(TestCaseCtrl.getLengthSteps());
        var add_row_Number=steps+1;
        document.getElementById("new_number").value=add_row_Number;
    })
     .catch(err => console.log(err));
  },
  getTestCasesSummary: () => {
    {
        http.get('http://localhost:3000/testCases')
         .then(data => { 
            // remove the loading part
            let ul = document.querySelector('.loading-table');
            ul.outerHTML = '';
            SummaryCtrl.setFetchedData(data);
            UISummaryCtrl.createSummary(SummaryCtrl.getSummary());
            
        })
         .catch(err => console.log(err));
    }
  },

  err: (err) => {
      //remove the loading li
      let ul = document.querySelector('#wrapper');
      ul.innerHTML = '';
      //display the error to the user
      let div = document.createElement('div');
      div.className = 'error msg';
      div.textContent = "error message";//err.message;
      document.body.appendChild(div);
      setTimeout(() => {
          let div = document.querySelector('.error.msg');
          div.parentElement.removeChild(div);
      }, 3000);
  }
}
app.init();