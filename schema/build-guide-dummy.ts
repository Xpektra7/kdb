import type { BuildGuide } from "@/lib/definitions";

export const buildGuideDummyData: BuildGuide = {
  "project": "Low-Cost Solar-Powered Flood Sensor System",
  "build_overview": "Assemble a solar-powered flood detection system utilizing an ultrasonic sensor for water level monitoring, an ESP32 for data processing, and a SIM800L for GSM communication. The system will activate a 12V siren via a relay upon detecting a flood threshold and send SMS alerts. Power is supplied by a solar panel and lead-acid battery managed by a PWM charge controller.",
  "prerequisites": {
    "tools": [
      "Soldering Iron and Solder",
      "Wire Strippers and Cutters",
      "Screwdriver Set (Phillips, Flathead)",
      "Multimeter",
      "Heat Shrink Tubing or Electrical Tape",
      "Drill and bits (for enclosure)",
      "Hot Glue Gun (optional, for securing components)"
    ],
    "materials": [
      "ESP32 DevKitC Module",
      "SIM800L GSM/GPRS Module (with appropriate antenna)",
      "JSN-SR04T Ultrasonic Sensor",
      "PWM Solar Charge Controller (12V)",
      "12V Lead-Acid Battery",
      "Solar Panel (compatible with charge controller and battery)",
      "High-Power 12V Relay Module (e.g., 1-channel with optocoupler)",
      "12V External Siren",
      "DC-DC Buck Converter (12V to 5V, for ESP32)",
      "DC-DC Buck Converter (12V to ~4V, for SIM800L)",
      "NPN Transistor (e.g., BC547) and 1kΩ Resistor (for relay driver)",
      "Assorted Jumper Wires",
      "Solid Core Wires (for power connections)",
      "Waterproof Enclosure",
      "Terminal Blocks or Screw Terminals",
      "Silicone Sealant (for waterproofing cable entries)",
      "SIM Card (active, with data/SMS plan)"
    ]
  },
  "wiring": {
    "description": "The system's power originates from the solar panel, charging a 12V lead-acid battery through a PWM charge controller. The charge controller's load output (12V) powers step-down converters for the ESP32 and SIM800L, and directly powers the siren via a relay. The ESP32 communicates with the ultrasonic sensor for level detection and the SIM800L for alerts, also controlling the relay for the siren.",
    "connections": [
      "Solar Panel positive to PWM Charge Controller 'Solar Input +'",
      "Solar Panel negative to PWM Charge Controller 'Solar Input -'",
      "12V Lead-Acid Battery positive to PWM Charge Controller 'Battery +'",
      "12V Lead-Acid Battery negative to PWM Charge Controller 'Battery -'",
      "PWM Charge Controller 'Load +' to Input of 12V-to-5V Buck Converter (for ESP32)",
      "PWM Charge Controller 'Load -' to Input GND of 12V-to-5V Buck Converter",
      "5V Output of Buck Converter to ESP32 DevKitC 5V (VIN) pin",
      "GND Output of Buck Converter to ESP32 DevKitC GND pin",
      "PWM Charge Controller 'Load +' to Input of 12V-to-4V Buck Converter (for SIM800L)",
      "PWM Charge Controller 'Load -' to Input GND of 12V-to-4V Buck Converter",
      "4V Output of Buck Converter to SIM800L VCC pin",
      "GND Output of Buck Converter to SIM800L GND pin",
      "SIM800L RX pin to ESP32 TX pin (or suitable GPIO configured as TX)",
      "SIM800L TX pin to ESP32 RX pin (or suitable GPIO configured as RX)",
      "JSN-SR04T VCC to ESP32 3.3V (or 5V if compatible, check datasheet)",
      "JSN-SR04T GND to ESP32 GND",
      "JSN-SR04T TRIG pin to ESP32 GPIO",
      "JSN-SR04T ECHO pin to ESP32 GPIO",
      "NPN Transistor Emitter to ESP32 GND",
      "NPN Transistor Collector to Relay Coil Negative terminal",
      "NPN Transistor Base via 1kΩ Resistor to ESP32 GPIO",
      "Relay Coil Positive terminal to PWM Charge Controller 'Load +' (12V)",
      "12V External Siren positive to PWM Charge Controller 'Load +' (12V)",
      "12V External Siren negative to Relay COM (Common) terminal",
      "Relay NO (Normally Open) terminal to PWM Charge Controller 'Load -' (GND)"
    ]
  },
  "firmware": {
    "language": "Arduino C++",
    "structure": [
      "**Setup Function:** Initialize Serial communication, set up ESP32 GPIOs for ultrasonic sensor (TRIG/ECHO), initialize SoftwareSerial or HardwareSerial for SIM800L communication, and configure relay control pin. Perform initial SIM800L setup (check network, configure SMS).",
      "**Loop Function:** Continuously read distance from ultrasonic sensor. Compare distance to predefined flood threshold. If flood detected, activate relay for siren, send SMS alert via SIM800L, and log event. Implement a delay or debouncing to prevent rapid re-triggering. If not flooding, ensure siren is off and system is ready for next measurement.",
      "**Helper Functions:** `readUltrasonicDistance()` to get sensor readings, `sendSMS(phoneNumber, message)` for GSM communication, `activateSiren(state)` to control the relay."
    ],
    "key_logic": [
      "**Water Level Measurement:** Use `pulseIn()` to measure the duration of the ECHO pulse from the JSN-SR04T, convert this duration into distance using the speed of sound.",
      "**Flood Detection:** Compare the calculated distance to a configurable 'flood_threshold_cm'. A distance below this threshold indicates a flood.",
      "**SMS Alerting:** Upon flood detection, use AT commands via the SIM800L module to send a predefined SMS message to specified phone numbers. Ensure network registration before sending.",
      "**Siren Actuation:** Control an ESP32 GPIO pin to switch the NPN transistor, which in turn energizes the 12V relay coil. When the relay activates, it closes the circuit for the 12V siren."
    ]
  },
  "calibration": [
    "**Ultrasonic Sensor:** Mount the sensor in its final position and measure the distance to the normal water level. Adjust the `flood_threshold_cm` in the firmware to be slightly less than the desired flood level (e.g., if flood occurs at 10cm water depth, and sensor is 50cm above the ground, the threshold would be 40cm). Verify distance readings against a known ruler or tape measure.",
    "**SIM800L GSM Network:** Confirm SIM card is active and the module registers to the local GSM network. Test SMS sending to a known phone number.",
    "**Power System:** Monitor battery voltage and charging current with a multimeter to ensure the solar panel and charge controller are functioning correctly and maintaining battery charge."
  ],
  "testing": {
    "unit": [
      "**ESP32 Functionality:** Upload a blink sketch to verify programming. Test individual GPIOs.",
      "**Ultrasonic Sensor:** Run a sketch to continuously print distance readings to Serial Monitor. Verify readings are consistent and accurate.",
      "**SIM800L Module:** Connect the SIM800L to ESP32 and run a simple AT command sketch (e.g., `AT+CSQ` for signal quality, `AT+CMGF` for text mode) to ensure communication and network registration. Send a test SMS.",
      "**Relay & Siren:** Write a sketch to toggle the relay on/off at intervals, verifying the 12V siren activates and deactivates correctly.",
      "**Power Converters:** Connect buck converters to the 12V source and verify stable 5V and ~4V outputs using a multimeter."
    ],
    "integration": [
      "**Sensor-to-ESP32:** Combine the ultrasonic sensor sketch with ESP32 and verify distance readings are correctly processed.",
      "**ESP32-to-SIM800L:** Integrate SIM800L communication for sending dummy SMS messages triggered by a simple condition.",
      "**ESP32-to-Relay/Siren:** Integrate siren activation logic with a test condition on the ESP32.",
      "**Full Power Path:** Power the entire system from the charge controller's load output, ensuring all components receive stable power."
    ],
    "acceptance": [
      "**Simulated Flood Test:** Place the system in a controlled environment (e.g., a large bucket or trough). Gradually fill with water until it reaches the defined flood threshold. Verify the siren activates and an SMS alert is successfully sent.",
      "**Power Autonomy Test:** Place the system outdoors under varying light conditions for several days. Monitor battery voltage and ensure it remains adequately charged, and the system stays operational through day/night cycles.",
      "**Connectivity Test (Remote):** Verify SMS alerts are reliably received on target phones in a remote area, accounting for potential network fluctuations in Nigeria."
    ]
  },
  "common_failures": [
    {
      "issue": "No GSM network registration / Failed SMS send.",
      "cause": "SIM card not activated, insufficient power to SIM800L (current spikes), antenna not connected, poor network coverage, incorrect AT commands.",
      "fix": "Ensure SIM card is active and has credit/data. Verify SIM800L receives stable 4V with adequate current (add large capacitor if needed). Check antenna connection. Test in an area with known good network coverage. Double-check AT command sequence and timing."
    },
    {
      "issue": "Inaccurate or erratic ultrasonic sensor readings.",
      "cause": "Sensor placed too close to water surface (dead zone), interference from nearby objects, sensor not waterproofed correctly, excessive electrical noise.",
      "fix": "Reposition sensor away from physical obstructions. Ensure sensor face is clean and dry. Verify wiring and shielding. Apply waterproofing if necessary. Review sensor datasheet for minimum/maximum range specifications."
    },
    {
      "issue": "Siren does not activate when flood is detected.",
      "cause": "Relay coil not receiving sufficient current, faulty transistor driver, incorrect relay wiring (NO/NC confusion), siren itself is faulty or miswired, ESP32 GPIO not correctly configured.",
      "fix": "Verify 12V supply to relay coil. Check transistor wiring and ensure ESP32 GPIO is actually going HIGH to switch the transistor. Confirm siren works by direct 12V connection. Double-check relay COM/NO connections."
    },
    {
      "issue": "System frequently restarts or crashes.",
      "cause": "Insufficient power supply, especially for current-hungry components like SIM800L, grounding issues, unstable code.",
      "fix": "Ensure buck converters are properly dimensioned and deliver stable voltage. Add decoupling capacitors near ESP32 and SIM800L power inputs. Verify all GND connections are common and robust. Review ESP32 code for memory leaks or infinite loops."
    }
  ],
  "safety": [
    "**Electrical Safety:** Always disconnect power before making or changing wiring connections. Use appropriately rated wires for power. Insulate all exposed live terminals and connections with heat shrink tubing or electrical tape.",
    "**Battery Handling:** Lead-acid batteries contain corrosive acid. Avoid short-circuiting terminals. Handle with care to prevent spills. Ensure proper ventilation if placing battery in an enclosed space (though sealed lead-acid are common).",
    "**Solar Panel:** Solar panels can generate current even in low light. Treat them as live electrical sources.",
    "**Outdoor Installation:** Mount the system securely to prevent damage from wind or vandalism. Ensure the enclosure is fully waterproofed to protect electronics from rain and moisture. Use proper grounding practices for the enclosure if metallic.",
    "**Tools:** Use soldering iron safely in a well-ventilated area. Wear safety glasses when drilling or cutting materials."
  ],
  "next_steps": [
    "Optimize firmware for low-power operation to extend battery life.",
    "Implement remote firmware update (OTA) capabilities.",
    "Add real-time data logging to the custom web server for historical analysis and forecasting.",
    "Integrate additional sensors (e.g., temperature, humidity, rain gauge) for more comprehensive environmental monitoring.",
    "Design a custom PCB for a more compact and robust solution.",
    "Explore alternative communication methods if GSM coverage is inconsistent in specific deployment areas (e.g., LoRaWAN for local transmission to a GSM gateway)."
  ]
};
