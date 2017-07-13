import json
import numpy as np

x = np.linspace(0, 100, 1001).tolist()
y = np.sin(x).tolist()

data_dict = dict(x=x, y=y)

with open("data.txt", 'w') as test_file:
    json.dump(data_dict, test_file, ensure_ascii=False)
