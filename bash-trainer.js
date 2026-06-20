// ═══════════════════════════════════════════════════════════════════════════
// bash-trainer.js — Complete Linux CLI Sandbox Extension
// Drop this <script src="bash-trainer.js"></script> after the closing </script>
// of the inline script in bash-trainer.html, OR replace the inline <script>
// block entirely with this file.
// ═══════════════════════════════════════════════════════════════════════════

// ─────────────────────────────────────────────────────────────
// VIRTUAL FILESYSTEM
// ─────────────────────────────────────────────────────────────
const INITIAL_FS = {
  type: 'd', children: {
    home: { type: 'd', children: {
      analyst: { type: 'd', children: {
        reports: { type: 'd', children: {
          'Q1_added_users.txt': { type: 'f', content: 'HR\nFinance\nSales', perms: '644', owner: 'analyst' },
          'Q2_added_users.txt': { type: 'f', content: 'Engineering', perms: '644', owner: 'analyst' },
          'Q3_added_users.txt': { type: 'f', content: 'Marketing', perms: '644', owner: 'analyst' },
          'Q4_added_users.txt': { type: 'f', content: 'Human Resources', perms: '644', owner: 'analyst' },
        }, perms: '755', owner: 'analyst' },
        downloads: { type: 'd', children: {}, perms: '755', owner: 'analyst' },
        projects:  { type: 'd', children: {
          'README.md': { type: 'f', content: '# Projects\n\nUse this directory to practice organizing project files.\n\nTry:\n  mkdir myproject\n  touch myproject/main.sh\n  chmod +x myproject/main.sh', perms: '644', owner: 'analyst' },
        }, perms: '755', owner: 'analyst' },
        scripts: { type: 'd', children: {
          'hello.sh': { type: 'f', content: '#!/bin/bash\necho "Hello, $USER!"\necho "Today is: $(date)"\necho "You are in: $PWD"', perms: '755', owner: 'analyst' },
          'backup.sh': { type: 'f', content: '#!/bin/bash\n# Simple backup script\nSRC=$1\nDST=$2\nif [ -z "$SRC" ] || [ -z "$DST" ]; then\n  echo "Usage: backup.sh <source> <dest>"\n  exit 1\nfi\ncp -r "$SRC" "$DST"\necho "Backed up $SRC to $DST"', perms: '755', owner: 'analyst' },
          'count_lines.sh': { type: 'f', content: '#!/bin/bash\nfor f in "$@"; do\n  echo "$f: $(wc -l < "$f") lines"\ndone', perms: '755', owner: 'analyst' },
        }, perms: '755', owner: 'analyst' },
        'notes.txt':  { type: 'f', content: 'Welcome Analyst\nUse this environment to practice Linux commands.', perms: '644', owner: 'analyst' },
        'todo.txt':   { type: 'f', content: 'Learn grep patterns\nPractice pipes and redirects\nUnderstand file permissions\nWrite a shell script', perms: '644', owner: 'analyst' },
        '.bashrc':    { type: 'f', content: '# .bashrc\nexport PATH=$PATH:/usr/bin\nalias ll="ls -la"\nalias la="ls -A"\nalias grep="grep --color=auto"', perms: '644', owner: 'analyst' },
        '.bash_history': { type: 'f', content: '', perms: '600', owner: 'analyst' },
        '.bash_profile': { type: 'f', content: '# .bash_profile\n[ -f ~/.bashrc ] && source ~/.bashrc', perms: '644', owner: 'analyst' },
      }, perms: '755', owner: 'analyst' },
    }},
    etc: { type: 'd', children: {
      passwd:   { type: 'f', content: 'root:x:0:0:root:/root:/bin/bash\nanalyst:x:1000:1000:Analyst User:/home/analyst:/bin/bash\nguest:x:1001:1001:Guest:/home/guest:/bin/sh', perms: '644', owner: 'root' },
      shadow:   { type: 'f', content: 'root:*:19000:0:99999:7:::\nanalyst:$6$hash:19000:0:99999:7:::', perms: '640', owner: 'root' },
      hosts:    { type: 'f', content: '127.0.0.1\tlocalhost\n127.0.1.1\tbash-trainer\n192.168.1.1\tgateway', perms: '644', owner: 'root' },
      group:    { type: 'f', content: 'root:x:0:\nsudo:x:27:analyst\nusers:x:100:analyst\nanalyst:x:1000:\nguest:x:1001:', perms: '644', owner: 'root' },
      hostname: { type: 'f', content: 'bash-trainer', perms: '644', owner: 'root' },
      'os-release': { type: 'f', content: 'NAME="Ubuntu"\nVERSION="22.04.3 LTS (Jammy Jellyfish)"\nID=ubuntu\nID_LIKE=debian\nPRETTY_NAME="Ubuntu 22.04.3 LTS"\nVERSION_ID="22.04"', perms: '644', owner: 'root' },
      'resolv.conf': { type: 'f', content: 'nameserver 8.8.8.8\nnameserver 8.8.4.4', perms: '644', owner: 'root' },
      crontab: { type: 'f', content: '# /etc/crontab\nSHELL=/bin/bash\nPATH=/usr/local/sbin:/usr/local/bin:/sbin:/bin:/usr/sbin:/usr/bin\n#m  h  dom mon dow user  command\n17 *  *   *   *  root  cd / && run-parts --report /etc/cron.hourly\n0  6  *   *   *  root  test -x /usr/sbin/anacron || run-parts /etc/cron.daily', perms: '644', owner: 'root' },
      fstab: { type: 'f', content: '# /etc/fstab\n/dev/sda1  /        ext4  defaults  0  1\n/dev/sda2  /home    ext4  defaults  0  2\ntmpfs      /tmp     tmpfs nodev,nosuid  0  0', perms: '644', owner: 'root' },
    }, perms: '755', owner: 'root' },
    var: { type: 'd', children: {
      log: { type: 'd', children: {
        'syslog': { type: 'f', content: 'Jun 19 00:00:01 bash-trainer kernel: Booted\nJun 19 00:00:02 bash-trainer systemd: Started session\nJun 19 08:00:01 bash-trainer cron: pam_unix(cron:session): session opened for user root\nJun 19 08:17:01 bash-trainer cron: pam_unix(cron:session): session closed for user root\nJun 19 09:15:42 bash-trainer sshd: Accepted publickey for analyst from 192.168.1.50\nJun 19 10:00:01 bash-trainer cron: pam_unix(cron:session): session opened for user root', perms: '640', owner: 'syslog' },
        'auth.log': { type: 'f', content: 'Jun 19 09:15:42 bash-trainer sshd: Accepted publickey for analyst from 192.168.1.50\nJun 19 09:15:42 bash-trainer sshd: pam_unix(sshd:session): session opened for user analyst\nJun 19 09:30:11 bash-trainer sudo: analyst : TTY=pts/0 ; PWD=/home/analyst ; USER=root ; COMMAND=/usr/bin/apt update', perms: '640', owner: 'syslog' },
        'kern.log': { type: 'f', content: 'Jun 19 00:00:01 bash-trainer kernel: [    0.000000] Initializing cgroup subsys cpuset\nJun 19 00:00:01 bash-trainer kernel: [    0.000000] Linux version 5.15.0-91-generic\nJun 19 00:00:01 bash-trainer kernel: [    0.000000] BIOS-provided physical RAM map', perms: '640', owner: 'syslog' },
      }, perms: '755', owner: 'root' },
      tmp: { type: 'd', children: {}, perms: '1777', owner: 'root' },
    }, perms: '755', owner: 'root' },
    usr: { type: 'd', children: {
      bin: { type: 'd', children: {}, perms: '755', owner: 'root' },
      local: { type: 'd', children: {
        bin: { type: 'd', children: {}, perms: '755', owner: 'root' },
      }, perms: '755', owner: 'root' },
      share: { type: 'd', children: {
        doc: { type: 'd', children: {}, perms: '755', owner: 'root' },
      }, perms: '755', owner: 'root' },
    }, perms: '755', owner: 'root' },
    proc: { type: 'd', children: {
      '1':    { type: 'd', children: { cmdline: { type: 'f', content: '/sbin/init', perms: '444', owner: 'root' } }, perms: '555', owner: 'root' },
      '1234': { type: 'd', children: { cmdline: { type: 'f', content: 'bash', perms: '444', owner: 'analyst' } }, perms: '555', owner: 'analyst' },
      cpuinfo: { type: 'f', content: 'processor\t: 0\nvendor_id\t: GenuineIntel\nmodel name\t: Intel(R) Core(TM) i7\ncpu MHz\t\t: 3600.000\ncache size\t: 8192 KB', perms: '444', owner: 'root' },
      meminfo:  { type: 'f', content: 'MemTotal:       8192000 kB\nMemFree:        4096000 kB\nMemAvailable:   5120000 kB\nBuffers:         102400 kB\nCached:          512000 kB', perms: '444', owner: 'root' },
      version:  { type: 'f', content: 'Linux version 5.15.0-91-generic (gcc version 11.4.0) #101-Ubuntu SMP', perms: '444', owner: 'root' },
      uptime:   { type: 'f', content: '3661.42 7251.84', perms: '444', owner: 'root' },
    }, perms: '555', owner: 'root' },
    dev: { type: 'd', children: {
      null:    { type: 'f', content: '', perms: '666', owner: 'root' },
      zero:    { type: 'f', content: '', perms: '666', owner: 'root' },
      random:  { type: 'f', content: '', perms: '666', owner: 'root' },
      stdin:   { type: 'f', content: '', perms: '660', owner: 'root' },
      stdout:  { type: 'f', content: '', perms: '660', owner: 'root' },
      stderr:  { type: 'f', content: '', perms: '660', owner: 'root' },
    }, perms: '755', owner: 'root' },
    tmp:  { type: 'd', children: {}, perms: '1777', owner: 'root' },
    bin:  { type: 'd', children: {}, perms: '755', owner: 'root' },
    sbin: { type: 'd', children: {}, perms: '755', owner: 'root' },
    opt:  { type: 'd', children: {}, perms: '755', owner: 'root' },
    root: { type: 'd', children: {
      '.bashrc': { type: 'f', content: '# root .bashrc\nexport PS1="\\u@\\h:\\w# "', perms: '644', owner: 'root' },
    }, perms: '700', owner: 'root' },
    mnt:  { type: 'd', children: {}, perms: '755', owner: 'root' },
    media:{ type: 'd', children: {}, perms: '755', owner: 'root' },
    srv:  { type: 'd', children: {}, perms: '755', owner: 'root' },
    run:  { type: 'd', children: {
      'sshd.pid': { type: 'f', content: '892', perms: '644', owner: 'root' },
    }, perms: '755', owner: 'root' },
  }
};

// ─────────────────────────────────────────────────────────────
// STATE
// ─────────────────────────────────────────────────────────────
let fs          = JSON.parse(JSON.stringify(INITIAL_FS));
let cwd         = '/home/analyst';
let currentUser = 'analyst';       // 'analyst' or 'root' (via sudo su)
let lastExitCode = 0;
let aliases     = { ll: 'ls -la', la: 'ls -A', grep: 'grep --color=auto' };
let env         = {
  HOME: '/home/analyst', USER: 'analyst', LOGNAME: 'analyst',
  HOSTNAME: 'bash-trainer', PATH: '/usr/local/sbin:/usr/local/bin:/usr/bin:/bin',
  SHELL: '/bin/bash', TERM: 'xterm-256color', LANG: 'en_US.UTF-8',
  PWD: '/home/analyst', OLDPWD: '/home/analyst',
  PS1: '\\u@\\h:\\w\\$ ', EDITOR: 'nano', PAGER: 'less',
};
let cmdHistory  = [];
let histIdx     = -1;
let acList      = [];
let acIdx       = -1;

// Simulated process table
const PROCESSES = [
  { pid: 1,    user: 'root',    cpu: 0.0, mem: 0.1, stat: 'Ss', start: '00:00', time: '0:01', cmd: '/sbin/init' },
  { pid: 892,  user: 'root',    cpu: 0.0, mem: 0.2, stat: 'Ss', start: '00:00', time: '0:00', cmd: '/usr/sbin/sshd -D' },
  { pid: 1200, user: 'root',    cpu: 0.0, mem: 0.1, stat: 'Ss', start: '00:00', time: '0:00', cmd: 'cron' },
  { pid: 1234, user: 'analyst', cpu: 0.0, mem: 0.4, stat: 'Ss', start: '09:15', time: '0:00', cmd: '-bash' },
  { pid: 1337, user: 'analyst', cpu: 0.0, mem: 0.3, stat: 'R+', start: '09:16', time: '0:00', cmd: 'bash-trainer' },
];

// Simulated network interfaces
const INTERFACES = [
  { name: 'lo',   addr: '127.0.0.1', mask: '255.0.0.0',     rx: '0 B',    tx: '0 B',    mac: '00:00:00:00:00:00', up: true  },
  { name: 'eth0', addr: '192.168.1.100', mask: '255.255.255.0', rx: '1.2 MB', tx: '340 KB', mac: 'de:ad:be:ef:ca:fe', up: true  },
];

// Simulated mounted filesystems
const MOUNTS = [
  { fs: '/dev/sda1',  mount: '/',     type: 'ext4',  size: '20G', used: '8.1G', avail: '10.8G', use: '43%' },
  { fs: '/dev/sda2',  mount: '/home', type: 'ext4',  size: '50G', used: '12G',  avail: '35.6G', use: '26%' },
  { fs: 'tmpfs',      mount: '/tmp',  type: 'tmpfs', size: '3.9G',used: '0',    avail: '3.9G',  use: '0%'  },
  { fs: 'tmpfs',      mount: '/run',  type: 'tmpfs', size: '786M',used: '1.2M', avail: '784M',  use: '1%'  },
];

// Systemd units
const SYSTEMD_UNITS = {
  ssh:       { status: 'active', sub: 'running', pid: 892,  desc: 'OpenBSD Secure Shell server' },
  cron:      { status: 'active', sub: 'running', pid: 1200, desc: 'Regular background program processing daemon' },
  nginx:     { status: 'inactive', sub: 'dead',  pid: null, desc: 'A high performance web server' },
  'apt-daily':{ status: 'active', sub: 'waiting',pid: null, desc: 'Daily apt download activities' },
  rsyslog:   { status: 'active', sub: 'running', pid: 400,  desc: 'System Logging Service' },
  ufw:       { status: 'active', sub: 'exited',  pid: null, desc: 'Uncomplicated firewall' },
};

// ─────────────────────────────────────────────────────────────
// FS HELPERS
// ─────────────────────────────────────────────────────────────
function normalizePath(p) {
  if (!p) p = cwd;
  if (p === '~' || p === '') p = env.HOME;
  if (p.startsWith('~/')) p = env.HOME + p.slice(1);
  if (!p.startsWith('/')) p = cwd + '/' + p;
  const parts = p.split('/').filter(Boolean);
  const res = [];
  for (const pt of parts) {
    if (pt === '.') continue;
    if (pt === '..') res.pop();
    else res.push(pt);
  }
  return '/' + res.join('/');
}

function getNode(path) {
  const parts = normalizePath(path).split('/').filter(Boolean);
  let node = fs;
  for (const p of parts) {
    if (!node.children || !node.children[p]) return null;
    node = node.children[p];
  }
  return node;
}

function getParent(path) {
  const n = normalizePath(path);
  const parts = n.split('/').filter(Boolean);
  parts.pop();
  return '/' + parts.join('/');
}

function basename(path) {
  return normalizePath(path).split('/').filter(Boolean).pop() || '/';
}

function setNode(path, node) {
  const n = normalizePath(path);
  const parts = n.split('/').filter(Boolean);
  let cur = fs;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur.children[parts[i]]) return false;
    cur = cur.children[parts[i]];
  }
  cur.children[parts[parts.length - 1]] = node;
  return true;
}

function deleteNode(path) {
  const n = normalizePath(path);
  const parts = n.split('/').filter(Boolean);
  let cur = fs;
  for (let i = 0; i < parts.length - 1; i++) {
    if (!cur.children || !cur.children[parts[i]]) return;
    cur = cur.children[parts[i]];
  }
  delete cur.children[parts[parts.length - 1]];
}

// Glob expand a path pattern (e.g. *.txt, report?.log)
function globExpand(pattern) {
  const np = normalizePath(pattern);
  const parts = np.split('/').filter(Boolean);
  let results = ['/'];

  for (const part of parts) {
    const next = [];
    const hasGlob = /[*?\[\]{}]/.test(part);
    for (const base of results) {
      const node = getNode(base);
      if (!node || node.type !== 'd') continue;
      if (!hasGlob) {
        if (node.children && node.children[part]) next.push(base === '/' ? '/' + part : base + '/' + part);
      } else {
        const re = new RegExp('^' + part.replace(/\./g,'\\.').replace(/\*/g,'.*').replace(/\?/g,'.') + '$');
        for (const [name] of Object.entries(node.children || {})) {
          if (re.test(name)) next.push(base === '/' ? '/' + name : base + '/' + name);
        }
      }
    }
    results = next;
  }
  return results.length ? results : [pattern]; // return original if no match
}

// Brace expansion: file.{txt,log,sh} → [file.txt, file.log, file.sh]
function braceExpand(token) {
  const match = token.match(/^(.*?)\{([^{}]+)\}(.*)$/);
  if (!match) return [token];
  const [, pre, inner, post] = match;
  return inner.split(',').flatMap(item => braceExpand(pre + item + post));
}

function promptStr() {
  let p = normalizePath(cwd);
  if (p.startsWith(env.HOME)) p = '~' + p.slice(env.HOME.length);
  return p;
}

