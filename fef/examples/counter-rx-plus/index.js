console.clear();
const log = x => (console.log(x),x);
const $less = document.querySelector('#less');
const $more = document.querySelector('#more');
const $value = document.querySelector('#value');
const $min = document.querySelector('#min');
const $max = document.querySelector('#max');
const $result = document.querySelector('#result');

const getValue = e => e.target.value;
const min$ = Rx.Observable.fromEvent($min, 'change', getValue).map(Number);
const max$ = Rx.Observable.fromEvent($max, 'change', getValue).map(Number);
const less$ = Rx.Observable.fromEvent($less, 'click').map(() => -1);
const more$ = Rx.Observable.fromEvent($more, 'click').map(() => 1);
const value$ = Rx.Observable.fromEvent($value, 'change', getValue).map(Number);

function setValueOnServer(v) {
    console.log(v);
    return new Promise(res => setTimeout(res, Math.random()*1000, v));
}
const passNotNaN = (s, u) => isNaN(u) ? s : u;
const validMin$ = min$.scan(passNotNaN, 0).startWith(0);
const validMax$ = max$.scan(passNotNaN, 100).startWith(100);
const validValue$ = value$.scan(passNotNaN, 0).startWith(0);
validMin$.subscribe(x => $min.value = x);
validMax$.subscribe(x => $max.value = x);
validValue$.subscribe(x => $value.value = x);

const model$ = Rx.Observable.merge(
    more$.map(v => ({type: 'update', data: v})),
    less$.map(v => ({type: 'update', data: v})),
    validValue$.map(v => ({type: 'value', data: v})),
    validMin$.map(v => ({type: 'min', data: v})),
    validMax$.map(v => ({type: 'max', data: v}))
).scan((s,u) => {
    const result = {};
    switch(u.type) {
        case 'value':
            Object.assign(result, s, {value: u.data});
            break;
        case 'update':
            Object.assign(result, s, {value: s.value + u.data});
            break;
        case 'min':
            Object.assign(result, s, {min: u.data});
            break;
        case 'max':
            Object.assign(result, s, {max: u.data});
            break;
    }

    result.value = Math.min(Math.max(result.value, result.min), result.max);
    return result;
}, {
    value: 0,
    min: 0,
    max: 100
}).map(model => model.value).startWith(0);


model$
    .distinctUntilChanged()
    .switchMap(v => Rx.Observable.fromPromise(setValueOnServer(v)))
    .subscribe(x => $value.value = x);

