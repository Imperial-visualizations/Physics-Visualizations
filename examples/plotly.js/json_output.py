import json
import numpy as np

amplitudes = [i+1 for i in range(10)]
x = np.linspace(0, 100, 1001)
data = []

for amp in amplitudes:
    data.append({"name": str(amp), "data": [{"x": [*x], "y": [*amp*np.sin(x)]}]})

with open("data.json", 'w') as test_file:
    json.dump(data, test_file, ensure_ascii=False)

# ToDo: time changing (data updating)
# ToDo: animation slider changes data then pause/play?
# ToDo: amplitude slider
# ToDo: show both buttons and slider
# ToDo: animation
# ToDO: maximise what can do in Python
