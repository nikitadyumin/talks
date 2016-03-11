const $input1 = document.createElement('input');
const $input2 = document.createElement('input');
const $result = document.createElement('span');

const getValue = e => e.target.value;
const render = data => $result.textContent = data;

const parse = value =>
    value === ''
        ? new Error('please enter values')
        : isNaN(Number(value))
            ? new Error('please correct values')
            : Number(value);

const combine = (x, y) =>
    x instanceof Error
        ? x.message
        : y instanceof Error
            ? y.message
            : x + y;

const xs$ = Rx.Observable.fromEvent($input1, 'keyup', getValue)
    .startWith($input1.value).map(parse);
const ys$ = Rx.Observable.fromEvent($input2, 'keyup', getValue)
    .startWith($input2.value).map(parse);

xs$.combineLatest(ys$, combine).subscribe(render);

document.body.appendChild($input1);
document.body.appendChild($input2);
document.body.appendChild($result);