function updatePrompt() {
  const p = promptStr();
  const dollar = currentUser === 'root' ? '#' : '$';
  const userCls = currentUser === 'root' ? 'color:var(--red)' : 'color:var(--green-dim)';
  document.getElementById('prompt-label').innerHTML =
    `<span style="${userCls}">${escHtml(currentUser)}</span><span class="at">@</span><span class="host">bash-trainer</span><span class="sep">:</span><span class="path">${escHtml(p)}</span><span class="dollar"> ${dollar}</span>`;
  document.getElementById('topbar-title').textContent = `${currentUser}@bash-trainer: ${p}`;
}

// ─────────────────────────────────────────────────────────────
// OUTPUT
// ─────────────────────────────────────────────────────────────
const outputEl = document.getElementById('output');

function print(html, cls = 'line-out') {
  const d = document.createElement('div');
  d.className = 'line ' + cls;
  d.innerHTML = html;
  outputEl.appendChild(d);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function printText(text, cls = 'line-out') {
  if (text === '') { print('&nbsp;', cls); return; }
  text.split('\n').forEach(l => print(escHtml(l) || '&nbsp;', cls));
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function printPromptEcho(raw) {
  const p = promptStr();
  const dollar = currentUser === 'root' ? '#' : '$';
  const userStyle = currentUser === 'root' ? 'color:var(--red)' : 'color:var(--green-dim)';
  const d = document.createElement('div');
  d.className = 'line prompt-echo';
  d.innerHTML = `<span style="${userStyle}">${escHtml(currentUser)}</span><span class="at">@</span><span class="host">bash-trainer</span><span class="sep">:</span><span class="path">${escHtml(p)}</span><span class="dollar"> ${dollar} </span><span>${escHtml(raw)}</span>`;
  outputEl.appendChild(d);
  outputEl.scrollTop = outputEl.scrollHeight;
}

// ─────────────────────────────────────────────────────────────
// PARSER  (enhanced: brace expansion, glob, $() substitution, $? $$ $0)
// ─────────────────────────────────────────────────────────────
function tokenize(input) {
  const tokens = [];
  let cur = '', inQ = null, inDQ = false;
  for (let i = 0; i < input.length; i++) {
    const c = input[i];
    if (inQ === "'") {
      if (c === "'") inQ = null;
      else cur += c;
    } else if (inDQ) {
      if (c === '"') { inDQ = false; }
      else cur += c; // still expand $var below via expandEnv
    } else if (c === '"') {
      inDQ = true;
    } else if (c === "'") {
      inQ = "'";
    } else if (c === '\\' && i + 1 < input.length) {
      cur += input[++i];
    } else if (c === ' ' || c === '\t') {
      if (cur) { tokens.push(cur); cur = ''; }
    } else {
      cur += c;
    }
  }
  if (cur) tokens.push(cur);
  return tokens;
}

function expandEnv(arg) {
  // $? $$ $0 $1..
  return arg
    .replace(/\$\?/g, String(lastExitCode))
    .replace(/\$\$/g, '1337')
    .replace(/\$0/g, 'bash')
    .replace(/\$([A-Z_][A-Z0-9_]*)/gi, (_, k) => env[k] !== undefined ? env[k] : '')
    .replace(/\$\{([^}]+)\}/g, (_, k) => env[k] !== undefined ? env[k] : '');
}

// Recursively expand $(...) command substitution
function expandCmdSub(arg) {
  return arg.replace(/\$\(([^)]+)\)/g, (_, inner) => {
    const result = runPipelineCapture(inner.trim());
    return result.out.trim();
  });
}

function resolveArgs(args) {
  const out = [];
  for (const a of args) {
    let expanded = expandCmdSub(expandEnv(a));
    // brace expand
    const braced = braceExpand(expanded);
    // glob expand each
    for (const b of braced) {
      if (/[*?\[\]]/.test(b)) {
        const globs = globExpand(b);
        out.push(...globs);
      } else {
        out.push(b);
      }
    }
  }
  return out;
}

function parseInput(input) {
  const segments = input.split('|').map(s => s.trim()).filter(Boolean);
  return segments.map(s => {
    const toks = tokenize(s);
    return { cmd: toks[0] || '', args: toks.slice(1) };
  });
}

// ─────────────────────────────────────────────────────────────
// COMMAND IMPLEMENTATIONS
// ─────────────────────────────────────────────────────────────
const COMMANDS = {};

// ── Navigation ──────────────────────────────────────────────

COMMANDS.pwd = () => ({ out: normalizePath(cwd) });

COMMANDS.cd = ({ args }) => {
  const target = args[0] || env.HOME;
  // cd - go back to OLDPWD
  if (target === '-') {
    const tmp = env.OLDPWD || env.HOME;
    env.OLDPWD = cwd;
    cwd = tmp;
    env.PWD = cwd;
    updatePrompt();
    return { out: cwd };
  }
  const resolved = normalizePath(target);
  const node = getNode(resolved);
  if (!node) return { err: `cd: ${target}: No such file or directory` };
  if (node.type !== 'd') return { err: `cd: ${target}: Not a directory` };
  if (resolved === '/root' && currentUser !== 'root') return { err: `cd: /root: Permission denied` };
  env.OLDPWD = cwd;
  cwd = resolved;
  env.PWD = cwd;
  updatePrompt();
  return { out: '' };
};

COMMANDS.ls = ({ args }) => {
  const flags   = args.filter(a => a.startsWith('-'));
  const paths   = args.filter(a => !a.startsWith('-'));
  const showAll = flags.some(f => f.includes('a'));
  const longFmt = flags.some(f => f.includes('l'));
  const humanSz = flags.some(f => f.includes('h'));
  const recurse = flags.some(f => f.includes('R'));
  const target  = paths[0] ? normalizePath(paths[0]) : normalizePath(cwd);
  const node    = getNode(target);
  if (!node) return { err: `ls: cannot access '${paths[0] || cwd}': No such file or directory` };

  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const now    = new Date();
  const dateStr = `${months[now.getMonth()]} ${String(now.getDate()).padStart(2)} ${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`;

  function renderDir(node, dirPath) {
    if (node.type === 'f') return { html: `<span class="ls-file">${escHtml(basename(dirPath))}</span>` };

    let entries = Object.entries(node.children).filter(([n]) => showAll || !n.startsWith('.'));
    entries.sort((a, b) => {
      if (a[1].type === b[1].type) return a[0].localeCompare(b[0]);
      return a[1].type === 'd' ? -1 : 1;
    });

    function fmtSize(content) {
      const b = content ? content.length : 0;
      if (!humanSz) return String(b).padStart(6);
      if (b < 1024) return `${b}B`.padStart(6);
      if (b < 1048576) return `${(b/1024).toFixed(1)}K`.padStart(6);
      return `${(b/1048576).toFixed(1)}M`.padStart(6);
    }

    if (!longFmt) {
      const parts = entries.map(([name, nd]) => {
        const cls = nd.type === 'd' ? 'ls-dir' : (nd.perms && nd.perms.includes('7') ? 'ls-exec' : 'ls-file');
        const suffix = nd.type === 'd' ? '/' : (nd.perms === '755' || nd.perms === '744' ? '*' : '');
        return `<span class="${cls}">${escHtml(name)}${suffix}</span>`;
      });
      return { html: parts.join('  ') };
    }

    const lines = [];
    if (showAll) {
      lines.push(`<span class="ls-dir">drwxr-xr-x  2 analyst analyst      0 ${dateStr} ./</span>`);
      lines.push(`<span class="ls-dir">drwxr-xr-x  2 analyst analyst      0 ${dateStr} ../</span>`);
    }
    for (const [name, nd] of entries) {
      const isDir = nd.type === 'd';
      const isLink= nd.type === 'l';
      const perms = nd.perms || (isDir ? '755' : '644');
      let permStr;
      if (isLink) permStr = 'lrwxrwxrwx';
      else if (isDir) {
        const p = parseInt(perms, 8) || 0o755;
        permStr = 'd' + permBits(p);
      } else {
        const p = parseInt(perms, 8) || 0o644;
        permStr = '-' + permBits(p);
      }
      const sz    = isDir ? '     0' : fmtSize(nd.content || '');
      const owner = nd.owner || 'analyst';
      const cls   = isDir ? 'ls-dir' : isLink ? 'ls-file' : (perms === '755' || perms === '744' ? 'ls-exec' : 'ls-file');
      const suffix= isDir ? '/' : isLink ? ` -> ${nd.target||'?'}` : '';
      lines.push(`<span class="${cls}">${escHtml(permStr)}  1 ${owner.padEnd(8)} ${owner.padEnd(8)} ${sz} ${dateStr} ${escHtml(name)}${suffix}</span>`);
    }

    let html = lines.join('\n');
    if (recurse) {
      for (const [name, nd] of entries) {
        if (nd.type === 'd') {
          const sub = renderDir(nd, dirPath + '/' + name);
          html += `\n\n<span class="ls-dir">${escHtml(dirPath + '/' + name)}:</span>\n` + sub.html;
        }
      }
    }
    return { html };
  }

  return renderDir(node, target);
};

function permBits(p) {
  const r = (p, shift) => {
    const bits = (p >> shift) & 7;
    return (bits & 4 ? 'r' : '-') + (bits & 2 ? 'w' : '-') + (bits & 1 ? 'x' : '-');
  };
  return r(p,6) + r(p,3) + r(p,0);
}

COMMANDS.tree = ({ args }) => {
  const target = args[0] ? normalizePath(args[0]) : normalizePath(cwd);
  const node   = getNode(target);
  if (!node) return { err: `tree: '${args[0] || cwd}': No such file or directory` };
  const maxDepth = args.includes('-L') ? parseInt(args[args.indexOf('-L') + 1]) : Infinity;
  const showAll  = args.some(a => a.includes('a'));
  const lines    = [escHtml(basename(target) + '/')];
  let dirs = 0, files = 0;

  function walk(n, prefix, depth) {
    if (depth > maxDepth) return;
    const entries = Object.entries(n.children || {}).filter(([nm]) => showAll || !nm.startsWith('.'));
    entries.sort((a,b) => a[0].localeCompare(b[0]));
    entries.forEach(([name, child], idx) => {
      const last      = idx === entries.length - 1;
      const connector = last ? '└── ' : '├── ';
      const ext       = child.type === 'd' ? '/' : '';
      const cls       = child.type === 'd' ? 'ls-dir' : 'ls-file';
      lines.push(`${escHtml(prefix + connector)}<span class="${cls}">${escHtml(name)}${ext}</span>`);
      if (child.type === 'd') { dirs++; walk(child, prefix + (last ? '    ' : '│   '), depth + 1); }
      else files++;
    });
  }
  walk(node, '', 1);
  lines.push('');
  lines.push(`<span class="line-dim">${dirs} director${dirs === 1 ? 'y' : 'ies'}, ${files} file${files === 1 ? '' : 's'}</span>`);
  return { html: lines.join('\n') };
};

// ── File ops ─────────────────────────────────────────────────

COMMANDS.cat = ({ args, stdin }) => {
  const flags = args.filter(a => a.startsWith('-'));
  const files = args.filter(a => !a.startsWith('-'));
  const showNum = flags.some(f => f.includes('n'));
  const showNonBlank = flags.some(f => f.includes('b'));

  function fmt(text) {
    if (!showNum && !showNonBlank) return text;
    return text.split('\n').map((l, i) => {
      if (showNonBlank && l.trim() === '') return '';
      return `${String(i+1).padStart(6)}\t${l}`;
    }).join('\n');
  }

  if (!files.length && stdin !== undefined) return { out: fmt(stdin) };
  if (!files.length) return { err: 'cat: missing operand' };
  const results = [];
  for (const a of files) {
    if (a === '-') { results.push({ out: stdin !== undefined ? fmt(stdin) : '' }); continue; }
    const p = normalizePath(a);
    const node = getNode(p);
    if (!node) { results.push({ err: `cat: ${a}: No such file or directory` }); continue; }
    if (node.type === 'd') { results.push({ err: `cat: ${a}: Is a directory` }); continue; }
    results.push({ out: fmt(node.content || '') });
  }
  return results;
};

COMMANDS.touch = ({ args }) => {
  if (!args.length) return { err: 'touch: missing file operand' };
  for (const a of args) {
    const p = normalizePath(a);
    if (!getNode(p)) {
      const parent = getNode(getParent(p));
      if (!parent || parent.type !== 'd') return { err: `touch: cannot touch '${a}': No such file or directory` };
      setNode(p, { type: 'f', content: '', perms: '644', owner: currentUser });
    }
  }
  return { out: '' };
};

COMMANDS.mkdir = ({ args }) => {
  if (!args.length) return { err: 'mkdir: missing operand' };
  const pFlag   = args.some(a => a === '-p' || a === '--parents');
  const targets = args.filter(a => !a.startsWith('-'));
  for (const a of targets) {
    const p = normalizePath(a);
    if (getNode(p)) return { err: `mkdir: cannot create directory '${a}': File exists` };
    if (pFlag) {
      // create all parents
      const parts = p.split('/').filter(Boolean);
      let cur = '';
      for (const part of parts) {
        cur += '/' + part;
        if (!getNode(cur)) setNode(cur, { type: 'd', children: {}, perms: '755', owner: currentUser });
      }
    } else {
      const parent = getNode(getParent(p));
      if (!parent) return { err: `mkdir: cannot create directory '${a}': No such file or directory` };
      setNode(p, { type: 'd', children: {}, perms: '755', owner: currentUser });
    }
  }
  return { out: '' };
};

COMMANDS.rm = ({ args }) => {
  if (!args.length) return { err: 'rm: missing operand' };
  const flags   = args.filter(a => a.startsWith('-'));
  const targets = args.filter(a => !a.startsWith('-'));
  const rf      = flags.some(f => f.includes('r') || f.includes('f'));
  const force   = flags.some(f => f.includes('f'));
  for (const a of targets) {
    const p    = normalizePath(a);
    const node = getNode(p);
    if (!node) {
      if (force) continue;
      return { err: `rm: cannot remove '${a}': No such file or directory` };
    }
    if (node.type === 'd' && !rf) return { err: `rm: cannot remove '${a}': Is a directory` };
    if (p === '/' || p === '/home' || p === '/etc') return { err: `rm: refusing to remove root or critical path '${a}'` };
    deleteNode(p);
  }
  return { out: '' };
};

COMMANDS.rmdir = ({ args }) => {
  if (!args.length) return { err: 'rmdir: missing operand' };
  for (const a of args) {
    const p    = normalizePath(a);
    const node = getNode(p);
    if (!node) return { err: `rmdir: failed to remove '${a}': No such file or directory` };
    if (node.type !== 'd') return { err: `rmdir: failed to remove '${a}': Not a directory` };
    if (Object.keys(node.children).length) return { err: `rmdir: failed to remove '${a}': Directory not empty` };
    deleteNode(p);
  }
  return { out: '' };
};

COMMANDS.cp = ({ args }) => {
  const flags   = args.filter(a => a.startsWith('-'));
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length < 2) return { err: 'cp: missing destination file operand' };
  const recursive = flags.some(f => f.includes('r') || f.includes('R'));
  const src  = normalizePath(targets[0]);
  let   dst  = normalizePath(targets[1]);
  const srcNode = getNode(src);
  if (!srcNode) return { err: `cp: cannot stat '${targets[0]}': No such file or directory` };
  if (srcNode.type === 'd' && !recursive) return { err: `cp: -r not specified; omitting directory '${targets[0]}'` };
  const dstNode = getNode(dst);
  if (dstNode && dstNode.type === 'd') dst = dst + '/' + basename(src);
  setNode(dst, JSON.parse(JSON.stringify(srcNode)));
  return { out: '' };
};

COMMANDS.mv = ({ args }) => {
  const targets = args.filter(a => !a.startsWith('-'));
  if (targets.length < 2) return { err: 'mv: missing destination file operand' };
  const src = normalizePath(targets[0]);
  let   dst = normalizePath(targets[1]);
  const srcNode = getNode(src);
  if (!srcNode) return { err: `mv: cannot stat '${targets[0]}': No such file or directory` };
  const dstNode = getNode(dst);
  if (dstNode && dstNode.type === 'd') dst = dst + '/' + basename(src);
  if (!setNode(dst, JSON.parse(JSON.stringify(srcNode)))) return { err: `mv: cannot move '${targets[0]}': destination not available` };
  deleteNode(src);
  return { out: '' };
};

COMMANDS.ln = ({ args }) => {
  const symbolic = args.some(a => a === '-s' || a === '--symbolic');
  const targets  = args.filter(a => !a.startsWith('-'));
  if (targets.length < 2) return { err: 'ln: missing destination operand' };
  const src = normalizePath(targets[0]);
  const dst = normalizePath(targets[1]);
  if (!getNode(src) && symbolic === false) return { err: `ln: failed to access '${targets[0]}': No such file or directory` };
  if (symbolic) {
    setNode(dst, { type: 'l', target: targets[0], content: '', perms: '777', owner: currentUser });
  } else {
    const srcNode = getNode(src);
    if (!srcNode) return { err: `ln: failed to create hard link '${targets[1]}': No such file or directory` };
    setNode(dst, JSON.parse(JSON.stringify(srcNode)));
  }
  return { out: '' };
};

// ── Text processing ──────────────────────────────────────────

COMMANDS.echo = ({ args }) => {
  const noNewline = args[0] === '-n';
  const interpret = args[0] === '-e';
  let parts = (noNewline || interpret) ? args.slice(1) : args;
  let out = parts.join(' ');
  if (interpret) {
    out = out.replace(/\\n/g,'\n').replace(/\\t/g,'\t').replace(/\\r/g,'\r').replace(/\\\\/g,'\\');
  }
  return { out };
};

COMMANDS.printf = ({ args }) => {
  if (!args.length) return { err: 'printf: missing operand' };
  let fmt = args[0];
  const vals = args.slice(1);
  let i = 0;
  const out = fmt.replace(/%s/g, () => vals[i++] || '').replace(/%d/g, () => parseInt(vals[i++]) || 0)
    .replace(/%f/g, () => parseFloat(vals[i++]) || 0)
    .replace(/\\n/g, '\n').replace(/\\t/g, '\t').replace(/\\\\/g, '\\');
  return { out };
};

