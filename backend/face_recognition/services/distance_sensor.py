import serial
import threading
import time


class DistanceSensor:
    _instance = None
    _lock = threading.Lock()

    def __new__(cls, port="COM10", baudrate=9600):
        with cls._lock:
            if cls._instance is None:
                cls._instance = super().__new__(cls)
                cls._instance._init_serial(port, baudrate)
            return cls._instance

    def _init_serial(self, port, baudrate):
        try:
            self.ser = serial.Serial(port, baudrate, timeout=0.2)
            time.sleep(2)  # esperar reset Arduino
            self.ser.reset_input_buffer()
            print("[DIST] Serial conectado en", port)
        except Exception as e:
            print("Error conectando Arduino:", e)
            self.ser = None

    def get_distance_cm(self):
        if not self.ser:
            return None

        try:
            last_line = None

            # Vaciar buffer y quedarnos con el ÚLTIMO valor
            while self.ser.in_waiting:
                raw = self.ser.readline()
                line = raw.decode().strip()
                if line:
                    last_line = line

            if last_line is None:
                return None

            print("[DIST] LAST LINE:", last_line)

            value = int(last_line)

            # Filtro físico razonable
            if 2 <= value <= 200:
                return value

            print("[DIST] Fuera de rango:", value)
            return None

        except Exception as e:
            print("[DIST] ERROR:", e)
            return None


# Singleton práctico
distance_sensor = DistanceSensor()
