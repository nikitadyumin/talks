/**
 * Created by ndyumin on 08.03.2016.
 */

'use strict';
const $input1 = document.createElement('input');
const $input2 = document.createElement('input');
const $result = document.createElement('span');

const getValue = e => e.target.value;
const sum = (x,y) => x + y;

const render = data => $result.textContent = data;

const xs$ = Rx.Observable.fromEvent($input1, 'change', getValue).map(Number);
const ys$ = Rx.Observable.fromEvent($input2, 'change', getValue).map(Number);
xs$.combineLatest(ys$, sum).subscribe(render);

document.body.appendChild($input1);
document.body.appendChild($input2);
document.body.appendChild($result);