COMMANDS.grep = ({ args, stdin }) => {
  const flags      = args.filter(a => a.startsWith('-'));
  const others     = args.filter(a => !a.startsWith('-'));
  const ignoreCase = flags.some(f => f.includes('i'));
  const invertMatch= flags.some(f => f.includes('v'));
  const lineNum    = flags.some(f => f.includes('n'));
  const countOnly  = flags.some(f => f.includes('c'));
  const recursive  = flags.some(f => f.includes('r') || f.includes('R'));
  const quiet      = flags.some(f => f.includes('q'));
  const fileMatch  = flags.some(f => f.includes('l'));
  const wordMatch  = flags.some(f => f.includes('w'));
  const extRegex   = flags.some(f => f.includes('E'));

  if (!others.length) return { err: 'grep: missing pattern' };
  const pattern  = others[0];
  const fileArgs = others.slice(1);

  let regexFlags = ignoreCase ? 'ig' : 'g';
  let pat = pattern;
  if (wordMatch) pat = `\\b${pat}\\b`;

  let regex;
  try { regex = new RegExp(pat, regexFlags); }
  catch(e) { return { err: `grep: invalid regular expression: ${pattern}` }; }

  function grepLines(text, label) {
    const lines   = text.split('\n');
    const matched = [];
    lines.forEach((l, idx) => {
      regex.lastIndex = 0;
      const m = regex.test(l);
      if ((!invertMatch && m) || (invertMatch && !m)) {
        let out = '';
        if (label) out += `<span style="color:var(--blue)">${escHtml(label)}</span>:`;
        if (lineNum) out += `<span style="color:var(--yellow)">${idx + 1}</span>:`;
        // highlight match
        if (!invertMatch && !quiet) {
          regex.lastIndex = 0;
          out += escHtml(l).replace(regex, m => `<span style="color:var(--red);font-weight:bold">${m}</span>`);
        } else {
          out += escHtml(l);
        }
        matched.push(out);
      }
    });
    return matched;
  }

  if (stdin !== undefined) {
    const matched = grepLines(stdin, null);
    if (quiet) return { out: '' };
    if (countOnly) return { out: String(matched.length) };
    return { html: matched.join('\n') || '' };
  }

  if (recursive) {
    const searchRoot = fileArgs[0] ? normalizePath(fileArgs[0]) : normalizePath(cwd);
    const results = [];
    function walk(p, node) {
      if (node.type === 'f') {
        const m = grepLines(node.content || '', p);
        if (fileMatch && m.length) results.push({ html: `<span class="ls-file">${escHtml(p)}</span>` });
        else results.push(...m.map(h => ({ html: h })));
      } else if (node.type === 'd') {
        for (const [name, child] of Object.entries(node.children)) {
          walk(p + '/' + name, child);
        }
      }
    }
    const rootNode = getNode(searchRoot);
    if (!rootNode) return { err: `grep: ${fileArgs[0]}: No such file or directory` };
    walk(searchRoot, rootNode);
    if (quiet) return { out: '' };
    if (countOnly) return { out: String(results.length) };
    return results.length ? results : { out: '' };
  }

  if (!fileArgs.length) return { err: 'grep: missing file operand (or use with pipe)' };
  const results = [];
  const multiFile = fileArgs.length > 1;
  for (const f of fileArgs) {
    const p    = normalizePath(f);
    const node = getNode(p);
    if (!node) { results.push({ err: `grep: ${f}: No such file or directory` }); continue; }
    if (node.type === 'd') { results.push({ err: `grep: ${f}: Is a directory` }); continue; }
    const matched = grepLines(node.content || '', multiFile ? f : null);
    if (fileMatch && matched.length) results.push({ html: `<span class="ls-file">${escHtml(f)}</span>` });
    else if (countOnly) results.push({ out: String(matched.length) });
    else matched.forEach(h => results.push({ html: h }));
  }
  return results.length ? results : { out: '' };
};

COMMANDS.sed = ({ args, stdin }) => {
  const flags    = args.filter(a => a.startsWith('-'));
  const inPlace  = flags.some(f => f.includes('i'));
  const others   = args.filter(a => !a.startsWith('-'));
  if (!others.length) return { err: 'sed: missing script' };
  const script   = others[0];
  const fileArgs = others.slice(1);

  function applyScript(text) {
    // Support: s/pat/rep/flags  d  p  q  =
    const lines   = text.split('\n');
    const output  = [];
    const sMatch  = script.match(/^s([/|,@!])(.+?)\1(.*?)\1([gipn]*)$/);
    const dMatch  = script.match(/^(\/[^/]+\/)?\s*d$/);
    const pMatch  = script.match(/^(\/[^/]+\/)?\s*p$/);
    const eqMatch = script === '=';

    if (sMatch) {
      const [,, pat, rep, mflags] = sMatch;
      const global  = mflags.includes('g');
      const icase   = mflags.includes('i');
      try {
        const re = new RegExp(pat, (global ? 'g' : '') + (icase ? 'i' : ''));
        return lines.map(l => l.replace(re, rep.replace(/\\1/g,'$1').replace(/\\2/g,'$2'))).join('\n');
      } catch(e) { return null; }
    }
    if (dMatch) {
      const addr = dMatch[1] ? new RegExp(dMatch[1].slice(1,-1)) : null;
      return lines.filter(l => addr ? !addr.test(l) : false).join('\n');
    }
    if (pMatch) {
      const addr = pMatch[1] ? new RegExp(pMatch[1].slice(1,-1)) : null;
      return lines.flatMap(l => addr ? (addr.test(l) ? [l, l] : [l]) : [l, l]).join('\n');
    }
    if (eqMatch) {
      return lines.flatMap((l, i) => [String(i+1), l]).join('\n');
    }
    return text; // passthrough for unsupported
  }

  if (stdin !== undefined && !fileArgs.length) {
    const result = applyScript(stdin);
    return result !== null ? { out: result } : { err: `sed: invalid script '${script}'` };
  }
  if (!fileArgs.length) return { err: 'sed: missing file operand' };

  const results = [];
  for (const f of fileArgs) {
    const p    = normalizePath(f);
    const node = getNode(p);
    if (!node) { results.push({ err: `sed: ${f}: No such file or directory` }); continue; }
    if (node.type === 'd') { results.push({ err: `sed: ${f}: Is a directory` }); continue; }
    const result = applyScript(node.content || '');
    if (result === null) { results.push({ err: `sed: invalid script '${script}'` }); continue; }
    if (inPlace) { node.content = result; results.push({ out: '' }); }
    else results.push({ out: result });
  }
  return results;
};

COMMANDS.awk = ({ args, stdin }) => {
  // Minimal awk: -F delim, single {print $N} or {print} or BEGIN/END patterns
  const fIdx    = args.indexOf('-F');
  const delim   = fIdx !== -1 ? (args[fIdx+1] || ' ') : ' ';
  const prog    = args.find(a => !a.startsWith('-') && a !== args[fIdx+1]) || '{print}';
  const files   = args.filter((a,i) => !a.startsWith('-') && i !== fIdx+1 && a !== prog);

  let text = stdin !== undefined ? stdin : '';
  if (!text && files.length) {
    const node = getNode(normalizePath(files[0]));
    if (!node) return { err: `awk: ${files[0]}: No such file or directory` };
    text = node.content || '';
  }

  const lines  = text === '' ? [] : text.split('\n');
  const output = [];
  let NR = 0;

  function evalProg(p, line, fields) {
    // Handle BEGIN/END
    const beginM = p.match(/BEGIN\s*\{([^}]*)\}/);
    const endM   = p.match(/END\s*\{([^}]*)\}/);
    const mainM  = p.match(/(?:^|[}])\s*\{([^}]*)\}/);
    const condM  = p.match(/\/([^/]+)\/\s*\{([^}]*)\}/);

    function execBlock(block) {
      // print $N, $0, NR, NF, toupper/tolower
      const NF = fields.length;
      block.split(';').forEach(stmt => {
        stmt = stmt.trim();
        if (!stmt || stmt.startsWith('#')) return;
        const printM = stmt.match(/^print\s*(.*)/);
        if (printM) {
          let expr = printM[1].trim() || '$0';
          expr = expr.replace(/\$([0-9]+)/g, (_, n) => n === '0' ? line : (fields[parseInt(n)-1] || ''));
          expr = expr.replace(/\bNR\b/g, NR).replace(/\bNF\b/g, NF);
          expr = expr.replace(/\btoupper\(([^)]+)\)/g, (_, s) => s.toUpperCase());
          expr = expr.replace(/\btolower\(([^)]+)\)/g, (_, s) => s.toLowerCase());
          expr = expr.replace(/\blength\(([^)]+)\)/g, (_, s) => s.length);
          // Remove string literals quotes for output
          expr = expr.replace(/"([^"]*)"/g, '$1');
          // join with OFS (space by default) if comma-separated
          output.push(expr.split(',').map(s => s.trim()).join(' '));
        }
      });
    }

    if (line === null) { // BEGIN or END
      if (p.startsWith('BEGIN') && beginM) execBlock(beginM[1]);
      if (p.startsWith('END')   && endM)   execBlock(endM[1]);
      return;
    }

    if (condM) {
      const re = new RegExp(condM[1]);
      if (re.test(line)) execBlock(condM[2]);
    } else if (mainM) {
      execBlock(mainM[1]);
    }
  }

  // BEGIN
  evalProg('BEGIN' + prog, null, []);

  for (const line of lines) {
    NR++;
    const fields = line.split(delim === ' ' ? /\s+/ : new RegExp(delim)).filter((s,i,a) => delim !== ' ' || true);
    if (delim === ' ' && fields[0] === '') fields.shift();
    evalProg(prog, line, fields);
  }

  // END
  evalProg('END' + prog, null, []);

  return { out: output.join('\n') };
};

COMMANDS.tr = ({ args, stdin }) => {
  if (stdin === undefined) return { err: 'tr: missing operand' };
  const deleteMode  = args.some(a => a === '-d');
  const squeezeMode = args.some(a => a === '-s');
  const others = args.filter(a => !a.startsWith('-'));

  function expand(s) {
    return s.replace(/\\n/g,'\n').replace(/\\t/g,'\t')
      .replace(/([^\\])-(.)/g, (_, a, b) => {
        let out = '';
        for (let c = a.charCodeAt(0); c <= b.charCodeAt(0); c++) out += String.fromCharCode(c);
        return out;
      });
  }

  const set1 = expand(others[0] || '');
  const set2 = expand(others[1] || '');
  let text   = stdin;

  if (deleteMode) {
    text = text.split('').filter(c => !set1.includes(c)).join('');
  } else if (squeezeMode && !set2) {
    let prev = null;
    text = text.split('').filter(c => {
      if (set1.includes(c) && c === prev) return false;
      prev = c; return true;
    }).join('');
  } else {
    text = text.split('').map(c => {
      const idx = set1.indexOf(c);
      return idx !== -1 ? (set2[idx] || set2[set2.length-1] || c) : c;
    }).join('');
  }
  return { out: text };
};

COMMANDS.sort = ({ args, stdin }) => {
  const reverse   = args.some(a => a.includes('r') && a.startsWith('-'));
  const unique    = args.some(a => a.includes('u') && a.startsWith('-'));
  const numeric   = args.some(a => a.includes('n') && a.startsWith('-'));
  const humanSort = args.some(a => a.includes('h') && a.startsWith('-'));
  const files     = args.filter(a => !a.startsWith('-'));
  let text = stdin !== undefined ? stdin : null;
  if (!text && files.length) {
    const node = getNode(normalizePath(files[0]));
    if (!node) return { err: `sort: cannot read: ${files[0]}: No such file or directory` };
    text = node.content || '';
  }
  if (text === null) return { err: 'sort: missing operand' };
  let lines = text.split('\n').filter(l => l !== '');
  if (unique) lines = [...new Set(lines)];
  if (numeric) lines.sort((a,b) => parseFloat(a) - parseFloat(b));
  else lines.sort((a, b) => a.localeCompare(b));
  if (reverse) lines.reverse();
  return { out: lines.join('\n') };
};

COMMANDS.uniq = ({ args, stdin }) => {
  const countFlag  = args.some(a => a.includes('c') && a.startsWith('-'));
  const dupOnly    = args.some(a => a.includes('d') && a.startsWith('-'));
  const uniqueOnly = args.some(a => a.includes('u') && a.startsWith('-'));
  const files      = args.filter(a => !a.startsWith('-'));
  let text = stdin !== undefined ? stdin : null;
  if (!text && files.length) {
    const node = getNode(normalizePath(files[0]));
    if (!node) return { err: `uniq: ${files[0]}: No such file or directory` };
    text = node.content || '';
  }
  if (text === null) return { err: 'uniq: missing operand' };
  const lines  = text.split('\n');
  const result = [];
  let i = 0;
  while (i < lines.length) {
    let c = 1;
    while (i + c < lines.length && lines[i+c] === lines[i]) c++;
    const isDup = c > 1;
    if (dupOnly && !isDup)    { i += c; continue; }
    if (uniqueOnly && isDup)  { i += c; continue; }
    result.push(countFlag ? `${String(c).padStart(7)} ${lines[i]}` : lines[i]);
    i += c;
  }
  return { out: result.join('\n') };
};

COMMANDS.cut = ({ args, stdin }) => {
  const dIdx     = args.indexOf('-d');
  const fIdx     = args.indexOf('-f');
  const cIdx     = args.indexOf('-c');
  const delim    = dIdx !== -1 ? (args[dIdx+1] || '\t') : '\t';
  const fieldStr = fIdx !== -1 ? args[fIdx+1] : null;
  const charStr  = cIdx !== -1 ? args[cIdx+1] : null;
  const files    = args.filter((a,i) => !a.startsWith('-') && i !== dIdx+1 && i !== fIdx+1 && i !== cIdx+1);

  let text = stdin !== undefined ? stdin : null;
  if (!text && files.length) {
    const node = getNode(normalizePath(files[0]));
    if (!node) return { err: `cut: ${files[0]}: No such file or directory` };
    text = node.content || '';
  }
  if (text === null) return { err: 'cut: missing operand' };

  function parseRange(str) {
    const indices = [];
    str.split(',').forEach(r => {
      const m = r.match(/^(\d*)-(\d*)$/);
      if (m) {
        const start = m[1] ? parseInt(m[1]) : 1;
        const end   = m[2] ? parseInt(m[2]) : 999;
        for (let i = start; i <= end; i++) indices.push(i);
      } else {
        indices.push(parseInt(r));
      }
    });
    return [...new Set(indices)].sort((a,b) => a-b);
  }

  const result = text.split('\n').map(l => {
    if (charStr) {
      const indices = parseRange(charStr);
      return indices.map(i => l[i-1] || '').join('');
    }
    if (fieldStr) {
      const indices = parseRange(fieldStr);
      const parts   = l.split(delim === '\t' ? '\t' : new RegExp(delim));
      return indices.map(i => parts[i-1] !== undefined ? parts[i-1] : '').join(delim);
    }
    return l;
  });
  return { out: result.join('\n') };
};

COMMANDS.wc = ({ args, stdin }) => {
  const flags = args.filter(a => a.startsWith('-'));
  const files = args.filter(a => !a.startsWith('-'));
  const showL = !flags.length || flags.some(f => f.includes('l'));
  const showW = !flags.length || flags.some(f => f.includes('w'));
  const showC = !flags.length || flags.some(f => f.includes('c'));
  const showM = flags.some(f => f.includes('m'));

  function count(text) {
    return {
      lines: (text.match(/\n/g) || []).length,
      words: text.trim() ? text.trim().split(/\s+/).length : 0,
      chars: text.length,
    };
  }

  function fmtCount(c, label) {
    const parts = [];
    if (showL) parts.push(String(c.lines).padStart(7));
    if (showW) parts.push(String(c.words).padStart(7));
    if (showC || showM) parts.push(String(c.chars).padStart(7));
    if (label) parts.push(' ' + label);
    return parts.join('');
  }

  if (stdin !== undefined && !files.length) return { out: fmtCount(count(stdin)) };
  if (!files.length) return { err: 'wc: missing file operand' };

  const results = [];
  let totL = 0, totW = 0, totC = 0;
  for (const f of files) {
    const node = getNode(normalizePath(f));
    if (!node) { results.push({ err: `wc: ${f}: No such file or directory` }); continue; }
    if (node.type === 'd') { results.push({ err: `wc: ${f}: Is a directory` }); continue; }
    const c = count(node.content || '');
    totL += c.lines; totW += c.words; totC += c.chars;
    results.push({ out: fmtCount(c, f) });
  }
  if (files.length > 1) results.push({ out: fmtCount({ lines:totL, words:totW, chars:totC }, 'total') });
  return results;
};

COMMANDS.head = ({ args, stdin }) => {
  const nFlag = args.findIndex(a => a === '-n');
  let n = 10;
  const others = args.filter(a => !a.startsWith('-'));
  if (nFlag !== -1 && args[nFlag+1]) { n = parseInt(args[nFlag+1]); }
  else { const numFlag = args.find(a => /^-\d+$/.test(a)); if (numFlag) n = parseInt(numFlag.slice(1)); }
  if (stdin !== undefined && !others.length) return { out: stdin.split('\n').slice(0, n).join('\n') };
  if (!others.length) return { err: 'head: missing file operand' };
  const node = getNode(normalizePath(others[0]));
  if (!node) return { err: `head: cannot open '${others[0]}': No such file or directory` };
  if (node.type === 'd') return { err: `head: ${others[0]}: Is a directory` };
  return { out: (node.content || '').split('\n').slice(0, n).join('\n') };
};

