export const QUESTION_BANK = [
    // --- Data Representation ---
    { q: "What is the denary (decimal) value of the binary number 1011?", options: ["11", "13", "9", "15"], answer: "11" },
    { q: "How many bits are in a Nibble?", options: ["4", "8", "16", "2"], answer: "4" },
    { q: "What is the maximum denary value that can be stored in an 8-bit register?", options: ["255", "256", "128", "127"], answer: "255" },
    { q: "In hexadecimal, what does the letter 'D' represent in denary?", options: ["13", "12", "14", "15"], answer: "13" },
    { q: "Which character encoding scheme uses 16 bits (or more) per character?", options: ["Unicode", "ASCII", "Extended ASCII", "EBCDIC"], answer: "Unicode" },
    { q: "What is the binary representation of the denary number 42?", options: ["00101010", "01000010", "00110100", "00010110"], answer: "00101010" },
    { q: "Which format is typically used to represent MAC addresses?", options: ["Hexadecimal", "Binary", "Denary", "Octal"], answer: "Hexadecimal" },
    { q: "If the sample rate of an audio file is doubled, what happens to the file size?", options: ["It doubles", "It halves", "It stays the same", "It quadruples"], answer: "It doubles" },
    { q: "What does 'colour depth' refer to in a bitmap image?", options: ["Number of bits per pixel", "Number of pixels per inch", "Physical size of the image", "Image resolution"], answer: "Number of bits per pixel" },
    { q: "Which of these is a lossy compression format for images?", options: ["JPEG", "PNG", "BMP", "GIF"], answer: "JPEG" },

    // --- Communication and Internet Technologies ---
    { q: "Which part of a data packet contains the sender and receiver IP addresses?", options: ["Header", "Payload", "Trailer", "Checksum"], answer: "Header" },
    { q: "What is the function of a router in a network?", options: ["To connect multiple networks and forward packets", "To connect devices within a single LAN", "To assign MAC addresses", "To convert analog signals to digital"], answer: "To connect multiple networks and forward packets" },
    { q: "Which protocol is used to securely transmit data over the web?", options: ["HTTPS", "HTTP", "FTP", "SMTP"], answer: "HTTPS" },
    { q: "What does an IP address identify?", options: ["A device on a network", "A specific hardware component", "The speed of a connection", "The website domain name"], answer: "A device on a network" },
    { q: "Unlike a dynamic IP, a MAC address is generally...", options: ["Static and assigned by the manufacturer", "Assigned by the ISP", "Changes every time you reboot", "Used only on the internet"], answer: "Static and assigned by the manufacturer" },
    { q: "Which network topology relies on a single central cable that all devices connect to?", options: ["Bus", "Star", "Ring", "Mesh"], answer: "Bus" },
    { q: "What is the primary purpose of a DNS server?", options: ["Resolves domain names to IP addresses", "Allocates IP addresses to devices", "Encrypts website traffic", "Stores website HTML files"], answer: "Resolves domain names to IP addresses" },
    { q: "Which of these is an example of guided (wired) transmission media?", options: ["Fibre-optic cable", "Wi-Fi", "Bluetooth", "Microwave"], answer: "Fibre-optic cable" },
    { q: "Calculate the time to transmit a 5MB file over a 10 Mbps connection.", options: ["4 seconds", "0.5 seconds", "50 seconds", "8 seconds"], answer: "4 seconds" },
    { q: "What does a packet trailer usually contain?", options: ["Error checking data (Checksum)", "Source IP address", "The actual data payload", "Packet sequence number"], answer: "Error checking data (Checksum)" },

    // --- Hardware and Software ---
    { q: "Which CPU component performs mathematical and logical operations?", options: ["ALU", "CU", "Registers", "Buses"], answer: "ALU" },
    { q: "What does the Program Counter (PC) hold?", options: ["Address of the next instruction", "Current instruction being decoded", "Result of the ALU calculation", "Address of the current memory location"], answer: "Address of the next instruction" },
    { q: "In the Fetch-Execute cycle, where are instructions fetched from?", options: ["Primary Memory (RAM)", "Secondary Storage", "Cache", "The ALU"], answer: "Primary Memory (RAM)" },
    { q: "Which type of memory is non-volatile and often stores the BIOS?", options: ["ROM", "RAM", "Cache memory", "Virtual memory"], answer: "ROM" },
    { q: "Which of these is considered secondary storage?", options: ["Solid State Drive (SSD)", "Random Access Memory (RAM)", "CPU Cache", "Memory Address Register"], answer: "Solid State Drive (SSD)" },
    { q: "Which type of touchscreen relies on the electrical properties of the human body?", options: ["Capacitive", "Resistive", "Infrared", "Surface Acoustic Wave"], answer: "Capacitive" },
    { q: "What is an advantage of SSDs over HDDs?", options: ["No moving parts (faster access)", "Cheaper per Gigabyte", "Infinite read/write cycles", "Higher storage capacity limits"], answer: "No moving parts (faster access)" },
    { q: "Which software provides a platform to run applications and manages hardware?", options: ["Operating System", "Utility Software", "Firmware", "Compiler"], answer: "Operating System" },
    { q: "Which type of translator runs code line-by-line and halts on the first error?", options: ["Interpreter", "Compiler", "Assembler", "Linker"], answer: "Interpreter" },
    { q: "What does an Assembler do?", options: ["Translates Assembly language to Machine code", "Translates High-level language to Assembly", "Translates Python to C++", "Executes machine code directly"], answer: "Translates Assembly language to Machine code" },

    // --- Security and Ethics ---
    { q: "What type of malware disguises itself as legitimate software?", options: ["Trojan", "Virus", "Worm", "Spyware"], answer: "Trojan" },
    { q: "What is the purpose of Phishing?", options: ["To trick users into revealing sensitive data", "To encrypt user files for ransom", "To overload a web server", "To log user keystrokes"], answer: "To trick users into revealing sensitive data" },
    { q: "Which of these security measures helps defend against DDoS attacks?", options: ["Firewall", "Antivirus", "Strong Passwords", "Biometrics"], answer: "Firewall" },
    { q: "What process scrambles data so that it cannot be understood without a key?", options: ["Encryption", "Hashing", "Compression", "Encoding"], answer: "Encryption" },
    { q: "In symmetric encryption, how many keys are used?", options: ["One key for both encrypting and decrypting", "Two keys (Public and Private)", "No keys, it relies on an algorithm", "A new key for every message"], answer: "One key for both encrypting and decrypting" },
    { q: "What is a DoS attack?", options: ["Flooding a server with traffic to crash it", "Guessing passwords using a dictionary", "Intercepting data on a network", "Injecting malicious SQL queries"], answer: "Flooding a server with traffic to crash it" },
    { q: "Which of the following is an example of biometrics?", options: ["Fingerprint scanner", "A strong password", "Two-factor authentication (SMS)", "A physical smart card"], answer: "Fingerprint scanner" },
    { q: "What is Free Software?", options: ["Software you have freedom to run, copy, and modify", "Software that costs $0 (Freeware)", "Software you can use only for 30 days", "Software with restricted source code"], answer: "Software you have freedom to run, copy, and modify" },
    { q: "Which attack intercepts and monitors network traffic unnoticeably?", options: ["Packet Sniffing / Eavesdropping", "Phishing", "Ransomware", "Brute Force"], answer: "Packet Sniffing / Eavesdropping" },
    { q: "What is the term for software whose source code is legally protected and hidden?", options: ["Proprietary Software", "Open Source Software", "Shareware", "Freeware"], answer: "Proprietary Software" },

    // --- Logic Gates and Architecture ---
    { q: "Which logic gate outputs 1 only when both inputs are 1?", options: ["AND", "OR", "NAND", "XOR"], answer: "AND" },
    { q: "Which gate is known as an 'Inverter'?", options: ["NOT", "NAND", "NOR", "XOR"], answer: "NOT" },
    { q: "What is the output of an OR gate if inputs are 0 and 1?", options: ["1", "0", "Depends on previous state", "NaN"], answer: "1" },
    { q: "Which gate outputs 1 only if the inputs are DIFFERENT?", options: ["XOR", "OR", "NAND", "AND"], answer: "XOR" },
    { q: "Which gate produces a 0 only when both inputs are 1?", options: ["NAND", "NOR", "NOT", "XOR"], answer: "NAND" },
    { q: "If A=1 and B=1, what is (A AND B) OR NOT A?", options: ["1", "0", "10", "-1"], answer: "1" },
    { q: "What does the abbreviation 'ALU' stand for?", options: ["Arithmetic Logic Unit", "Algorithm Logic Unit", "Array Logic Unit", "Arithmetic Local Unit"], answer: "Arithmetic Logic Unit" },
    { q: "Which bus carries signals to coordinate operations within the CPU?", options: ["Control Bus", "Data Bus", "Address Bus", "Universal Serial Bus"], answer: "Control Bus" },
    { q: "The von Neumann architecture stores what in the same memory?", options: ["Data and Instructions", "ROM and RAM", "Cache and Registers", "Input and Output"], answer: "Data and Instructions" },
    { q: "What does the 'Address Bus' do?", options: ["Carries the memory location of data/instructions", "Carries the actual data between components", "Synchronizes the CPU clock", "Connects external peripherals"], answer: "Carries the memory location of data/instructions" },

    // --- Programming and Algorithms ---
    { q: "What is the purpose of an 'IF' statement in programming?", options: ["Selection / Branching", "Iteration / Looping", "Variable declaration", "File handling"], answer: "Selection / Branching" },
    { q: "Which shape represents a 'Decision' in a flowchart?", options: ["Diamond", "Rectangle", "Parallelogram", "Oval"], answer: "Diamond" },
    { q: "What is a loop that continues until a condition becomes true?", options: ["REPEAT...UNTIL", "FOR...NEXT", "WHILE...DO", "IF...THEN"], answer: "REPEAT...UNTIL" },
    { q: "In programming, an array index typically starts at which number?", options: ["0", "1", "-1", "Depends on the CPU"], answer: "0" },
    { q: "What is an algorithm?", options: ["A step-by-step set of instructions to solve a problem", "A programming language syntax error", "The physical hardware of a processor", "A type of malicious software"], answer: "A step-by-step set of instructions to solve a problem" },
    { q: "Which standard search algorithm relies on the list already being sorted?", options: ["Binary Search", "Linear Search", "Bubble Sort", "Insertion Search"], answer: "Binary Search" },
    { q: "What type of test data tests the upper and lower limits of accepted data?", options: ["Extreme (Boundary) data", "Normal data", "Abnormal data", "Syntax data"], answer: "Extreme (Boundary) data" },
    { q: "A syntax error occurs when...", options: ["The rules of the programming language are broken", "The program produces an unexpected output", "The computer runs out of memory", "A peripheral device disconnects"], answer: "The rules of the programming language are broken" },
    { q: "What is pseudocode?", options: ["A structured, language-independent way to describe an algorithm", "Fake code generated by malware", "Code that can only run on virtual machines", "Machine code translated by an assembler"], answer: "A structured, language-independent way to describe an algorithm" },
    { q: "Which variable data type is used to store 'True' or 'False'?", options: ["Boolean", "Integer", "String", "Char"], answer: "Boolean" },

    // --- Databases ---
    { q: "In a database, what does a single 'Row' commonly represent?", options: ["A Record", "A Field", "A Table", "A Primary Key"], answer: "A Record" },
    { q: "What is a Primary Key?", options: ["A field that uniquely identifies each record", "The first field in a table", "A password to access the database", "The most commonly searched field"], answer: "A field that uniquely identifies each record" },
    { q: "Which SQL command is used to retrieve data from a database?", options: ["SELECT", "EXTRACT", "PULL", "GET"], answer: "SELECT" },
    { q: "What does the SQL wildcard '*' stand for?", options: ["All columns/fields", "All tables", "Multiply", "Password hidden"], answer: "All columns/fields" },
    { q: "If a field is designed to store dates (e.g., 2026-05-14), what data type should it be?", options: ["Date/Time", "String", "Integer", "Boolean"], answer: "Date/Time" },

    // --- Additional Mix ---
    { q: "What is 1 Byte?", options: ["8 bits", "4 bits", "1024 bits", "16 bits"], answer: "8 bits" },
    { q: "If an IP address uses 32 bits, which version is it?", options: ["IPv4", "IPv6", "IPv8", "MAC"], answer: "IPv4" },
    { q: "What happens when a packet collides on a network?", options: ["It is discarded and re-requested", "It is stored locally", "It speeds up transmission", "It shuts down the network"], answer: "It is discarded and re-requested" },
    { q: "Which optical disk uses a blue laser to read data?", options: ["Blu-ray", "CD-ROM", "DVD-RW", "Magnetic Tape"], answer: "Blu-ray" },
    { q: "What is a 'Trace Table' used for?", options: ["Finding logical errors in algorithms", "Designing a database schema", "Routing internet packets", "Tracing a hacker's IP address"], answer: "Finding logical errors in algorithms" },
    { q: "What does RAM stand for?", options: ["Random Access Memory", "Read Access Memory", "Run Address Module", "Rapid Action Memory"], answer: "Random Access Memory" },
    { q: "How many states can a single bit hold?", options: ["2", "4", "8", "10"], answer: "2" },
    { q: "What is the purpose of a checksum?", options: ["Detect data transmission errors", "Encrypt the password", "Compress the file", "Convert to binary"], answer: "Detect data transmission errors" },
    { q: "Which hexadecimal digit equals 15 in denary?", options: ["F", "E", "A", "C"], answer: "F" },
    { q: "Which component inside a CPU generates pulses to synchronize operations?", options: ["Clock", "ALU", "Cache", "Bus"], answer: "Clock" },
    { q: "What does HTML stand for?", options: ["Hypertext Markup Language", "Hypertext Machine Language", "Hyper Transfer Main List", "Host Text Modeling Language"], answer: "Hypertext Markup Language" },
    { q: "What is the role of CSS in web development?", options: ["Styling and presentation", "Database management", "Server-side logic", "Hardware configuration"], answer: "Styling and presentation" },
    { q: "What does a MAC address consist of?", options: ["6 pairs of hexadecimal digits", "4 blocks of decimal numbers", "8 bytes of binary", "A string of alphanumeric characters"], answer: "6 pairs of hexadecimal digits" },
    { q: "Which topology connects every device to every other device?", options: ["Mesh", "Star", "Ring", "Bus"], answer: "Mesh" },
    { q: "Which of the following describes Phishing?", options: ["A deceptive email pretending to be a bank", "A virus that replicates itself over networks", "Intercepting Wi-Fi signals", "Cracking a password by guessing"], answer: "A deceptive email pretending to be a bank" },
    { q: "A logic error is...", options: ["A mistake in the algorithm that causes unexpected results", "A typo in the code syntax", "A program failing to compile", "Hardware failure during runtime"], answer: "A mistake in the algorithm that causes unexpected results" },
    { q: "What does SQL stand for?", options: ["Structured Query Language", "Standard Query Logic", "System Question Language", "Select Query List"], answer: "Structured Query Language" },
    { q: "In a flowchart, what shape represents an Input/Output operation?", options: ["Parallelogram", "Rectangle", "Diamond", "Oval"], answer: "Parallelogram" },
    { q: "Which memory type stores the startup instructions (bootstrap)?", options: ["ROM", "RAM", "Cache", "Hard Drive"], answer: "ROM" },
    { q: "Which security threat locks files and demands payment?", options: ["Ransomware", "Spyware", "Adware", "Trojan"], answer: "Ransomware" }
];

export const getRandomQuestions = (count = 10) => {
    const shuffled = [...QUESTION_BANK].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};
