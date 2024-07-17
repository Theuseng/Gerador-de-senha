document.addEventListener('DOMContentLoaded', () => {
    const maiusculasCheckbox = document.getElementById('maiusculas');
    const minusculasCheckbox = document.getElementById('minusculas');
    const numerosCheckbox = document.getElementById('numeros');
    const simbolosCheckbox = document.getElementById('simbolos');
    const facilLerCheckbox = document.getElementById('facilLer');
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthValue = document.getElementById('lengthValue');
    const userInput = document.getElementById('userInput');
    const passwordOutput = document.getElementById('passwordOutput');
    const strengthBar = document.getElementById('strengthBar');
    const retryButton = document.getElementById('retry');
    const copyButton = document.getElementById('copyPassword');
    const toggleThemeButton = document.getElementById('toggleTheme');

    const generateRandomButton = document.getElementById('generateRandom');
    const generateFromInputButton = document.getElementById('generateFromInput');

    const maiusculasChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const minusculasChars = 'abcdefghijklmnopqrstuvwxyz';
    const numberChars = '0123456789';
    const simbolosChars = '!@#$%^&*()_+~`|}{[]:;?><,./-=';

    lengthSlider.addEventListener('input', () => {
        lengthValue.textContent = lengthSlider.value;
    });

    function generatePassword(baseString, length) {
        let characters = '';
        let password = '';

        if (maiusculasCheckbox.checked) {
            characters += maiusculasChars;
        }
        if (minusculasCheckbox.checked) {
            characters += minusculasChars;
        }
        if (numerosCheckbox.checked) {
            characters += numberChars;
        }
        if (simbolosCheckbox.checked) {
            characters += simbolosChars;
        }

        if (!characters) {
            alert("Selecione pelo menos uma opção de caractere.");
            return "";
        }

        for (let i = 0; i < length; i++) {
            password += characters.charAt(Math.floor(Math.random() * characters.length));
        }

        return password;
    }

    function generatePasswordFromInput(baseString) {
        let password = '';

        for (let char of baseString) {
            let newChar = char;
            if (maiusculasCheckbox.checked && Math.random() > 0.5) {
                newChar = char.toUpperCase();
            }
            if (minusculasCheckbox.checked && Math.random() > 0.5) {
                newChar = char.toLowerCase();
            }
            if (numerosCheckbox.checked && Math.random() > 0.5) {
                newChar = numberChars.charAt(Math.floor(Math.random() * numberChars.length));
            }
            if (simbolosCheckbox.checked && Math.random() > 0.5) {
                newChar = simbolosChars.charAt(Math.floor(Math.random() * simbolosChars.length));
            }
            password += newChar;
        }

        const remainingLength = lengthSlider.value - baseString.length;
        if (remainingLength > 0) {
            password += generatePassword('', remainingLength);
        }

        return password;
    }

    function generateReadablePassword(baseString) {
        const leetMap = {
            'a': '4', 'e': '3', 'i': '1', 'o': '0', 's': '5', 't': '7'
        };

        let password = '';
        for (let char of baseString) {
            if (facilLerCheckbox.checked && leetMap[char.toLowerCase()]) {
                char = leetMap[char.toLowerCase()];
            }
            let newChar = char;
            if (maiusculasCheckbox.checked && Math.random() > 0.5) {
                newChar = char.toUpperCase();
            }
            if (numerosCheckbox.checked && leetMap[char.toLowerCase()]) {
                newChar = leetMap[char.toLowerCase()];
            }
            if (simbolosCheckbox.checked && Math.random() > 0.5) {
                newChar = simbolosChars.charAt(Math.floor(Math.random() * simbolosChars.length));
            }
            password += newChar;
        }

        const remainingLength = lengthSlider.value - baseString.length;
        if (remainingLength > 0) {
            password += generatePassword('', remainingLength);
        }

        return password;
    }

    function evaluateStrength(password) {
        let strength = 0;

        const regexes = [
            /[A-Z]/,
            /[a-z]/,
            /[0-9]/,
            /[!@#$%^&*()_+~`|}{[\]:;?><,./-=]/
        ];

        regexes.forEach((regex) => {
            if (regex.test(password)) {
                strength += 1;
            }
        });

        if (password.length >= 8) strength += 1;

        return strength;
    }

    function updateStrengthBar(strength) {
        const strengthColors = ['#ff4d4d', '#ff884d', '#ffbf00', '#99cc00', '#66cc66'];
        strengthBar.style.width = `${strength * 20}%`;
        strengthBar.style.backgroundColor = strengthColors[strength - 1] || '#e0e0e0';
    }

    generateRandomButton.addEventListener('click', () => {
        const length = parseInt(lengthSlider.value);
        const password = generatePassword('', length);
        if (password) {
            passwordOutput.textContent = password;
            updateStrengthBar(evaluateStrength(password));
        }
    });

    generateFromInputButton.addEventListener('click', () => {
        const baseString = userInput.value;
        const password = facilLerCheckbox.checked ? generateReadablePassword(baseString) : generatePasswordFromInput(baseString);
        if (password) {
            passwordOutput.textContent = password;
            updateStrengthBar(evaluateStrength(password));
        }
    });

    retryButton.addEventListener('click', () => {
        if (userInput.value) {
            const baseString = userInput.value;
            const password = facilLerCheckbox.checked ? generateReadablePassword(baseString) : generatePasswordFromInput(baseString);
            if (password) {
                passwordOutput.textContent = password;
                updateStrengthBar(evaluateStrength(password));
            }
        } else {
            const length = parseInt(lengthSlider.value);
            const password = generatePassword('', length);
            if (password) {
                passwordOutput.textContent = password;
                updateStrengthBar(evaluateStrength(password));
            }
        }
    });

    copyButton.addEventListener('click', () => {
        const password = passwordOutput.textContent;
        navigator.clipboard.writeText(password).then(() => {
            alert('Senha copiada para a área de transferência!');
        }).catch(err => {
            alert('Falha ao copiar a senha: ', err);
        });
    });

    toggleThemeButton.addEventListener('click', () => {
        document.body.classList.toggle('dark-theme');
        toggleThemeButton.textContent = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
    });
});
