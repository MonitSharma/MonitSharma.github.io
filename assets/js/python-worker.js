/* Python runs in a fresh worker per check. The parent terminates slow programs. */
import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.27.7/full/pyodide.mjs';
const pyodide=await loadPyodide();
self.postMessage({type:'ready'});
self.onmessage=async event=>{
  const {code,suite}=event.data;
  try {
    pyodide.globals.set('_student_source',code);
    pyodide.globals.set('_suite_json',JSON.stringify(suite));
    const result=await pyodide.runPythonAsync(`
import ast, json, copy, contextlib, io
_suite = json.loads(_suite_json)
_checks = []
try:
    _tree = ast.parse(_student_source)
    # These are small algorithm exercises. Keep imports to their Python helpers.
    for _node in ast.walk(_tree):
        if isinstance(_node, (ast.Import, ast.ImportFrom)):
            _mods = [_node.module] if isinstance(_node, ast.ImportFrom) else [a.name for a in _node.names]
            if any((m or '').split('.')[0] not in ('math', 'collections', 'itertools', 'functools', 'typing', 'heapq', 'bisect') for m in _mods):
                raise ValueError('This exercise supports standard algorithm helpers only; external packages and browser access are not supported.')
    _environment = {'__builtins__': __builtins__}
    with contextlib.redirect_stdout(io.StringIO()):
        exec(compile(_tree, '<exercise>', 'exec'), _environment)
    _function = _environment.get(_suite['name'])
    if not callable(_function):
        raise ValueError('Define the function ' + _suite['name'] + ' with the requested arguments.')
    for _case in _suite['cases']:
        try:
            _args = copy.deepcopy(_case['args'])
            with contextlib.redirect_stdout(io.StringIO()):
                _actual = _function(*_args)
            if _suite['name'] == 'two_sum':
                _nums, _target = _case['args']
                _ok = isinstance(_actual, (list, tuple)) and len(_actual) == 2 and all(type(i) is int and 0 <= i < len(_nums) for i in _actual) and _actual[0] != _actual[1] and _nums[_actual[0]] + _nums[_actual[1]] == _target
                _wanted = 'two distinct valid indices whose values add to ' + str(_target)
            else:
                _wanted = _case['expected']
                _ok = _actual == _wanted and (type(_actual) is bool if _suite['name'] == 'is_valid' else type(_actual) is int if _suite['name'] == 'num_islands' else isinstance(_actual, list))
            _checks.append({'label': _case['label'], 'pass': bool(_ok), 'detail': 'Returned ' + repr(_actual)[:120] + '; expected ' + str(_wanted)[:120]})
        except Exception as _error:
            _checks.append({'label': _case['label'], 'pass': False, 'detail': type(_error).__name__ + ': ' + str(_error)[:180]})
except Exception as _error:
    _checks = [{'label': 'Python program executes', 'pass': False, 'detail': type(_error).__name__ + ': ' + str(_error)[:250]}]
json.dumps({'checks': _checks, 'verified': bool(_checks) and all(c['pass'] for c in _checks), 'message': 'Executed Python against actual input/output cases. These checks verify the tested behavior, not asymptotic complexity.'})
    `);
    self.postMessage({type:'result',result:JSON.parse(result)});
  }catch(error){self.postMessage({type:'error',message:error.message});}
};