COMMANDS.tail = ({ args, stdin }) => {
  const nFlag = args.findIndex(a => a === '-n');
  let n = 10;
  const fFlag   = args.some(a => a === '-f');
  const others  = args.filter(a => !a.startsWith('-'));
  if (nFlag !== -1 && args[nFlag+1]) { n = parseInt(args[nFlag+1]); }
  else { const numFlag = args.find(a => /^-\d+$/.test(a)); if (numFlag) n = parseInt(numFlag.slice(1)); }
  if (stdin !== undefined && !others.length) {
    const lines = stdin.split('\n');
    return { out: lines.slice(Math.max(0, lines.length - n)).join('\n') };
  }
  if (!others.length) return { err: 'tail: missing file operand' };
  const node = getNode(normalizePath(others[0]));
  if (!node) return { err: `tail: cannot open '${others[0]}': No such file or directory` };
  if (node.type === 'd') return { err: `tail: ${others[0]}: Is a directory` };
  const lines = (node.content || '').split('\n');
  const out   = lines.slice(Math.max(0, lines.length - n)).join('\n');
  if (fFlag) {
    return [{ out }, { out: `\n<span style="color:var(--dim)">[tail -f simulation: output shown, live-follow not supported in sandbox]</span>` }];
  }
  return { out };
};

COMMANDS.diff = ({ args }) => {
  const unified = args.some(a => a.startsWith('-u') || a === '--unified');
  const files   = args.filter(a => !a.startsWith('-'));
  if (files.length < 2) return { err: 'diff: missing operand' };
  const n1 = getNode(normalizePath(files[0]));
  const n2 = getNode(normalizePath(files[1]));
  if (!n1) return { err: `diff: ${files[0]}: No such file or directory` };
  if (!n2) return { err: `diff: ${files[1]}: No such file or directory` };
  const a = (n1.content || '').split('\n');
  const b = (n2.content || '').split('\n');

  if (a.join('\n') === b.join('\n')) return { out: '' };

  const lines = [];
  if (unified) {
    lines.push(`--- ${files[0]}`);
    lines.push(`+++ ${files[1]}`);
    lines.push(`@@ -1,${a.length} +1,${b.length} @@`);
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      if (i >= a.length) lines.push(`+${b[i]}`);
      else if (i >= b.length) lines.push(`-${a[i]}`);
      else if (a[i] !== b[i]) { lines.push(`-${a[i]}`); lines.push(`+${b[i]}`); }
      else lines.push(` ${a[i]}`);
    }
  } else {
    const max = Math.max(a.length, b.length);
    for (let i = 0; i < max; i++) {
      if (i >= a.length) lines.push(`${i+1}a${i+1}\n> ${b[i]}`);
      else if (i >= b.length) lines.push(`${i+1}d${i}\n< ${a[i]}`);
      else if (a[i] !== b[i]) lines.push(`${i+1}c${i+1}\n< ${a[i]}\n---\n> ${b[i]}`);
    }
  }
  lastExitCode = 1;
  return { out: lines.join('\n') };
};

COMMANDS.tee = ({ args, stdin }) => {
  if (stdin === undefined) return { err: 'tee: no input' };
  const append  = args.some(a => a === '-a');
  const files   = args.filter(a => !a.startsWith('-'));
  for (const f of files) {
    const p    = normalizePath(f);
    const node = getNode(p);
    if (node && append) {
      node.content = (node.content || '') + (node.content ? '\n' : '') + stdin;
    } else {
      const parent = getNode(getParent(p));
      if (parent) setNode(p, { type: 'f', content: stdin, perms: '644', owner: currentUser });
    }
  }
  return { out: stdin }; // passthrough
};

COMMANDS.xargs = ({ args, stdin }) => {
  if (stdin === undefined) return { err: 'xargs: no input' };
  const nFlag = args.indexOf('-n');
  const n     = nFlag !== -1 ? parseInt(args[nFlag+1]) : Infinity;
  const cmd   = args.filter(a => !a.startsWith('-') && isNaN(a))[0] || 'echo';
  const items = stdin.split(/\s+/).filter(Boolean);
  const results = [];
  let chunk = [];
  for (const item of items) {
    chunk.push(item);
    if (chunk.length >= n) {
      const seg = { cmd, args: chunk };
      const r   = executeSegment(seg, undefined);
      results.push(flattenResult(r).out);
      chunk = [];
    }
  }
  if (chunk.length) {
    const seg = { cmd, args: chunk };
    const r   = executeSegment(seg, undefined);
    results.push(flattenResult(r).out);
  }
  return { out: results.filter(Boolean).join('\n') };
};

// ── File info ────────────────────────────────────────────────

COMMANDS.find = ({ args }) => {
  const startArg = args[0] && !args[0].startsWith('-') ? args[0] : '.';
  const startPath = normalizePath(startArg);
  const startNode = getNode(startPath);
  if (!startNode) return { err: `find: '${startArg}': No such file or directory` };

  let namePattern = null, typeFilter = null, maxDepth = Infinity, minDepth = 0;
  let execCmd = null, deleteMode = false, newer = null, emptyMode = false;
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '-name'     && args[i+1]) { namePattern = args[++i]; }
    if (args[i] === '-iname'    && args[i+1]) { namePattern = args[++i]; }
    if (args[i] === '-type'     && args[i+1]) { typeFilter  = args[++i]; }
    if (args[i] === '-maxdepth' && args[i+1]) { maxDepth    = parseInt(args[++i]); }
    if (args[i] === '-mindepth' && args[i+1]) { minDepth    = parseInt(args[++i]); }
    if (args[i] === '-exec'     && args[i+1]) {
      execCmd = [];
      while (++i < args.length && args[i] !== ';' && args[i] !== '\\;') execCmd.push(args[i]);
    }
    if (args[i] === '-delete') deleteMode = true;
    if (args[i] === '-empty')  emptyMode  = true;
  }

  const results = [];
  function walk(path, node, depth) {
    if (depth > maxDepth) return;
    const name = basename(path);
    let match = true;
    if (namePattern) {
      const re = new RegExp('^' + namePattern.replace(/\./g,'\\.').replace(/\*/g,'.*').replace(/\?/g,'.') + '$', 'i');
      if (!re.test(name)) match = false;
    }
    if (typeFilter === 'f' && node.type !== 'f') match = false;
    if (typeFilter === 'd' && node.type !== 'd') match = false;
    if (typeFilter === 'l' && node.type !== 'l') match = false;
    if (emptyMode && node.type === 'f' && (node.content || '').length > 0) match = false;
    if (emptyMode && node.type === 'd' && Object.keys(node.children || {}).length > 0) match = false;
    if (depth >= minDepth && match) {
      if (deleteMode) deleteNode(path);
      else if (execCmd) {
        const cmd  = execCmd[0];
        const eArgs = execCmd.slice(1).map(a => a === '{}' ? path : a);
        const r    = flattenResult(executeSegment({ cmd, args: eArgs }, undefined));
        if (r.out) results.push(r.out);
      } else {
        results.push(path);
      }
    }
    if (node.type === 'd') {
      for (const [n, child] of Object.entries(node.children)) walk(path + '/' + n, child, depth + 1);
    }
  }
  walk(startPath, startNode, 0);
  return { out: results.join('\n') };
};

COMMANDS.stat = ({ args }) => {
  if (!args.length) return { err: 'stat: missing operand' };
  const results = [];
  for (const a of args) {
    const p    = normalizePath(a);
    const node = getNode(p);
    if (!node) { results.push({ err: `stat: cannot stat '${a}': No such file or directory` }); continue; }
    const isDir  = node.type === 'd';
    const perms  = node.perms || (isDir ? '755' : '644');
    const size   = isDir ? 4096 : (node.content || '').length;
    const now    = new Date().toISOString().replace('T',' ').slice(0,-5);
    const owner  = node.owner || 'analyst';
    results.push({ out:
      `  File: ${p}\n` +
      `  Size: ${size}\t\tBlocks: ${Math.ceil(size/512)}\t IO Block: 4096  ${isDir ? 'directory' : 'regular file'}\n` +
      `Device: fd01h/64769d\tInode: ${Math.abs(p.split('').reduce((h,c)=>((h<<5)-h+c.charCodeAt(0))|0,0))%100000}\tLinks: 1\n` +
      `Access: (0${perms}/${isDir ? 'd':'-'}${permBits(parseInt(perms,8)||0)})  Uid: ( 1000/ ${owner})   Gid: ( 1000/ ${owner})\n` +
      `Access: ${now}\nModify: ${now}\nChange: ${now}\n Birth: -`
    });
  }
  return results;
};

COMMANDS.file = ({ args }) => {
  if (!args.length) return { err: 'file: missing operand' };
  const results = [];
  for (const a of args) {
    const p    = normalizePath(a);
    const node = getNode(p);
    if (!node) { results.push({ out: `${a}: ERROR: No such file or directory` }); continue; }
    if (node.type === 'd') { results.push({ out: `${a}: directory` }); continue; }
    if (node.type === 'l') { results.push({ out: `${a}: symbolic link to ${node.target}` }); continue; }
    const content = node.content || '';
    let   kind    = 'ASCII text';
    if (content.startsWith('#!/bin/bash') || content.startsWith('#!/bin/sh')) kind = 'Bourne-Again shell script, ASCII text executable';
    else if (content.startsWith('#!/usr/bin/env python')) kind = 'Python script, ASCII text executable';
    else if (content.startsWith('<?xml')) kind = 'XML document text';
    else if (content.startsWith('{') || content.startsWith('[')) kind = 'JSON text';
    else if (/\x00/.test(content)) kind = 'data';
    results.push({ out: `${a}: ${kind}` });
  }
  return results;
};

COMMANDS.du = ({ args }) => {
  const humanSz  = args.some(a => a.includes('h') && a.startsWith('-'));
  const summarize = args.some(a => a.includes('s') && a.startsWith('-'));
  const maxDepth  = args.includes('--max-depth') ? parseInt(args[args.indexOf('--max-depth')+1]) : Infinity;
  const targets   = args.filter(a => !a.startsWith('-'));
  const target    = targets[0] ? normalizePath(targets[0]) : normalizePath(cwd);
  const node      = getNode(target);
  if (!node) return { err: `du: cannot access '${target}': No such file or directory` };

  function size(n) {
    if (n.type === 'f') return (n.content || '').length;
    return Object.values(n.children || {}).reduce((s,c) => s + size(c), 4096);
  }

  function fmt(bytes) {
    if (!humanSz) return String(Math.ceil(bytes/1024)).padStart(7);
    if (bytes < 1024) return `${bytes}B`.padStart(7);
    if (bytes < 1048576) return `${(bytes/1024).toFixed(1)}K`.padStart(7);
    if (bytes < 1073741824) return `${(bytes/1048576).toFixed(1)}M`.padStart(7);
    return `${(bytes/1073741824).toFixed(1)}G`.padStart(7);
  }

  const results = [];
  function walk(p, n, depth) {
    if (n.type === 'd') {
      if (!summarize || depth === 0) {
        if (depth <= maxDepth) results.push(`${fmt(size(n))}\t${p}`);
        for (const [name, child] of Object.entries(n.children)) walk(p + '/' + name, child, depth + 1);
      }
    } else {
      if (!summarize || depth === 0) results.push(`${fmt(size(n))}\t${p}`);
    }
  }
  walk(target, node, 0);
  return { out: results.join('\n') };
};

COMMANDS.df = ({ args }) => {
  const humanSz = args.some(a => a.includes('h') && a.startsWith('-'));
  const header  = 'Filesystem      Size  Used Avail Use% Mounted on';
  const rows    = MOUNTS.map(m => `${m.fs.padEnd(16)}${m.size.padStart(4)}  ${m.used.padStart(4)} ${m.avail.padStart(5)} ${m.use.padStart(4)} ${m.mount}`);
  return { out: [header, ...rows].join('\n') };
};

// ── Permissions ──────────────────────────────────────────────

COMMANDS.chmod = ({ args }) => {
  const flags   = args.filter(a => a.startsWith('-'));
  const recurse = flags.some(f => f.includes('R'));
  const nonflags= args.filter(a => !a.startsWith('-'));
  if (nonflags.length < 2) return { err: 'chmod: missing operand' };
  const modeArg = nonflags[0];
  const targets = nonflags.slice(1);

  function applyMode(node, modeArg) {
    if (/^\d{3,4}$/.test(modeArg)) {
      node.perms = modeArg;
    } else {
      // symbolic mode: u+x, a-w, o=r, +x, etc.
      let p = parseInt(node.perms || (node.type === 'd' ? '755' : '644'), 8);
      const parts = modeArg.split(',');
      for (const part of parts) {
        const m = part.match(/^([ugoaUGOA]*)([+\-=])([rwxRWX]*)$/);
        if (!m) continue;
        let who = m[1] || 'a';
        const op  = m[2];
        const perm = m[3];
        const bits = (perm.includes('r') ? 4 : 0) | (perm.includes('w') ? 2 : 0) | (perm.includes('x') ? 1 : 0);
        if (who.includes('a') || !who) who = 'ugo';
        const shift = { u: 6, g: 3, o: 0 };
        for (const c of who) {
          if (shift[c] === undefined) continue;
          const s = shift[c];
          if (op === '+') p |= (bits << s);
          else if (op === '-') p &= ~(bits << s);
          else if (op === '=') { p &= ~(7 << s); p |= (bits << s); }
        }
      }
      node.perms = p.toString(8).padStart(3, '0');
    }
  }

  for (const t of targets) {
    const p    = normalizePath(t);
    const node = getNode(p);
    if (!node) return { err: `chmod: cannot access '${t}': No such file or directory` };
    applyMode(node, modeArg);
    if (recurse && node.type === 'd') {
      function walkChmod(n) {
        for (const child of Object.values(n.children || {})) {
          applyMode(child, modeArg);
          if (child.type === 'd') walkChmod(child);
        }
      }
      walkChmod(node);
    }
  }
  return { out: '' };
};

COMMANDS.chown = ({ args }) => {
  if (currentUser !== 'root') return { err: `chown: changing ownership of '${args[1] || ''}': Operation not permitted` };
  const recurse = args.some(a => a === '-R');
  const others  = args.filter(a => !a.startsWith('-'));
  if (others.length < 2) return { err: 'chown: missing operand' };
  const owner = others[0];
  const targets = others.slice(1);
  for (const t of targets) {
    const node = getNode(normalizePath(t));
    if (!node) return { err: `chown: cannot access '${t}': No such file or directory` };
    node.owner = owner.split(':')[0];
  }
  return { out: '' };
};

COMMANDS.chgrp = ({ args }) => {
  if (currentUser !== 'root') return { err: `chgrp: changing group of '${args[1] || ''}': Operation not permitted` };
  return { out: '' };
};

COMMANDS.umask = ({ args }) => {
  if (!args.length) return { out: '0022' };
  return { out: '' };
};

// ── User/system ──────────────────────────────────────────────

COMMANDS.whoami = () => ({ out: currentUser });

COMMANDS.id = ({ args }) => {
  const u = args[0] || currentUser;
  if (u === 'root') return { out: `uid=0(root) gid=0(root) groups=0(root)` };
  return { out: `uid=1000(analyst) gid=1000(analyst) groups=1000(analyst),100(users),27(sudo)` };
};

COMMANDS.groups = ({ args }) => {
  const u = args[0] || currentUser;
  return { out: u === 'root' ? 'root' : 'analyst users sudo' };
};

COMMANDS.who = () => ({
  out: `analyst  pts/0        ${new Date().toLocaleDateString('en-US',{month:'short',day:'2-digit'})} ${new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',hour12:false})} (192.168.1.50)`
});

COMMANDS.w = () => ({
  out: ` ${new Date().toLocaleTimeString()} up 1:01,  1 user,  load average: 0.00, 0.00, 0.00\nUSER     TTY      FROM             LOGIN@   IDLE JCPU   PCPU WHAT\nanalyst  pts/0    192.168.1.50     09:15    0.00s  0.02s  0.00s bash-trainer`
});

COMMANDS.last = () => ({
  out: `analyst  pts/0        192.168.1.50     ${new Date().toDateString()} still logged in\nroot     tty1                          reboot\n\nwtmp begins ${new Date(Date.now() - 86400000).toDateString()}`
});

COMMANDS.sudo = ({ args }) => {
  if (!args.length) return { err: 'sudo: a command must be specified' };
  if (args[0] === 'su' || (args[0] === '-s' && args[1] === '/bin/bash') || args[0] === '-i') {
    currentUser = 'root';
    env.USER    = 'root';
    env.HOME    = '/root';
    env.PS1     = '\\u@\\h:\\w# ';
    cwd         = '/root';
    env.PWD     = cwd;
    updatePrompt();
    return { out: `[sudo] switching to root. Type 'exit' to return to analyst.` };
  }
  // Execute command as root
  const prev  = currentUser;
  currentUser = 'root';
  const seg   = { cmd: args[0], args: args.slice(1) };
  const res   = executeSegment(seg, undefined);
  currentUser = prev;
  return res;
};

COMMANDS.su = ({ args }) => {
  const user = (args.filter(a => !a.startsWith('-'))[0]) || 'root';
  if (user === 'root' && currentUser !== 'root') {
    return { err: `su: Authentication failure\n<span style="color:var(--dim)">(Hint: use 'sudo su' to become root in this sandbox)</span>` };
  }
  if (user === 'analyst' && currentUser === 'root') {
    currentUser = 'analyst';
    env.USER    = 'analyst';
    env.HOME    = '/home/analyst';
    cwd         = '/home/analyst';
    env.PWD     = cwd;
    updatePrompt();
    return { out: '' };
  }
  return { err: `su: user ${user} does not exist` };
};

COMMANDS.exit = ({ args }) => {
  const code = args[0] ? parseInt(args[0]) : 0;
  if (currentUser === 'root') {
    currentUser = 'analyst';
    env.USER    = 'analyst';
    env.HOME    = '/home/analyst';
    cwd         = '/home/analyst';
    env.PWD     = cwd;
    updatePrompt();
    return { out: 'logout' };
  }
  lastExitCode = code;
  return { out: `<span style="color:var(--dim)">[Session cannot exit in sandbox — shell reset to analyst]</span>` };
};

