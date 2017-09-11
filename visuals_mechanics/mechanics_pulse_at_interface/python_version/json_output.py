import json
import numpy as np

t_list = [i+1 for i in range(10)]
x = np.linspace(0, 10, 100)
y = (x-1) * np.exp(-(x-1)**2 + (x-1))
data = []

for t in t_list:
    data.append({"name": str(t), "data": [{"x": [*x], "y": [*y]}]})

with open("data_pulse.json", 'w') as test_file:
    json.dump(data, test_file, ensure_ascii=False)
