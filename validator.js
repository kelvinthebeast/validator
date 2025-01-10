function Validator(options) {
    const formElement = document.querySelector(options.form); // form-1

    const selectorRules = {};

   
    function validate(inputElement, rule) {
 
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        var rules = selectorRules[rule.selector];
        // loop each rule and check 
        
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage; // add innerText add errorMessage
            inputElement.classList.add("invalid"); //enable fontend
        } else {
            errorElement.innerText = "";
            inputElement.classList.remove("invalid");
        }
        return !errorMessage;

    }
    if (formElement) {
        // khi submit form 
        formElement.onsubmit = (e) => {
            e.preventDefault();
            var isFormValid = true;
            // thuc hien lap qua tung rule 
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                var isValid = validate(inputElement, rule);
                if (!isValid) {// có 1 ông không valid thì trả về false
                    isFormValid = false;
                    
                }
            });
            
            
            if (isFormValid) {

                // trường hợp là function không mặc định
                if (typeof options.onSubmit === 'function') {
                    var enableInputs = formElement.querySelectorAll("[name]");
                    var formValues = Array.from(enableInputs).reduce(function(values, input){
                        return (values[input.name] = input.value) && values;
                    }, {});
                    options.onSubmit(formValues);
                } else {
                    // submit với hành vi mặc định
                    formElement.submit();
                }

            } else {
                console.log("có lỗi")
            }
        }
        // xu ly lap rule va xu ly (click, blur, oninput... )
        options.rules.forEach(rule => {
            
            
            // lưu lại các rule cho mỗi input
            if (Array.isArray(selectorRules[rule.selector]) ) {
                selectorRules[rule.selector].push(rule.test);
            } else {
                selectorRules[rule.selector] = [rule.test]; 
            }
            

            // dùng selector để Dom chọn đúng element của nó
            var inputElement = formElement.querySelector(rule.selector);

            if (inputElement) {
                // xử lý trường hợp blur khỏi input
                inputElement.onblur = () => {

                    validate(inputElement, rule);
                };

                inputElement.oninput = () => {
                    var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
                    errorElement.innerText = "";
                    inputElement.classList.remove("invalid");
                };
            }
        });
    }

}

Validator.isRequired = function (selector) {
    return {
        selector: selector,
        test: function (value, message) {
            return value.trim() ? undefined : message ||"vui lòng nhập trường này"
        }
    }
};


Validator.isEmail = function (selector) {
    return {
        selector: selector,
        test: function (value, message) {
            const re =/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
            
            return re.test(value) ? undefined : message ||"Trường này không phải là email"
        }
    };
}


Validator.minLength = function (selector, min) {
    return {
        selector: selector,
        test: function (value, message) {
            return value.length >= min? undefined : message ||`Trường này phải có ít nhất ${min} ký tự`
        }
    }
}

Validator.isConfirmed = function (selector, getComfirmValue, message) {
    return {
        selector: selector,
        test: function (value) {
            return value === getComfirmValue() ? undefined : message || "Giá trị nhập vào không trùng khớp"
        }
    }

}