COMMANDS.passwd = ({ args }) => {
  const user = args[0] || currentUser;
  if (user !== currentUser && currentUser !== 'root') return { err: 'passwd: You may not view or modify password information for another user.' };
  return { out: `Changing password for ${user}.\n<span style="color:var(--dim)">[Password change simulated — no actual auth in sandbox]</span>` };
};

COMMANDS.useradd = ({ args }) => {
  if (currentUser !== 'root') return { err: 'useradd: Permission denied.' };
  const user = args.filter(a => !a.startsWith('-')).pop();
  if (!user) return { err: 'useradd: missing operand' };
  const passwdNode = getNode('/etc/passwd');
  if (passwdNode) passwdNode.content += `\n${user}:x:1002:1002:${user}:/home/${user}:/bin/bash`;
  setNode(`/home/${user}`, { type: 'd', children: {}, perms: '755', owner: user });
  return { out: '' };
};

COMMANDS.userdel = ({ args }) => {
  if (currentUser !== 'root') return { err: 'userdel: Permission denied.' };
  const user = args.filter(a => !a.startsWith('-')).pop();
  if (!user) return { err: 'userdel: missing operand' };
  const removeHome = args.some(a => a === '-r');
  if (removeHome) deleteNode(`/home/${user}`);
  return { out: '' };
};

COMMANDS.usermod = ({ args }) => {
  if (currentUser !== 'root') return { err: 'usermod: Permission denied.' };
  return { out: '' };
};

// ── Environment ──────────────────────────────────────────────

COMMANDS.env = ({ args }) => {
  if (args[0] && !args[0].startsWith('-')) {
    // env CMD ARGS
    return executeSegment({ cmd: args[0], args: args.slice(1) }, undefined);
  }
  return { out: Object.entries(env).map(([k,v]) => `${k}=${v}`).join('\n') };
};

COMMANDS.export = ({ args }) => {
  for (const a of args) {
    const eq = a.indexOf('=');
    if (eq === -1) { /* mark existing for export */ continue; }
    const key = a.slice(0, eq);
    const val = expandEnv(a.slice(eq + 1));
    env[key]  = val;
  }
  return { out: '' };
};

COMMANDS.unset = ({ args }) => {
  for (const a of args) delete env[a];
  return { out: '' };
};

COMMANDS.set = ({ args }) => {
  if (!args.length) return { out: Object.entries(env).map(([k,v]) => `${k}=${v}`).join('\n') };
  return { out: '' };
};

