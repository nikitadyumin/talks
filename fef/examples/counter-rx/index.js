// https://jsbin.com/paqokonavi/edit?html,js,console,output
// http://stackoverflow.com/questions/31434606/rxjs-make-counter-with-reset-stateless

console.clear();
const $less = document.querySelector('#less');
const $more = document.querySelector('#more');
const $value = document.querySelector('#value');
const $result = document.querySelector('#result');

const less$ = Rx.Observable.fromEvent($less, 'click')
    .map(x => ({update: -1}));
const more$ = Rx.Observable.fromEvent($more, 'click')
    .map(x => ({update: 1}));
const value$ = Rx.Observable.fromEvent($value, 'change')
    .map(e => ({value: Number(e.target.value)}));

function setValueOnServer(v) {
    return new Promise(res => setTimeout(res, Math.random() * 1000, v));
}

const model$ = Rx.Observable.merge(
    value$,
    more$,
    less$
).scan((s, u) => u.value ? u.value : s + u.update, 0)
    .startWith(0);

model$.switchMap(v => Rx.Observable.fromPromise(setValueOnServer(v)))
    .subscribe(v => $value.value = v);

model$
    .subscribe(v => $result.textContent = JSON.stringify(v));