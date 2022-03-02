import './style.css';

import {
  of,
  map,
  Observable,
  bufferToggle,
  windowToggle,
  partition,
  BehaviorSubject,
  merge,
  Subject,
  mergeMap,
  tap,
} from 'rxjs';
import { share } from 'rxjs/operators';

of('World')
  .pipe(map((name) => `Hello, ${name}!`))
  .subscribe(console.log);

// Open the console in the bottom right to see results.

const loadingSubject = new BehaviorSubject<boolean>(true);
const loadingOb = loadingSubject.asObservable().pipe(
  tap((v) => console.log(`loading ${v ? 'started' : 'stopped'}`)),
  share()
);
const [stopObs, startObs] = partition(loadingOb, Boolean);

const obs = new Subject<number>();
merge(
  obs.pipe(
    bufferToggle(stopObs, () => startObs),
    tap((v) => console.log('bufferToggle' + v))
  ),
  obs.pipe(
    windowToggle(startObs, () => stopObs),
    tap((v) => {
      console.log('windowToggle');
      console.log(v);
    })
  )
)
  .pipe(
    mergeMap((v) => {
      console.log('mergeMap ');
      console.log(v);
      return v;
    })
  )
  .subscribe((v) => {
    console.log('final result', v);
  });

setTimeout(() => {
  obs.next(1);
  obs.next(2);
  loadingSubject.next(false);
});
