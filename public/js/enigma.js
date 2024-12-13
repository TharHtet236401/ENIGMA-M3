const REFLECTORS = {
    B: {  // UKW-B
        "A": "Y", "B": "R", "C": "U", "D": "H", "E": "Q", "F": "S",
        "G": "L", "H": "D", "I": "P", "J": "X", "K": "N", "L": "G",
        "M": "O", "N": "K", "O": "M", "P": "I", "Q": "E", "R": "B",
        "S": "F", "T": "Z", "U": "C", "V": "W", "W": "V", "X": "J",
        "Y": "A", "Z": "T"
    },
    C: {  // UKW-C
        "A": "F", "B": "V", "C": "P", "D": "J", "E": "I", "F": "A",
        "G": "O", "H": "Y", "I": "E", "J": "D", "K": "R", "L": "Z",
        "M": "X", "N": "W", "O": "G", "P": "C", "Q": "T", "R": "K",
        "S": "U", "T": "Q", "U": "S", "V": "B", "W": "N", "X": "M",
        "Y": "H", "Z": "L"
    }
};

class EnigmaMachine {
    constructor(rotors, reflectorType, rotorPositions) {
        this.alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        this.rotors = rotors;
        this.reflectorType = reflectorType;
        this.reflector = REFLECTORS[reflectorType];
        this.rotorPositions = rotorPositions;
    }

    setReflector(type) {
        this.reflectorType = type;
        this.reflector = REFLECTORS[type];
    }

    init() {
        this.setupRotorSelects();
        this.setupReflectorWiring();
        this.setupLightboard();
        this.setupFlipButtons();
    }

    setupReflectorWiring() {
        this.selectedLetter = null;
        this.customReflector = {};
        this.canvas = document.getElementById('wiringCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Setup letter node click handlers
        document.querySelectorAll('.letter-node').forEach(node => {
            node.addEventListener('click', (e) => this.handleLetterClick(e.target));
        });

        // Setup control buttons
        document.getElementById('clearWiring').addEventListener('click', () => this.clearWiring());
        document.getElementById('saveWiring').addEventListener('click', () => this.saveCustomReflector());
    }

    resizeCanvas() {
        const container = this.canvas.parentElement;
        const rect = container.getBoundingClientRect();
        
        // Set the canvas size to match its container's size
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        
        // Set canvas style dimensions explicitly
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        
        // Redraw any existing connections
        this.redrawWiring();
    }

    handleLetterClick(letterNode) {
        const letter = letterNode.dataset.letter;
        
        if (!this.selectedLetter) {
            // First letter selection
            if (!this.customReflector[letter]) {
                this.selectedLetter = letter;
                letterNode.classList.add('selected');
            }
        } else if (this.selectedLetter === letter) {
            // Deselect current letter
            this.selectedLetter = null;
            letterNode.classList.remove('selected');
        } else {
            // Connect letters
            if (!this.customReflector[letter] && !this.customReflector[this.selectedLetter]) {
                this.connectLetters(this.selectedLetter, letter);
                this.selectedLetter = null;
                this.redrawWiring();
            }
        }
    }

    connectLetters(letter1, letter2) {
        this.customReflector[letter1] = letter2;
        this.customReflector[letter2] = letter1;
        
        // Update UI
        document.querySelector(`[data-letter="${letter1}"]`).classList.add('connected');
        document.querySelector(`[data-letter="${letter2}"]`).classList.add('connected');
        document.querySelector(`[data-letter="${letter1}"]`).classList.remove('selected');
    }

    redrawWiring() {
        const canvas = this.canvas;
        const ctx = this.ctx;
        
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Set line style
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = 2;

        Object.entries(this.customReflector).forEach(([letter1, letter2]) => {
            if (letter1 < letter2) { // Draw each connection only once
                const node1 = document.querySelector(`[data-letter="${letter1}"]`);
                const node2 = document.querySelector(`[data-letter="${letter2}"]`);
                
                if (node1 && node2) {
                    const rect1 = node1.getBoundingClientRect();
                    const rect2 = node2.getBoundingClientRect();
                    const canvasRect = canvas.getBoundingClientRect();

                    // Calculate positions relative to canvas
                    const x1 = rect1.left - canvasRect.left;
                    const y1 = rect1.top - canvasRect.top + (rect1.height / 2);
                    const x2 = rect2.left - canvasRect.left;
                    const y2 = rect2.top - canvasRect.top + (rect2.height / 2);

                    // Add half of node width to x coordinates
                    const adjustedX1 = x1 + (rect1.width / 2);
                    const adjustedX2 = x2 + (rect2.width / 2);

                    // Scale the coordinates to match canvas coordinate space
                    const scaleX = canvas.width / canvasRect.width;
                    const scaleY = canvas.height / canvasRect.height;

                    ctx.beginPath();
                    ctx.moveTo(adjustedX1 * scaleX, y1 * scaleY);
                    ctx.lineTo(adjustedX2 * scaleX, y2 * scaleY);
                    ctx.stroke();
                }
            }
        });
    }

    clearWiring() {
        this.customReflector = {};
        this.selectedLetter = null;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        document.querySelectorAll('.letter-node').forEach(node => {
            node.classList.remove('connected', 'selected');
        });
    }

    saveCustomReflector() {
        // Verify all letters are connected
        if (Object.keys(this.customReflector).length === 26) {
            this.reflector = this.customReflector;
            alert('Custom reflector saved and activated!');
        } else {
            alert('Please connect all letters before saving!');
        }
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

    setupFlipButtons() {
        // First, let's check if we can find the buttons
        const buttons = document.querySelectorAll('.flip-button');
        console.log('Found buttons:', buttons.length); // Should show how many buttons were found
        
        // Check if we can find the card
        const card = document.querySelector('.enigma-card');
        console.log('Found card:', card); // Should show the card element if found
        
        buttons.forEach((button, index) => {
            console.log(`Setting up button ${index}`); // Log for each button
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log(`Button ${index} clicked`);
                
                if (card) {
                    card.classList.toggle('flipped');
                    console.log('Card classes after toggle:', card.className);
                } else {
                    console.error('Card element not found');
                }
            });
        });
    }
}

// Initialize with historical rotor and reflector configurations
const rotors = [
    "EKMFLGDQVZNTOWYHXUSPAIBRCJ".split(''),  // Rotor I
    "AJDKSIRUXBLHWTMCQGZNPYFVOE".split(''),  // Rotor II
    "BDFHJLCPRTXVZNYEIWGAKMUSQO".split('')   // Rotor III
];

const rotorPositions = [0, 0, 0];

// Initialize the machine when the page loads
document.addEventListener('DOMContentLoaded', () => {
    const enigma = new EnigmaMachine(rotors, 'B', rotorPositions);  // Start with UKW-B reflector
    enigma.init();
}); 