const log = id => v => console.log(id, v);

/**
 * single
 */
Rx.Observable.of(1)
    .subscribe(log('single'));

/**
 *  finite iterable
 */
Rx.Observable.from([1, 2, 3])
    .subscribe(log('finite iterable (array)'));

function * gen1(i) {
    while (i--) {
        yield i;
    }
}
Rx.Observable.from(gen1(5))
    .subscribe(log('finite iterable (generator)'));

/**
 * internal completion logic
 */
//Rx.Observable.create(function (o) {
//    o.next(1);
//    o.next(2);
//    o.next(3);
//    setTimeout(() => {
//        o.next(4);
//        o.complete();
//    }, 1000);
//}).subscribe(log('create'));

/**
 *  .take
 */
function * gen2(i) {
    while (true) {
        yield i++;
    }
}

Rx.Observable.from(gen2(0))
    .take(15)
    .subscribe(log('.take '));


/**
 .takeUntil
 */
const b1clicks$ = Rx.Observable
    .fromEvent(document.querySelector('#button1'), 'click');

const b2clicks$ = Rx.Observable
    .fromEvent(document.querySelector('#button2'), 'click')
    .takeUntil(b1clicks$);

b1clicks$.subscribe(log('.takeUntil 1'));
b2clicks$.subscribe(log('.takeUntil 2'));