COMMANDS.alias = ({ args }) => {
  if (!args.length) {
    return { out: Object.entries(aliases).map(([k,v]) => `alias ${k}='${v}'`).join('\n') };
  }
  for (const a of args) {
    const eq = a.indexOf('=');
    if (eq === -1) {
      if (aliases[a]) return { out: `alias ${a}='${aliases[a]}'` };
      return { err: `bash: alias: ${a}: not found` };
    }
    aliases[a.slice(0, eq)] = a.slice(eq + 1).replace(/^['"]|['"]$/g, '');
  }
  return { out: '' };
};

COMMANDS.unalias = ({ args }) => {
  if (!args.length) return { err: 'unalias: usage: unalias [-a] name [name ...]' };
  if (args[0] === '-a') { aliases = {}; return { out: '' }; }
  for (const a of args) delete aliases[a];
  return { out: '' };
};

COMMANDS.which = ({ args }) => {
  if (!args.length) return { err: 'which: missing argument' };
  const results = [];
  for (const a of args) {
    if (COMMANDS[a] || aliases[a]) results.push({ out: `/usr/bin/${a}` });
    else results.push({ err: `${a}: not found` });
  }
  return results;
};

COMMANDS.type = ({ args }) => {
  if (!args.length) return { err: 'type: missing argument' };
  const results = [];
  for (const a of args) {
    if (aliases[a])   results.push({ out: `${a} is aliased to '${aliases[a]}'` });
    else if (COMMANDS[a]) results.push({ out: `${a} is ${env.PATH.split(':')[0]}/${a}` });
    else results.push({ out: `${a} not found` });
  }
  return results;
};

// ── Scripting / control ──────────────────────────────────────

COMMANDS.source = ({ args }) => {
  if (!args.length) return { err: 'source: missing filename' };
  const p    = normalizePath(args[0]);
  const node = getNode(p);
  if (!node) return { err: `bash: ${args[0]}: No such file or directory` };
  if (node.type !== 'f') return { err: `bash: ${args[0]}: Is a directory` };
  // Execute line by line
  const lines = (node.content || '').split('\n').filter(l => l.trim() && !l.trim().startsWith('#'));
  for (const line of lines) runPipeline(line);
  return { out: '' };
};
COMMANDS['.'] = COMMANDS.source;

COMMANDS.bash = ({ args }) => {
  if (!args.length) return { out: '<span style="color:var(--dim)">[Interactive bash not supported. Use bash script.sh to run a script]</span>' };
  return COMMANDS.source({ args });
};

COMMANDS.sh = COMMANDS.bash;

COMMANDS.sleep = ({ args }) => {
  if (!args.length) return { err: 'sleep: missing operand' };
  const n = parseFloat(args[0]);
  if (isNaN(n)) return { err: `sleep: invalid time interval '${args[0]}'` };
  return { out: `<span style="color:var(--dim)">[Simulated: sleep ${n}s complete]</span>` };
};

COMMANDS.true  = () => { lastExitCode = 0; return { out: '' }; };
COMMANDS.false = () => { lastExitCode = 1; return { out: '' }; };
COMMANDS['[']  = ({ args }) => {
  // Minimal [ ] test
  const idx = args.indexOf(']');
  const testArgs = idx !== -1 ? args.slice(0, idx) : args;
  lastExitCode = evalTest(testArgs) ? 0 : 1;
  return { out: '' };
};

COMMANDS.test = ({ args }) => {
  lastExitCode = evalTest(args) ? 0 : 1;
  return { out: '' };
};

function evalTest(args) {
  if (!args.length) return false;
  const a = args;
  // Unary
  if (a[0] === '!' && a.length > 1) return !evalTest(a.slice(1));
  if (a[0] === '-z') return !a[1] || a[1].length === 0;
  if (a[0] === '-n') return !!a[1] && a[1].length > 0;
  if (a[0] === '-f') return !!(a[1] && getNode(normalizePath(a[1]))?.type === 'f');
  if (a[0] === '-d') return !!(a[1] && getNode(normalizePath(a[1]))?.type === 'd');
  if (a[0] === '-e') return !!(a[1] && getNode(normalizePath(a[1])));
  if (a[0] === '-r') return !!(a[1] && getNode(normalizePath(a[1])));
  if (a[0] === '-w') return !!(a[1] && getNode(normalizePath(a[1])));
  if (a[0] === '-x') { const n = a[1] && getNode(normalizePath(a[1])); return !!(n && (n.perms || '').includes('7')); }
  if (a[0] === '-s') { const n = a[1] && getNode(normalizePath(a[1])); return !!(n && n.type === 'f' && (n.content || '').length > 0); }
  // Binary
  if (a.length >= 3) {
    const l = a[0], op = a[1], r = a[2];
    if (op === '='  || op === '==') return l === r;
    if (op === '!=' ) return l !== r;
    if (op === '-eq') return parseInt(l) === parseInt(r);
    if (op === '-ne') return parseInt(l) !== parseInt(r);
    if (op === '-lt') return parseInt(l) <  parseInt(r);
    if (op === '-le') return parseInt(l) <= parseInt(r);
    if (op === '-gt') return parseInt(l) >  parseInt(r);
    if (op === '-ge') return parseInt(l) >= parseInt(r);
    if (op === '-nt') return true; // newer than (simulated)
    if (op === '-ot') return false;
  }
  return !!a[0];
}

// ── Process/system ───────────────────────────────────────────

COMMANDS.ps = ({ args }) => {
  const aux = args.some(a => a.includes('a') || a.includes('x') || a.includes('u'));
  const header = aux
    ? 'USER       PID %CPU %MEM   VSZ  RSS TTY      STAT START   TIME COMMAND'
    : '  PID TTY          TIME CMD';

  const rows = aux
    ? PROCESSES.map(p => `${(p.user).padEnd(8)} ${String(p.pid).padStart(6)} ${p.cpu.toFixed(1).padStart(4)} ${p.mem.toFixed(1).padStart(4)} ${' 12345'.padStart(6)} ${' 2048'.padStart(5)} pts/0    ${p.stat.padEnd(5)} ${p.start.padStart(5)} ${p.time.padStart(7)} ${p.cmd}`)
    : PROCESSES.filter(p => p.user === currentUser).map(p => `${String(p.pid).padStart(5)} pts/0    00:00:00 ${p.cmd.split('/').pop().split(' ')[0]}`);

  return { out: [header, ...rows].join('\n') };
};

COMMANDS.kill = ({ args }) => {
  const sigFlag = args.find(a => a.startsWith('-'));
  const sig     = sigFlag ? sigFlag.slice(1).toUpperCase() : 'TERM';
  const pids    = args.filter(a => !a.startsWith('-'));
  if (!pids.length) return { err: 'kill: usage: kill [-s sigspec] pid | jobspec ...' };
  const results = [];
  for (const pidStr of pids) {
    const pid = parseInt(pidStr);
    const proc = PROCESSES.find(p => p.pid === pid);
    if (!proc) { results.push({ err: `kill: (${pid}) - No such process` }); }
    else if (proc.user !== currentUser && currentUser !== 'root') {
      results.push({ err: `kill: (${pid}) - Operation not permitted` });
    } else {
      results.push({ out: `<span style="color:var(--dim)">[Simulated: sent SIG${sig} to process ${pid} (${proc.cmd})]</span>` });
    }
  }
  return results;
};

COMMANDS.killall = ({ args }) => {
  const name = args.filter(a => !a.startsWith('-'))[0];
  if (!name) return { err: 'killall: missing argument' };
  const match = PROCESSES.filter(p => p.cmd.includes(name));
  if (!match.length) return { err: `killall: no process found` };
  return { out: `<span style="color:var(--dim)">[Simulated: sent SIGTERM to ${match.length} process(es) matching '${name}']</span>` };
};

COMMANDS.jobs = () => ({ out: '<span style="color:var(--dim)">[No background jobs running in sandbox]</span>' });
COMMANDS.bg   = () => ({ out: '<span style="color:var(--dim)">[bg: no stopped jobs in sandbox]</span>' });
COMMANDS.fg   = () => ({ out: '<span style="color:var(--dim)">[fg: no jobs in sandbox]</span>' });

// ── Network ──────────────────────────────────────────────────

COMMANDS.ifconfig = ({ args }) => {
  const iface = args[0];
  const show  = iface ? INTERFACES.filter(i => i.name === iface) : INTERFACES;
  if (!show.length) return { err: `ifconfig: interface ${iface} does not exist` };
  const lines = show.flatMap(i => [
    `<span style="color:var(--green)">${i.name}</span>: flags=4163&lt;UP,BROADCAST,RUNNING,MULTICAST&gt;  mtu 1500`,
    `        inet ${i.addr}  netmask ${i.mask}  broadcast ${i.addr.split('.').slice(0,3).join('.')}.255`,
    `        ether ${i.mac}  txqueuelen 1000  (Ethernet)`,
    `        RX packets 15234  bytes ${i.rx}`,
    `        TX packets 8921   bytes ${i.tx}`,
    '',
  ]);
  return { html: lines.join('\n') };
};

COMMANDS.ip = ({ args }) => {
  const sub = args[0];
  if (sub === 'addr' || sub === 'a') {
    const lines = INTERFACES.flatMap((i, idx) => [
      `<span style="color:var(--green)">${idx+1}: ${i.name}</span>: &lt;BROADCAST,MULTICAST,UP,LOWER_UP&gt; mtu 1500 qdisc mq state UP`,
      `    link/ether ${i.mac} brd ff:ff:ff:ff:ff:ff`,
      `    inet ${i.addr}/${i.mask === '255.0.0.0' ? '8' : '24'} brd ${i.addr.split('.').slice(0,3).join('.')}.255 scope global ${i.name}`,
      '',
    ]);
    return { html: lines.join('\n') };
  }
  if (sub === 'route' || sub === 'r') {
    return { out: `default via 192.168.1.1 dev eth0\n192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.100` };
  }
  if (sub === 'link' || sub === 'l') {
    const lines = INTERFACES.flatMap((i, idx) => [
      `${idx+1}: ${i.name}: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc mq state UP mode DEFAULT`,
      `    link/ether ${i.mac} brd ff:ff:ff:ff:ff:ff`,
    ]);
    return { out: lines.join('\n') };
  }
  return { out: `Usage: ip [ OBJECT ] { COMMAND | help }\nOBJECTS: addr|a, route|r, link|l` };
};

COMMANDS.netstat = ({ args }) => {
  const header = `Active Internet connections (only servers)\nProto Recv-Q Send-Q Local Address           Foreign Address         State`;
  const rows   = [
    `tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN`,
    `tcp6       0      0 :::22                   :::*                    LISTEN`,
    `tcp        0      0 192.168.1.100:22        192.168.1.50:54321      ESTABLISHED`,
  ];
  return { out: [header, ...rows].join('\n') };
};

COMMANDS.ss = COMMANDS.netstat;

COMMANDS.ping = ({ args }) => {
  const host  = args.filter(a => !a.startsWith('-')).pop() || 'localhost';
  const count = args.includes('-c') ? parseInt(args[args.indexOf('-c')+1]) : 4;
  const ip    = host === 'localhost' ? '127.0.0.1' : host.match(/\d+\.\d+\.\d+\.\d+/) ? host : `93.184.216.34`;
  const lines = [
    `PING ${host} (${ip}) 56(84) bytes of data.`,
    ...Array.from({length: Math.min(count, 4)}, (_,i) =>
      `64 bytes from ${ip}: icmp_seq=${i+1} ttl=64 time=${(Math.random()*2+0.5).toFixed(3)} ms`),
    '',
    `--- ${host} ping statistics ---`,
    `${Math.min(count,4)} packets transmitted, ${Math.min(count,4)} received, 0% packet loss, time ${Math.min(count,4)*1000-3}ms`,
    `rtt min/avg/max/mdev = 0.512/0.847/1.234/0.289 ms`,
  ];
  return { out: lines.join('\n') };
};

COMMANDS.curl = ({ args }) => {
  const flags  = args.filter(a => a.startsWith('-'));
  const silent = flags.some(f => f.includes('s'));
  const header = flags.some(f => f === '-I' || f === '--head');
  const url    = args.filter(a => !a.startsWith('-')).pop();
  if (!url) return { err: 'curl: no URL specified' };
  if (header) {
    return { out: `HTTP/1.1 200 OK\nContent-Type: text/html\nServer: nginx/1.24.0\nDate: ${new Date().toUTCString()}\nContent-Length: 1234` };
  }
  return { out: `<span style="color:var(--dim)">[curl: Network requests are simulated in the sandbox]\n[URL: ${url}]\n[Response: 200 OK — simulated response body]</span>` };
};

COMMANDS.wget = ({ args }) => {
  const url = args.filter(a => !a.startsWith('-')).pop();
  if (!url) return { err: 'wget: missing URL' };
  const fname = url.split('/').pop().split('?')[0] || 'index.html';
  setNode(normalizePath(fname), { type: 'f', content: `<!-- Downloaded from ${url} -->\n[simulated content]`, perms: '644', owner: currentUser });
  return { out: `--${new Date().toISOString().split('T')[0]}-- ${url}\nResolving host... done.\nHTTP request sent, awaiting response... 200 OK\nLength: 1024 [text/html]\nSaving to: '${fname}'\n\n${fname}         100%[===================>]   1.00K  --.-KB/s    in 0.1s\n\nDownloaded: 1 file (1.0K)` };
};

COMMANDS.ssh = ({ args }) => {
  const host = args.filter(a => !a.startsWith('-')).pop();
  return { out: `<span style="color:var(--dim)">[ssh: Remote connections are simulated in the sandbox]\n[Would connect to: ${host}]\n[Type 'exit' to simulate disconnect]</span>` };
};

COMMANDS.scp = ({ args }) => ({ out: `<span style="color:var(--dim)">[scp: Simulated. No actual file transfer in sandbox.]</span>` });

// ── Archives ─────────────────────────────────────────────────

COMMANDS.tar = ({ args }) => {
  const flags   = args.filter(a => a.startsWith('-')).join('') + args.filter(a => !a.startsWith('-') && args.indexOf(a) === 0).join('');
  const allArgs = args.join(' ');
  const create  = /[czjCtT]/.test(allArgs.split('-').join('')) && (allArgs.includes('c'));
  const extract = allArgs.includes('x');
  const list    = allArgs.includes('t');
  const verbose = allArgs.includes('v');
  const gzip    = allArgs.includes('z');
  const bzip    = allArgs.includes('j');
  const xz      = allArgs.includes('J');

  const nonFlagArgs = args.filter(a => !a.startsWith('-') || /^-[0-9]$/.test(a));
  const fIdx = args.findIndex(a => a === '-f' || (a.startsWith('-') && a.includes('f') && !a.startsWith('--')));
  let archive, fileArgs;

  if (fIdx !== -1 && args[fIdx+1] && !args[fIdx+1].startsWith('-')) {
    archive  = normalizePath(args[fIdx+1]);
    fileArgs = args.slice(fIdx+2).filter(a => !a.startsWith('-'));
  } else {
    // flags like -czf archive.tar.gz
    const nonFlag = args.filter(a => !a.startsWith('-'));
    archive  = nonFlag[0] ? normalizePath(nonFlag[0]) : null;
    fileArgs = nonFlag.slice(1);
  }

  if (!archive && !list) return { err: 'tar: Refusing to create an archive without a file' };

  if (create) {
    const contents = {};
    for (const f of fileArgs) {
      const p = normalizePath(f);
      const n = getNode(p);
      if (!n) return { err: `tar: ${f}: Cannot stat: No such file or directory` };
      contents[f] = JSON.parse(JSON.stringify(n));
    }
    setNode(archive, { type: 'f', content: JSON.stringify(contents), perms: '644', owner: currentUser });
    if (verbose) {
      const lines = Object.keys(contents).map(k => k);
      return { out: lines.join('\n') };
    }
    return { out: '' };
  }

  if (list) {
    const node = getNode(archive);
    if (!node) return { err: `tar: ${archive}: Cannot open: No such file or directory` };
    try {
      const contents = JSON.parse(node.content || '{}');
      return { out: Object.keys(contents).join('\n') };
    } catch { return { err: 'tar: This does not look like a tar archive' }; }
  }

  if (extract) {
    const node = getNode(archive);
    if (!node) return { err: `tar: ${archive}: Cannot open: No such file or directory` };
    try {
      const contents = JSON.parse(node.content || '{}');
      const dest = args.includes('-C') ? normalizePath(args[args.indexOf('-C')+1]) : cwd;
      for (const [name, fileNode] of Object.entries(contents)) {
        setNode(dest + '/' + name, fileNode);
        if (verbose) print(escHtml(name), 'line-out');
      }
      return { out: '' };
    } catch { return { err: 'tar: This does not look like a tar archive' }; }
  }

  return { err: 'tar: You must specify one of the \'-Acdtrux\', \'--delete\' or \'--test-label\' options' };
};

COMMANDS.gzip = ({ args }) => {
  const files = args.filter(a => !a.startsWith('-'));
  const keep  = args.some(a => a === '-k');
  const decomp= args.some(a => a === '-d');
  const results = [];
  for (const f of files) {
    const p = normalizePath(f);
    const node = getNode(p);
    if (!node) { results.push({ err: `gzip: ${f}: No such file or directory` }); continue; }
    if (decomp) {
      const dst = p.endsWith('.gz') ? p.slice(0,-3) : p + '.out';
      setNode(dst, { type: 'f', content: node.content || '', perms: '644', owner: currentUser });
      if (!keep) deleteNode(p);
    } else {
      setNode(p + '.gz', { type: 'f', content: node.content || '', perms: '644', owner: currentUser });
      if (!keep) deleteNode(p);
    }
    results.push({ out: '' });
  }
  return results;
};

COMMANDS.gunzip = ({ args }) => COMMANDS.gzip({ args: ['-d', ...args] });

COMMANDS.zip = ({ args }) => {
  const files = args.filter(a => !a.startsWith('-'));
  if (files.length < 2) return { err: 'zip: missing file arguments' };
  const archive = normalizePath(files[0]) + (files[0].endsWith('.zip') ? '' : '.zip');
  const contents = {};
  for (const f of files.slice(1)) {
    const node = getNode(normalizePath(f));
    if (node) contents[f] = JSON.parse(JSON.stringify(node));
  }
  setNode(archive, { type: 'f', content: JSON.stringify(contents), perms: '644', owner: currentUser });
  return { out: `adding: ${files.slice(1).join(', ')}\n  inflating: ${basename(archive)}` };
};

COMMANDS.unzip = ({ args }) => {
  const files   = args.filter(a => !a.startsWith('-'));
  const archive = files[0];
  if (!archive) return { err: 'unzip: missing zipfile' };
  const node    = getNode(normalizePath(archive));
  if (!node) return { err: `unzip: cannot find or open ${archive}` };
  try {
    const contents = JSON.parse(node.content || '{}');
    for (const [name, fileNode] of Object.entries(contents)) setNode(cwd + '/' + name, fileNode);
    return { out: `Archive:  ${archive}\n  inflating: ${Object.keys(contents).join('\n  inflating: ')}` };
  } catch { return { err: `unzip: ${archive}: not a zip archive` }; }
};

// ── System control ───────────────────────────────────────────

COMMANDS.systemctl = ({ args }) => {
  const action = args[0];
  const unit   = (args[1] || '').replace('.service','');

  if (!action || action === 'list-units') {
    const lines = [
      'UNIT                     LOAD   ACTIVE SUB     DESCRIPTION',
      '─'.repeat(80),
      ...Object.entries(SYSTEMD_UNITS).map(([name, u]) =>
        `${(name + '.service').padEnd(25)} loaded ${u.status.padEnd(6)} ${u.sub.padEnd(8)} ${u.desc}`),
      '',
      `LOAD   = Reflects whether the unit definition was properly loaded.`,
      `ACTIVE = The high-level unit activation state.`,
    ];
    return { out: lines.join('\n') };
  }

  if (action === 'status') {
    const u = SYSTEMD_UNITS[unit];
    if (!u) return { err: `Unit ${unit}.service could not be found.` };
    const color  = u.status === 'active' ? 'var(--green)' : 'var(--dim)';
    const bullet = u.status === 'active' ? '●' : '○';
    return { html:
      `<span style="color:${color}">${bullet} ${unit}.service - ${u.desc}</span>\n` +
      `   Loaded: loaded (/lib/systemd/system/${unit}.service; enabled)\n` +
      `   Active: <span style="color:${color}">${u.status} (${u.sub})</span>\n` +
      (u.pid ? `Main PID: ${u.pid} (${unit})\n` : '') +
      `   Tasks: 1 (limit: 4915)\n` +
      `   Memory: 1.2M\n` +
      `   CGroup: /system.slice/${unit}.service`
    };
  }

  if (['start','stop','restart','reload','enable','disable'].includes(action)) {
    const u = SYSTEMD_UNITS[unit];
    if (!u) return { err: `Failed to ${action} ${unit}.service: Unit not found.` };
    if (currentUser !== 'root') return { err: `Failed to ${action} ${unit}.service: Interactive authentication required.` };
    if (action === 'start')   { u.status = 'active'; u.sub = 'running'; }
    if (action === 'stop')    { u.status = 'inactive'; u.sub = 'dead'; }
    if (action === 'restart') { u.status = 'active'; u.sub = 'running'; }
    return { out: '' };
  }

  return { err: `systemctl: unknown action '${action}'` };
};

COMMANDS.journalctl = ({ args }) => {
  const unit    = args.includes('-u') ? args[args.indexOf('-u')+1] : null;
  const follow  = args.some(a => a === '-f');
  const lines_n = args.includes('-n') ? parseInt(args[args.indexOf('-n')+1]) : 20;
  const syslog  = getNode('/var/log/syslog');
  let   content = syslog ? (syslog.content || '') : '';
  if (unit) {
    const node = getNode('/var/log/auth.log');
    content = node ? (node.content || '') : content;
  }
  const lines   = content.split('\n');
  const out     = lines.slice(-lines_n).join('\n');
  if (follow) return { out: out + `\n<span style="color:var(--dim)">[journalctl -f: live follow not supported in sandbox]</span>` };
  return { out: out || '-- No entries --' };
};

COMMANDS.service = ({ args }) => {
  const name   = args[0];
  const action = args[1];
  if (!name || !action) return { err: 'Usage: service NAME ACTION' };
  return COMMANDS.systemctl({ args: [action, name] });
};

COMMANDS.crontab = ({ args }) => {
  const list   = args.some(a => a === '-l');
  const edit   = args.some(a => a === '-e');
  const remove = args.some(a => a === '-r');
  const userCron = `/var/spool/cron/crontabs/${currentUser}`;
  if (list) {
    const node = getNode(normalizePath(userCron));
    return { out: node ? (node.content || '# no crontab for analyst') : '# no crontab for analyst' };
  }
  if (edit) {
    return { out: `<span style="color:var(--dim)">[crontab -e: editor not available in sandbox. Use:\n  echo "*/5 * * * * /home/analyst/scripts/backup.sh" | crontab -]</span>` };
  }
  // pipe mode: echo "..." | crontab -
  return { out: '' };
};

// ── Text editors (minimal) ────────────────────────────────────

COMMANDS.nano = ({ args }) => {
  const file = args.filter(a => !a.startsWith('-'))[0];
  return { out: `<span style="color:var(--dim)">[nano: Full editor not available in sandbox.]\n[To write files, use redirect: echo "content" > ${file || 'filename'}]\n[Or append: echo "more" >> ${file || 'filename'}]</span>` };
};

COMMANDS.vim  = COMMANDS.nano;
COMMANDS.vi   = COMMANDS.nano;
COMMANDS.emacs= COMMANDS.nano;
COMMANDS.gedit= COMMANDS.nano;

// ── Pagers ────────────────────────────────────────────────────

COMMANDS.less = ({ args, stdin }) => {
  const file = args.filter(a => !a.startsWith('-'))[0];
  let content = stdin;
  if (!content && file) {
    const node = getNode(normalizePath(file));
    if (!node) return { err: `${file}: No such file or directory` };
    content = node.content || '';
  }
  if (!content) return { err: 'less: missing input' };
  // Show first 30 lines with a note
  const lines = content.split('\n');
  const shown = lines.slice(0, 30);
  const more  = lines.length > 30 ? `\n<span style="color:var(--dim)">[${lines.length - 30} more lines — use head/tail/cat for full output]</span>` : '';
  return { html: shown.map(l => escHtml(l)).join('\n') + more };
};

COMMANDS.more = COMMANDS.less;

// ── Path helpers ──────────────────────────────────────────────

COMMANDS.basename = ({ args }) => {
  if (!args.length) return { err: 'basename: missing operand' };
  const p   = args[0];
  const suf = args[1];
  let   b   = p.split('/').filter(Boolean).pop() || p;
  if (suf && b.endsWith(suf)) b = b.slice(0, -suf.length);
  return { out: b };
};

COMMANDS.dirname = ({ args }) => {
  if (!args.length) return { err: 'dirname: missing operand' };
  const p     = args[0];
  const parts = p.split('/').filter(Boolean);
  if (parts.length <= 1) return { out: p.startsWith('/') ? '/' : '.' };
  return { out: (p.startsWith('/') ? '/' : '') + parts.slice(0,-1).join('/') };
};

COMMANDS.realpath = ({ args }) => {
  if (!args.length) return { err: 'realpath: missing operand' };
  return { out: normalizePath(args[0]) };
};

// ── Misc ──────────────────────────────────────────────────────

COMMANDS.echo = ({ args }) => {
  const noNewline = args[0] === '-n';
  const interpret = args[0] === '-e';
  let parts = (noNewline || interpret) ? args.slice(1) : args;
  let out   = parts.join(' ');
  if (interpret) {
    out = out.replace(/\\n/g,'\n').replace(/\\t/g,'\t').replace(/\\r/g,'\r')
             .replace(/\\a/g,'\x07').replace(/\\\\/g,'\\').replace(/\\e/g,'\x1b');
  }
  return { out };
};

COMMANDS.history = ({ args }) => {
  const n = args[0] ? parseInt(args[0]) : cmdHistory.length;
  if (!cmdHistory.length) return { out: '' };
  const slice = cmdHistory.slice(-n);
  const start = cmdHistory.length - slice.length + 1;
  return { out: slice.map((c, i) => `  ${String(start + i).padStart(4)}  ${c}`).join('\n') };
};

COMMANDS.clear = () => { outputEl.innerHTML = ''; return null; };
COMMANDS.reset = () => { outputEl.innerHTML = ''; return null; };

COMMANDS.date = ({ args }) => {
  const fmt  = args.find(a => a.startsWith('+'));
  const d    = new Date();
  if (!fmt) return { out: d.toString() };
  const fmtStr = fmt.slice(1);
  const pad = (n, w=2) => String(n).padStart(w,'0');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const days   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const out = fmtStr
    .replace(/%Y/g, d.getFullYear())
    .replace(/%m/g, pad(d.getMonth()+1))
    .replace(/%d/g, pad(d.getDate()))
    .replace(/%H/g, pad(d.getHours()))
    .replace(/%M/g, pad(d.getMinutes()))
    .replace(/%S/g, pad(d.getSeconds()))
    .replace(/%b/g, months[d.getMonth()])
    .replace(/%A/g, ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d.getDay()])
    .replace(/%a/g, days[d.getDay()])
    .replace(/%s/g, Math.floor(d.getTime()/1000))
    .replace(/%n/g, '\n')
    .replace(/%t/g, '\t');
  return { out };
};

COMMANDS.uname = ({ args }) => {
  const all = args.some(a => a.includes('a'));
  const r   = args.some(a => a.includes('r'));
  const n   = args.some(a => a.includes('n'));
  const m   = args.some(a => a.includes('m'));
  if (all) return { out: 'Linux bash-trainer 5.15.0-91-generic #101-Ubuntu SMP Fri Nov 10 11:41:11 UTC 2023 x86_64 x86_64 x86_64 GNU/Linux' };
  if (r)   return { out: '5.15.0-91-generic' };
  if (n)   return { out: 'bash-trainer' };
  if (m)   return { out: 'x86_64' };
  return { out: 'Linux' };
};

COMMANDS.uptime = () => {
  const d   = new Date();
  const ts  = d.toTimeString().split(' ')[0];
  const upM = Math.floor((d - new Date(d).setHours(0,0,0,0))/60000);
  const h   = Math.floor(upM/60), mins = upM%60;
  return { out: ` ${ts} up ${h}:${String(mins).padStart(2,'0')},  1 user,  load average: 0.00, 0.00, 0.00` };
};

COMMANDS.hostname = ({ args }) => {
  if (args.some(a => a === '-I')) return { out: '192.168.1.100' };
  if (args.some(a => a === '-f')) return { out: 'bash-trainer.local' };
  return { out: 'bash-trainer' };
};

COMMANDS.free = ({ args }) => {
  const human = args.some(a => a.includes('h'));
  const header = '               total        used        free      shared  buff/cache   available';
  const fmt    = (n) => human ? `${(n/1024).toFixed(1)}G`.padStart(12) : String(n*1024).padStart(12);
  const rows   = [
    `Mem:    ${fmt(8)}${fmt(3)}${fmt(5)}${fmt(0)}${fmt(0.5)}${fmt(5)}`,
    `Swap:   ${fmt(2)}${fmt(0)}${fmt(2)}`,
  ];
  return { out: [header, ...rows].join('\n') };
};

COMMANDS.top = () => ({
  out: `<span style="color:var(--dim)">[top: interactive mode not supported in sandbox]\n[Use 'ps aux' for process listing, 'free -h' for memory]</span>`
});

COMMANDS.htop = COMMANDS.top;

COMMANDS.lsof = ({ args }) => {
  const proc  = args.includes('-p') ? args[args.indexOf('-p')+1] : null;
  const header= 'COMMAND  PID     USER   FD   TYPE DEVICE SIZE/OFF NODE NAME';
  const rows  = [
    `bash    1234  analyst  cwd    DIR    8,1     4096  ${cwd}`,
    `bash    1234  analyst  txt    REG    8,1   949504  /bin/bash`,
    `bash    1234  analyst    0u   CHR  136,0      0t0  /dev/pts/0`,
    `bash    1234  analyst    1u   CHR  136,0      0t0  /dev/pts/0`,
    `bash    1234  analyst    2u   CHR  136,0      0t0  /dev/pts/0`,
  ];
  return { out: [header, ...rows].join('\n') };
};

COMMANDS.mount = ({ args }) => {
  if (!args.length) {
    return { out: MOUNTS.map(m => `${m.fs} on ${m.mount} type ${m.type} (rw,relatime)`).join('\n') };
  }
  return { out: '<span style="color:var(--dim)">[mount: operation simulated]</span>' };
};

COMMANDS.lsblk = () => ({
  out: `NAME   MAJ:MIN RM  SIZE RO TYPE MOUNTPOINT\nsda      8:0    0   72G  0 disk\n├─sda1   8:1    0   20G  0 part /\n└─sda2   8:2    0   50G  0 part /home`
});

COMMANDS['read'] = ({ args }) => {
  const varName = args.filter(a => !a.startsWith('-'))[0] || 'REPLY';
  env[varName] = `<simulated-input>`;
  return { out: `<span style="color:var(--dim)">[read: '${varName}' set to simulated input in sandbox]</span>` };
};

COMMANDS.tput = ({ args }) => {
  const cap = args[0];
  if (cap === 'cols')   return { out: '220' };
  if (cap === 'lines')  return { out: '50' };
  if (cap === 'colors') return { out: '256' };
  return { out: '' };
};

COMMANDS.column = ({ args, stdin }) => {
  const text = stdin || '';
  if (!text) return { err: 'column: no input' };
  const sep   = args.includes('-t');
  const lines = text.split('\n').filter(Boolean);
  if (!sep) return { out: text };
  const rows  = lines.map(l => l.split(/\s+/));
  const cols  = Math.max(...rows.map(r => r.length));
  const widths= Array.from({length: cols}, (_, i) => Math.max(...rows.map(r => (r[i]||'').length)));
  return { out: rows.map(r => r.map((v,i) => v.padEnd(widths[i])).join('  ')).join('\n') };
};

COMMANDS.nl = ({ args, stdin }) => {
  const files = args.filter(a => !a.startsWith('-'));
  let text    = stdin !== undefined ? stdin : null;
  if (!text && files.length) {
    const node = getNode(normalizePath(files[0]));
    if (!node) return { err: `nl: ${files[0]}: No such file or directory` };
    text = node.content || '';
  }
  if (text === null) return { err: 'nl: missing operand' };
  return { out: text.split('\n').map((l, i) => `${String(i+1).padStart(6)}\t${l}`).join('\n') };
};

COMMANDS.rev = ({ args, stdin }) => {
  const text = stdin !== undefined ? stdin : (args[0] ? (getNode(normalizePath(args[0]))?.content || '') : '');
  return { out: text.split('\n').map(l => l.split('').reverse().join('')).join('\n') };
};

COMMANDS.yes = ({ args }) => {
  const word = args[0] || 'y';
  return { out: Array(10).fill(word).join('\n') + '\n<span style="color:var(--dim)">[yes: truncated to 10 repetitions in sandbox]</span>' };
};

COMMANDS.seq = ({ args }) => {
  if (!args.length) return { err: 'seq: missing operand' };
  let start = 1, step = 1, end;
  if (args.length === 1) { end = parseInt(args[0]); }
  else if (args.length === 2) { start = parseInt(args[0]); end = parseInt(args[1]); }
  else { start = parseInt(args[0]); step = parseInt(args[1]); end = parseInt(args[2]); }
  const lines = [];
  for (let i = start; step > 0 ? i <= end : i >= end; i += step) lines.push(String(i));
  return { out: lines.join('\n') };
};

COMMANDS.bc = ({ args, stdin }) => {
  const input = stdin || args.join(' ');
  if (!input.trim()) return { out: '' };
  try {
    // Very basic: eval simple math
    const safe = input.replace(/[^0-9+\-*/().\n ]/g,'').trim();
    if (!safe) return { err: 'bc: invalid expression' };
    const result = safe.split('\n').map(e => {
      try { return String(eval(e.trim())); } catch { return ''; }
    }).filter(Boolean).join('\n');
    return { out: result };
  } catch(e) { return { err: 'bc: error' }; }
};

COMMANDS.expr = ({ args }) => {
  if (!args.length) return { err: 'expr: missing operand' };
  try {
    const expr = args.join(' ');
    const result = expr
      .replace(/(\d+)\s*\+\s*(\d+)/g, (_, a, b) => parseInt(a)+parseInt(b))
      .replace(/(\d+)\s*-\s*(\d+)/g,  (_, a, b) => parseInt(a)-parseInt(b))
      .replace(/(\d+)\s*\*\s*(\d+)/g, (_, a, b) => parseInt(a)*parseInt(b))
      .replace(/(\d+)\s*\/\s*(\d+)/g, (_, a, b) => Math.floor(parseInt(a)/parseInt(b)))
      .replace(/(\d+)\s*%\s*(\d+)/g,  (_, a, b) => parseInt(a)%parseInt(b));
    // length op
    if (args[0] === 'length' && args[1]) { return { out: String(args[1].length) }; }
    return { out: result };
  } catch { return { err: 'expr: syntax error' }; }
};

COMMANDS.md5sum = ({ args, stdin }) => {
  function simHash(s) {
    let h = 0x12345678;
    for (let i = 0; i < s.length; i++) h = (Math.imul(h^s.charCodeAt(i),0x9e3779b1)>>>0);
    return h.toString(16).padStart(8,'0').repeat(4);
  }
  if (stdin !== undefined && !args.length) return { out: `${simHash(stdin)}  -` };
  const results = [];
  for (const f of args) {
    const node = getNode(normalizePath(f));
    if (!node) { results.push({ err: `md5sum: ${f}: No such file or directory` }); continue; }
    results.push({ out: `${simHash(node.content||'')}  ${f}` });
  }
  return results;
};

COMMANDS.sha256sum = ({ args, stdin }) => {
  function simHash(s) {
    let h1 = 0xdeadbeef, h2 = 0x41c6ce57;
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      h1 = (Math.imul(h1^c, 0x9e3779b9)>>>0);
      h2 = (Math.imul(h2^c, 0x5c4dd124)>>>0);
    }
    return (h1.toString(16).padStart(8,'0')+h2.toString(16).padStart(8,'0')).repeat(4);
  }
  if (stdin !== undefined && !args.length) return { out: `${simHash(stdin)}  -` };
  const results = [];
  for (const f of args) {
    const node = getNode(normalizePath(f));
    if (!node) { results.push({ err: `sha256sum: ${f}: No such file or directory` }); continue; }
    results.push({ out: `${simHash(node.content||'')}  ${f}` });
  }
  return results;
};

