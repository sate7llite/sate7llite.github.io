function partition(arr, start, end, cmpFunc)
{
    // Taking the last element as the pivot
    const pivotValue = arr[end];
    let pivotIndex = start; 
    for (let i = start; i < end; i++) 
	{
        if ( cmpFunc(arr[i], pivotValue) < 0 ) 
		{
			// Swapping elements
			[arr[i], arr[pivotIndex]] = [arr[pivotIndex], arr[i]];
			// Moving to next element
			pivotIndex++;
        }
    }
    
    // Putting the pivot value in the middle
    [arr[pivotIndex], arr[end]] = [arr[end], arr[pivotIndex]] 
    return pivotIndex;
};

function defCmp(o1, o2)
{
	return o1-o2;
}

function quickSortRecursive(arr, cmpFunc=defCmp, start=0, end=-1) 
{
	if(end<0)
		end = arr.length-1;
		
    // Base case or terminating case
    if (start >= end) 
        return;
    
    // Returns pivotIndex
    let index = partition(arr, start, end, cmpFunc);
    
    // Recursively apply the same logic to the left and right subarrays
    quickSortRecursive(arr, cmpFunc, start, index - 1);
    quickSortRecursive(arr, cmpFunc, index + 1, end);
}
