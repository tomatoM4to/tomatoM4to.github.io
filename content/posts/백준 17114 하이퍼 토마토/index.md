---
title: "백준 7576 토마토"
description: "[골드1] 백준 17114번 하이퍼 토마토, BFS, 그래프, Python"
date: "2021-09-25"
keywords: "백준"
---

> [https://www.acmicpc.net/problem/17114](https://www.acmicpc.net/problem/17114)

⚡⚡⚡⚡⚡⚡⚡

```python
from sys import stdin
import collections

p, a, b, c, d, e, f, g, h, i, j = map(int, stdin.readline().split())

aa = []
bb = []
cc = []
dd = []
ee = []
ff = []
gg = []
hh = []
ii = []
jj = []

aa_append = aa.append
bb_append = bb.append
cc_append = cc.append
dd_append = dd.append
ee_append = ee.append
ff_append = ff.append
gg_append = gg.append
hh_append = hh.append
ii_append = ii.append
jj_append = jj.append


for jjj in range(j):
    for iii in range(i):
        for hhh in range(h):
            for ggg in range(g):
                for fff in range(f):
                    for eee in range(e):
                        for ddd in range(d):
                            for ccc in range(c):
                                for bbb in range(b):
                                    for aaa in range(a):
                                        aa_append(list(map(int,stdin.readline().split())))
                                    bb_append(aa[-a:])
                                cc_append(bb[-b:])
                            dd_append(cc[-c:])
                        ee_append(dd[-d:])
                    ff_append(ee[-e:])
                gg_append(ff[-f:])
            hh_append(gg[-g:])
        ii_append(hh[-h:])
    jj_append(ii[-i:])

# 익은 토마토
check = collections.deque([])
check_append = check.append
for pj in range(j):
    for pi in range(i):
        for ph in range(h):
            for pg in range(g):
                for pf in range(f):
                    for pe in range(e):
                        for pd in range(d):
                            for pc in range(c):
                                for pb in range(b):
                                    for pa in range(a):
                                        for pp in range(p):
                                            if jj[pj][pi][ph][pg][pf][pe][pd][pc][pb][pa][pp] == 1:
                                                check_append([pj, pi, ph, pg, pf, pe, pd, pc, pb, pa, pp])

# bfs 쓰타뜨
dj = (1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
di = (0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
dh = (0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
dg = (0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
df = (0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
de = (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0)
dd = (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0, 0, 0)
dc = (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0, 0, 0)
db = (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0, 0, 0)
da = (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1, 0, 0)
dp = (0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, -1)

while check:
    qj, qi, qh, qg, qf, qe, qd, qc, qb, qa, qp = check.popleft()
    for q in range(0, 22):
        nj = qj + dj[q]
        ni = qi + di[q]
        nh = qh + dh[q]
        ng = qg + dg[q]
        nf = qf + df[q]
        ne = qe + de[q]
        nd = qd + dd[q]
        nc = qc + dc[q]
        nb = qb + db[q]
        na = qa + da[q]
        np = qp + dp[q]
        if 0 <= nj <= (j-1) and 0 <= ni <= (i-1) and 0 <= nh <= (h-1) and 0 <= ng <= (g-1) and 0 <= nf <= (f-1) and 0 <= ne <= (e-1) and 0 <= nd <= (d-1) and 0 <= nc <= (c-1) and 0 <= nb <= (b-1) and 0 <= na <= (a-1) and 0 <= np <= (p-1) and jj[nj][ni][nh][ng][nf][ne][nd][nc][nb][na][np] == 0:
            jj[nj][ni][nh][ng][nf][ne][nd][nc][nb][na][np] = jj[qj][qi][qh][qg][qf][qe][qd][qc][qb][qa][qp] + 1
            check_append([nj, ni, nh, ng, nf, ne, nd, nc, nb, na, np])


day = 0
for j in jj:
    for i in j:
        for h in i:
            for g in h:
                for f in g:
                    for e in f:
                        for d in e:
                            for c in d:
                                for b in c:
                                    for a in b:
                                        for p in a:
                                            if p == 0:
                                                print(-1)
                                                exit(0)
                                        day = max(day, max(a))
print(day-1)
```