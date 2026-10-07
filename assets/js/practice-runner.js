(function(root){
  function runPython(code,id,mode,onStatus=()=>{}) {
    const suite=root.PythonCases[id];
    if(!suite)return Promise.resolve({verified:false,checks:[{label:'Exercise is supported',pass:false,detail:'No behavioral test suite exists yet.'}]});
    return new Promise(resolve=>{
      const worker=new Worker('assets/js/python-worker.js',{type:'module'});
      let timer;
      const finish=result=>{clearTimeout(timer);worker.terminate();resolve(result);};
      const error=message=>finish({verified:false,checks:[{label:'Python runner',pass:false,detail:message}],message});
      onStatus('Loading browser Python…');
      timer=setTimeout(()=>error('Python could not load within 45 seconds. The first run needs an internet connection to download the pinned Pyodide runtime.'),45000);
      worker.onmessage=event=>{
        if(event.data.type==='ready'){
          clearTimeout(timer);onStatus('Running input/output cases…');
          timer=setTimeout(()=>error('Execution stopped after 2 seconds. Check for an infinite loop or missing termination condition.'),2000);
          worker.postMessage({code,suite:{...suite,cases:mode==='sample'?suite.cases.slice(0,2):suite.cases}});
        }else if(event.data.type==='result')finish(event.data.result);
        else if(event.data.type==='error')error(event.data.message);
      };
      worker.onerror=()=>error('Python runtime unavailable. Check your connection and retry. No assessment was passed.');
    });
  }
  function cleanCuda(code){return code.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\/\/[^\n]*/g,'').replace(/"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'/g,'');}
  function reviewCuda(exercise,code) {
    const source=cleanCuda(code);
    const checks=exercise.checks.map(([label,test])=>({label,pass:test(source),detail:'Structural hint only; this kernel has not been compiled or run.'}));
    return {verified:false,reviewOnly:true,checks,message:'This is a CUDA structure review. It cannot establish numeric correctness, memory safety, or synchronization correctness without compiling and running the kernel on a GPU.'};
  }
  root.PracticeRunner={runPython,reviewCuda};
})(typeof window==='undefined'?globalThis:window);
