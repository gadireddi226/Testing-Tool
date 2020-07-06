import { TestCaseCtrl } from './TestCaseCtrl.js';
import {uiAlert} from '../alertsLogic/UIAlert';
import {http} from "../http";
// UITestCase Controller
export const UITestCaseCtrl = (function(){
    const UISelectors = {
      tableOfSteps: '#data_table',
      addBtn: 'addBtn',
      editBtn: 'edit_button',
      saveBtn: 'save_button',
      deleteBtn: 'delete_button',
      stepDescription: '#description',
      setUp: '#setUp',
      expResult: '#expResult',

      title: "#nameOfTestCase",
      status: "#status",
      creator: "#creator",
      priority: '#priority',
      type: "#type",
      version: "#version",
    } 
    
    function setVersionSelector(versions) {
      let selectVersion = document.getElementById("version");
      let lastIndex = versions.length-1;

      versions.forEach((version,index)=> {
        let option = document.createElement("option");
        option.text = version;
        selectVersion.add(option);
        if (lastIndex===index) {
          selectVersion.value = version;
        }
      })
    }

    function clearAll(){
      clearTable();
      clearVersionSelector();

    }

    function clearTable() {
      let uiSteps = document.querySelector("#data_table").rows;
      let indexOfNewRow = uiSteps.length;
      for (let index = 0; index < indexOfNewRow-2; index++) {
        uiSteps.item(1).outerHTML = "";  
      }     
    }

    function clearVersionSelector(){
      let versionSelectorOptions = document.querySelector("#version").children;
      let length = versionSelectorOptions.length;
      for (let index = 1; index < length; index++) {
        versionSelectorOptions[1].outerHTML = "";        
      }
    }

    function updateNumbersOfrows() {
      let tableOfSteps = document.querySelector(UISelectors.tableOfSteps);
      let numberOfRows = tableOfSteps.rows.length;
      let rows = Array.from(document.querySelectorAll("#number"));
      rows.forEach((step,index) => {
        step.innerHTML = index+1;
      });
      //update add row
      document.querySelector("#new_number").value = numberOfRows-1;
      
    }

    function changeOtherCheckBoxes(bool,form,id){
      let none = form.querySelector("#none");
      let passed = form.querySelector("#passed");
      let failed = form.querySelector("#failed");
      let blocked = form.querySelector("#blocked");
     
      switch(id) {
        case "none":
          passed.disabled = bool;
          failed.disabled = bool;
          blocked.disabled = bool;
          break;
        case "passed":
          none.disabled = bool;
          failed.disabled = bool;
          blocked.disabled = bool;
          break;
        case "failed":
          none.disabled = bool;
          passed.disabled = bool;
          blocked.disabled = bool;
          break;
        case "blocked":
          none.disabled = bool;
          passed.disabled = bool;
          failed.disabled = bool;
          break;
        default:
          console.log("unrecognized");
      }
    }

    // Public methods
    return {
      populateStepsTable: function(steps){
        let html = '';
        let tableOfSteps = document.querySelector(UISelectors.tableOfSteps);
        let indexBeforeInputRow = tableOfSteps.rows.length-1;
    
        document.querySelector(UISelectors.tableOfSteps).children[0].style.display = "table-header-group";
        steps.forEach(function(step,index) {
            let table_len=index+1;
            let size=table_len;
            html +=`<tr id="row-${table_len}">
                <td id="number">${table_len}</td>
                <td id="description">${step.description}</td>
                <td id="setUp">${step.setUp}</td>
                <td id="expResult">${step.expResult}</td>
                <td>
                    <input type="button" id="edit_button" value="Edit" class="edit"> 
                    <input type="button" id="save_button" value="Save" class="save" style="display: none;"> 
                    <input type="button" value="Delete" class="delete">
                    <form action="#" style="display: none;">
                      <p class="state_">
                        <label>
                          <input id="none" type="checkbox" class="filled-in"   />
                          <span>None</span>
                        </label>
                      </p>
                      <p class="state_">
                        <label>
                          <input id="passed" type="checkbox" class="filled-in"  />
                          <span>Passed</span>
                        </label>
                      </p>
                      <p class="state_">
                        <label>
                          <input id="failed" type="checkbox" class="filled-in"  />
                          <span> Failed</span>
                        </label>
                      </p>
                      <p class="state_">
                        <label>
                          <input id="blocked" type="checkbox" class="filled-in" />
                          <span>Blocked</span>
                        </label>
                      </p>
                    </form>
                </td></tr>`
        });  
        // Insert steps 
        tableOfSteps.insertRow(indexBeforeInputRow).outerHTML = html;
      },
      getTestCaseInfo: function(){
        return {
          title: document.querySelector(UISelectors.title).value,
          creator: document.querySelector(UISelectors.creator).value,
          priority: document.querySelector(UISelectors.priority).value,
          status: document.querySelector(UISelectors.status).value,
          version: document.querySelector(UISelectors.version).value,
          type: document.querySelector(UISelectors.type).value,
        }
      },
      setTestCaseInfo: function(info) {
        document.querySelector(UISelectors.title).value = info.title;
        document.querySelector(UISelectors.creator).value = info.creator;
        document.querySelector(UISelectors.status).value = info.status;
        document.querySelector(UISelectors.priority).value = info.priority;
        document.querySelector(UISelectors.type).value = info.type;
        setVersionSelector(info.version);

      },
      getStepInput: function(){
        return {
        description:document.querySelector("#new_description").value,
        setUp:document.querySelector("#new_setUp").value,
        expResult:document.querySelector("#new_expResult").value,
        }
      },
      addStep: function() {
        const step = UITestCaseCtrl.getStepInput();
        //validate row
        if(step.description === '' && step.setUp === '' && step.expResult === '') {
          uiAlert.showAlert('Please fill at least one field!', 'alert alert-danger');
        }
        else {      
          // Show table headers
          document.querySelector(UISelectors.tableOfSteps).children[0].style.display = "table-header-group";
          let row_number = TestCaseCtrl.getSteps().length+1;
          console.log(row_number);
          // Add HTML
          let tableOfSteps = document.querySelector(UISelectors.tableOfSteps);
          let indexBeforeInputRow = tableOfSteps.rows.length-1;
          // Insert item
          let html =`<tr id="row-${row_number}">
                  <td id="number">${row_number}</td>
                  <td id="description">${step.description}</td>
                  <td id="setUp">${step.setUp}</td>
                  <td id="expResult">${step.expResult}</td>
                  <td>
                      <input type="button" id="edit_button" value="Edit" class="edit" > 
                      <input type="button" id="save_button" value="Save" class="save" style="display: none;"> 
                      <input type="button" value="Delete" class="delete" >
                      <form action="#" style="display: none;" >
                      <p class="state_">
                        <label>
                          <input id="none" type="checkbox" class="filled-in"   />
                          <span>None</span>
                        </label>
                      </p>
                      <p class="state_">
                        <label>
                          <input id="passed" type="checkbox" class="filled-in"  />
                          <span>Passed</span>
                        </label>
                      </p>
                      <p class="state_">
                        <label>
                          <input id="failed" type="checkbox" class="filled-in"  />
                          <span> Failed</span>
                        </label>
                      </p>
                      <p class="state_">
                        <label>
                          <input id="blocked" type="checkbox" class="filled-in" />
                          <span>Blocked</span>
                        </label>
                      </p>
                    </form>
                  </td></tr>`
          // Insert step to storage
          TestCaseCtrl.isThereChange();
          TestCaseCtrl.addStep(step.description,step.setUp,step.expResult);
          // Inser step to UI
          tableOfSteps.insertRow(indexBeforeInputRow).outerHTML = html;

          document.querySelector(`#row-${row_number}`).querySelector("#save_button").style.display="none";
          document.querySelector("#new_description").value = "";
          document.querySelector("#new_setUp").value = "";
          document.querySelector("#new_expResult").value = "";
          document.querySelector("#new_number").value = indexBeforeInputRow+1;
          TestCaseCtrl.isThereChange();
        }
      },
      deleteStep: function(e) {
        // td with buttons 
        if(e.target.className === "delete"){
          console.log("Delete Clicked ");
          const cellButtons = e.target.parentElement;
          const row = cellButtons.parentElement; 
          // delete in html and in controller storage
          let indexOfElementToBeRemoved = Number(row.querySelector("#number").innerHTML);
          TestCaseCtrl.removeStep(indexOfElementToBeRemoved);
          row.outerHTML="";
          //update numbers
          updateNumbersOfrows();
          e.preventDefault();
        }
      },
      editStep: function(e) {
        if(e.target.className === "edit") {
          console.log("Edit Clicked")
          const cellButtons = e.target.parentElement;
          const row = cellButtons.parentElement; 
          const editBtn = cellButtons.children[0];
          const saveBtn = cellButtons.children[1];

          editBtn.style.display="none";
          saveBtn.style.display="table-cell";

          const cellDescription = row.querySelector(UISelectors.stepDescription);
          const cellSetup = row.querySelector(UISelectors.setUp);
          const cellExpRes = row.querySelector(UISelectors.expResult);
          const arrayFields = [cellDescription,cellSetup,cellExpRes]
          
          arrayFields.forEach(function(field) {
            let previousText = field.innerHTML;
            field.innerHTML = "";

            //create input element
            let inputDescription = document.createElement("input");
            inputDescription.setAttribute("value",previousText);
            inputDescription.setAttribute("type","text");
            field.appendChild(inputDescription)
          })
          e.preventDefault();
       }
      },
      saveStep: function(e) {
        if(e.target.className === "save") {
          console.log("Edit Clicked")
          const cellButtons = e.target.parentElement;
          const row = cellButtons.parentElement; 
          const rowIndex = Number(row.querySelector("#number").innerHTML);
          const editBtn = cellButtons.children[0];
          const saveBtn = cellButtons.children[1];
          
          const inputDescription = row.querySelector(UISelectors.stepDescription).firstChild;
          const inputSetup = row.querySelector(UISelectors.setUp).firstChild;
          const inputExpRes = row.querySelector(UISelectors.expResult).firstChild;
          const arrayFields = [inputDescription,inputSetup,inputExpRes];
          
          let valuesForStorage =[];
          arrayFields.forEach(function(field) {
              let value = field.value;
              let cell = field.parentElement;
              cell.innerHTML = value;
              valuesForStorage.push(value)
          })
          // add to storage
          TestCaseCtrl.modifyStep(rowIndex,valuesForStorage[0],valuesForStorage[1],valuesForStorage[2]);
          // show proper buttons
          editBtn.style.display="table-cell";
          saveBtn.style.display="none";
          e.preventDefault();
        }
      },
      statusOfStepUpdated: function(e) {
        const checkbox = e.target;
        if(checkbox.type == "checkbox") {
          let checkBoxesParent = checkbox.parentElement.parentElement.parentElement;
          switch(checkbox.id) {
            case "none":
              console.log(checkbox.checked);
              changeOtherCheckBoxes(checkbox.checked,checkBoxesParent,"none");
              break;
            case "passed":
              console.log(checkbox.checked);
              changeOtherCheckBoxes(checkbox.checked,checkBoxesParent,"passed");
              break;
            case "failed":
              console.log(checkbox.checked);
              changeOtherCheckBoxes(checkbox.checked,checkBoxesParent,"failed");
              break;
            case "blocked":
              console.log(checkbox.checked);
              changeOtherCheckBoxes(checkbox.checked,checkBoxesParent,"blocked");
              break;
            default:
              console.log("unrecognize");
              // code block
          }
        }
      },
      changeTestCaseVersion:function(e) {
        console.log("changed version");
        let version = e.target.value;
        TestCaseCtrl.setTestCaseVersionBaseOnSelect(version);
        UITestCaseCtrl.createUIelements();
        e.target.value = version; //set selector to users latest state
        var elems = document.querySelectorAll('select');
        var options = document.querySelectorAll('option');
        var instances = M.FormSelect.init(elems, options); 
        //e.preventDefault();
      },
      hideFirstRow: function() {
        document.querySelector(UISelectors.tableOfSteps).children[0].style.display = "none";
      },
      getSelectors: function() {
        return UISelectors;
      },
      createUIelements:function(){
        clearAll();
        UITestCaseCtrl.populateStepsTable(TestCaseCtrl.getSteps());
        UITestCaseCtrl.setTestCaseInfo(TestCaseCtrl.getTestcaseInfo());
      },
      saveTC:function(e) {
        let info = UITestCaseCtrl.getTestCaseInfo();
        console.log(info.creator);
        TestCaseCtrl.setTestcaseInfo(info.title,info.status, info.creator, info.priority, info.type, info.version );
        console.log(TestCaseCtrl.getSteps());
        if(TestCaseCtrl.isThereChange()){       
          TestCaseCtrl.applyChanges();
          let data = TestCaseCtrl.getDataHistory();
          // Update versions
          http.put(`http://localhost:3000/testCases/${data.title}`, data)
          .then(data => {
            uiAlert.showAlert('TestCase updated', 'alert alert-success');
          })
          .catch(err => console.log(err));
          e.preventDefault();
        }
        else {
          uiAlert.showAlert("Nothing to be saved.","alert alert-info");  
          console.log("AlertFired") 
        }
      },
      saveNewTC:function(e) {
        let info = UITestCaseCtrl.getTestCaseInfo();
        TestCaseCtrl.setTestcaseInfo(info.title,info.status, info.creator, info.priority, info.type, info.version );
        TestCaseCtrl.createZeroVersion();
        let data = TestCaseCtrl.getDataHistory();
        console.log("save new tc");
        // add testcase to database
        http.post(`http://localhost:3000/testCases`, data)
        .then(data => {
          uiAlert.showAlert('NewTestCase Saved', 'alert alert-success');
        })
        .catch(err => console.log(err));
        // go to test suite page
        window.location.href = "index.html"
        e.preventDefault();      
      }
    }
  })();