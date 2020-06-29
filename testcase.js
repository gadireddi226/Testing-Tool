import { ui } from './src/dataControllers/TestCaseCtrl.js';

// // Step Controller
// const TestCaseCtrl = (function(){
//     // Step Constructor
//     const Step = function(description, setUp, expResult){
//       this.description = description;
//       this.setUp = setUp;
//       this.expResult = expResult;
//     }
  
//     // // Data Structure / State
//     const data = {
//       steps: [
//         //   {
//         //       description:"Hellow",
//         //       setUp:"asrad",
//         //       expResult:"yep"
//         //   },
//         //   {
//         //       description:"Second",
//         //       setUp:"wow",
//         //       expResult:"doge"
//         //   }

//       ],
//     }
//     // Public methods
//     return {
//       getSteps: function(){
//         return data.steps;
//       },
//       addStep: function(description, setUp,expResult){
//         // Create new step
//         newStep= new Step(description, setUp,expResult);
  
//         // Add to steps array
//         data.steps.push(newStep);
//         return newStep;
//       },
//       logData: function(){
//         console.log(data);
        
//       },
//       removeStep:function(index) {
//           const removedElement = data.steps.splice(index,1);
//           console.log("Removed elelment"+removedElement);
//       },
//       modifyStep:function(index,description, setUp,expResult) {
//         const newStep = new Step(description, setUp,expResult);
//         const changedElement = data.steps.splice(index,1,newStep);
//         console.log("Removed elelment"+removedElement);
//       }
//     }
//   })();

  // UITestCase Controller
const UICtrl = (function(){
    const UISelectors = {
      tableOfSteps: '#data_table',
      addBtn: 'addBtn',
      editBtn: 'edit_button',
      saveBtn: 'save_button',
      deleteBtn: 'delete_button',
      stepDescription: '#description',
      setUp: '#setUp',
      expResult: '#expResult'
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
            size=table_len;
            html +=`<tr id="row-${table_len}">
                <td id="number">${table_len}</td>
                <td id="description">${step.description}</td>
                <td id="setUp">${step.setUp}</td>
                <td id="expResult">${step.expResult}</td>
                <td>
                    <input type="button" id="edit_button" value="Edit" class="edit"> 
                    <input type="button" id="save_button" value="Save" class="save" style="display: none;"> 
                    <input type="button" value="Delete" class="delete">
                </td></tr>`
        });  
        // Insert steps 
        tableOfSteps.insertRow(indexBeforeInputRow).outerHTML = html;
      },
      getStepInput: function(){
        return {
        description:document.querySelector("#new_description").value,
        setUp:document.querySelector("#new_setUp").value,
        expResult:document.querySelector("#new_expResult").value,
        }
      },
      addStep: function() {
        const step = UICtrl.getStepInput();
        console.log(step)
        // Show table 
        document.querySelector(UISelectors.tableOfSteps).children[0].style.display = "table-header-group";
        row_number = TestCaseCtrl.getSteps().length+1;
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
                </td></tr>`
        // Insert steps 
        TestCaseCtrl.addStep(step.description,step.setUp,step.expResult);
        tableOfSteps.insertRow(indexBeforeInputRow).outerHTML = html;

        document.querySelector(`#row-${row_number}`).querySelector("#save_button").style.display="none";
        document.querySelector("#new_description").value = "";
        document.querySelector("#new_setUp").value = "";
        document.querySelector("#new_expResult").value = "";
        document.querySelector("#new_number").value = indexBeforeInputRow+1;
        
      },
      deleteStep: function(e) {
        // td with buttons 
        const cellButtons = e.target.parentElement;
        console.log(cellButtons)
        const row = cellButtons.parentElement; 
        row.outerHTML="";
      },
      editStep:function(e) {
        const cellButtons = e.target.parentElement;
        const row = cellButtons.parentElement; 
        const editBtn = cellButtons.children[0];
        const saveBtn = cellButtons.children[1];

        editBtn.style.display="none";
        saveBtn.style.display="block";

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
      },
      saveStep: function(e) {
        const cellButtons = e.target.parentElement;
        const row = cellButtons.parentElement; 
        const editBtn = cellButtons.children[0];
        const saveBtn = cellButtons.children[1];
        
        const inputDescription = row.querySelector(UISelectors.stepDescription).firstChild;
        const inputSetup = row.querySelector(UISelectors.setUp).firstChild;
        const inputExpRes = row.querySelector(UISelectors.expResult).firstChild;
        const arrayFields = [inputDescription,inputSetup,inputExpRes];
        
         arrayFields.forEach(function(field) {
             let value = field.value;
             let cell = field.parentElement;
             cell.innerHTML = value;
         })
       
         editBtn.style.display="block";
         saveBtn.style.display="none";
      },
      hideFirstRow: function() {
        document.querySelector(UISelectors.tableOfSteps).children[0].style.display = "none";
      },
      getSelectors: function() {
        return UISelectors;
      }
    }
  })();




document.addEventListener('DOMContentLoaded', function() {
    var elems = document.querySelectorAll('select');
    var options = document.querySelectorAll('option');
    var instances = M.FormSelect.init(elems, options); 
    let steps= TestCaseCtrl.getSteps()
    UICtrl.populateStepsTable(steps);
    //UPDATE STEP NUMBER FOR NEW STEP
    var table=document.getElementById("data_table");
    var table_len=steps.length+1;
    document.getElementById("new_number").value=table_len;
    //add listeners to steps
    if((TestCaseCtrl.getSteps().length)>0){
        document.querySelector('.delete').addEventListener('click',UICtrl.deleteStep);
        document.querySelector('.edit').addEventListener('click',UICtrl.editStep);
        document.querySelector('.save').addEventListener('click',UICtrl.saveStep);
    }
    document.querySelector('.add').addEventListener('click',UICtrl.addStep);
})
