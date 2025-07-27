function product_Range(a: number, b: number) {
    var prd = a,i = a;
   
    while (i++< b) {
      prd*=i;
    }
    return prd;
  }
  
  
export function combinations(n: number, r: number) 
{
    if (n==r || r==0) 
    {
        return 1;
    } 
    else 
    {
        r=(r < n-r) ? n-r : r;
        return product_Range(r+1, n)/product_Range(1, n-r);
    }
}