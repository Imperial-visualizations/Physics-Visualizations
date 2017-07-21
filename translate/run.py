from translate.plotly_translator import *

d0 = [[[8.83, 8.89, 8.81, 8.87, 8.9, 8.87],
    [8.89, 8.94, 8.85, 8.94,8.96,8.92],
    [8.84,8.9,8.82,8.92,8.93,8.91],
    [8.79,8.85,8.79,8.9,8.94,8.92],
    [8.79,8.88,8.81,8.9,8.95,8.92],
    [8.8,8.82,8.78,8.91,8.94,8.92],
    [8.75,8.78,8.77,8.91,8.95,8.92],
    [8.8,8.8,8.77,8.91,8.95,8.94],
    [8.74,8.81,8.76,8.93,8.98,8.99],
    [8.89,8.99,8.92,9.1,9.13,9.11],
    [8.97,8.97,8.91,9.09,9.11,9.11],
    [9.04,9.08,9.05,9.25,9.28,9.27],
    [9,9.01,9,9.2,9.23,9.2],
    [8.99,8.99,8.98,9.18,9.2,9.19],
    [8.93,8.97,8.97,9.18,9.2,9.18]]]

# surf = Surface(id="test_surface_plot")
# surf.plot(d0, showscale=True, legend=False, opacity=0.9)
line = Scatter2D(id="sc_pl", x=d0[0][0], y=d0[0][1])
line.add_data(x=d0[0][2], y=d0[0][3])
line.plot()
print(line)

# line2 = Line2D(x=d0[0][2], y=d0[0][3])
# print(line2)
#
# script = show(x=line.data, y=line2.data)
# print(script)

line.create_document("test.html")
# surf.show()
# surf.create_document("test.html")
# print(surf)
