import plputils

class Vector:
    """Vector class to enable use of numpy arrays manipulation methods in
    context of Points, Lines and Planes.
    @author Nick
    @since 01.08.17"""
    def __init__(self, vec):
        self.vec = vec
        
    def __add__(self, other):
        N= len(self.vec)
        ans = []
        if N != len(other.vec):
            raise ValueError("Dimensions mismatch")
        for idx in range(N):
            ans.append(self.vec[idx]+other.vec[idx])
        return Vector(ans)
        
    def __sub__(self, other):
        return self.__add__(other.__neg__())
        
    def __neg__(self):
        ans = []
        for idx in range(len(self.vec)):
            ans.append(-self.vec[idx])
        return Vector(ans)
    
    def mul(self, num):
        new_vec = [num*i for i in self.vec]
        return Vector(new_vec)
        
    def __mul__(self, other):
        return self.mul(other)
    
    def __rmul__(self, other):
        return self.__mul__(other)
    
    def __repr__(self):
        return 'Vector: ' + str(self.vec)
        
    def dot(self, other):
        """Dot product between this vector and some other vector.
        @author Nick
        @since 01.08.17"""
        N= len(self.vec)
        ans = []
        if N != len(other.vec):
            raise ValueError("Dimensions mismatch")
        for idx in range(N):
            ans.append(self.vec[idx]*other.vec[idx])
        return float(sum(ans))
    
    def cross(self, other):
        """Cross product between this vector and some other vector.
        @author Nick
        @since 01.08.17"""
        a=self.vec
        b=other.vec
        if len(a) != 3 or len(b) != 3:
            raise ValueError("Dimensions mismatch: cross product only works in 3d")
        return Vector([a[1]*b[2]-a[2]*b[1], a[0]*b[2]-a[2]*b[0], a[0]*b[1]-a[1]*b[0]])
    
    def normalize(self):
        """Normalizes a vector v, returns a 3d vector.
        @author Nick
        @since 01.08.17"""
        magnitude = self.norm()
        if plputils.numbersclose(magnitude,0.0):
            raise ValueError("Zero vector cannot be normalized.")
        else:
            return Vector([i/magnitude for i in self.vec])
    
    def norm(self):
        """Norm of a vector.
        @author Nick
        @since 01.08.17"""
        return sum([i**2 for i in self.vec])**(0.5)