COMMANDS.base64 = ({ args, stdin }) => {
  const decode  = args.some(a => a === '-d' || a === '--decode');
  const files   = args.filter(a => !a.startsWith('-'));
  let text = stdin !== undefined ? stdin : (files[0] ? (getNode(normalizePath(files[0]))?.content || '') : null);
  if (text === null) return { err: 'base64: missing input' };
  try {
    return { out: decode ? atob(text.trim()) : btoa(text) };
  } catch { return { err: 'base64: invalid input' }; }
};

// Man pages (extended) ─────────────────────────────────────────

COMMANDS.man = ({ args }) => {
  if (!args.length) return { err: 'What manual page do you want?' };
  const section = args.length > 1 && /^\d$/.test(args[0]) ? args.shift() : null;
  const cmd  = args[0];
  const pages = {
    ls:    'ls — list directory contents\n\nSYNOPSIS\n    ls [OPTION]... [FILE]...\n\nOPTIONS\n    -a    do not ignore entries starting with .\n    -l    use long listing format\n    -h    human-readable sizes (with -l)\n    -R    list subdirectories recursively\n    -r    reverse order\n    -t    sort by modification time\n\nEXAMPLES\n    ls -la\n    ls -lah /etc\n    ls -R ~/projects',
    cd:    'cd — change the shell working directory\n\nSYNOPSIS\n    cd [DIR]\n\nSPECIAL PATHS\n    ~     home directory\n    -     previous directory\n    ..    parent directory\n\nEXAMPLES\n    cd ~\n    cd -\n    cd /var/log',
    grep:  'grep — print lines matching a pattern\n\nSYNOPSIS\n    grep [OPTION]... PATTERN [FILE]...\n\nOPTIONS\n    -i    ignore case\n    -v    invert match\n    -n    show line numbers\n    -c    count matching lines\n    -r    recursive search\n    -l    only list filenames\n    -w    match whole word\n    -E    extended regex\n\nEXAMPLES\n    grep -rn "TODO" ~/projects\n    cat file.txt | grep -i "error"\n    grep -v "^#" config.txt',
    sed:   'sed — stream editor\n\nSYNOPSIS\n    sed [OPTION]... SCRIPT [FILE]...\n\nCOMMANDS\n    s/pat/rep/g   substitute\n    /pat/d        delete matching lines\n    /pat/p        print matching lines\n    =             print line numbers\n\nOPTIONS\n    -i    edit file in place\n    -n    suppress automatic printing\n\nEXAMPLES\n    sed "s/foo/bar/g" file.txt\n    sed -i "s/old/new/g" file.txt\n    cat file.txt | sed "/^#/d"',
    awk:   'awk — pattern scanning and processing language\n\nSYNOPSIS\n    awk [-F delim] "program" [FILE]...\n\nPROGRAM ELEMENTS\n    $0        entire line\n    $1,$2..   fields\n    NR        record (line) number\n    NF        number of fields\n    BEGIN{}   run before input\n    END{}     run after input\n    /pat/{}   run on matching lines\n\nEXAMPLES\n    awk "{print $1}" file.txt\n    awk -F: "{print $1}" /etc/passwd\n    awk "NR>2 {print $0}" file.txt',
    find:  'find — search for files\n\nSYNOPSIS\n    find [PATH] [EXPRESSION]\n\nOPTIONS\n    -name PATTERN  filename pattern\n    -type f|d|l    file type\n    -maxdepth N    max depth\n    -mindepth N    min depth\n    -exec CMD {} \\; execute command\n    -delete        delete matches\n    -empty         empty files/dirs\n\nEXAMPLES\n    find . -name "*.log" -type f\n    find /etc -maxdepth 1 -type f\n    find . -name "*.txt" -exec wc -l {} \\;',
    chmod: 'chmod — change file mode bits\n\nSYNOPSIS\n    chmod [OPTION]... MODE FILE...\n\nMODE FORMATS\n    Octal:    755, 644, 600, 777\n    Symbolic: u+x, g-w, o=r, a+x, +x\n\nCOMMON PERMISSIONS\n    644  rw-r--r--  regular file\n    755  rwxr-xr-x  executable/directory\n    600  rw-------  private key\n    777  rwxrwxrwx  world-writable\n\nEXAMPLES\n    chmod +x script.sh\n    chmod 644 file.txt\n    chmod -R 755 directory/',
    tar:   'tar — tape archive\n\nSYNOPSIS\n    tar [OPTION]... [FILE]...\n\nOPTIONS\n    -c    create archive\n    -x    extract archive\n    -t    list contents\n    -f    archive filename\n    -v    verbose\n    -z    gzip compression\n    -j    bzip2 compression\n    -C    change to directory\n\nEXAMPLES\n    tar -czf backup.tar.gz ~/reports\n    tar -xzf backup.tar.gz\n    tar -tf backup.tar.gz',
    ssh:   'ssh — OpenSSH remote login client\n\nSYNOPSIS\n    ssh [OPTION]... [user@]host\n\nOPTIONS\n    -i KEY    identity file\n    -p PORT   port number\n    -L local:host:remote  local forward\n    -N        no remote command (for forwarding)\n\nEXAMPLES\n    ssh analyst@192.168.1.50\n    ssh -i ~/.ssh/id_rsa user@host\n    ssh -p 2222 user@host',
    curl:  'curl — transfer data from/to server\n\nSYNOPSIS\n    curl [OPTION]... URL\n\nOPTIONS\n    -o FILE   output to file\n    -O        save with remote filename\n    -s        silent mode\n    -I        show headers only\n    -d DATA   POST data\n    -H HEADER add header\n    -u u:p    auth credentials\n    -L        follow redirects\n\nEXAMPLES\n    curl -s https://example.com\n    curl -O https://example.com/file.zip\n    curl -d "key=val" https://api.example.com/data',
    diff:  'diff — compare files line by line\n\nSYNOPSIS\n    diff [OPTION]... FILE1 FILE2\n\nOPTIONS\n    -u    unified format (most common)\n    -i    ignore case\n    -w    ignore whitespace\n    -r    recursive (dirs)\n\nOUTPUT\n    <     line from FILE1\n    >     line from FILE2\n    ---   separator\n    @@    hunk header (unified)\n\nEXAMPLES\n    diff file1.txt file2.txt\n    diff -u original.txt modified.txt',
    ps:    'ps — report process status\n\nSYNOPSIS\n    ps [OPTION]...\n\nCOMMON USAGE\n    ps          current user processes\n    ps aux      all processes (BSD style)\n    ps -ef      all processes (System V)\n    ps aux | grep nginx   find process\n\nCOLUMNS\n    PID   process ID\n    USER  owner\n    %CPU  CPU usage\n    %MEM  memory usage\n    CMD   command',
    systemctl: 'systemctl — control the systemd system\n\nSYNOPSIS\n    systemctl [COMMAND] [UNIT]...\n\nCOMMANDS\n    start NAME    start a unit\n    stop NAME     stop a unit\n    restart NAME  restart a unit\n    status NAME   show unit status\n    enable NAME   enable at boot\n    disable NAME  disable at boot\n    list-units    list all units\n\nEXAMPLES\n    sudo systemctl start nginx\n    systemctl status ssh\n    systemctl list-units',
    tr:    'tr — translate or delete characters\n\nSYNOPSIS\n    tr [OPTION]... SET1 [SET2]\n\nOPTIONS\n    -d    delete characters in SET1\n    -s    squeeze repeated characters\n\nSPECIAL SEQUENCES\n    a-z   range\n    A-Z   uppercase range\n    \\n    newline\n    \\t    tab\n\nEXAMPLES\n    echo "hello" | tr a-z A-Z\n    cat file.txt | tr -d "\\n"\n    echo "aabbcc" | tr -s "a-z"',
    xargs: 'xargs — build and execute command lines from standard input\n\nSYNOPSIS\n    xargs [OPTION]... [COMMAND]\n\nOPTIONS\n    -n N    max args per command line\n    -I {}   replace string\n    -P N    parallel processes\n\nEXAMPLES\n    find . -name "*.txt" | xargs wc -l\n    echo "a b c" | xargs -n 1 echo\n    cat urls.txt | xargs -I {} curl -s {}',
    tee:   'tee — read stdin and write to stdout and files\n\nSYNOPSIS\n    tee [OPTION]... [FILE]...\n\nOPTIONS\n    -a    append to files\n\nEXAMPLES\n    echo "hello" | tee output.txt\n    cat log.txt | tee -a combined.log | grep ERROR',
    sort:  'sort — sort lines of text\n\nSYNOPSIS\n    sort [OPTION]... [FILE]\n\nOPTIONS\n    -r    reverse order\n    -n    numeric sort\n    -u    unique (remove duplicates)\n    -k N  sort by field N\n    -t C  field separator\n\nEXAMPLES\n    sort file.txt\n    sort -rn numbers.txt\n    cat names.txt | sort -u',
    wc:    'wc — word, line, character count\n\nSYNOPSIS\n    wc [OPTION]... [FILE]...\n\nOPTIONS\n    -l    count lines\n    -w    count words\n    -c    count bytes\n    -m    count characters\n\nEXAMPLES\n    wc -l file.txt\n    cat file.txt | wc -w\n    wc *.txt',
    pipe:  'PIPES — connecting commands\n\nSYNOPSIS\n    cmd1 | cmd2 | cmd3\n\nDESCRIPTION\n    The pipe operator | connects stdout of one\n    command to stdin of the next.\n\nEXAMPLES\n    cat /etc/passwd | cut -d: -f1 | sort\n    ls -la | grep ".txt"\n    find . -name "*.log" | xargs grep "ERROR" | wc -l\n    ps aux | sort -nrk 3 | head -10',
    redirect: 'REDIRECTION — controlling file descriptors\n\nOPERATORS\n    >       redirect stdout (overwrite)\n    >>      redirect stdout (append)\n    2>      redirect stderr\n    2>&1    merge stderr into stdout\n    <       redirect stdin from file\n    /dev/null  discard output\n\nEXAMPLES\n    echo "hello" > file.txt\n    echo "world" >> file.txt\n    command 2> errors.log\n    command > out.txt 2>&1\n    command 2>/dev/null\n    cat < file.txt',
    bash:  'bash — GNU Bourne-Again SHell\n\nSPECIAL VARIABLES\n    $?    exit status of last command\n    $$    PID of current shell\n    $0    name of shell/script\n    $1-9  positional parameters\n    $#    number of arguments\n    $@    all arguments\n    $HOME, $PATH, $USER, $PWD...\n\nCONTROL FLOW\n    if/then/elif/else/fi\n    for VAR in LIST; do; done\n    while COND; do; done\n    case VAR in PATTERN) ;; esac\n\nEXAMPLES\n    echo $?\n    for f in *.txt; do echo $f; done\n    [ -f file.txt ] && echo "exists"',
  };

  if (pages[cmd]) {
    return { html: `<div style="color:var(--white)"><pre style="font-family:var(--font);white-space:pre-wrap"><span style="color:var(--yellow);font-weight:bold">${escHtml(cmd.toUpperCase())}(1)</span>\n\n${escHtml(pages[cmd])}\n\n<span style="color:var(--dim)">bash-trainer manual — type any command to continue</span></pre></div>` };
  }
  if (COMMANDS[cmd]) return { out: `${cmd}: a shell command. Try '${cmd} --help' or 'man bash' for scripting.` };
  return { err: `No manual entry for ${cmd}` };
};

COMMANDS.help = ({ args }) => {
  if (args[0]) return COMMANDS.man({ args });
  return { html: `<span style="color:var(--green);font-weight:bold">bash-trainer — Available Commands</span>

<span style="color:var(--yellow)">NAVIGATION</span>
  cd, ls, pwd, tree

<span style="color:var(--yellow)">FILE MANAGEMENT</span>
  cat, touch, mkdir, rm, rmdir, cp, mv, ln
  nano/vi (info), file, stat

<span style="color:var(--yellow)">TEXT PROCESSING</span>
  echo, printf, grep, sed, awk, tr
  sort, uniq, cut, wc, head, tail
  diff, tee, xargs, column, nl, rev

<span style="color:var(--yellow)">SEARCH</span>
  find, grep -r

<span style="color:var(--yellow)">ARCHIVES</span>
  tar, gzip, gunzip, zip, unzip

<span style="color:var(--yellow)">PERMISSIONS</span>
  chmod, chown, umask, stat

<span style="color:var(--yellow)">USERS &amp; SYSTEM</span>
  whoami, id, groups, who, w, last
  sudo, su, exit, passwd, useradd, userdel, usermod

<span style="color:var(--yellow)">ENVIRONMENT</span>
  env, export, unset, alias, unalias, which, type
  source (.), bash/sh (run scripts)

<span style="color:var(--yellow)">PROCESSES</span>
  ps, kill, killall, jobs, bg, fg, sleep, top

<span style="color:var(--yellow)">NETWORK</span>
  ping, curl, wget, ssh, ifconfig, ip, netstat, ss

<span style="color:var(--yellow)">SYSTEM INFO</span>
  date, uname, uptime, hostname, free, df, du
  mount, lsblk, lsof, journalctl, systemctl

<span style="color:var(--yellow)">MISC</span>
  history, clear, man, help, bc, expr, seq, yes
  md5sum, sha256sum, base64, tput, test, [

<span style="color:var(--yellow)">SHELL FEATURES</span>
  Pipes:         cmd1 | cmd2 | cmd3
  Redirect:      cmd > file, cmd >> file, cmd 2>err
  Append stderr: cmd 2>&1
  Cmd sub:       echo $(date)
  Variables:     export NAME=val; echo \$NAME; echo \$?
  Brace expand:  touch file.{txt,log,sh}
  Glob:          ls *.txt, find . -name "*.sh"
  Aliases:       alias ll='ls -la'
  Run script:    bash scripts/hello.sh

<span style="color:var(--dim)">Type 'man COMMAND' for details. Try 'man pipe' or 'man redirect' for concepts.</span>` };
};

// ─────────────────────────────────────────────────────────────
// EXECUTOR
// ─────────────────────────────────────────────────────────────

