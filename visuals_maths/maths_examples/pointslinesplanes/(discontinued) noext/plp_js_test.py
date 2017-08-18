__pragma__('opov')
def point_test():
    import point
    x = float(document.getElementById('point_x').value)
    y = float(document.getElementById('point_y').value)
    z = float(document.getElementById('point_z').value)
    pt = point.Point([x,y,z])
    document.getElementById('point_pos').innerHTML = "{}: {}".format('Position', pt.pos)
    document.getElementById('point_getXYZ').innerHTML = "{}: {}".format('getXYZ()', pt.getXYZ())
    document.getElementById('point_goify').innerHTML = "{}: {}".format('goify()', pt.goify())
    Plotly.plot('scatter3d',pt.goify())

def line_test():
    import line
    vx = float(document.getElementById('line_dir_x').value)
    vy = float(document.getElementById('line_dir_y').value)
    vz = float(document.getElementById('line_dir_z').value)
    ox = float(document.getElementById('line_off_x').value)
    oy = float(document.getElementById('line_off_y').value)
    oz = float(document.getElementById('line_off_z').value)
    lin = line.Line([vx,vy,vz],[ox,oy,oz])
    document.getElementById('line_dir').innerHTML = "{}: {}".format('Direction', lin.vec)
    document.getElementById('line_off').innerHTML = "{}: {}".format('Offset', lin.offset)
    document.getElementById('line_getXYZ').innerHTML = "{}: {}".format('getXYZ()', lin.getXYZ())
    document.getElementById('line_goify').innerHTML = "{}: {}".format('goify()', lin.goify())
    
def plane_test():
    import plane
    nx = float(document.getElementById('plane_n_x').value)
    ny = float(document.getElementById('plane_n_y').value)
    nz = float(document.getElementById('plane_n_z').value)
    ox = float(document.getElementById('plane_off_x').value)
    oy = float(document.getElementById('plane_off_y').value)
    oz = float(document.getElementById('plane_off_z').value)
    pl = plane.Plane([nx,ny,nz],[ox,oy,oz])
    document.getElementById('plane_normal').innerHTML = "{}: {}".format('Normal', pl.normal)
    document.getElementById('plane_off').innerHTML = "{}: {}".format('Offset', pl.offset)
    document.getElementById('plane_getXYZ').innerHTML = "{}: {}".format('getXYZ()', pl.getXYZ())
    document.getElementById('plane_goify').innerHTML = "{}: {}".format('goify()', pl.goify())
__pragma__('noopov')
