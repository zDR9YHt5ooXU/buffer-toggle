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
import { mergeAll, share } from 'rxjs/operators';

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
    // map((v) => of(...v))
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
    // mergeMap((v) => {
    //   console.log('mergeMap ');
    //   console.log(v);
    //   return v;
    // })
    mergeAll()
  )
  .subscribe((v) => {
    console.log('final result', v);
  });

setTimeout(() => {
  obs.next(1);
  obs.next(2);
  loadingSubject.next(false);
  obs.next(3);
  obs.next(4);
  loadingSubject.next(true);
  obs.next(5);
  obs.next(6);

  setTimeout(() => {
    loadingSubject.next(false);
  }, 3000);
});
