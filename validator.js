function Validator (options) {
    const formElement = document.querySelector(options.form);
    
    if (formElement) {
        options.rules.forEach(rule => {
            
            var inputElement = formElement.querySelector(rule.selector);
            var errorElement = inputElement.parentElement.querySelector(".form-message");

            
            if (inputElement) {
                inputElement.onblur = () => { 
                    var errorMessage = rule.test(inputElement.value);
                    if (errorMessage) {
                        errorElement.innerText =  errorMessage;
                        inputElement.classList.add("invalid");
                    } else {
                        errorElement.innerText = "";
                        inputElement.classList.remove("invalid");
                    }

                };
            }
        });
    }

}

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return value.trim() ? undefined : "vui lòng nhập trường này"
        }
    }
};


Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value) {
            return "con cặc"

        }
    };
}