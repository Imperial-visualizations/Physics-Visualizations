"""plputils.py"""
  
def close(a, b, threshold=1e-6):
    """Compute array of truth values of which elements are close. Threshold
    is the difference between numbers at which they are considered close.
    eg. close([1,2,0],[1,2.1,1e-7], threshold=1e-6) -> [True, False, True]"""
    N = len(a)
    ans = []
    if N != len(b):
        raise ValueError("Dimensions mismatch")
    for idx in range(N):
        ans.append(numbersclose(a[idx],b[idx],threshold))
    return ans

def numbersclose(a, b, threshold=1e-6):
    """Determine whether numbers a and b lie within 'threshold' from each other"""
    return abs(a - b) < threshold