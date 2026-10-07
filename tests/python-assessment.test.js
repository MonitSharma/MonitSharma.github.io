const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const {spawnSync} = require('node:child_process');
const suites = require('../assets/js/python-cases');

// Run the worker's actual grading harness in CPython. Browser verification separately
// exercises the Pyodide download, worker lifecycle, and execution timeout.
const worker = fs.readFileSync(require.resolve('../assets/js/python-worker.js'), 'utf8');
const harness = worker.match(/runPythonAsync\(`([\s\S]*?)`\)/)[1];
function assess(id, code) {
  const bootstrap = `import sys,json,ast
payload=json.load(sys.stdin)
env={'_student_source':payload['code'],'_suite_json':json.dumps(payload['suite'])}
tree=ast.parse(payload['harness'])
exec(compile(ast.Module(body=tree.body[:-1],type_ignores=[]),'<worker>','exec'),env)
print(eval(compile(ast.Expression(tree.body[-1].value),'<result>','eval'),env))`;
  const run = spawnSync('python3', ['-c', bootstrap], {
    input: JSON.stringify({code,suite:suites[id],harness}), encoding:'utf8', timeout:5000
  });
  assert.equal(run.status, 0, run.stderr || String(run.error));
  return JSON.parse(run.stdout);
}

test('Two Sum executes edge cases and accepts either valid index order', () => {
  const result = assess('two-sum', `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen:
            return [i, seen[target - n]]
        seen[n] = i`);
  assert.equal(result.verified, true);
  assert.equal(result.checks.length, 8);
  assert.equal(assess('two-sum', 'def two_sum(nums, target):\n    return [0, 1]').verified, false);
  assert.equal(assess('two-sum', 'def two_sum(nums, target):\n    return [0, 0]').verified, false);
});
test('Running maximum checks empty and negative inputs', () => {
  assert.equal(assess('prefix-max', `def running_max(nums):
    result = []
    largest = float('-inf')
    for n in nums:
        largest = max(largest, n)
        result.append(largest)
    return result`).verified, true);
  const incorrect = assess('prefix-max', `def running_max(nums):
    result = []
    largest = 0
    for n in nums:
        largest = max(largest, n)
        result.append(largest)
    return result`);
  assert.equal(incorrect.verified, false);
  assert.equal(incorrect.checks.find(c => c.label === 'All negative values').pass, false);
});
test('Bracket matching checks nesting and requires an actual boolean', () => {
  assert.equal(assess('valid-parentheses', `def is_valid(s):
    stack = []
    pairs = {')':'(', ']':'[', '}':'{'}
    for ch in s:
        if ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
        else:
            stack.append(ch)
    return not stack`).verified, true);
  assert.equal(assess('valid-parentheses', 'def is_valid(s):\n    return True').verified, false);
  assert.equal(assess('valid-parentheses', 'def is_valid(s):\n    return 1').verified, false);
});
test('Islands uses four-neighbor connectivity and handles empty grids', () => {
  assert.equal(assess('number-of-islands', `def num_islands(grid):
    if not grid: return 0
    seen = set()
    count = 0
    for r in range(len(grid)):
        for c in range(len(grid[0])):
            if grid[r][c] == 1 and (r,c) not in seen:
                count += 1
                stack = [(r,c)]
                seen.add((r,c))
                while stack:
                    x,y = stack.pop()
                    for a,b in ((x-1,y),(x+1,y),(x,y-1),(x,y+1)):
                        if 0 <= a < len(grid) and 0 <= b < len(grid[0]) and grid[a][b] == 1 and (a,b) not in seen:
                            seen.add((a,b))
                            stack.append((a,b))
    return count`).verified, true);
  assert.equal(assess('number-of-islands', 'def num_islands(grid):\n    return 2').verified, false);
});
test('Syntax errors, missing functions, exceptions, and unsupported imports fail closed', () => {
  for (const code of ['def two_sum(', 'answer = [0, 1]', 'def two_sum(nums, target):\n    raise ValueError("broken")', 'import js\ndef two_sum(nums,target): return [0,1]']) {
    const result = assess('two-sum', code);
    assert.equal(result.verified, false);
    assert.ok(result.checks.some(c => !c.pass));
  }
});
