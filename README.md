# Web Enigma Machine

A web-based simulation of the WWII Enigma encryption machine. This project recreates the functionality of the Enigma M3 with a modern interface.

![Enigma Machine](https://themilitarymuseums.ca/images/exhibitsPermanent/enigma/enigma-machine-8.jpg)

## Features
- Historical rotor and reflector configurations
- Real-time encryption/decryption
- Interactive keyboard and lampboard
- Physical keyboard support

## Setup
1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Features

- **Authentic Rotor Mechanics**: 
  - Implements historical rotor wirings (I, II, III)
  - Accurate stepping mechanism
  - Real-time rotor position display

- **Interactive Interface**:
  - Clickable keyboard layout matching original ENIGMA design
  - Illuminating lampboard showing encrypted/decrypted letters
  - Physical keyboard support for typing
  - Real-time encryption/decryption

- **Historical Accuracy**:
  - Based on the Enigma M3 model
  - Uses authentic reflector configurations
  - Implements reciprocal encryption (encrypting an encrypted message returns the original text)

## Technical Details

- Built with vanilla JavaScript, HTML, and CSS
- No external dependencies
- Responsive design that works on both desktop and mobile devices
- Follows the original Enigma machine's encryption algorithm

## How to Use

1. Clone the repository: 
```bash
git clone https://github.com/yourusername/web-enigma-machine.git
cd web-enigma-machine
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

4. Open your browser and navigate to `http://localhost:3000`

## Operating the Enigma Machine

1. **Set Initial Rotor Positions**:
   - Use the rotor selection dropdowns to choose your rotor configuration
   - Set the starting position for each rotor using the position selectors

2. **Encrypting Messages**:
   - Type using your physical keyboard or click the on-screen keys
   - Watch the lampboard illuminate with each encrypted letter
   - The rotor positions will update automatically as you type

3. **Decrypting Messages**:
   - Use the same rotor settings as the encrypted message
   - Type the encrypted message to reveal the original text
   - The encryption is reciprocal - the same process works for both encryption and decryption

## Development

To run the project in development mode:

```bash
npm run start
```

This will start the server with hot-reloading enabled.

## Testing

Run the test suite:

```bash
npm test
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Based on the historical Enigma M3 machine specifications
- Inspired by the cryptographic achievements at Bletchley Park
- Thanks to all contributors who have helped with this project
# ENIGMA-M3
