import { SummaryCtrk } from './SummaryCtrl';
import {uiAlert} from '../../alertsLogic/UIAlert';

// UITestCase Controller
export const UISummaryCtrl = (function() {
    const UISelectors = {
      tableOfTestCases: '#data_table',
      title: "#nameOfTestCase",
      status: "#status",
      lastRun: "#lastRun",
      version: "#version",
    } 

    return {
      createSummary: function (summary) {
        let html = '';
        let tableOfTC = document.querySelector(UISelectors.tableOfTestCases);
        summary.forEach((element) => {
          html +=`<tr id="row" data-href="${element.name}">
              <td id="name">${element.name}</td>
              <td id="version">${element.version}</td>
              <td id="status">${element.status}</td>
              <td id="lastRun">${element.lastRun.getFullYear()}</td>
             </tr>`
        });  
        // Insert steps 
        tableOfTC.insertRow(1).outerHTML = html;
      },
      openTestCase: function(e) {
        if(e.target.id === "name") {
          // testing purposes
          // console.log(e.target.parentElement);
          let row = e.target.parentElement;
          let rowLink = row.dataset.href;
          // window.location.href = rowLink;
          //
          localStorage.setItem("TestCaseRequest",rowLink);
          window.location.href = "testCase.html"

        }
        else{
          console.log(e.target);
        }
      }
    }

})();