import { h, classNames, extractClass, createRef } from "uiBase";

function validateElement(el) {
  const { validity } = el;
  if (!validity) return;
  if (!validity.valid) {
    const invalids = [];
    for (let p in validity) {
      if (p !== "valid" && validity[p] === true) {
        invalids.push(p);
      }
    }
    if (invalids.length) el.dataset.invalid = invalids.join(" ");
    if (el.validationMessage)
      el.dataset.validationMessage = el.validationMessage;
  } else {
    delete el.dataset.invalid;
    delete el.dataset.validationMessage;
  }
}
function inputingHandler(evt) {
  const form = evt.currentTarget;
  form.checkValidity();
  form.classList.add("was-validated");
}
/**
 * 自定义验证，所有标记 data-validate 属性的元素
 * @param {HTMLFormElement} form
 * @returns
 */
function checkCustomValidity(form) {
  const others = [...form.querySelectorAll("[data-validate]")];

  [...form.elements, ...others].forEach((el) => {
    validateElement(el);
  });
  const validities = others.map((other) =>
    other.checkValidity ? other.checkValidity() : true
  );
  return validities.every((ok) => ok);
}
function submitHandler(evt) {
  const form = evt.target;

  form.removeEventListener("input", inputingHandler);
  form.addEventListener("input", inputingHandler, false);

  if (!OIForm.checkValidity(form)) {
    evt.preventDefault();
    evt.stopPropagation();
  }
}
/**
 * @module Form
 * @desc 表单
 * @example
 <form is="wp-form" class="row">
          <div class="col-md-4">
            <label for="validationCustom01" class="form-label">
              First name
            </label>
            <input
              type="text"
              class="form-control"
              id="validationCustom01"
              value="Mark"
              required
            />
            <div class="valid-feedback">Looks good!</div>
          </div>
          <div class="col-md-4">
            <label for="validationCustom02" class="form-label">
              Last name
            </label>
            <input
              type="text"
              class="form-control"
              id="validationCustom02"
              value="Otto"
              pattern="[a-zA-Z]+"
              required
            />
            <div class="valid-feedback">Looks good!</div>
          </div>
          <div class="col-md-4">
            <label for="validationCustomUsername" class="form-label">
              Username
            </label>
            <div class="input-group has-validation">
              <span class="input-group-text" id="inputGroupPrepend">
                @
              </span>
              <input
                type="text"
                class="form-control"
                id="validationCustomUsername"
                aria-describedby="inputGroupPrepend"
                required
              />
              <div class="invalid-feedback">Please choose a username.</div>
            </div>
          </div>
          <div class="col-md-6">
            <label for="validationCustom03" class="form-label">
              City
            </label>
            <input
              type="text"
              class="form-control"
              id="validationCustom03"
              required
            />
            <div class="invalid-feedback">Please provide a valid city.</div>
          </div>
          <div class="col-md-3">
            <label for="validationCustom04" class="form-label">
              State
            </label>
            <select class="form-select" id="validationCustom04" required>
              <option selected disabled value="">
                Choose...
              </option>
              <option>...</option>
            </select>
            <div class="invalid-feedback">Please select a valid state.</div>
          </div>
          <div class="col-md-3">
            <label for="validationCustom05" class="form-label">
              Zip
            </label>
            <input
              type="text"
              class="form-control"
              id="validationCustom05"
              required
            />
            <div class="invalid-feedback">Please provide a valid zip.</div>
          </div>
          <div class="col-12">
            <div class="form-check">
              <input
                class="form-check-input"
                type="checkbox"
                value=""
                id="invalidCheck"
                required
              />
              <label class="form-check-label" for="invalidCheck">
                Agree to terms and conditions
              </label>
              <div class="invalid-feedback">
                You must agree before submitting.
              </div>
            </div>
          </div>
          <div class="col-12">
            <button class="btn btn-primary" type="submit">
              Submit form
            </button>
          </div>
        </form>

 */
export default class WPForm extends HTMLFormElement {
  /**
   * 验证表单
   * @param {HTMLFormElement} form
   */
  static validate(form) {
    form.noValidate = true;
    form.removeEventListener("submit", submitHandler);
    form.addEventListener("submit", submitHandler, true);
  }
  static checkValidity(form) {
    form.classList.add("was-validated");
    return form.checkValidity() && checkCustomValidity(form);
  }

  static reset(form) {
    form.classList.remove("was-validated");
    form.reset();
  }

  reset() {
    this.classList.remove("was-validated");
    super.reset();
  }
  validate() {
    return this.checkValidity();
  }
  checkValidity() {
    this.classList.add("was-validated");
    return super.checkValidity() && checkCustomValidity(this);
  }

  connectedCallback() {
    this.constructor.validate(this);
  }
}
