import { elementTypes, formDataCollection } from "./utils.js";
let formData = formDataCollection;
const sideBarelements = document.getElementsByClassName("types-of-elements")[0];

//Header is rendered here
function renderHeader() {
  document.getElementsByTagName("header")[0].innerHTML = `
<div class="form-designer">Form Designer</div>
      <button class="btn-save">Save</button>
`;
}
renderHeader();

// Side bar is rendered here
function rendersidebar() {
  sideBarelements.innerHTML = "";
  elementTypes.forEach((ele) => {
    sideBarelements.innerHTML += `
        <button class="addElement" id=${ele} >
        <span>${ele}</span> <span>+</span>
        </button>
        
        `;
  });
}
rendersidebar();

// =============Side bar logic done below================
const sideBarBtns = document.querySelectorAll(".addElement");
// tracking which Element need to Add
sideBarBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    addThisElement(e.target.id);
  });
});

// adding data for new Element
function addThisElement(type) {
  let newObjforNewElement = {
    id: Math.random().toString(),
    type: type,
  };

  if (type == "input" || type == "textarea") {
    newObjforNewElement.placeholder = "Sample placeholder";
    newObjforNewElement.label = `${type == "input" ? "Sample Label" : type} `;
  } else {
    newObjforNewElement.options = ["Option1", "Option2", "Option3"];
    newObjforNewElement.label = `Select `;
  }
  formData.push(newObjforNewElement);
  RenderFormElements(formData);
}

// Rendering updated form
let form = document.getElementsByTagName("form")[0];
function RenderFormElements(upDatedData) {
  form.innerHTML = "";
  if (upDatedData.length == 0) {
    form.innerHTML = "Add some Elements";
    return;
  }
  upDatedData.forEach((obj, index) => {
    if (obj.type == "input") {
      form.innerHTML += `
      <div class="eachElement" id=${index}>
      <div class="label-icons">
        <div>${obj.label}</div>
        <span class="material-icons deleteThis" id=${obj.id}> delete </span>
      </div>
      <input type="text" placeholder="${obj.placeholder}"/>
    </div>

      `;
    } else if (obj.type == "textarea") {
      form.innerHTML += `
      <div class="eachElement" id=${index}>
      <div class="label-icons">
        <div>${obj.label}</div>
        <span class="material-icons deleteThis" id=${obj.id}> delete </span>
      </div>
      <textarea name="" id="" cols="20" rows="5" placeholder="${obj.placeholder}"></textarea>
    </div>

      `;
    } else {
      form.innerHTML += `
      <div class="eachElement" id=${index}>
         <div class="label-icons">
          <div>${obj.label}</div>
          <span class="material-icons deleteThis" id=${obj.id}> delete </span>
            </div>
      <select name="">
      <option value="" class="eachoption">Choose options</option>
      ${obj.options
        .map((val) => `<option value="" class="eachoption">${val}</option>`)
        .join()}
        </select>
        </div> 
`;
    }
  });
  trackDeleteIconAndDelete();
  AttachAllEventOfDraggable();
}
RenderFormElements(formData);

//tracking the Element to to be deleted
function trackDeleteIconAndDelete() {
  let deleteIconsEle = document.querySelectorAll(".deleteThis");
  deleteIconsEle.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      formData = formData.filter((obj) => obj.id != e.target.id);
      RenderFormElements(formData);
    });
  });
}

function AttachAllEventOfDraggable() {
  let eachElements = document.getElementsByClassName("eachElement");
  let arrOfEle = Array.from(eachElements);

  arrOfEle.forEach((each, ind) => {
    each.draggable = true;
    each.addEventListener("dragstart", () => dragStart(ind));
    each.addEventListener("dragover", (e) => dragoverIndex(e, ind));
    each.addEventListener("drop", (e) => dropEle(e, ind));
    // each.addEventListener("dragend", dragEnd);
  });
}

//Consoling the json data in console(Developer tool)
document.querySelector(".btn-save").addEventListener("click", () => {
  console.log(formData);
});

// ================================================
// Drag and drop functionality given below
let dragStartInd;
let dropInd;
function dragStart(ind) {
  //tracking starting index of drag
  dragStartInd = ind;
}

function dragoverIndex(e, ind) {
  //tracking gragOver  index
  e.preventDefault();
}

// updating order of Elements
function dropEle(e, ind) {
  e.preventDefault();
  dropInd = ind;
  let deltedEle = formData.splice(dragStartInd, 1);
  formData.splice(dropInd, 0, deltedEle[0]);
  RenderFormElements(formData);
}
