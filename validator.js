function Validator(options) {
    const formElement = document.querySelector(options.form); // form-1

    function validate(inputElement, rule) {
        var errorMessage = rule.test(inputElement.value);// test nhận 1 value
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        if (errorMessage) {
            errorElement.innerText = errorMessage; // dùng innerText thêm errorMessage
            inputElement.classList.add("invalid"); // chỉnh sửa fontend
        } else {
            errorElement.innerText = "";
            inputElement.classList.remove("invalid");
        }


    }
    if (formElement) {
        options.rules.forEach(rule => {

            var inputElement = formElement.querySelector(rule.selector);
            


            if (inputElement) {
                inputElement.onblur = () => {

                    validate(inputElement, rule);
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
            const re =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            
            return re.test(value) ? undefined : "Trường này không phải là email"
        }
    };
}


Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value) {
            return value.length >= min? undefined : `Trường này phải có ít nhất ${min} ký tự`
        }
    }
}