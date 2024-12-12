class EnigmaMachine {
    constructor(rotors, reflector, rotorPositions) {
        this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.rotors = rotors;  // List of rotor mappings
        this.reflector = reflector;  // Reflector mapping
        this.rotorPositions = rotorPositions;  // Initial rotor positions
    }

    rotateRotors() {
        for (let i = 0; i < this.rotorPositions.length; i++) {
            // Rotate the current rotor
            this.rotorPositions[i] = (this.rotorPositions[i] + 1) % 26;

            // Stop rotating if this rotor hasn't completed a full rotation
            if (this.rotorPositions[i] !== 0) {
                break;
            }
        }
        // Update the UI
        this.updateRotorDisplays();
    }

    passThroughRotors(letter, reverse = false) {
        let index = this.alphabet.indexOf(letter);

        if (!reverse) {
            // Forward pass through the rotors
            for (let i = 0; i < this.rotors.length; i++) {
                index = (index + this.rotorPositions[i]) % 26;
                letter = this.rotors[i][index];
                index = this.alphabet.indexOf(letter) - this.rotorPositions[i];
                index = (index + 26) % 26;  // Handle negative index
            }
        } else {
            // Reverse pass through the rotors
            for (let i = this.rotors.length - 1; i >= 0; i--) {
                index = (index + this.rotorPositions[i]) % 26;
                letter = this.alphabet[this.rotors[i].indexOf(this.alphabet[index])];
                index = this.alphabet.indexOf(letter) - this.rotorPositions[i];
                index = (index + 26) % 26;  // Handle negative index
            }
        }

        return this.alphabet[index];
    }

    reflect(letter) {
        return this.reflector[letter];
    }

    encryptDecrypt(text) {
        let result = "";

        for (let char of text.toUpperCase()) {
            if (this.alphabet.includes(char)) {
                this.rotateRotors();  // Rotate rotors before processing
                let letter = this.passThroughRotors(char);
                letter = this.reflect(letter);
                letter = this.passThroughRotors(letter, true);
                result += letter;
                
                // Light up the corresponding lamp
                this.lightUp(letter);
            } else {
                result += char;  // Non-alphabet characters remain unchanged
            }
        }

        return result;
    }

    // UI-related methods
    init() {
        this.setupRotorSelects();
        this.setupLightboard();
        this.setupEventListeners();
    }

    setupRotorSelects() {
        const rotors = ['rotor1', 'rotor2', 'rotor3'];
        rotors.forEach((rotorId, index) => {
            const select = document.getElementById(rotorId);
            select.innerHTML = '';
            
            for (let i = 0; i < 26; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.text = this.alphabet[i];
                option.style.textAlign = 'center';
                select.appendChild(option);
            }
            
            select.value = this.rotorPositions[index];
            
            select.addEventListener('change', (e) => {
                this.rotorPositions[index] = parseInt(e.target.value);
            });
        });
    }

    setupLightboard() {
        const lampboard = document.querySelector('.lampboard');
        const keyboard = document.querySelector('.keyboard');
        
        const layout = [
            'QWERTZUIO',
            'ASDFGHJK',
            'PYXCVBNML'
        ];

        layout.forEach(row => {
            row.split('').forEach(letter => {
                // Create lamp
                const lamp = document.createElement('div');
                lamp.className = 'lamp';
                lamp.textContent = letter;
                lamp.id = `lamp-${letter}`;
                lampboard.appendChild(lamp);

                // Create key
                const key = document.createElement('div');
                key.className = 'key';
                key.textContent = letter;
                key.id = `key-${letter}`;
                keyboard.appendChild(key);

                // Add click event
                key.addEventListener('mousedown', () => {
                    const result = this.encryptDecrypt(letter);
                    document.getElementById('output-text').value += result;
                });
            });
        });

        // Keyboard input handling
        document.addEventListener('keydown', (e) => {
            const key = e.key.toUpperCase();
            if (this.alphabet.includes(key)) {
                const result = this.encryptDecrypt(key);
                document.getElementById('output-text').value += result;
            }
        });
    }

    updateRotorDisplays() {
        ['rotor1', 'rotor2', 'rotor3'].forEach((rotorId, index) => {
            document.getElementById(rotorId).value = this.rotorPositions[index];
        });
    }

    lightUp(letter) {
        const lamp = document.getElementById(`lamp-${letter}`);
        if (lamp) {
            lamp.classList.add('active');
            setTimeout(() => lamp.classList.remove('active'), 200);
        }
    }
}

// Initialize with historical rotor and reflector configurations
const rotors = [
    "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split(''),  // Rotor I
    "AJDKSIRUXBLHWTMCQGZNPYFVOE".split(''),  // Rotor II
    "BDFHJLCPRTXVZNYEIWGAKMUSQO".split('')   // Rotor III
];

const reflector = {
    "A": "Y", "B": "R", "C": "U", "D": "H", "E": "Q", "F": "S",
    "G": "L", "H": "D", "I": "P", "J": "X", "K": "N", "L": "G",
    "M": "O", "N": "K", "O": "M", "P": "I", "Q": "E", "R": "B",
    "S": "F", "T": "Z", "U": "C", "V": "W", "W": "V", "X": "J",
    "Y": "A", "Z": "T"
};

const rotorPositions = [0, 0, 0];

// Initialize the machine when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const enigma = new EnigmaMachine(rotors, reflector, rotorPositions);
    enigma.init();
}); 