(function(root){
  const cases={
    'two-sum':{name:'two_sum',cases:[
      {label:'Basic pair',args:[[2,7,11,15],9]}, {label:'Unsorted pair',args:[[3,2,4],6]},
      {label:'Duplicate values use distinct indices',args:[[3,3],6]}, {label:'Zero target',args:[[-3,0,3,4],0]},
      {label:'Negative numbers',args:[[-5,-2,-9,-1],-3]}, {label:'Pair at the end',args:[[11,3,7,2,8],10]},
      {label:'Same element cannot be used twice',args:[[3,1,5],6]}, {label:'Large values',args:[[1000000,-999999,4],1]}
    ]},
    'prefix-max':{name:'running_max',cases:[
      {label:'Rising and falling values',args:[[2,1,5,3]],expected:[2,2,5,5]}, {label:'Empty input',args:[[]],expected:[]},
      {label:'All negative values',args:[[-4,-7,-2,-5]],expected:[-4,-4,-2,-2]}, {label:'Repeated values',args:[[3,3,3]],expected:[3,3,3]},
      {label:'Single value',args:[[-9]],expected:[-9]}, {label:'Descending values',args:[[9,5,2,0]],expected:[9,9,9,9]},
      {label:'Crossing zero',args:[[-2,0,-1,4]],expected:[-2,0,0,4]}
    ]},
    'valid-parentheses':{name:'is_valid',cases:[
      ...[['({[]})',true],['',true],['()',true],['()[]{}',true],['([)]',false],['(',false],[')',false],['((',false],['[{}]',true],['}{',false],['(()())',true],['[(])',false]].map(([s,expected])=>({label:`Brackets ${s||'(empty)'}`,args:[s],expected}))
    ]},
    'number-of-islands':{name:'num_islands',cases:[
      {label:'Two separate islands',args:[[[1,1,0],[0,1,0],[0,0,1]]],expected:2}, {label:'Empty grid',args:[[]],expected:0},
      {label:'All water',args:[[[0,0],[0,0]]],expected:0}, {label:'One connected island',args:[[[1,1],[1,1]]],expected:1},
      {label:'Diagonal cells are not connected',args:[[[1,0],[0,1]]],expected:2}, {label:'Separated row',args:[[[1,0,1,0,1]]],expected:3},
      {label:'Ring is one island',args:[[[1,1,1],[1,0,1],[1,1,1]]],expected:1}, {label:'Single cell',args:[[[1]]],expected:1}
    ]}
  };
  if(typeof module!=='undefined'&&module.exports)module.exports=cases;else root.PythonCases=cases;
})(typeof window==='undefined'?globalThis:window);
