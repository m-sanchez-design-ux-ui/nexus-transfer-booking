import { inject, Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PrefixContextService } from '../services/prefix-context.service';
import { ContentfulService } from '../services/contenful.service';

@Injectable({
  providedIn: 'root',
})
export class PrefixGuard implements CanActivate {
  private readonly contentfulService = inject(ContentfulService);
  private readonly prefixContextService = inject(PrefixContextService);
  private readonly router = inject(Router);

  canActivate(route: ActivatedRouteSnapshot): Observable<boolean | UrlTree> {
    const prefix = route.params['prefix'];

    if (!prefix) {
      this.prefixContextService.setPrefix('default');
      return of(true);
    }

    const cached = sessionStorage.getItem(`prefix_${prefix}`);

    if (cached !== null) {
      const exists = cached === 'true';
      if (exists) {
        this.prefixContextService.setPrefix(prefix);
        if (prefix === 'default') {
          return of(this.redirectWithoutPrefix(route));
        }
        return of(true);
      } else {
        return of(this.redirectWithoutPrefix(route));
      }
    }    

    return this.contentfulService.checkContentfulSlugExists(prefix).pipe(
      map((exists) => {
        sessionStorage.setItem(`prefix_${prefix}`, String(exists));
        if (exists) {
          if (prefix === 'default') {
            return this.redirectWithoutPrefix(route);
          }
          this.prefixContextService.setPrefix(prefix);
          return true;
        }
        return this.redirectWithoutPrefix(route);
      }),
      catchError(() => {
        return of(this.redirectWithoutPrefix(route));
      })
    );
  }

  private redirectWithoutPrefix(route: ActivatedRouteSnapshot): UrlTree {
    const childPaths = this.getChildPaths(route);
    return this.router.createUrlTree(['/', ...childPaths]);
  }

  private getChildPaths(route: ActivatedRouteSnapshot): string[] {
    const paths: string[] = [];

    let current = route.firstChild;
    while (current) {
      if (current.url.length) {
        paths.push(...current.url.map((seg) => seg.path));
      }
      current = current.firstChild;
    }

    return paths;
  }
}