function executeSegment(seg, stdin) {
  const args = resolveArgs(seg.args);

  // Alias expansion
  if (aliases[seg.cmd]) {
    const aliasTokens = tokenize(aliases[seg.cmd]);
    seg = { cmd: aliasTokens[0], args: [...aliasTokens.slice(1), ...args] };
  }

  const fn = COMMANDS[seg.cmd];
  if (!fn) {
    // Try running as a script file
    const p = normalizePath(seg.cmd);
    const node = getNode(p);
    if (node && node.type === 'f' && (node.perms || '').match(/[75]/)) {
      return COMMANDS.source({ args: [seg.cmd, ...args] });
    }
    lastExitCode = 127;
    return { err: `bash: ${seg.cmd}: command not found` };
  }

  const result = fn({ args, stdin, rawCmd: seg.cmd });
  lastExitCode = (result && result.err) ? 1 : 0;
  return result;
}

function flattenResult(result) {
  if (!result) return { out: '', err: '' };
  if (Array.isArray(result)) {
    let out = [], err = [], html = [];
    for (const r of result) {
      const f = flattenResult(r);
      if (f.out)  out.push(f.out);
      if (f.err)  err.push(f.err);
      if (f.html) html.push(f.html);
    }
    return { out: out.join('\n'), err: err.join('\n'), html: html.join('\n') };
  }
  return { out: result.out || '', err: result.err || '', html: result.html || '' };
}

// Capture pipeline output (for command substitution)
function runPipelineCapture(input) {
  // stripped version that returns result instead of printing
  input = input.trim();
  if (!input) return { out: '' };

  let redirectFile = null, appendMode = false;
  const dblRedir = input.match(/^(.*?)\s*>>\s*(.+)$/);
  const sglRedir = input.match(/^(.*?)\s*>\s*(.+)$/);
  if (dblRedir) { input = dblRedir[1].trim(); redirectFile = dblRedir[2].trim(); appendMode = true; }
  else if (sglRedir) { input = sglRedir[1].trim(); redirectFile = sglRedir[2].trim(); }

  const segments = parseInput(input);
  if (!segments.length || !segments[0].cmd) return { out: '' };

  let stdin = undefined;
  let lastResult = null;

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const isLast = i === segments.length - 1;
    if (!seg.cmd) continue;
    const raw = executeSegment(seg, stdin);
    lastResult = raw;
    if (!isLast) {
      const flat = flattenResult(raw);
      if (flat.err) return { out: '', err: flat.err };
      stdin = flat.out;
    }
  }

  if (lastResult === null) return { out: '' };
  const flat = flattenResult(lastResult);

  if (redirectFile) {
    const p = normalizePath(redirectFile);
    const parent = getNode(getParent(p));
    if (parent) {
      if (appendMode) {
        const existing = getNode(p);
        const prev = existing ? (existing.content || '') : '';
        setNode(p, { type: 'f', content: prev + (prev ? '\n' : '') + flat.out, perms: '644', owner: currentUser });
      } else {
        setNode(p, { type: 'f', content: flat.out, perms: '644', owner: currentUser });
      }
    }
    return { out: '' };
  }

  return flat;
}

function runPipeline(input) {
  input = input.trim();
  if (!input) return;

  // Stderr redirect: 2> or 2>&1
  let stderrFile = null, stderrToStdout = false;
  input = input.replace(/\s+2>&1/, () => { stderrToStdout = true; return ''; });
  input = input.replace(/\s+2>\s*(\S+)/, (_, f) => { stderrFile = f; return ''; });

  // Dev/null shortcut
  const devNull = input.endsWith('>/dev/null') || input.endsWith('> /dev/null');
  if (devNull) input = input.replace(/\s*>\/dev\/null|\s*> \/dev\/null/, '');

  let redirectFile = null, appendMode = false;
  const dblRedir = input.match(/^(.*?)\s*>>\s*(.+)$/);
  const sglRedir = !dblRedir && input.match(/^(.*?)\s*>\s*(.+)$/);
  if (dblRedir) { input = dblRedir[1].trim(); redirectFile = dblRedir[2].trim(); appendMode = true; }
  else if (sglRedir) { input = sglRedir[1].trim(); redirectFile = sglRedir[2].trim(); }

  const segments = parseInput(input);
  if (!segments.length || !segments[0].cmd) return;

  let stdin    = undefined;
  let lastResult = null;

  for (let i = 0; i < segments.length; i++) {
    const seg    = segments[i];
    const isLast = i === segments.length - 1;
    if (!seg.cmd) continue;
    const raw = executeSegment(seg, stdin);
    lastResult = raw;
    if (!isLast) {
      const flat = flattenResult(raw);
      if (flat.err) { if (!devNull) printText(flat.err, 'line-err'); return; }
      stdin = flat.out;
    }
  }

  if (lastResult === null) return;
  const flat = flattenResult(lastResult);

  if (redirectFile) {
    const p      = normalizePath(redirectFile);
    const parent = getNode(getParent(p));
    if (!parent || parent.type !== 'd') {
      printText(`bash: ${redirectFile}: No such file or directory`, 'line-err');
      return;
    }
    if (appendMode) {
      const existing = getNode(p);
      const prev = existing ? (existing.content || '') : '';
      setNode(p, { type: 'f', content: prev + (prev ? '\n' : '') + flat.out, perms: '644', owner: currentUser });
    } else {
      setNode(p, { type: 'f', content: flat.out, perms: '644', owner: currentUser });
    }
    if (flat.err && !stderrFile && !stderrToStdout) printText(flat.err, 'line-err');
    return;
  }

  if (stderrFile) {
    const p = normalizePath(stderrFile);
    setNode(p, { type: 'f', content: flat.err, perms: '644', owner: currentUser });
  }

  if (!devNull) {
    if (flat.err && !stderrFile) printText(flat.err, 'line-err');
    if (flat.html) {
      const d = document.createElement('div');
      d.className = 'line line-out';
      d.innerHTML = flat.html;
      outputEl.appendChild(d);
      outputEl.scrollTop = outputEl.scrollHeight;
    } else if (flat.out !== undefined && flat.out !== null && flat.out !== '') {
      printText(flat.out);
    }
  }
}

// ─────────────────────────────────────────────────────────────
// SCRIPTING: simple for/while/if block execution
// ─────────────────────────────────────────────────────────────

function handleInput(raw) {
  const input = raw.trim();
  printPromptEcho(raw);
  if (!input) return;

  // Update history
  if (cmdHistory[cmdHistory.length - 1] !== input) cmdHistory.push(input);
  histIdx = -1;

  // Semicolon-separated commands
  // But don't split inside for/if/while blocks
  if (!input.match(/^(for|while|if|until)\s/)) {
    const cmds = input.split(';').map(s => s.trim()).filter(Boolean);
    for (const cmd of cmds) runPipeline(cmd);
    return;
  }

  // Basic for loop: for VAR in LIST; do CMD; done
  const forMatch = input.match(/^for\s+(\w+)\s+in\s+(.+?);\s*do\s+(.+?);\s*done$/);
  if (forMatch) {
    const varName = forMatch[1];
    const list    = resolveArgs(tokenize(forMatch[2]));
    const body    = forMatch[3];
    for (const item of list) {
      env[varName] = item;
      runPipeline(body.replace(new RegExp(`\\$${varName}|\\$\\{${varName}\\}`, 'g'), item));
    }
    return;
  }

  // Basic while: while COND; do CMD; done
  const whileMatch = input.match(/^while\s+(.+?);\s*do\s+(.+?);\s*done$/);
  if (whileMatch) {
    let iters = 0;
    while (iters++ < 50) {
      const condResult = runPipelineCapture(whileMatch[1]);
      if (lastExitCode !== 0) break;
      runPipeline(whileMatch[2]);
    }
    return;
  }

  // Basic if: if COND; then CMD; [else CMD;] fi
  const ifMatch = input.match(/^if\s+(.+?);\s*then\s+(.+?)(?:;\s*else\s+(.+?))?;\s*fi$/);
  if (ifMatch) {
    runPipelineCapture(ifMatch[1]);
    if (lastExitCode === 0) runPipeline(ifMatch[2]);
    else if (ifMatch[3]) runPipeline(ifMatch[3]);
    return;
  }

  runPipeline(input);
}

// ─────────────────────────────────────────────────────────────
// AUTOCOMPLETE
// ─────────────────────────────────────────────────────────────
const acEl = document.getElementById('autocomplete');

function getCompletions(val) {
  const tokens      = tokenize(val);
  const trailingSpace = val.endsWith(' ');
  const isCmd       = tokens.length === 0 || (tokens.length === 1 && !trailingSpace);

  if (isCmd) {
    const prefix = tokens[0] || '';
    const cmdMatches  = Object.keys(COMMANDS).filter(c => c.startsWith(prefix)).map(c => ({ label: c, type: 'cmd' }));
    const aliasMatches= Object.keys(aliases).filter(a => a.startsWith(prefix) && !cmdMatches.some(m => m.label === a)).map(a => ({ label: a, type: 'cmd' }));
    return [...cmdMatches, ...aliasMatches].sort((a,b) => a.label.localeCompare(b.label));
  }

  const lastToken = trailingSpace ? '' : (tokens[tokens.length - 1] || '');
  const lastSlash = lastToken.lastIndexOf('/');
  const dirPart   = lastSlash >= 0 ? lastToken.slice(0, lastSlash + 1) : '';
  const filePart  = lastSlash >= 0 ? lastToken.slice(lastSlash + 1)    : lastToken;

  const dirPath = dirPart ? normalizePath(dirPart) : normalizePath(cwd);
  const dirNode = getNode(dirPath);
  if (!dirNode || dirNode.type !== 'd') return [];

  const showHidden = filePart.startsWith('.');
  return Object.entries(dirNode.children)
    .filter(([n]) => n.startsWith(filePart) && (showHidden || !n.startsWith('.')))
    .map(([n, nd]) => ({ label: (dirPart || '') + n + (nd.type === 'd' ? '/' : ''), type: nd.type === 'd' ? 'dir' : 'file' }))
    .sort((a,b) => a.label.localeCompare(b.label));
}

function showAC(list) {
  acEl.innerHTML = '';
  if (!list.length) { acEl.style.display = 'none'; return; }
  list.slice(0, 20).forEach((item, i) => {
    const d = document.createElement('div');
    d.className = 'ac-item ' + (item.type === 'dir' ? 'ac-dir' : item.type === 'cmd' ? 'ac-cmd' : '');
    d.textContent = item.label;
    d.addEventListener('mousedown', e => { e.preventDefault(); applyAC(item.label); });
    acEl.appendChild(d);
  });
  const rect = document.getElementById('inputbar').getBoundingClientRect();
  acEl.style.display  = 'block';
  acEl.style.left     = rect.left + 'px';
  acEl.style.bottom   = (window.innerHeight - rect.top + 4) + 'px';
  acEl.style.top      = 'auto';
  acEl.style.maxWidth = (window.innerWidth - rect.left - 16) + 'px';
}

function hideAC() {
  acEl.style.display = 'none';
  acList = []; acIdx = -1;
}

function applyAC(label) {
  const inputEl     = document.getElementById('cmd-input');
  const val         = inputEl.value;
  const tokens      = tokenize(val);
  const trailingSpace = val.endsWith(' ');

  if (tokens.length === 0 || (tokens.length === 1 && !trailingSpace)) {
    inputEl.value = label + ' ';
  } else {
    if (trailingSpace) {
      inputEl.value = val + label + (label.endsWith('/') ? '' : ' ');
    } else {
      tokens[tokens.length - 1] = label;
      inputEl.value = tokens.slice(0,-1).join(' ') + (tokens.length > 1 ? ' ' : '') + label + (label.endsWith('/') ? '' : ' ');
    }
  }
  hideAC();
}

// ─────────────────────────────────────────────────────────────
// INPUT HANDLER
// ─────────────────────────────────────────────────────────────
const inputEl = document.getElementById('cmd-input');

inputEl.addEventListener('keydown', e => {
  if (e.key === 'Enter') {
    hideAC();
    const val = inputEl.value;
    inputEl.value = '';
    handleInput(val);
    return;
  }

  if (e.key === 'Tab') {
    e.preventDefault();
    if (acEl.style.display === 'none' || !acList.length) {
      acList = getCompletions(inputEl.value);
      if (acList.length === 1) { applyAC(acList[0].label); acList = []; return; }
      acIdx = -1;
      showAC(acList);
    } else {
      acIdx = (acIdx + 1) % acList.length;
      [...acEl.children].forEach((c, i) => c.classList.toggle('selected', i === acIdx));
    }
    return;
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (acEl.style.display !== 'none' && acList.length) {
      acIdx = (acIdx - 1 + acList.length) % acList.length;
      [...acEl.children].forEach((c, i) => c.classList.toggle('selected', i === acIdx));
      return;
    }
    if (histIdx === -1) histIdx = cmdHistory.length;
    if (histIdx > 0) { histIdx--; inputEl.value = cmdHistory[histIdx]; }
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (acEl.style.display !== 'none' && acList.length) {
      acIdx = (acIdx + 1) % acList.length;
      [...acEl.children].forEach((c, i) => c.classList.toggle('selected', i === acIdx));
      return;
    }
    if (histIdx === -1) return;
    histIdx++;
    inputEl.value = histIdx < cmdHistory.length ? cmdHistory[histIdx] : '';
    if (histIdx >= cmdHistory.length) histIdx = -1;
    return;
  }

  if (e.key === 'Escape') { hideAC(); return; }

  if (e.ctrlKey && e.key === 'c') {
    printText('^C', 'line-err');
    inputEl.value = '';
    hideAC();
    return;
  }

  if (e.ctrlKey && e.key === 'l') {
    e.preventDefault();
    COMMANDS.clear();
    return;
  }

  if (e.ctrlKey && e.key === 'a') { e.preventDefault(); inputEl.setSelectionRange(0,0); return; }
  if (e.ctrlKey && e.key === 'e') { e.preventDefault(); inputEl.setSelectionRange(inputEl.value.length, inputEl.value.length); return; }

  if (e.ctrlKey && e.key === 'u') {
    e.preventDefault();
    inputEl.value = '';
    hideAC();
    return;
  }

  if (e.ctrlKey && e.key === 'w') {
    e.preventDefault();
    const val   = inputEl.value;
    const parts = val.trimEnd().split(' ');
    parts.pop();
    inputEl.value = parts.join(' ') + (parts.length ? ' ' : '');
    hideAC();
    return;
  }
});

inputEl.addEventListener('input', () => { hideAC(); });
document.addEventListener('click', e => { if (!acEl.contains(e.target) && e.target !== inputEl) hideAC(); });
document.addEventListener('keydown', e => {
  if (document.activeElement !== inputEl && e.key.length === 1 && !e.ctrlKey && !e.metaKey) inputEl.focus();
});

// ─────────────────────────────────────────────────────────────
// PERSISTENCE
// ─────────────────────────────────────────────────────────────
const DB_NAME = 'bash-trainer-v2', STORE = 'state', KEY = 'session';

function openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open(DB_NAME, 1);
    r.onupgradeneeded = e => e.target.result.createObjectStore(STORE);
    r.onsuccess = e => res(e.target.result);
    r.onerror   = e => rej(e);
  });
}

async function saveState() {
  const data = { fs, cwd, env, cmdHistory, aliases, currentUser };
  try {
    const db = await openDB();
    const tx = db.transaction(STORE, 'readwrite');
    tx.objectStore(STORE).put(data, KEY);
  } catch(e) {
    try { localStorage.setItem('bash-trainer-v2', JSON.stringify(data)); } catch(_) {}
  }
}

async function loadState() {
  try {
    const db = await openDB();
    return new Promise(res => {
      const tx  = db.transaction(STORE, 'readonly');
      const req = tx.objectStore(STORE).get(KEY);
      req.onsuccess = e => res(e.target.result || null);
      req.onerror   = () => res(null);
    });
  } catch(e) {
    try { const d = localStorage.getItem('bash-trainer-v2'); return d ? JSON.parse(d) : null; } catch(_) { return null; }
  }
}

setInterval(saveState, 30000);

// ─────────────────────────────────────────────────────────────
// BOOT
// ─────────────────────────────────────────────────────────────
async function boot() {
  const saved = await loadState();
  if (saved) {
    fs          = saved.fs          || fs;
    cwd         = saved.cwd         || cwd;
    env         = saved.env         || env;
    cmdHistory  = saved.cmdHistory  || [];
    aliases     = saved.aliases     || aliases;
    currentUser = saved.currentUser || 'analyst';
  }

  updatePrompt();

  const banner = [
    `<span style="color:var(--green)">  ██████╗  █████╗ ███████╗██╗  ██╗</span>`,
    `<span style="color:var(--green)">  ██╔══██╗██╔══██╗██╔════╝██║  ██║</span>`,
    `<span style="color:var(--green)">  ██████╔╝███████║███████╗███████║</span>`,
    `<span style="color:var(--green)">  ██╔══██╗██╔══██║╚════██║██╔══██║</span>`,
    `<span style="color:var(--green)">  ██████╔╝██║  ██║███████║██║  ██║</span>`,
    `<span style="color:var(--green)">  ╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝  <span style="color:var(--dim)">trainer v2.1</span></span>`,
    '',
    `<span style="color:var(--dim)">  Linux Bash Sandbox — Full CLI Learning Environment</span>`,
    `<span style="color:var(--dim)">  Type <span style="color:var(--white)">help</span> to see all commands | <span style="color:var(--white)">man COMMAND</span> for details</span>`,
    `<span style="color:var(--dim)">  Try: <span style="color:var(--white)">man pipe</span> | <span style="color:var(--white)">man redirect</span> | <span style="color:var(--white)">bash scripts/hello.sh</span></span>`,
    `<span style="color:var(--dim)">  Session auto-saves every 30s | Ctrl+C, Ctrl+L, Ctrl+U supported</span>`,
    '',
  ];

  for (const line of banner) {
    const d = document.createElement('div');
    d.className = 'line';
    d.innerHTML = line;
    outputEl.appendChild(d);
  }

  inputEl.focus();
}

boot();