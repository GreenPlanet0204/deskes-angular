export class CommonUtils {
  static sortProperties(obj: { [x: string]: any; hasOwnProperty: (arg0: string) => any; }, sortedBy: number, isNumericSort: boolean, reverse: boolean): any[] {
    sortedBy = sortedBy || 1;
    isNumericSort = isNumericSort || false;
    reverse = reverse || false;
    const reversed = (reverse) ? -1 : 1;

    const sortable = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        sortable.push([key, obj[key]]);
      }
    }

    if (isNumericSort) {
      sortable.sort((a, b) => {
        return reversed * (a[1][sortedBy] - b[1][sortedBy]);
      });
    } else {
      sortable.sort((a, b) => {
        const x = a[1][sortedBy].toLowerCase();
        const y = b[1][sortedBy].toLowerCase();
        return x < y ? reversed * -1 : x > y ? reversed : 0;
      });
    }
    return sortable; // array in format [ [ key1, val1 ], [ key2, val2 ], ... ]
  }

  static delay(milliseconds: number): Promise<void> {
    return delay(milliseconds);
  }

  static deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj)) as T;
  }

  static validateEmail(email: any): boolean {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  static parseQueryParams(url: string): Map<string, string> {
    const params = new Map<string, string>();
    if (!url) {
      return params;
    }

    const tokens = url.split('?');
    if (tokens.length !== 2) {
      return params;
    }
    const queries = tokens[1].split('&');

    queries.forEach((indexQuery: string) => {
      const indexPair = indexQuery.split('=');

      const key = decodeURIComponent(indexPair[0]);
      const value = decodeURIComponent(indexPair.length > 1 ? indexPair[1] : '');

      params.set(key, value);
    });

    return params;
  }
}

async function delay(milliseconds: number): Promise<void> {
  return new Promise<void>(resolve => {
    setTimeout(resolve, milliseconds);
  });
}
