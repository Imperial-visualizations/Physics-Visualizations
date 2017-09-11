def Point_test():
    from point import Point
    pt = Point([1,2,3]) #__init__
    print(pt)
    print(pt.getXYZ()) #getXYZ 
    print(pt.goify()) #goify

def Line_test():
    from line import Line
    line = Line([1,0,0],[1,1,1])
    print(line,line.vec,line.offset) #test that initial parameters work
    print(line.getXYZ())
    print(line.goify()) #goify

def Plane_test():
    from plane import Plane
    plane = Plane([1,2,3],[1,1,1])
    print(Plane,plane.normal,plane.offset)
    print(plane.getXYZ())
    print(plane.goify())

if __name__ == "__main__":
    #run all tests
    tests = [func for func in dir() if func[0] != '_']
    [eval(test+'()') for test in tests]
