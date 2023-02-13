import {Observable, throwError, timer} from 'rxjs';
import {mergeMap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';

export const genericRetryStrategy = ({
                                       requestMethod = 'GET',
                                       maxRetryAttempts = environment.api.options.retries,
                                       scalingDuration = 1000,
                                       excludedStatusCodes = []
                                     }: {
  requestMethod?: string,
  maxRetryAttempts?: number,
  scalingDuration?: number,
  excludedStatusCodes?: number[]
} = {}) =>
  (attempts: Observable<any>) => {
    return attempts.pipe(
      mergeMap((error, i) => {
        if (requestMethod !== 'GET') {
          return throwError(error);
        }

        const retryAttempt = i + 1;
        if (retryAttempt > maxRetryAttempts || excludedStatusCodes.find(e => e === error.status)) {
          return throwError(error);
        }
        return timer(retryAttempt * scalingDuration);
      })
    );
  };
