function Validator(options) {
    const formElement = document.querySelector(options.form); // form-1

    const selectorRules = {};

    // hàm validate inputElement với ràng buộc rule
    function validate(inputElement, rule) {
        // var errorMessage = rule.test(inputElement.value);// test nhận 1 value
        var errorElement = inputElement.parentElement.querySelector(options.errorSelector);
        var errorMessage;

        var rules = selectorRules[rule.selector];
        // lặp qua từng rule rồi kiểm tra
        
        for (var i = 0; i < rules.length; i++) {
            errorMessage = rules[i](inputElement.value);
            if (errorMessage) break;
        }
        if (errorMessage) {
            errorElement.innerText = errorMessage; // dùng innerText thêm errorMessage
            inputElement.classList.add("invalid"); // chỉnh sửa fontend
        } else {
            errorElement.innerText = "";
            inputElement.classList.remove("invalid");
        }


    }
    if (formElement) {
        // khi submit form 
        formElement.onsubmit = (e) => {
            e.preventDefault();
            // thuc hien lap qua tung rule 
            options.rules.forEach(function (rule) {
                var inputElement = formElement.querySelector(rule.selector);
                validate(inputElement, rule);
            })
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